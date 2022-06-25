#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(test)]
#[macro_use] extern crate proptest;

mod character_state;
mod engine;
mod filesystem;
mod genesys;
mod window;

use std::sync::Mutex;

use crate::engine::{Element, ElementType, Id};
use crate::genesys::Character;
use crate::window::{build_menu, on_menu_event, on_window_event, update_title};
use tauri::api::dialog;
use tauri::{Manager, Window};

use crate::character_state::CharacterState;
use crate::engine::Engine;

#[tauri::command]
fn on_character_edited(character: Character, state: tauri::State<CharacterState>, window: Window) {
    let mut state = state.lock();
    *state.character_mut() = character;
    update_title(&window, state.character());
}

#[tauri::command]
fn get_character(state: tauri::State<CharacterState>) -> Character {
    state.lock().character().clone()
}

#[tauri::command]
fn get_character_element(state: tauri::State<Mutex<Engine>>) -> Option<Element> {
    let state = state.lock().unwrap();
    state.elements.get(&state.character).cloned()
}

#[tauri::command]
fn get_element(id: Id, state: tauri::State<Mutex<Engine>>) -> Option<Element> {
    state.lock().unwrap().elements.get(&id).cloned()
}

#[tauri::command]
fn create_element(element_type: ElementType, state: tauri::State<Mutex<Engine>>) -> Element {
    state.lock().unwrap().create_element(element_type)
}

#[tauri::command]
fn delete_element(element: Element) {
    todo!();
}

#[tauri::command]
fn update_element(
    window: Window,
    element: Element,
    state: tauri::State<Mutex<Engine>>,
    character: tauri::State<CharacterState>,
) {
    println!("Element updated");
    let mut state = state.lock().unwrap();
    //TODO check that id was in use before inserting.
    //TODO CONSIDER CHECKING IF element type maches the given element
    state.elements.insert(element.id(), element.clone());
    let mut character = character.lock();
    let character = character.character_mut();
    state.write_into(character).unwrap();
    emit_element_updated(&window, element);
}

fn emit_character_updated(window: &Window, character: &Character) {
    window
        .app_handle()
        .emit_all("character-updated", character.clone())
        .unwrap();
}

fn emit_element_updated(window: &Window, element: Element) {
    window.app_handle().emit_all("element-updated", element).unwrap();
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

fn quit(window: &Window) {
    if window.state::<CharacterState>().dirty() {
        let window_clone = window.clone();
        dialog::ask(
            Some(window),
            "You have unsaved changes",
            "Do you still want to quit?",
            move |yes| {
                if yes {
                    window_clone.app_handle().exit(0);
                }
            },
        )
    } else {
        window.app_handle().exit(0);
    }
}

fn main() {
    let menu = build_menu();

    tauri::Builder::default()
        .menu(menu)
        .manage(CharacterState::new())
        .manage(Mutex::new(Engine::new()))
        .on_menu_event(on_menu_event)
        .on_window_event(on_window_event)
        // This is where you pass in your commands
        .invoke_handler(tauri::generate_handler![
            on_character_edited,
            get_character,
            get_character_element,
            get_element,
            update_element,
            create_element,
            delete_element,
        ])
        .setup(|app| {
            let character = app.state::<CharacterState>().lock().character().clone();
            app.emit_all("character-updated", character)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
