import { CHARACTER_LOADED, SendCharacterUpdated } from "./common.js";
import { Ability } from './genesys.js';
import { ListEditor } from "./listEditor.js";

const AbilityNameInput = document.getElementById('edit-ability-name');
const AbilitySourceInput = document.getElementById('edit-ability-source');
const AbilityDescriptionInput = document.getElementById('edit-ability-description');

const AbilityListEditor = new ListEditor(
    () => window.character.abilities,
    "ability-template",
    'ability-table',
    'modal-edit-ability',
    UpdateModal,
    UpdateDisplay,
    UpdateAbility,
    () => SendCharacterUpdated(),
);

/**
 * 
 * @param {Ability} ability 
 * @param {HTMLElement} element 
 */
function UpdateDisplay(ability, element) {
    element.querySelector('.name').textContent = ability.name;
    element.querySelector('.source').textContent = ability.source;
    element.querySelector('.description').textContent = ability.description;
}

function UpdateModal(ability) {
    AbilityNameInput.value = ability.name;
    AbilitySourceInput.value = ability.source;
    AbilityDescriptionInput.value = ability.description;
}

function UpdateAbility(ability) {
    ability.name = AbilityNameInput.value;
    ability.source = AbilitySourceInput.value;
    ability.description = AbilityDescriptionInput.value;
    SendCharacterUpdated();
}

document.getElementById('new-ability').addEventListener('click', event => {
    AbilityListEditor.add(event, new Ability("", "", ""));
    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.abilities) window.character.abilities = [];
    AbilityListEditor.regenerate();
});