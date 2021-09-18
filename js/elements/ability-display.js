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
    <h1 id="name">Name</h1>
    <h2 id="source">Source</h2>
</div>
<div id="body">
Once per session when your character uses one of their g-mods to modify a check, you may spend a Story Point to add equal to your character's ranks in Resilience to the results (in addition to any other affects the g-mod has)
</div>
`;

export class AbilityDisplay extends HTMLElement {
    #state;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = ELEMENT_HTML;

        this.#state = {};

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
}
customElements.define('ability-display', AbilityDisplay);