use std::sync::Mutex;

use tauri::api::dialog;
use tauri::{Manager, Window};

use crate::character_state::CharacterState;
use crate::engine::Engine;
use crate::{emit_character_updated, update_title};

pub(crate) fn save_character_as(window: Window) {
    let dialog = {
        let state = window.state::<CharacterState>();
        let state = state.lock();
        let character = state.character();

        let dialog = dialog::FileDialogBuilder::new();

        if let Some(path) = state.path() {
            if path.is_dir() {
                dialog
                    .set_directory(path)
                    .set_file_name(&format!("{}.json", character.header.name))
            } else if let Some(dir) = path.parent() {
                dialog
                    .set_directory(dir)
                    .set_file_name(&path.file_name().unwrap().to_string_lossy())
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

        if let Err(e) = state.save_as(file_path) {
            dialog::message(
                Some(&window),
                "Failed to save character",
                format!("{:#}", e),
            )
        }

        update_title(&window, state.character());
        println!("Character saved");
    });
}

pub(crate) fn save_character(window: Window) {
    let state = window.state::<CharacterState>();
    let mut state = state.lock();

    if state.path().is_some() {
        if let Err(e) = state.save() {
            dialog::message(
                Some(&window),
                "Failed to save character",
                format!("{:#}", e),
            )
        }
        update_title(&window, state.character());
        println!("Character saved");
    } else {
        std::mem::drop(state);
        save_character_as(window);
    }
}

/// Async to deter calling from main thread
pub(crate) async fn new_character(window: Window) {
    let state = window.state::<CharacterState>();
    let engine = window.state::<Mutex<Engine>>();

    if state.dirty() {
        let discard_changes = dialog::blocking::ask(
            Some(&window),
            "The character has unsaved changes",
            "Do you want to discard those changes?",
        );

        if !discard_changes {
            return;
        }
    }

    let mut state = state.lock();
    state.new_character();
    let character = state.character();
    *engine.lock().unwrap() = character.clone().into();

    update_title(&window, &character);
    emit_character_updated(&window, &character);
    println!("New character created");
}

pub(crate) async fn open_character(window: Window) {
    let state = window.state::<CharacterState>();
    let engine = window.state::<Mutex<Engine>>();

    if state.dirty() {
        let discard_changes = dialog::blocking::ask(
            Some(&window),
            "The character has unsaved changes",
            "Do you want to discard those changes?",
        );

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
            *engine.lock().unwrap() = character.clone().into();
            update_title(&window, character);
            emit_character_updated(&window, character);
            println!("Character loaded");
        }
        Err(e) => dialog::message(
            Some(&window),
            "Failed to open character",
            format!("{:#}", e),
        ),
    }
}

pub(crate) fn print_character(window: Window) {
    match window.print() {
        Ok(()) => (),
        Err(e) => dialog::message(
            Some(&window),
            "Failed to print character",
            format!("{:#}", e),
        ),
    }
}
