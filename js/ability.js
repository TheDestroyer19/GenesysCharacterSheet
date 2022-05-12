import { CHARACTER_LOADED } from "./common.js";
import { Ability } from './genesys.js';
import { NewSimpleListEditor } from "./listEditor.js";
import { ConvertSymbols } from "./util/prettyText.js";
import { } from "./elements/list-controls.js";

export class AbilityDisplay extends HTMLElement {
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
        h1 {
            display: inline;
        }
        #body, #source {
            font-size: small;
        }
        </style>
        <list-controls></list-controls>
        <div>
            <div>
                <button id="edit" class="edit" title="Edit">🖉</button>
                <h1 id="name">Name</h1>
                <span id="source">Source</span>
            </div>
            <div id="body">
                "body"
            </div>
        </div>
        `;

        this.shadowRoot.getElementById('edit').addEventListener('click', event => {
            event.preventDefault();
            event.target.blur();
            this.#edit(event);
        });
        
        this.#state = {};
        this.onEdit = event => console.warn("Ability-Display needs onEdit set");

    }

    static get observedAttributes() {
        return ['name', 'source', 'description'];
    }

    static get tag() {
        return "ability-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        ConvertSymbols(this.#state.name, this.shadowRoot.querySelector('#name'));
        ConvertSymbols(this.#state.source, this.shadowRoot.querySelector('#source'));
        ConvertSymbols(this.#state.description, this.shadowRoot.querySelector('#body'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'name': ConvertSymbols(newValue, this.shadowRoot.querySelector('#name')); break;
            case 'source': ConvertSymbols(newValue, this.shadowRoot.querySelector('#source')); break;
            case 'description': ConvertSymbols(newValue, this.shadowRoot.querySelector('#body')); break;
        }
    }

    #edit(event) {
        this.onEdit(event);
    }
}
customElements.define(AbilityDisplay.tag, AbilityDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'ability-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Ability</h1>
    <label>Name <input id="name"></label>
    <label>Source <input id="source"></label>
    <label for="description">Description</label>
    <textarea id="description" class="growable"></textarea>
</td19-modal>
`;
document.body.append(ModalTemplate);

const listEditor = NewSimpleListEditor(
    document.getElementById('ability-table'),
    AbilityDisplay,
    ModalTemplate,
);

document.getElementById('new-ability').addEventListener('click', event => {
    listEditor.add(new Ability("Unnamed Ability", "unknown", "some strange ability")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.abilities) window.character.abilities = [];
    listEditor.replaceArray(window.character.abilities);
});