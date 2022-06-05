import {CHARACTER_LOADED } from './common';
import {Item} from './genesys.js';
import { NewSimpleListEditor } from './util/listEditor';
import { ConvertSymbols } from './util/prettyText';
import { GenericListItem } from "./elements/generic-list-item.ts";

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
            if (newValue != 0) {
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

const listEditor = NewSimpleListEditor(
    document.getElementById('item-table'),
    ItemDisplay,
    ModalTemplate,
);

document.getElementById('new-item').addEventListener('click', event => {
    listEditor.add(new Item("Unidentifed Item", 1, "something you have yet to identify")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.inventory) window.character.inventory = [];
    listEditor.replaceArray(window.character.inventory);
});