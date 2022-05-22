#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod character_state;
mod genesys;

use genesys::Character;
use tauri::api::dialog;
use tauri::{CustomMenuItem, Manager, Menu, Submenu, Window, WindowMenuEvent};

use crate::character_state::CharacterState;

const WINDOW_TITLE_PREFIX: &str = "Genesys Characters";

#[tauri::command]
fn on_character_edited(character: Character, state: tauri::State<CharacterState>, window: Window) {
    let mut state = state.lock();
    *state.character_mut() = character;
    let title = format!(
        "{} - {}{}",
        WINDOW_TITLE_PREFIX, state.character().header.name, if state.dirty() { "*" } else { "" }
    );
    println!("Character modified");
    window
        .set_title(&title)
        .unwrap();
}

fn save_as(window: Window) {
    let dialog = {
        let state = window.state::<CharacterState>();
        let state = state.lock();
        let character = state.character();

        let dialog = dialog::FileDialogBuilder::new();

        if let Some(path) = state.path() {
            if path.is_dir() { 
                dialog.set_directory(path)
            } else if let Some(path) = path.parent() {
                dialog.set_directory(path)
            } else {
                dialog
            }
        } else {
            dialog
        }.set_file_name(&format!("{}.json", character.header.name))
    };

    dialog
        
        .save_file(move |file_path| {
            if file_path.is_none() {
                return;
            }
            let file_path = file_path.unwrap();

            let state = window.state::<CharacterState>();
            let mut state = state.lock();

            match state.save_as(file_path) {
                Ok(()) => {
                    let title = format!(
                        "{} - {}{}",
                        WINDOW_TITLE_PREFIX, state.character().header.name, if state.dirty() { "*" } else { "" }
                    );
                    window.set_title(&title).unwrap();
                },
                Err(e) => dialog::message(
                    Some(&window),
                    "Failed to save character",
                    format!("{:#}", e),
                ),
            }
        });
}

fn new_character(window: Window) {
    let dirty = window.state::<CharacterState>().dirty();
    let new_character = |window: Window| {
        let state = window.state::<CharacterState>();
        let mut state = state.lock();
        state.new_character();
        let character = state.character();
        window
            .set_title(&format!(
                "{} - {}*",
                WINDOW_TITLE_PREFIX, character.header.name
            ))
            .unwrap();
        window
            .app_handle()
            .emit_all("character-updated", character.clone())
            .unwrap();
    };

    if dirty {
        dialog::ask(Some(&window.clone()),
        "New Character", 
        "The character has unsaved changes.\nDo you want to discard those changes and create a new character?", 
        move |answer| if answer {
            new_character(window);
        });
    } else {
        new_character(window);
    }
}

fn open_character(window: Window) {
    let dirty = {
        window
            .state::<CharacterState>()
            .dirty()
    };
    let load_character = |window: Window| {
        dialog::FileDialogBuilder::new().pick_file(move |file| {
            if file.is_none() {
                return;
            }
            let path = file.unwrap();

            let state = window.state::<CharacterState>();
            let mut state = state.lock();
            match state.load(path) {
                Ok(_) => {
                    let character = state.character();
                    window
                        .set_title(&format!(
                            "{} - {}",
                            WINDOW_TITLE_PREFIX, character.header.name
                        ))
                        .unwrap();
                    window
                        .app_handle()
                        .emit_all("character-updated", character.clone())
                        .unwrap();
                },
                Err(e) => dialog::message(
                    Some(&window),
                    "Failed to open character",
                    format!("{:#}", e),
                ),
            };
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

fn print_character(window: Window) {
    match window.print() {
        Ok(()) => (),
        Err(e) => dialog::message(
            Some(&window),
            "Failed to print character",
            format!("{:#}", e),
        ),
    }
}

fn toggle_symbols(window: Window) {
    window.emit_all("toggle_symbols", ()).unwrap();
}

fn on_menu_event(event: WindowMenuEvent) {
    let window = event.window().clone();
    match event.menu_item_id() {
        "new" => new_character(window),
        "open" => open_character(window),
        "save" => save_as(window),
        "print" => print_character(window),
        "symbols" => toggle_symbols(window),
        a => println!("Unhandled menu event '{}'", a),
    }
}

#[tauri::command]
fn get_character(state: tauri::State<CharacterState>) -> Character {
    state.lock().character().clone()
}

fn build_menu() -> Menu {
    let new = CustomMenuItem::new("new", "New").accelerator("CommandOrControl+N");
    let open = CustomMenuItem::new("open", "Open").accelerator("CommandOrControl+O");
    let save = CustomMenuItem::new("save", "Save").accelerator("CommandOrControl+S");
    let print = CustomMenuItem::new("print", "Print").accelerator("CommandOrControl+P");
    let file = Submenu::new(
        "File",
        Menu::new()
            .add_item(new)
            .add_item(open)
            .add_item(save)
            .add_item(print),
    );
    let view = Submenu::new(
        "View",
        Menu::new().add_item(CustomMenuItem::new("symbols", "Symbols Reference")),
    );
    Menu::new().add_submenu(file).add_submenu(view)
}

fn main() {
    let thread = std::thread::current();
    println!("thread {:?}", thread.id());

    let menu = build_menu();

    tauri::Builder::default()
        .menu(menu)
        .manage(CharacterState::new())
        .on_menu_event(on_menu_event)
        // This is where you pass in your commands
        .invoke_handler(tauri::generate_handler![on_character_edited, get_character])
        .setup(|app| {
            let character = app
                .state::<CharacterState>()
                .lock()
                .character()
                .clone();
            app.emit_all("character-updated", character)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
