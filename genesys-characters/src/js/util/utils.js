/*
 * Useful functions that don't have a better place to live
 */

/**
 * Removes all children of the given element
 * @param {HTMLElement} parent 
 */
 export function RemoveAllChildNodes(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}