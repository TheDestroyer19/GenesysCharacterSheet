import { ConvertSymbols } from "../util/prettyText.js";
import { } from "./list-controls.js";

const ELEMENT_HTML = /* HTML */ `
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
        <h1 id="name">Name</h1>
        <h2 id="source">Source</h2>
    </div>
    <div id="body">
        "body"
    </div>
</div>
`;

export class AbilityDisplay extends HTMLElement {
    #state;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = ELEMENT_HTML;

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
customElements.define('ability-display', AbilityDisplay);