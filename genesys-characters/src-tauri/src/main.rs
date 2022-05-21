#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod genesys;

use std::fs::File;
use std::io::prelude::*;
use std::sync::Mutex;

use genesys::Character;
use tauri::{CustomMenuItem, Submenu, Menu, WindowMenuEvent, Manager};
use tauri::api::dialog::{FileDialogBuilder, self};

#[tauri::command]
fn on_character_edited(character: Character, state: tauri::State<Mutex<Character>>) {
  let mut state = state.lock().unwrap();
  *state = character;
  println!("Character modified");
}

#[tauri::command]
fn save_character(character: tauri::State<Mutex<Character>>) {
  let character = character.lock().unwrap();
  let name = format!("{}.json", character.header.name);
  let json = serde_json::to_string(&*character).unwrap();

  FileDialogBuilder::new()
    .set_file_name(&name)
    .save_file(move |file_path| {
      if file_path.is_none() { return; }
      let file_path = file_path.unwrap();
      let display = file_path.display();

      
      let mut file = match File::create(&file_path) {
        Err(why) => panic!("couldn't create {}: {}", display, why),
        Ok(file) => file,
      };

      match file.write_all(json.as_bytes()) {
        Err(why) => panic!("couldn't write to {}: {}", display, why),
        Ok(_) => (),
      }
    });
}

fn on_menu_event(event: WindowMenuEvent) {
  let window = event.window();
  let character = window.state::<Mutex<Character>>();
  match event.menu_item_id() {
    "new" => dialog::message(Some(window), "New", "Creating a new character is not implemented yet"),//TODO
    "open" => dialog::message(Some(window), "Open", "Opening a character is not implemented yet"),//TODO
    "save" => save_character(character),
    a => println!("Unhandled menu event '{}'", a),
  }
}

fn main() {
  let new = CustomMenuItem::new("new", "New");
  let open = CustomMenuItem::new("open", "Open");
  let save = CustomMenuItem::new("save", "Save");
  let submenu = Submenu::new("File", Menu::new().add_item(new).add_item(open).add_item(save));
  let menu = Menu::new().add_submenu(submenu);

  tauri::Builder::default()
    .menu(menu)
    .manage(Mutex::new(Character::default()))
    .on_menu_event(on_menu_event)
    // This is where you pass in your commands
    .invoke_handler(tauri::generate_handler![on_character_edited, save_character])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
