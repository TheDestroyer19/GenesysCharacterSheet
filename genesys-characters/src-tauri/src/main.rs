#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod genesys;

use genesys::Character;
use tauri::api::dialog::FileDialogBuilder;

#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JS for real!");

}

#[tauri::command]
fn save_character(character: Character) {
  FileDialogBuilder::new()
    .set_file_name(&format!("{}.json", character.header.name))
    .save_file(|file_path| {
      if file_path.is_none() { return; }
      let file_path = file_path.unwrap();
      
      println!("{:?}", file_path);
    });
}

fn main() {
  tauri::Builder::default()
    // This is where you pass in your commands
    .invoke_handler(tauri::generate_handler![my_custom_command, save_character])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
