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
mod dialog;
mod genesys;
mod window;

use command::*;

use crate::event::emit_character_updated;
use crate::window::{build_menu, on_menu_event, on_window_event, update_title};
use std::sync::Mutex;
use tauri::Manager;

use crate::character_state::CharacterState;
use crate::engine::Engine;

mod event;

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
            let state = state.lock();
            let character = state.character();

            window::create_main_window(app, character)?;

            emit_character_updated(app, character);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
