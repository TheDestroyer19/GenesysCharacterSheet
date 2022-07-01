import { CHARACTER_LOADED, RegisterEditorModal } from "./common";
import { ConvertSymbols } from "./util/prettyText";
import { } from "./elements/list-controls";
import { } from "./elements/list-editor";
import { GenericListItem } from "./elements/generic-list-item";
import { invoke } from "@tauri-apps/api";

export class AbilityDisplay extends GenericListItem {
    #state;

    constructor() {
        super();
        this.#state = {};
    }

    static get observedAttributes() {
        return ['name', 'rank', 'source', 'description'];
    }

    static get tag() {
        return "ability-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        this.updateName(element => ConvertSymbols(this.#state.name, element));
        this.updateSuffix(element => ConvertSymbols(this.#state.source, element));
        this.updateBody(element => ConvertSymbols(this.#state.description, element));
        this.#updateRank(this.#state.rank);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'name': this.updateName(element => ConvertSymbols(this.#state.name, element)); break;
            case 'rank': this.#updateRank(newValue); break;
            case 'source': this.updateSuffix(element => ConvertSymbols(this.#state.source, element)); break;
            case 'description': this.updateBody(element => ConvertSymbols(this.#state.description, element)); break;
        }
    }

    #updateRank(newValue) {
        this.updateBadge(element => {
            if (newValue > 0) {
                element.appendChild(document.createTextNode('Rank ' + newValue));
            }  
        });
    }
}
customElements.define(AbilityDisplay.tag, AbilityDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'ability-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Ability</h1>
    <div class="two-column-grid">
        <label for="name">Name</label><input id="name" type="text">
        <label for="rank">Rank</label><input id="rank" type="number" min=0>
        <label for="source">Source</label><input id="source" type="text">
        <label for="description">Description</label><textarea id="description" class="growable"></textarea>
    </div>
</td19-modal>
`;
document.body.append(ModalTemplate);
RegisterEditorModal("Ability", ModalTemplate);

const listEditorElement = document.getElementById('ability-table');

document.getElementById('new-ability').addEventListener('click', event => {
    invoke('create_element', { elementType: "Ability" })
        .then(element => listEditorElement.add(element.id).onEdit(event));
});

document.addEventListener(CHARACTER_LOADED, () => {
    invoke('get_character_element')
        .then((character) => {
            listEditorElement.setAttribute('data-element-id', character.abilities)
        });
});