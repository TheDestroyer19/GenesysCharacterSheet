import { CHARACTER_LOADED } from "./common.js";
import { NewSimpleListEditor } from "./util/listEditor.js";
import { NotesDisplay } from './elements/notes-display.js';

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