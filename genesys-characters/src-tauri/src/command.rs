use std::sync::Mutex;

use crate::engine::{Element, ElementType, Id};
use crate::event::emit_element_updated;
use crate::genesys::Character;
use crate::window::update_title;
use tauri::{Invoke, Window};

use crate::character_state::CharacterState;
use crate::engine::Engine;

pub(crate) fn commands() -> impl Fn(Invoke) -> () {
    tauri::generate_handler![
        on_character_edited,
        get_character,
        get_character_element,
        get_element,
        update_element,
        create_element,
        delete_element,
    ]
}

#[tauri::command]
fn on_character_edited(character: Character, state: tauri::State<CharacterState>, window: Window) {
    info!("on_character_edited invoked");
    let mut state = state.lock();
    *state.character_mut() = character;
    update_title(&window, state.character());
}

#[tauri::command]
fn get_character(state: tauri::State<CharacterState>) -> Character {
    info!("get_character invoked");
    state.lock().character().clone()
}

#[tauri::command]
fn get_character_element(state: tauri::State<Mutex<Engine>>) -> Option<Element> {
    info!("get_character_element invoked");
    let state = state.lock().unwrap();
    state.elements.get(&state.character).cloned()
}

#[tauri::command]
fn get_element(id: Id, state: tauri::State<Mutex<Engine>>) -> Option<Element> {
    info!("getting element {:?}", id);
    state.lock().unwrap().elements.get(&id).cloned()
}

#[tauri::command]
fn create_element(element_type: ElementType, state: tauri::State<Mutex<Engine>>) -> Element {
    info!("creating element of type {:?}", element_type);
    state.lock().unwrap().create_element(element_type)
    //TODO mark character as dirty
}

#[tauri::command]
fn delete_element(id: Id, state: tauri::State<Mutex<Engine>>, window: Window) {
    info!("deleting element {:?}", id);
    let mut engine = state.lock().unwrap();
    let affected = engine.delete_element(id);
    for id in affected {
        emit_element_updated(&window, engine.elements[&id].clone())
    }
}

#[tauri::command]
fn update_element(
    window: Window,
    element: Element,
    state: tauri::State<Mutex<Engine>>,
    character: tauri::State<CharacterState>,
) {
    info!("updating element {:?}", element.id());
    let mut state = state.lock().unwrap();
    //TODO check that id was in use before inserting.
    //TODO CONSIDER CHECKING IF element type maches the given element
    state.elements.insert(element.id(), element.clone());
    let mut character = character.lock();
    let character = character.character_mut();
    state.write_into(character).unwrap();
    emit_element_updated(&window, element);
    //TODO mark character as dirty
}
