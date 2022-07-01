import { CHARACTER_LOADED, RegisterEditorModal } from "./common";
import { ConvertSymbols } from "./util/prettyText.js";
import { GenericListItem } from "./elements/generic-list-item.ts";
import { invoke } from '@tauri-apps/api/tauri';

export class NotesDisplay extends GenericListItem {
    #state;

    constructor() {
        super();
        this.#state = {};
    }

    static get observedAttributes() {
        return ['note_title', 'subtitle', 'body'];
    }

    static get tag() {
        return 'note-display';
    }

    connectedCallback() {
        if (!this.isConnected) return;

        this.updateName(element => ConvertSymbols(this.#state.note_title, element));
        this.updateBody(element => ConvertSymbols(this.#state.body, element));
        this.updateBadge(element => {
            if (this.#state.subtitle && this.#state.subtitle.length > 0) element.append(this.#state.subtitle);
        }); 
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'note_title': this.updateName(element => ConvertSymbols(this.#state.note_title, element)); break;
            case 'subtitle': 
                this.updateBadge(element => {
                    if (newValue.length > 0) element.append(this.#state.subtitle);
                }); 
                break;
            case 'body': this.updateBody(element => ConvertSymbols(this.#state.body, element)); break;
        }
    }
}
customElements.define(NotesDisplay.tag, NotesDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'notes-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Note</h1>
    <div class="two-column-grid">
        <label for="note-title">Title </label><input id="note_title" type="text">
        <label for="subtitle">Subtitle </label><input id="subtitle" type="text">
        <label for="body">Body</label>
        <textarea id="body" class="growable"></textarea>
    </div>
</td19-modal>
`;
document.body.append(ModalTemplate);
RegisterEditorModal("Note", ModalTemplate);

const listElement = document.getElementById('notes-table');

document.getElementById('new-note')?.addEventListener('click', event => {
    invoke('create_element', { elementType: "Note" })
        .then(element => listElement.add(element.id)).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    invoke('get_character_element')
    .then((character) => {
        listElement.setAttribute('data-element-id', character.notes)
    });
});