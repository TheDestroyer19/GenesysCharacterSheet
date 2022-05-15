import { ConvertSymbols } from "../util/prettyText.js";
import { } from "./list-controls.js";

const ELEMENT_HTML = /* HTML */ `
<style>
@import './css/shared.css';

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
#body {
    font-size: small;
}
</style>
<list-controls></list-controls>
<div>
    <div>
        <button id="edit" class="edit" title="Edit">🖉</button>
        <h1 id="title">Title</h1>
    </div>
    <div id="body">
        Body
    </div>
</div>
`;

export class NotesDisplay extends HTMLElement {
    #state;

    onEdit;

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
        this.onEdit = event => console.warn("Notes-Display needs onEdit set");
    }

    static get observedAttributes() {
        return ['title', 'body'];
    }

    static get tag() {
        return 'notes-display';
    }

    connectedCallback() {
        if (!this.isConnected) return;

        ConvertSymbols(this.#state.title, this.shadowRoot.querySelector('#title'));
        ConvertSymbols(this.#state.body, this.shadowRoot.querySelector('#body'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'title': ConvertSymbols(newValue, this.shadowRoot.querySelector('#title')); break;
            case 'body': ConvertSymbols(newValue, this.shadowRoot.querySelector('#body')); break;
        }
    }

    #edit(event) {
        this.onEdit(event);
    }
}
customElements.define(NotesDisplay.tag, NotesDisplay);