import {Favor} from './genesys.js';
import { CHARACTER_LOADED, RemoveAllChildNodes, SendCharacterUpdated } from './common.js';
import { ListEditor } from './listEditor.js';

const FavorOwedInput = document.getElementById("edit-owed-favor");
const FavorGivenInput = document.getElementById("edit-given-favor");

const GivenFavorListEditor = new ListEditor(
    () => window.character.favors_given,
    "favor-template",
    'favors-given',
    'modal-edit-given-favor',
    (favor) => FavorGivenInput.value = favor.text,
    (favor, element) => element.querySelector(".text").textContent = favor.text,
    (favor) => {favor.text = FavorGivenInput.value; SendCharacterUpdated(); },
    () => SendCharacterUpdated(),
);

document.getElementById("give-favor").addEventListener('click', () => {
    GivenFavorListEditor.add(new Favor(""));
    SendCharacterUpdated();
});

const OwedFavorListEditor = new ListEditor(
    () => window.character.favors_owed,
    "favor-template",
    'favors-owed',
    'modal-edit-owed-favor',
    (favor) => {FavorOwedInput.value = favor.text; SendCharacterUpdated(); },
    (favor, element) => element.querySelector(".text").textContent = favor.text,
    (favor) => favor.text = FavorOwedInput.value,
    () => SendCharacterUpdated(),
);

document.getElementById("owe-favor").addEventListener('click', () => {
    OwedFavorListEditor.add(new Favor(""));
    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, () => {
    GivenFavorListEditor.regenerate();
    OwedFavorListEditor.regenerate();
});