import {Favor} from './genesys';
import { ConvertSymbols } from './util/prettyText';
import { CHARACTER_LOADED } from './common';
import { NewSimpleListEditor } from './util/listEditor';
import { GenericListItem } from './elements/generic-list-item';

export class FavorDisplay extends GenericListItem {
    #state;

    constructor() {
        super();
        this.#state = {};
        let style = document.createElement('style');
        style.textContent = ":host { font-size: small; } list-controls {font-size: medium; }";
        this.shadowRoot.appendChild(style);
    }

    static get observedAttributes() {
        return ['text'];
    }

    static get tag() {
        return 'favor-display';
    }

    connectedCallback() {
        if (!this.isConnected) return;

        this.updateSuffix(element => ConvertSymbols(this.#state.text, element));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'text': this.updateSuffix(element => ConvertSymbols(this.#state.text, element)); break;
        }
    }
}
customElements.define(FavorDisplay.tag, FavorDisplay);

const GivenFavorModalTemplate = document.createElement('template');
GivenFavorModalTemplate.id = "favor-modal-template";
GivenFavorModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Given Favor</h1>
    <textarea id="text"></textarea>
</td19-modal>
`;
document.body.append(GivenFavorModalTemplate);

const OwedFavorModalTemplate = document.createElement('template');
OwedFavorModalTemplate.id = "favor-modal-template";
OwedFavorModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Owed Favor</h1>
    <textarea id="text"></textarea>
</td19-modal>
`;
document.body.append(OwedFavorModalTemplate);

const GivenFavorEditor = NewSimpleListEditor(
    document.getElementById('favors-given'),
    FavorDisplay,
    GivenFavorModalTemplate
);

const OwedFavorEditor = NewSimpleListEditor(
    document.getElementById('favors-owed'),
    FavorDisplay,
    OwedFavorModalTemplate
);

document.getElementById('give-favor').addEventListener('click', event => {
    GivenFavorEditor.add(new Favor("I helped someone out, they owe me now")).onEdit(event);
});

document.getElementById('owe-favor').addEventListener('click', event => {
    OwedFavorEditor.add(new Favor("Someone saved my bacon, now I owe them")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.favors_given) window.character.favors_given = [];
    GivenFavorEditor.replaceArray(window.character.favors_given);
    if (!window.character.favors_owed) window.character.favors_owed = [];
    OwedFavorEditor.replaceArray(window.character.favors_owed);
});