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
 * Sends an event to signal that the character has been updated and needs to be saved
 */
export function SendCharacterUpdated() {
    var event = new CustomEvent("character-updated", {});
    document.dispatchEvent(event);
}