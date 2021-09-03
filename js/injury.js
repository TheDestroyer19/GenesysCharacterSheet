import { CHARACTER_LOADED, SendCharacterUpdated } from "./common.js";
import { CriticalInjury } from "./genesys.js";
import { ListEditor } from "./listEditor.js";

const InjuryModal = document.getElementById('modal-edit-injury');
const InjuryResultInput = document.getElementById('edit-injury-result');

const CriticalInjuryListEditor = new ListEditor(
    () => window.character.critical_injuries,
    "injury-template",
    'injury-table',
    'modal-edit-injury',
    UpdateModal, 
    UpdateDisplay,
    UpdateInjury,
    () => SendCharacterUpdated(),
);

/**
 * @param {CriticalInjury} injury 
 */
function UpdateModal(injury) {
    //update severity
    for (const [key, checkbox] of InjuryModal.querySelectorAll('.severity').entries()) {
        checkbox.checked = key < injury.severity;
    }

    //update text
    InjuryResultInput.value = injury.result;
}

function UpdateDisplay(injury, element) {
    for (const [key, checkbox] of element.querySelectorAll('.severity').entries()) {
        checkbox.checked = key < injury.severity;
    }

    element.querySelector('.result').textContent = injury.result;
}

function UpdateInjury(injury) {
    injury.severity = InjuryModal.querySelectorAll('.severity:checked').length;
    injury.result = InjuryResultInput.value;
    SendCharacterUpdated();
}

InjuryModal.addEventListener('change', () => {
    let severity = InjuryModal.querySelectorAll('.severity:checked').length;
    for (const [key, checkbox] of InjuryModal.querySelectorAll('.severity').entries()) {
        checkbox.checked = key < severity;
    }
});

document.getElementById('new-injury').addEventListener('click', event => {
    CriticalInjuryListEditor.add(event, new CriticalInjury(1, ''));
    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.critical_injuries) {
        window.character.critical_injuries = [];
    }
    CriticalInjuryListEditor.regenerate();
});