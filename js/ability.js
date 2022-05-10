import { CHARACTER_LOADED } from "./common.js";
import { Ability } from './genesys.js';
import { NewSimpleListEditor } from "./listEditor.js";
import { AbilityDisplay } from './elements/ability-display.js';

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'ability-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Ability</h1>
    <label>Name <input id="name"></label>
    <label>Source <input id="source"></label>
    <label for="description">Description</label>
    <textarea id="description" class="growable"></textarea>
</td19-modal>
`;
document.body.append(ModalTemplate);

const listEditor = NewSimpleListEditor(
    document.getElementById('ability-table'),
    AbilityDisplay,
    ModalTemplate,
);

document.getElementById('new-ability').addEventListener('click', event => {
    listEditor.add(new Ability("Unnamed Ability", "unknown", "some strange ability")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.abilities) window.character.abilities = [];
    listEditor.replaceArray(window.character.abilities);
});