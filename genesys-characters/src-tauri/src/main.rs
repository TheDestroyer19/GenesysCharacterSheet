#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(test)]
#[macro_use]
extern crate proptest;
#[macro_use]
extern crate log;

mod character_state;
mod command;
mod engine;
mod filesystem;
mod genesys;
mod window;

use command::*;

use crate::event::emit_character_updated;
use crate::window::{build_menu, on_menu_event, on_window_event, update_title};
use std::sync::Mutex;
use tauri::api::dialog;
use tauri::{Manager, Window};

use crate::character_state::CharacterState;
use crate::engine::Engine;

mod event;

fn quit(window: &Window) {
    if window.state::<CharacterState>().dirty() {
        let window_clone = window.clone();
        dialog::ask(
            Some(window),
            "You have unsaved changes",
            "Do you still want to quit?",
            move |yes| {
                if yes {
                    info!("Quitting App");
                    window_clone.app_handle().exit(0);
                }
            },
        )
    } else {
        info!("Quitting App");
        window.app_handle().exit(0);
    }
}

fn main() {
    pretty_env_logger::init();

    info!("Starting up App");

    let menu = build_menu();

    tauri::Builder::default()
        .menu(menu)
        .manage(CharacterState::new())
        .manage(Mutex::new(Engine::new()))
        .on_menu_event(on_menu_event)
        .on_window_event(on_window_event)
        // This is where you pass in your commands
        .invoke_handler(commands())
        .setup(|app| {
            let state = app.state::<CharacterState>();
            emit_character_updated(app, state.lock().character());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
