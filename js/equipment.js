import {CHARACTER_LOADED, CHARACTER_UPDATED, RemoveAllChildNodes, SendCharacterUpdated} from './common.js';
import {Modal} from './modal.js';
import {Item} from './genesys.js';

const ItemTemplate = document.getElementById('item-template');
const ItemTable = document.getElementById('item-table');

const ItemName = document.getElementById('edit-item-name');
const ItemDescription = document.getElementById('edit-item-description');
const ItemQuantity = document.getElementById('edit-item-quantity');

const NewItem = document.getElementById('new-item');

const ItemModal = new Modal(
    document.getElementById('modal-edit-item'),
    UpdateActiveItem,
    DeleteActiveItem,
);

/** @type {Item} */
let activeItem = null;
/** @type {HTMLElement} */
let activeElement = null;

function UpdateActiveItem() {
    activeItem.name = ItemName.value;
    activeItem.description = ItemDescription.value;
    activeItem.quantity = parseInt(ItemQuantity.value);

    UpdateItemDisplay(activeElement, activeItem);

    SendCharacterUpdated();
}

/**
 * @param {HTMLElement} element 
 * @param {Item} item 
 */
function UpdateItemDisplay(element, item) {
    element.querySelector(".name").textContent = item.name;
    element.querySelector(".description").textContent = item.description;
    element.querySelector(".quantity").textContent = item.quantity;
}

function DeleteActiveItem() {
    let inventory = window.character.inventory;

    let idx = inventory.findIndex(e => e === activeItem);
    if (idx >= 0) inventory.splice(idx, 1);

    activeElement.remove();
    activeItem = null;
    activeElement = null;
}

/**
 * @param {Item} item 
 * @param {boolean} editnow 
 */
function CreateItemDisplay(item, editnow) {
    /** @type {HTMLTableRowElement} */
    let row = ItemTemplate.content.cloneNode(true);
    row = row.querySelector(".item");

    UpdateItemDisplay(row, item);

    let edit = () => {
        activeElement = row;
        activeItem = item;
        
        ItemName.value = item.name;
        ItemDescription.value = item.description;
        ItemQuantity.value = item.quantity;

        ItemModal.Open();
    }

    row.querySelector(".edit").addEventListener("click", edit);

    if (editnow) edit();

    ItemTable.appendChild(row);
}

function CreateItem() {
    let inventory = window.character.inventory;

    if (inventory == null) {
        inventory = [];
        window.character.inventory = inventory;
    }

    let item = new Item("Strange rock", 1, "");
    inventory.push(item);
    CreateItemDisplay(item, true);
}

NewItem.addEventListener('click', CreateItem);

function CreateAllItemDisplays() {
    let inventory = window.character.inventory;
    if (inventory == null) {
        inventory = [];
        window.character.inventory = inventory;
    }

    RemoveAllChildNodes(ItemTable);

    inventory.forEach(item => {
        CreateItemDisplay(item, false);
    });
}

document.addEventListener(CHARACTER_LOADED, CreateAllItemDisplays);