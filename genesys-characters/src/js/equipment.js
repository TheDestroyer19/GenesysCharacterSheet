import {CHARACTER_LOADED } from './common';
import { buildItemwiseDisplayFunction, ListEditor } from './util/listEditor';
import { ConvertSymbols } from './util/prettyText';
import { GenericListItem } from "./elements/generic-list-item";
import { invoke } from '@tauri-apps/api';

export class ItemDisplay extends GenericListItem {
    #state;

    constructor() {
        super();
        this.#state = {};
        let style = document.createElement('style');
        style.textContent = "#suffix { font-size: small; }";
        this.shadowRoot.appendChild(style);
    }

    static get observedAttributes() {
        return ['name', 'encumbrance', 'quantity', 'description'];
    }

    static get tag() {
        return "item-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        this.updateName(element => ConvertSymbols(this.#state.name, element));
        this.updateBody(element => ConvertSymbols(this.#state.description, element));
        this.#updateEncumbrance(this.#state.encumbrance);
        this.#updateQuantity(this.#state.quantity);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'name': this.updateName(element => ConvertSymbols(this.#state.name, element)); break;
            case 'encumbrance': this.#updateEncumbrance(newValue); break;
            case 'quantity': this.#updateQuantity(newValue); break;
            case 'description': this.updateBody(element => ConvertSymbols(this.#state.description, element)); break;
        }
    }

    #updateQuantity(newValue) {
        this.updatePrefix(element => {
            if (newValue > 1) {
                element.appendChild(document.createTextNode(newValue + "x"));
            }
        });
    }

    #updateEncumbrance(newValue) {
        this.updateSuffix(element => {
            if (newValue && newValue != 0) {
                element.appendChild(document.createTextNode("Encumbrance: " + newValue));
            }
        })
    }
}
customElements.define(ItemDisplay.tag, ItemDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'item-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Item</h1>
    <div class="two-column-grid">
        <label for="name">Name</label>
        <input type="text" id="name" />
        <label for="quantity">Quantity</label>
        <input type="number" id="quantity" />
        <label for="encumbrance">Encumbrance</label>
        <input type="number" id="encumbrance" />
        <label for="description">Description</label>
        <textarea class="growable" id="description"></textarea>
    </div>
</td19-modal>
`;
document.body.append(ModalTemplate);

let list = { id: 0, items: [], type: "List" };

const listEditor = new ListEditor(document.getElementById('item-table'));
listEditor.createDisplay = buildItemwiseDisplayFunction(listEditor, ItemDisplay, ModalTemplate);
listEditor.onChange = () => invoke('update_element', {element: list });
listEditor.replaceArray(list.items);

document.getElementById('new-item')?.addEventListener('click', event => {
    invoke('create_element', { elementType: "Item" })
        .then(element => listEditor.add(element.id));
});

document.addEventListener(CHARACTER_LOADED, () => {
    invoke('get_character_element')
        .then((character) => invoke('get_element', { id: character.inventory }))
        .then((listContainer) => {
            list = listContainer;
            listEditor.replaceArray(list.items);
        });
});