import { ConvertSymbols } from "../util/prettyText.js";

const ELEMENT_HTML = /* HTML */ `
<style>
@import '/css/shared.css';

:host {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.25rem;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "ctrl head"
        "ctrl body";
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
}
#controls {
    grid-area: ctrl;
    border-right: 0.2rem solid var(--ca1-50);
    display: flex;
    flex-direction: column;
}
#head {
    grid-area: head;
}
#body {
    grid-area: body;
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
<div id="controls">
    <slot></slot>
</div>
<div id="head">
    <h1 id="title">Title</h1>
</div>
<div id="body">
    Body
</div>
`;

export class NotesDisplay extends HTMLElement {
    #state;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = ELEMENT_HTML;

        this.#state = {};

    }

    static get observedAttributes() {
        return ['title', 'body'];
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
}
customElements.define('notes-display', NotesDisplay);