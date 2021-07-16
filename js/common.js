/**
* @enum {string}
*/
export const CHARACTERISTIC = {
   Brawn: "Brawn",
   Agility: "Agility",
   Intellect: "Intellect",
   Cunning: "Cunning",
   Willpower: "Willpower",
   Presence: "Presence"
};

/**
 * @param {CHARACTERISTIC} characteristic 
 */
 export const ShortenCharacteristic = (characteristic) => {
    switch (characteristic) {
        case CHARACTERISTIC.Brawn: return "Br";
        case CHARACTERISTIC.Agility: return "Ag";
        case CHARACTERISTIC.Intellect: return "Int";
        case CHARACTERISTIC.Cunning: return "Cun";
        case CHARACTERISTIC.Willpower: return "Will";
        case CHARACTERISTIC.Presence: return "Pr";
    }
}

/**
 * The string name of character updated events
 */
export const CHARACTER_UPDATED = "character-updated";

/**
 * Sends an event to signal that the character has been modified and needs to be saved
 */
export function SendCharacterUpdated() {
    var event = new CustomEvent(CHARACTER_UPDATED, {});
    document.dispatchEvent(event);
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

/**
 * Removes all children of the given element
 * @param {HTMLElement} parent 
 */
export function RemoveAllChildNodes(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}