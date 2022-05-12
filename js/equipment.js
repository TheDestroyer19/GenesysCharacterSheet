import {CHARACTER_LOADED, RemoveAllChildNodes, SendCharacterUpdated} from './common.js';
import {Item} from './genesys.js';
import { NewSimpleListEditor } from './listEditor.js';
import { ConvertSymbols } from './util/prettyText.js';
import { } from "./elements/list-controls.js";

export class ItemDisplay extends HTMLElement {
    #state;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = /* HTML */ `
        <style>
        @import '/css/shared.css';
        
        :host {
            display: flex;
            flex-direction: row;
            gap: 0.25rem;
            margin-top: 0.25rem;
            margin-bottom: 0.25rem;
            font-size: small;
        }
        h1, h2 {
            display: inline;
            font-size: small;
        }
        h1 {
            font-weight: bold;
        }
        h2 {
            font-weight: normal;
        }
        </style>
        <list-controls></list-controls>
        <div>
            <div>
                <button id="edit" class="edit" title="Edit">🖉</button>
                <h2 id="quantity">1x</h2>
                <h1 id="name">Name</h1>
            </div>
            <div id="description">
                description
            </div>
        </div>
        `;

        this.shadowRoot.getElementById('edit').addEventListener('click', event => {
            event.preventDefault();
            event.target.blur();
            this.#edit(event);
        });
        
        this.#state = {};
        this.onEdit = event => console.warn("Item-Display needs onEdit set");

    }

    static get observedAttributes() {
        return ['name', 'quantity', 'description'];
    }

    static get tag() {
        return "item-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        ConvertSymbols(this.#state.name, this.shadowRoot.querySelector('#name'));
        this.#updateQuantity(this.#state.quantity);
        ConvertSymbols(this.#state.description, this.shadowRoot.querySelector('#description'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'name': ConvertSymbols(newValue, this.shadowRoot.querySelector('#name')); break;
            case 'quantity': this.#updateQuantity(newValue); break;
            case 'description': ConvertSymbols(newValue, this.shadowRoot.querySelector('#description')); break;
        }
    }

    #edit(event) {
        this.onEdit(event);
    }

    #updateQuantity(newValue) {
        let container = this.shadowRoot.querySelector('#quantity');
        RemoveAllChildNodes(container);
        if (newValue > 1) {
            container.appendChild(document.createTextNode(newValue + "x"));
        }
    }
}
customElements.define(ItemDisplay.tag, ItemDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'item-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Item</h1>
    <label for="name">Name:</label>
    <input type="text" id="name" />
    <label for="quantity">Quantity:</label>
    <input type="number" id="quantity" />
    <label for="description">Description:</label>
    <textarea class="growable" id="description"></textarea>
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