import { SendCharacterUpdated } from '../common';
import { RemoveAllChildNodes } from './utils';
import { attachResize } from "./growabletextarea";
import { } from "../elements/dice-symbols";

/**
 * @typedef {function} ModalOpenCallback
 * @param {Object} entry - the entry being opened in the modal
 */

/**
 * @typedef {function} UpdateDisplayCallback
 * @param {Object} entry - the entry that was edited
 * @param {HTMLElement} element - the element that displays the entry being edited
 */

/**
 * @typedef {function} UpdateEntryCallback
 * @param {Object} entry - the entry that is being edited
 * Note that the UpdateDisplayCallback will be called afterwards
 */

/**
 * @typedef {function} deleteEntryCallback
 * @param {Object} entry - the entry that is being deleted
 * Note: the element has already been removed from display and the managed array
 */

/**
 * 
 * @param {Element} tableElement 
 * @param {any} displayClass 
 * @param {HTMLTemplateElement} modalTemplate 
 * @param {string} modPath the modpath for SendCharacterUpdated. Optional
 * @returns 
 */
export function NewSimpleListEditor(tableElement, displayClass, modalTemplate, modPath) {
    let listEditor = new ListEditor(tableElement);
    listEditor.onChange = () => SendCharacterUpdated(modPath);
    listEditor.createDisplay = (ability) => {
        let element = document.createElement(displayClass.tag);

        let fields = displayClass.observedAttributes; 

        fields.forEach(field => {
            element.setAttribute(field, ability[field]);
        });

        element.onEdit = event => {
            //create modal
            /** @type { Element} */
            let modal  = modalTemplate.content.firstElementChild.cloneNode(true);
            document.body.append(modal);
            //display
            modal.Open(event.clientX, event.clientY);
            //fill in details
            fields.forEach(field => {
                let inputField = modal.querySelector('#' + field);
                if (!inputField) {
                    console.info(`skipped '${field}' because there's no input field for it`);
                    return;
                }
                inputField.value = ability[field];
                if (inputField.classList.contains('growable')) {
                    attachResize(inputField);
                }
                inputField.addEventListener('change', event => {
                    let value;
                    if (inputField.type == 'checkbox')
                        value = inputField.checked;
                    else if (inputField.type == 'number')
                        value = parseInt(inputField.value);
                    else
                        value = inputField.value;
                    ability[field] = value;
                    element.setAttribute(field, value);
                    SendCharacterUpdated(modPath);
                });
            });
            //hookup listeners
            modal.addEventListener('delete', () => listEditor.remove(ability));
        };
        return element;
    };   
    return listEditor;
}

export class ListEditor {
    /** @type {Array} */
    #content;
    /** @type {HTMLElement} */
    #container;

    constructor(containerElement) {
        this.#content = [];

        this.#container = containerElement

        this.onChange = () => console.error(`ListEditor for ${this.#container.id} needs onChange set`);

        this.createDisplay = (item) => {
            console.error(`ListEditor for ${this.#container.id} needs createDisplay set`);
            let element = document.createElement('span');
            element.textContent = JSON.stringify(item);
            return element;
        }
    }

    /**
     * Adds a new item to the list (both js and display)
     * @param {*} item The new item to be added to the list
     * @returns the element that displays the item
     */
    add(item) {
        let element = this.createDisplay(item);
        element.addEventListener('list-move-up', event => this.moveUp(item));
        element.addEventListener('list-move-down', event => this.moveDown(item));
        this.#content.push(item);
        this.#container.appendChild(element);
        this.onChange();
        return element;
    }

    remove(item) {
        let idx = this.#content.indexOf(item);
        if (idx > -1) {
            this.#content.splice(idx, 1);
            this.#container.children[idx].remove();
        }
        this.onChange();
    }

    replaceArray(newContentArray) {
        RemoveAllChildNodes(this.#container);
        this.#content = newContentArray;
        this.#content.forEach(item => {
            let element = this.createDisplay(item);
            element.addEventListener('list-move-up', event => this.#moveUp(item));
            element.addEventListener('list-move-down', event => this.#moveDown(item));
            this.#container.appendChild(element);
        });
    }

    #moveUp(item) {
        let idx = this.#content.indexOf(item);
        if (idx > 0) {
            this.#content[idx] = this.#content[idx-1];
            this.#content[idx-1] = item;
            let element = this.#container.children[idx];
            element.remove();
            this.#container.insertBefore(element, this.#container.children[idx-1]);
        }
        this.onChange();
    }

    #moveDown(item) {
        let idx = this.#content.indexOf(item);
        if (idx > -1 && idx < this.#content.length - 1) {
            this.#content[idx] = this.#content[idx+1];
            this.#content[idx+1] = item;
            let element = this.#container.children[idx+1];
            element.remove();
            this.#container.insertBefore(element, this.#container.children[idx]);
        }
    }
}