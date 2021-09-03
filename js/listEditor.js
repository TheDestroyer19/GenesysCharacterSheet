import { RemoveAllChildNodes } from './common.js';
import {Modal} from './elements/modal.js';

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

export class ListEditor {

    constructor(
        getDataArray,
        htmlTemplateID,
        htmlContainerID,
        htmlModalID,
        modalOpenCallback,
        updateDisplayCallback,
        updateEntryCallback,
        deleteEntryCallback,
    ) {
        this.getDataArray = getDataArray;
        /** @private @type {!HTMLTemplateElement}*/
        this.template = document.getElementById(htmlTemplateID);
        /** @private @type {!HTMLElement}*/
        this.container = document.getElementById(htmlContainerID);
        /** @private @type {!Modal} */
        this.modal = document.getElementById(htmlModalID);
        this.modal.addEventListener('save', event => this.onModalSave());
        this.modal.addEventListener('delete', event => this.onModalDelete());
        /** @private @type {?Object} */
        this.activeEntry = null;
        /** @private @type {?HTMLElement} */
        this.activeElement = null;

        /** @type {ModalOpenCallback} */
        this.modalOpenCallback = modalOpenCallback;
        /** @type {UpdateDisplayCallback} */
        this.updateDisplayCallback = updateDisplayCallback;
        /** @type {UpdateEntryCallback} */
        this.updateEntryCallback = updateEntryCallback;
        this.deleteEntryCallback = deleteEntryCallback;
    }

    regenerate() {
        RemoveAllChildNodes(this.container);
        this.activeElement = null;
        this.activeEntry = null;
        this.getDataArray().forEach(entry => this.addDisplay(entry));
    }

    /**
     * @private
     * @param {Object} entry the entry to generate display for
     */
    addDisplay(entry, editNow = false, event = null) {
        /** @type {HTMLElement} */
        let element = this.template.content.firstElementChild.cloneNode(true);
        this.updateDisplayCallback(entry, element);

        let edit = (event) => {
            this.activeEntry = entry;
            this.activeElement = element;

            this.modal.Open(event.clientX, event.clientY);

            this.modalOpenCallback(entry);
        };

        element.querySelector('.edit').addEventListener('click', edit);

        this.container.appendChild(element);

        if (editNow) edit(event);
    }

    /**
     * Adds a new entry to the list this editor controls, and opens it for editing
     * @param {Object} entry the entry being added
     */
    add(event, entry) {
        this.getDataArray().push(entry);
        this.addDisplay(entry, true, event);
    }

    /**
     * @private
     */
    onModalSave() {
        if (!this.activeEntry) return;
        this.updateEntryCallback(this.activeEntry);
        this.updateDisplayCallback(this.activeEntry, this.activeElement);
        this.activeEntry = null;
        this.activeElement = null;
    }

    /**
     * @private
     */
    onModalDelete() {
        if (!this.activeEntry) return;

        let idx = this.getDataArray().findIndex(e => e === this.activeEntry);
        if (idx >= 0) this.getDataArray().splice(idx, 1);

        this.activeElement.remove();
        this.deleteEntryCallback(this.activeEntry);
        this.activeEntry = null;
        this.activeElement = null;

    }
}