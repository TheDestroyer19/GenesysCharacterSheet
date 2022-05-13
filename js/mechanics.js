import {CHARACTER_LOADED, RemoveAllChildNodes, SendCharacterUpdated} from './common.js';
import { Mechanic } from './genesys.js';
import { NewSimpleListEditor } from './listEditor.js';
import { ConvertSymbols } from './util/prettyText.js';
import { } from "./elements/list-controls.js";

export class MechanicDisplay extends HTMLElement {
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
            gap: 0.25em;
            margin-top: 0.25em;
            margin-bottom: 0.25em;
        }
        #description {
            font-size: small;
        }
        h1 {
            display: inline;
        }
        #value {
            font-size: small;
        }
        </style>
        <list-controls></list-controls>
        <div>
            <div>
                <button id="edit" class="edit" title="Edit">🖉</button>
                <h1 id="type">Name</h1>
                <span id="value"></span>
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
        this.onEdit = event => console.warn("Mehcanic-Display needs onEdit set");

    }

    static get observedAttributes() {
        return ['type', 'value', 'description'];
    }

    static get tag() {
        return "mechanic-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        ConvertSymbols(this.#state.type, this.shadowRoot.querySelector('#type'));
        this.#updateValue(this.#state.value);
        ConvertSymbols(this.#state.description, this.shadowRoot.querySelector('#description'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'type': ConvertSymbols(newValue, this.shadowRoot.querySelector('#type')); break;
            case 'value': this.#updateValue(newValue); break;
            case 'description': ConvertSymbols(newValue, this.shadowRoot.querySelector('#description')); break;
        }
    }

    #edit(event) {
        this.onEdit(event);
    }

    #updateValue(newValue) {
        let container = this.shadowRoot.querySelector('#value');
        RemoveAllChildNodes(container);
        if (newValue) {
            container.appendChild(document.createTextNode("value: " + newValue));
        }
    }
}
customElements.define(MechanicDisplay.tag, MechanicDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'obligation-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Obligation</h1>
    <label for="type">Type:</label>
    <input type="text" id="type" />
    <label for="value">Value:</label>
    <input type="number" id="value" />
    <label for="description">Description:</label>
    <textarea class="growable" id="description"></textarea>
</td19-modal>
`;
document.body.append(ModalTemplate);

const listEditor = NewSimpleListEditor(
    document.getElementById('obligation-table'),
    MechanicDisplay,
    ModalTemplate,
);

document.getElementById('new-obligation').addEventListener('click', event => {
    listEditor.add(new Mechanic("Debt", 10, "You owe someone a large amount of money that will \
take signifigant effort to repay. \
Your creditor is getting impatient")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.obligations) window.character.obligations = [];
    listEditor.replaceArray(window.character.obligations);
});