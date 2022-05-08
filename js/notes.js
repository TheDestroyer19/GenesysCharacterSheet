import { CHARACTER_LOADED, SendCharacterUpdated } from "./common.js";
import { attachResize } from "./growabletextarea.js";
import { ListEditor } from "./listEditor.js";
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
    <label>Title <input id="title"></label>
    <label for="body">Body</label>
    <textarea id="body" class="growable"></textarea>
    <div class="horizontal-row">
        <button class="modal-delete">Delete</button>
        <button class="modal-close">Close</button>
    </div>
</td19-modal>
`;
document.body.append(ModalTemplate);

const listEditor = new ListEditor(document.getElementById('notes-table'));
listEditor.onChange = () => SendCharacterUpdated();
listEditor.createDisplay = (note) => {
    let element = document.createElement('notes-display');
    element.setAttribute('title', note.title);
    element.setAttribute('body', note.body);

    element.onEdit = event => {
        //create modal
        let modal = ModalTemplate.content.firstElementChild.cloneNode(true);
        document.body.append(modal);
        //fill in details
        let title = modal.querySelector('#title');
        let body = modal.querySelector('#body');
        title.value = note.title;
        body.value = note.body;
        //hookup listeners
        modal.addEventListener('delete', () => listEditor.remove(note));
        title.addEventListener('change', event => {
            note.title = title.value;
            element.setAttribute('title', title.value);
            SendCharacterUpdated();
        });
        body.addEventListener('change', event => {
            note.body = body.value;
            element.setAttribute('body', body.value);
            SendCharacterUpdated();
        });
        //display
        modal.Open(event.clientX, event.clientY);
        attachResize(modal.querySelector('#body'));
    };
    return element;
};

document.getElementById('new-note').addEventListener('click', event => {
    listEditor.add({ title: "New Note", body: ""}).edit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.notes) window.character.notes = [];
    listEditor.replaceArray(window.character.notes);
});