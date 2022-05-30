#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod character_state;
mod genesys;

use genesys::Character;
use tauri::api::dialog;
use tauri::{CustomMenuItem, Manager, Menu, Submenu, Window, WindowMenuEvent, GlobalWindowEvent, MenuItem, async_runtime};

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

#[tauri::command]
fn get_character(state: tauri::State<CharacterState>) -> Character {
    state.lock().character().clone()
}

fn save(window: Window) {
    let state = window.state::<CharacterState>();
    let mut state = state.lock();

    if state.path().is_some() {
        match state.save() {
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
    } else {
        std::mem::drop(state);
        save_as(window);
    }

}

fn save_as(window: Window) {
    let dialog = {
        let state = window.state::<CharacterState>();
        let state = state.lock();
        let character = state.character();

        let dialog = dialog::FileDialogBuilder::new();

        if let Some(path) = state.path() {
            if path.is_dir() { 
                dialog.set_directory(path).set_file_name(&format!("{}.json", character.header.name))
            } else if let Some(dir) = path.parent() {
                dialog.set_directory(dir).set_file_name(&path.file_name().unwrap().to_string_lossy())
            } else {
                //TODO there is a path but it doesn't have a parent
                dialog.set_file_name(&path.file_name().unwrap().to_string_lossy())
            }
        } else {
            dialog.set_file_name(&format!("{}.json", character.header.name))
        }
    };

    dialog.save_file(move |file_path| {
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

/// Async to deter calling from main thread
async fn new_character(window: Window) {
    let state = window.state::<CharacterState>();

    if state.dirty() {
        let discard_changes = dialog::blocking::ask(
            Some(&window),
            "The character has unsaved changes",
            "Do you want to discard those changes?");

        if !discard_changes {
            return;
        }
    }

    let mut state = state.lock();
    state.new_character();

    let character = state.character();
    update_title(&window, &character);
    emit_character_updated(&window, &character);
    println!("New character created");
}

async fn open_character(window: Window) {
    let state = window.state::<CharacterState>();

    if state.dirty() {
        let discard_changes = dialog::blocking::ask(
            Some(&window),
            "The character has unsaved changes",
            "Do you want to discard those changes?");

        if !discard_changes {
            return;
        }
    }

    let path = match dialog::blocking::FileDialogBuilder::new().pick_file() {
        Some(path) => path,
        None => return,
    };

    match state.load_async(path).await {
        Ok(_) => {
            let state = state.lock();
            let character = state.character();
            update_title(&window, character);
            emit_character_updated(&window, character);
            println!("Character loaded");
        },
        Err(e) => dialog::message(Some(&window), "Failed to open character", format!("{:#}", e)),
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

fn emit_character_updated(window: &Window, character: &Character) {
    window
        .app_handle()
        .emit_all("character-updated", character.clone())
        .unwrap();
}

fn emit_toggle_symbols(window: Window) {
    window.emit_all("toggle_symbols", ()).unwrap();
}

fn emit_goto(window: Window, target: &str) {
    let target = if target.starts_with("goto-") {
        &target[5..]
    } else {
        target
    };
    window.emit_all("goto", target).unwrap();
}

fn update_title(window: &Window, character: &Character) {
    window
        .set_title(&format!(
            "{} - {}",
            WINDOW_TITLE_PREFIX, character.header.name
        ))
        .unwrap();
}

fn on_menu_event(event: WindowMenuEvent) {
    async_runtime::spawn(async move {
        let window = event.window().clone();
        match event.menu_item_id() {
            "new" => new_character(window).await,
            "open" => open_character(window).await,
            "save" => save(window),
            "save-as" => save_as(window),
            "print" => print_character(window),
            "quit" => quit(&window),
            "symbols" => emit_toggle_symbols(window),
            a => if a.starts_with("goto-") {
                emit_goto(window, a);
            } else {
                println!("Unhandled menu event '{}'", a);
            },
        }
    });
}

fn build_menu() -> Menu {
    let new = CustomMenuItem::new("new", "New").accelerator("CommandOrControl+N");
    let open = CustomMenuItem::new("open", "Open").accelerator("CommandOrControl+O");
    let save = CustomMenuItem::new("save", "Save").accelerator("CommandOrControl+S");
    let save_as = CustomMenuItem::new("save-as", "Save As...").accelerator("CommandOrControl+Shift+S");
    let print = CustomMenuItem::new("print", "Print").accelerator("CommandOrControl+P");
    let quit = CustomMenuItem::new("quit", "Quit").accelerator("CommandOrControl+Q");
    let file = Submenu::new(
        "File",
        Menu::new()
            .add_item(new)
            .add_item(open)
            .add_native_item(MenuItem::Separator)
            .add_item(save)
            .add_item(save_as)
            .add_native_item(MenuItem::Separator)
            .add_item(print)
            .add_native_item(MenuItem::Separator)
            .add_item(quit)
    );
    let view = Submenu::new(
        "View",
        Menu::new().add_item(CustomMenuItem::new("symbols", "Symbols Reference"))
    );
    let go = Submenu::new(
        "Go",
        Menu::new()
            .add_item(CustomMenuItem::new("goto-page1header", "Go to Characteristics"))
            .add_item(CustomMenuItem::new("goto-skills", "Go to Skills"))
            .add_item(CustomMenuItem::new("goto-weapons", "Go to Weapons"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("goto-abilities", "Go to Abilities"))
            .add_item(CustomMenuItem::new("goto-critical-injuries", "Go to Injuries"))
            .add_item(CustomMenuItem::new("goto-mechanics", "Go to Mechanics"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("goto-inventory", "Go to Equipment"))
            .add_item(CustomMenuItem::new("goto-character-description", "Go to Description"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("goto-notes", "Go to Notes"))
    );
    Menu::new().add_submenu(file).add_submenu(view).add_submenu(go)
}

fn quit(window: &Window) {
    if window.state::<CharacterState>().dirty() {
        let window_clone = window.clone();
        dialog::ask(Some(window), "You have unsaved changes", "Do you still want to quit?", move |yes| {
            if yes {
                window_clone.app_handle().exit(0);
            }
        })
    } else {
        window.app_handle().exit(0);
    }
}

fn on_window_event(event: GlobalWindowEvent) {
    let window = event.window();
    let event = event.event();
    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        api.prevent_close();
        quit(window);
    }
}

fn main() {
    let thread = std::thread::current();
    println!("thread {:?}", thread.id());

    let menu = build_menu();

    tauri::Builder::default()
        .menu(menu)
        .manage(CharacterState::new())
        .on_menu_event(on_menu_event)
        .on_window_event(on_window_event)
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