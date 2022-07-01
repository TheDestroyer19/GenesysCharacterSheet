use tauri::Wry;

use tauri::Manager;

use crate::engine::Element;

use crate::genesys::Character;

pub(crate) fn emit_character_updated<M>(manager: &M, character: &Character)
where
    M: Manager<Wry>,
{
    info!("character_updated sent");
    manager
        .emit_all("character-updated", character.clone())
        .unwrap();
}

pub(crate) fn emit_element_updated<M>(manager: &M, element: Element)
where
    M: Manager<Wry>,
{
    info!("element_updated sent");
    manager.emit_all("element-updated", element).unwrap();
}

pub(crate) fn emit_toggle_symbols<M>(manager: &M)
where
    M: Manager<Wry>,
{
    info!("toggle_symbols sent");
    manager.emit_all("toggle_symbols", ()).unwrap();
}

pub(crate) fn emit_goto<M>(manager: &M, target: &str)
where
    M: Manager<Wry>,
{
    info!("goto sent");
    let target = if target.starts_with("goto-") {
        &target[5..]
    } else {
        target
    };
    manager.emit_all("goto", target).unwrap();
}
