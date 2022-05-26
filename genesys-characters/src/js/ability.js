import { CHARACTER_LOADED } from "./common";
import { Ability } from './genesys';
import { NewSimpleListEditor } from "./util/listEditor";
import { ConvertSymbols } from "./util/prettyText";
import { } from "./elements/list-controls";
import { RemoveAllChildNodes } from "./util/utils";

export class AbilityDisplay extends HTMLElement {
    #state;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = /* HTML */ `
        <style>
        @import '/src/css/shared.css';
        
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
        #body, #source, #rank {
            font-size: small;
        }
        #rank {
            display: inline-block;
            height: 1.15em;
            min-width: 1.15em;

            color: white;
            text-align: center;
            font-weight: bold;

            border-radius: 0.35em;
            padding: 0 0.2em;
            background-color: Var(--ca2-50);
        }
        #rank.hidden {
            display: none;
        }
        </style>
        <list-controls></list-controls>
        <div>
            <div>
                <button id="edit" class="edit" title="Edit">🖉</button>
                <h1 id="name">Name</h1>
                <span id="rank"></span>
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
        return ['name', 'rank', 'source', 'description'];
    }

    static get tag() {
        return "ability-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        ConvertSymbols(this.#state.name, this.shadowRoot.querySelector('#name'));
        this.#updateRank(this.#state.rank);
        ConvertSymbols(this.#state.source, this.shadowRoot.querySelector('#source'));
        ConvertSymbols(this.#state.description, this.shadowRoot.querySelector('#body'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'name': ConvertSymbols(newValue, this.shadowRoot.querySelector('#name')); break;
            case 'rank': this.#updateRank(newValue); break;
            case 'source': ConvertSymbols(newValue, this.shadowRoot.querySelector('#source')); break;
            case 'description': ConvertSymbols(newValue, this.shadowRoot.querySelector('#body')); break;
        }
    }

    #updateRank(newValue) {
        let element = this.shadowRoot.querySelector('#rank');
        RemoveAllChildNodes(element);
        let value = parseInt(newValue);
        if (value > 0) {
            element.appendChild(document.createTextNode('Rank ' + newValue));
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
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
    <label>Name <input id="name" type="text"></label>
    <label>Rank <input id="rank" type="number" min=0></label>
    <label>Source <input id="source" type="text"></label>
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
    listEditor.add(new Ability("Unnamed Ability", 0, "unknown", "some strange ability")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.abilities) window.character.abilities = [];
    listEditor.replaceArray(window.character.abilities);
});