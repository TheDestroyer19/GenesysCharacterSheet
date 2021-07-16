import { CHARACTER_LOADED, RemoveAllChildNodes, SendCharacterUpdated } from './common.js';
import {Modal} from './modal.js';

/** @type {HTMLTemplateElement} */
const FavorTemplate = document.getElementById("favor-template");

const GiveFavorBtn = document.getElementById("give-favor");
const OweFavorBtn = document.getElementById("owe-favor");

const GivenFavors = document.getElementById("favors-given");
const OwedFavors = document.getElementById("favors-owed");

const FavorInput = document.getElementById("edit-favor");

const FavorModal = new Modal(
    document.getElementById("modal-edit-favor"),
    UpdateActiveFavor,
    DeleteActiveFavor,
)

let activeFavor = null;
let activeElement = null;

/**
 * @property {string} text
 */
export class Favor {
    constructor(text) {
        this.text = text;
    }
}

/**
 * 
 * @param {HTMLUListElement} list 
 * @param {Favor} favor 
 */
 function AddFavor(list, favor, editNow = false) {
    /** @type {HTMLUListElement} */
    let favorItem = FavorTemplate.content.cloneNode(true);

    let element = favorItem.querySelector(".favor");

    let edit = () => {
        FavorInput.value = favor.text;
        activeFavor = favor;
        activeElement = element;
        FavorModal.Open();
    };

    favorItem.querySelector(".edit").addEventListener("click", edit);

    activeFavor = favor;
    activeElement = element;

    favorItem.querySelector(".text").textContent = favor.text;

    list.appendChild(favorItem);

    if (editNow) edit();
}

function DeleteActiveFavor() {
    let character = window.character;

    let idx = character.favors_given.findIndex(e => e === activeFavor);
    if (idx >= 0) character.favors_given.splice(idx, 1);
    idx = character.favors_owed.findIndex(e => e === activeFavor);
    if (idx >= 0) character.favors_owed.splice(idx, 1);

    activeElement.remove();
    activeFavor = null;
    activeElement = null;

    SendCharacterUpdated();
}

function UpdateActiveFavor() {
    activeFavor.text = FavorInput.value;
    activeElement.querySelector(".text").textContent = activeFavor.text;
    activeFavor = null;
    activeElement = null;

    SendCharacterUpdated();
}

GiveFavorBtn.addEventListener("click", () => {
    let character = window.character;
    let favor = new Favor("I helped someone out, now they owe me");
    character.favors_given.push(favor);
    AddFavor(GivenFavors, favor, true);
})

OweFavorBtn.addEventListener("click", () => {
    let character = window.character;
    let favor = new Favor("I owe someone a favor");
    character.favors_owed.push(favor);
    AddFavor(OwedFavors, favor, true);
})

function AddAllFavors() {
    let character = window.character;

    RemoveAllChildNodes(GivenFavors);
    RemoveAllChildNodes(OwedFavors);
    
    character.favors_given.forEach(favor => {
        AddFavor(GivenFavors, favor);
    });

    character.favors_owed.forEach(favor => {
        AddFavor(OwedFavors, favor);
    });
}

document.addEventListener(CHARACTER_LOADED, AddAllFavors);