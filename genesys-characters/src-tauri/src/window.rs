use crate::dialog::{
    new_character, open_character, print_character, save_character, save_character_as, quit,
};
use crate::genesys::Character;
use crate::{event::emit_goto, event::emit_toggle_symbols};
use tauri::{
    async_runtime, CustomMenuItem, GlobalWindowEvent, Menu, MenuItem, Submenu, Window,
    WindowMenuEvent,
};

pub(crate) const WINDOW_TITLE_PREFIX: &str = "Genesys Characters";

pub(crate) fn update_title(window: &Window, character: &Character) {
    window
        .set_title(&format!(
            "{} - {}",
            WINDOW_TITLE_PREFIX, character.header.name
        ))
        .unwrap();
}

pub(crate) fn on_window_event(event: GlobalWindowEvent) {
    let window = event.window();
    let event = event.event();
    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        api.prevent_close();
        quit(window);
    }
}

pub(crate) fn on_menu_event(event: WindowMenuEvent) {
    async_runtime::spawn(async move {
        let window = event.window().clone();
        match event.menu_item_id() {
            "new" => new_character(window).await,
            "open" => open_character(window).await,
            "save" => save_character(window),
            "save-as" => save_character_as(window),
            "print" => print_character(window),
            "quit" => quit(&window),
            "symbols" => emit_toggle_symbols(&window),
            a => {
                if a.starts_with("goto-") {
                    emit_goto(&window, a);
                } else {
                    error!("Unhandled menu event '{}'", a);
                }
            }
        }
    });
}

pub(crate) fn build_menu() -> Menu {
    let new = CustomMenuItem::new("new", "New").accelerator("CommandOrControl+N");
    let open = CustomMenuItem::new("open", "Open").accelerator("CommandOrControl+O");
    let save = CustomMenuItem::new("save", "Save").accelerator("CommandOrControl+S");
    let save_as =
        CustomMenuItem::new("save-as", "Save As...").accelerator("CommandOrControl+Shift+S");
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
            .add_item(quit),
    );
    let view = Submenu::new(
        "View",
        Menu::new().add_item(CustomMenuItem::new("symbols", "Symbols Reference")),
    );
    let go = Submenu::new(
        "Go",
        Menu::new()
            .add_item(CustomMenuItem::new(
                "goto-page1header",
                "Go to Characteristics",
            ))
            .add_item(CustomMenuItem::new("goto-skills", "Go to Skills"))
            .add_item(CustomMenuItem::new("goto-weapons", "Go to Weapons"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("goto-abilities", "Go to Abilities"))
            .add_item(CustomMenuItem::new(
                "goto-critical-injuries",
                "Go to Injuries",
            ))
            .add_item(CustomMenuItem::new("goto-mechanics", "Go to Mechanics"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("goto-inventory", "Go to Equipment"))
            .add_item(CustomMenuItem::new(
                "goto-character-description",
                "Go to Description",
            ))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("goto-notes", "Go to Notes")),
    );
    Menu::new()
        .add_submenu(file)
        .add_submenu(view)
        .add_submenu(go)
}
