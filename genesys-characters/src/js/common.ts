import { invoke } from "@tauri-apps/api";
import { attachResize } from "./util/growabletextarea";

/**
 * The string name of character updated events
 */
export const CHARACTER_UPDATED = "character-updated";
export const ELEMENT_UPDATED = "element-updated";

/**
 * Sends an event to signal that the character has been modified and needs to be saved.
 * modpath can be ommitted if there aren't any other elements that depend on what was changed.
 * @param {string} modpath the path to what was changed, eg 'character.characteristics.Brawn'
 */
export function SendCharacterUpdated(modpath: String) {
    var event = new CustomEvent(CHARACTER_UPDATED, { detail: modpath});
    document.dispatchEvent(event);
}

/**
 * Register an event handler when the specified field of the character is changed
 * WARNING: this can lead to memory leaks. Only register once per pageload
 * @param {string} modpath path to field that is being watched eg 'character.characteristics.Brawn'
 * @param {function} action 
 */
export function DoOnUpdate(modpath: String, action: () => void) {
    document.addEventListener(CHARACTER_UPDATED, event => {
        try {
            if ((<CustomEvent>event).detail === modpath) {
                action();
            }
            DoOnUpdate(modpath, action);
        } catch (exception) {
            //I'm assuming that most exceptions will be of the flavor - thing doesn't exist anymore
        }
    }, { once: true });
}

interface ElementEditorList {
    [index: string]: HTMLTemplateElement;
};
let element_editors: ElementEditorList = {};
export function RegisterEditorModal(element_type: "Note" | "Item", editor: HTMLTemplateElement) {
    element_editors[element_type] = editor;
}

export async function OpenForEdit(id: number, x: number, y: number) 
{
    if (document.querySelector('[data-edits-element-id]') != undefined) {
        //TODO do something to the modal to bring attention to it
        return;
    }
    let element: any = await invoke('get_element', { id: id });
    let modalTemplate = element_editors[element.type];
    if (modalTemplate == undefined) {
        console.error("Missing editor modal for element type: " + element.type);
        return;
    }
    let modal = <Element | undefined>modalTemplate.content.firstElementChild?.cloneNode(true);
    if (modal == undefined) {
        console.error(`Modal for type ${element.type} does not have a element inside it`);
        return;
    }
    modal.setAttribute("data-edits-element-id", id.toString());
    document.body.append(modal);

    modal.Open(x, y);

    Object.keys(element).forEach(field => {
        let inputField = <HTMLInputElement | undefined>modal?.querySelector('#' + field);
        if (inputField == undefined) {
            console.info(`skipped '${field}' because there's no input field for it`);
            return;
        }
        inputField.value = element[field];
        if (inputField.classList.contains('growable')) {
            attachResize(inputField);
        }
        inputField.addEventListener('change', _event => {
            if (inputField == undefined) throw "Why is inputField Undefined?";
            let value;
            if (inputField.type == 'checkbox')
                value = inputField.checked;
            else if (inputField.type == 'number')
                value = parseInt(inputField.value);
            else
                value = inputField.value;
            element[field] = value;
            invoke('update_element', { element: element })
        });
    });

    //hookup listeners
    modal.addEventListener('delete', () => invoke('delete_element', { id: id }));
}

/**
 * The string name of character loaded events
 */
export const CHARACTER_LOADED = "character-loaded";

/**
 * Sends an event to signal that the character has been loaded and the gui needs updated
 */
export function SendCharacterLoaded() {
    var event = new CustomEvent(CHARACTER_LOADED, {});
    document.dispatchEvent(event);
}