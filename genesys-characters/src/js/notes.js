import { CHARACTER_LOADED } from "./common.js";
import { NewSimpleListEditor } from "./util/listEditor.js";
import { ConvertSymbols } from "./util/prettyText.js";
import { GenericListItem } from "./elements/generic-list-item.ts";

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
            if (this.#state.subtitle.length > 0) {
                element.appendChild(document.createTextNode(this.#state.subtitle));
            }
        }); 
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'note_title': this.updateName(element => ConvertSymbols(this.#state.note_title, element)); break;
            case 'subtitle': 
                this.updateBadge(element => {
                    if (newValue.length > 0) {
                        element.appendChild(document.createTextNode(this.#state.subtitle));
                    }
                }); 
                break;
            case 'body': this.updateBody(element => ConvertSymbols(this.#state.body, element)); break;
        }
    }
}
customElements.define(NotesDisplay.tag, NotesDisplay);

//TODO replace uses of NotesTemplate with just inserting a new notes-display
const NotesTemplate = document.createElement('template');
NotesTemplate.id = 'notes-template';
NotesTemplate.innerHTML = /* HTML */ `
<notes-display></notes-display>
`;
document.body.append(NotesTemplate);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'notes-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Note</h1>
    <label>Title <input id="note_title"></label>
    <label>Subtitle <input id="subtitle"></label>
    <label for="body">Body</label>
    <textarea id="body" class="growable"></textarea>
</td19-modal>
`;
document.body.append(ModalTemplate);

const listEditor = NewSimpleListEditor(
    document.getElementById('notes-table'),
    NotesDisplay,
    ModalTemplate
);

document.getElementById('new-note').addEventListener('click', event => {
    listEditor.add({ title: "New Note", body: ""}).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.notes) window.character.notes = [];
    listEditor.replaceArray(window.character.notes);
});