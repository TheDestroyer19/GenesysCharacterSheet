import { CHARACTER_LOADED } from "./common.js";
import { buildItemwiseDisplayFunction, ListEditor, NewSimpleListEditor } from "./util/listEditor.js";
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
        return 'notes-display';
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

let list = { id: 0, items: [], type: "List" };

const listEditor = new ListEditor(document.getElementById('notes-table'));
listEditor.createDisplay = buildItemwiseDisplayFunction(NotesDisplay, ModalTemplate);
listEditor.onChange = () => invoke('update_element', { element: list });
listEditor.replaceArray(list.items);

document.getElementById('new-note').addEventListener('click', event => {
    invoke('create_element', { elementType: "Note" })
        .then(element => listEditor.add(element.id).onEdit(event));
});

document.addEventListener(CHARACTER_LOADED, () => {
    invoke('get_character_element')
        .then((character) => invoke('get_element', { id: character.notes }))
        .then((listContainer) => {
            list = listContainer;
            listEditor.replaceArray(list.items);
        });
});