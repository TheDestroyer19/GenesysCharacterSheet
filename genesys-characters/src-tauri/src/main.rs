#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod genesys;

use std::fs::File;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;

use anyhow::Context;
use genesys::Character;
use tauri::api::dialog;
use tauri::{CustomMenuItem, Manager, Menu, Submenu, Window, WindowMenuEvent};

struct CharacterDirty(AtomicBool);

#[tauri::command]
fn on_character_edited(
    character: Character,
    character_state: tauri::State<Mutex<Character>>,
    dirty: tauri::State<CharacterDirty>,
) {
    let mut character_state = character_state.lock().unwrap();
    *character_state = character;
    dirty.0.store(true, Ordering::SeqCst);
    println!("Character modified");
}

fn save_character(window: Window) {
    let name = {
        let character = window.state::<Mutex<Character>>();
        let character = character.lock().unwrap();
        format!("{}.json", character.header.name)
    };

    dialog::FileDialogBuilder::new()
        .set_file_name(&name)
        .save_file(move |file_path| {
            if file_path.is_none() {
                return;
            }
            let file_path = file_path.unwrap();

            let character = window.state::<Mutex<Character>>();
            let character = character.lock().unwrap();

            let result = File::create(&file_path)
                .with_context(|| format!("Failed to create file '{}'", file_path.display()))
                .and_then(|file| {
                    serde_json::to_writer_pretty(file, &*character).context("Failed to serialize data")
                });

            match result {
                Ok(()) => window
                    .state::<CharacterDirty>()
                    .0
                    .store(false, Ordering::SeqCst),
                Err(e) => {
                    dialog::message(Some(&window), "Failed to save character", format!("{:#}", e))
                }
            }
        });
}

fn new_character(window: Window) {
    let dirty = { window.state::<CharacterDirty>().0.load(Ordering::SeqCst) };
    let new_character = move || {
        let character_state = window.state::<Mutex<Character>>();
        let dirty = window.state::<CharacterDirty>();
        let mut character = character_state.lock().unwrap();
        *character = Character::default();
        dirty.0.store(false, Ordering::SeqCst);
        window
            .app_handle()
            .emit_all("character-updated", character.clone())
            .unwrap();
    };

    if dirty {
        dialog::ask(Option::<&Window<tauri::Wry>>::None,
      "New Character", 
      "The character has unsaved changes.\nDo you want to discard those changes and create a new character?", 
      move |answer| if answer {
        new_character();
    });
    } else {
        new_character();
    }
}

fn open_character(window: Window) {
    let dirty = { window.state::<CharacterDirty>().0.load(Ordering::SeqCst) };
    let load_character = |window: Window| {
        dialog::FileDialogBuilder::new()
            .pick_file(move |file| {
                if file.is_none() {
                    return;
                }
                let path = file.unwrap();

                let loaded_character = File::open(&path).with_context(|| format!("Failed to open '{}'", path.display()))
                    .and_then(|file| serde_json::from_reader(file).context("Failed to load character"));

                match loaded_character {
                    Ok(loaded_character) => {
                        let character_state = window.state::<Mutex<Character>>();
                        let mut character = character_state.lock().unwrap();
                        let dirty = window.state::<CharacterDirty>();
                        *character = loaded_character;
                        dirty.0.store(false, Ordering::SeqCst);
                        window
                            .app_handle()
                            .emit_all("character-updated", character.clone())
                            .unwrap();
                    },
                    Err(e) => dialog::message(Some(&window), "Failed to open character", format!("{:#}", e))
                }
            });
    };

    if dirty {
        dialog::ask(
            Some(&window.clone()),
            "New Character",
            "The character has unsaved changes.\nDo you want to discard those changes?",
            move |answer| {
                if answer {
                    load_character(window);
                }
            },
        );
    } else {
        load_character(window);
    }
}

fn on_menu_event(event: WindowMenuEvent) {
    let window = event.window();
    match event.menu_item_id() {
        "new" => new_character(window.clone()),
        "open" => open_character(window.clone()),
        "save" => save_character(window.clone()),
        a => println!("Unhandled menu event '{}'", a),
    }
}

#[tauri::command]
fn get_character(character: tauri::State<Mutex<Character>>) -> Character {
    character.lock().unwrap().clone()
}

fn main() {
    let thread = std::thread::current();
    println!("thread {:?}", thread.id());

    let new = CustomMenuItem::new("new", "New");
    let open = CustomMenuItem::new("open", "Open");
    let save = CustomMenuItem::new("save", "Save");
    let submenu = Submenu::new(
        "File",
        Menu::new().add_item(new).add_item(open).add_item(save),
    );
    let menu = Menu::new().add_submenu(submenu);

    tauri::Builder::default()
        .menu(menu)
        .manage(Mutex::new(Character::default()))
        .manage(CharacterDirty(AtomicBool::new(false)))
        .on_menu_event(on_menu_event)
        // This is where you pass in your commands
        .invoke_handler(tauri::generate_handler![on_character_edited, get_character])
        .setup(|app| {
            let character = app.state::<Mutex<Character>>().lock().unwrap().clone();
            app.emit_all("character-updated", character)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
