import { CHARACTER_LOADED, SendCharacterUpdated } from "./common.js";
import { attachResize } from "./growabletextarea.js";
import { Ability } from './genesys.js';
import { ListEditor, OldListEditor } from "./listEditor.js";
import { AbilityDisplay } from './elements/ability-display.js';

const AbilityTemplate = document.createElement('template');
AbilityTemplate.id = 'ability-template';
AbilityTemplate.innerHTML = /* HTML */ `
<ability-display></ability-display>
`;
document.body.append(AbilityTemplate);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'ability-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Ability</h1>
    <label>Name <input id="name"></label>
    <label>Source <input id="source"></label>
    <label for="description">Description</label>
    <textarea id="description" class="growable"></textarea>
    <div class="horizontal-row">
        <button class="modal-delete">Delete</button>
        <button class="modal-close">Close</button>
    </div>
</td19-modal>
`;
document.body.append(ModalTemplate);

const listEditor = new ListEditor(document.getElementById('ability-table'));
listEditor.onChange = () => SendCharacterUpdated();
listEditor.createDisplay = (ability) => {
    let element = AbilityTemplate.content.firstElementChild.cloneNode(true);
    element.setAttribute('name', ability.name);
    element.setAttribute('source', ability.source);
    element.setAttribute('description', ability.description);

    element.onEdit = event => {
        //create modal
        let modal = ModalTemplate.content.firstElementChild.cloneNode(true);
        document.body.append(modal);
        //fill in details
        let name = modal.querySelector('#name');
        let source = modal.querySelector('#source');
        let description = modal.querySelector('#description');
        name.value = ability.name;
        source.value = ability.source;
        description.value = ability.description;
        //hookup listeners
        modal.addEventListener('delete', () => listEditor.remove(ability));
        name.addEventListener('change', event => {
            ability.name = name.value;
            element.setAttribute('name', name.value);
            SendCharacterUpdated();
        });
        modal.querySelector('#source').addEventListener('change', event => {
            ability.source = event.target.value;
            element.setAttribute('source', event.target.value);
            SendCharacterUpdated();
        });
        modal.querySelector('#description').addEventListener('change', event => {
            ability.description = event.target.value;
            element.setAttribute('description', event.target.value);
            SendCharacterUpdated();
        });
        //display
        modal.Open(event.clientX, event.clientY);
        attachResize(modal.querySelector('#description'));
    };
    return element;
};

document.getElementById('new-ability').addEventListener('click', event => {
    listEditor.add(new Ability("Unnamed Ability", "unknown", "some strange ability"));
    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.abilities) window.character.abilities = [];
    listEditor.replaceArray(window.character.abilities);
});