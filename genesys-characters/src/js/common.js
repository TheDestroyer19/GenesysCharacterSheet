/**
 * The string name of character updated events
 */
export const CHARACTER_UPDATED = "character-updated";

/**
 * Sends an event to signal that the character has been modified and needs to be saved.
 * modpath can be ommitted if there aren't any other elements that depend on what was changed.
 * @param {string} modpath the path to what was changed, eg 'character.characteristics.Brawn'
 */
export function SendCharacterUpdated(modpath) {
    var event = new CustomEvent(CHARACTER_UPDATED, { detail: modpath});
    document.dispatchEvent(event);
}

/**
 * Register an event handler when the specified field of the character is changed
 * WARNING: this can lead to memory leaks. Only register once per pageload
 * @param {string} modpath path to field that is being watched eg 'character.characteristics.Brawn'
 * @param {function} action 
 */
export function DoOnUpdate(modpath, action) {
    document.addEventListener(CHARACTER_UPDATED, event => {
        try {
            if (event.detail === modpath) {
                action();
            }
            document.addEventListener(CHARACTER_UPDATED, this, { once: true });
        } catch (exception) {
            //I'm assuming that most exceptions will be of the flavor - thing doesn't exist anymore
        }
    }, { once: true });
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