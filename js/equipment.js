import {CHARACTER_LOADED, CHARACTER_UPDATED, RemoveAllChildNodes, SendCharacterUpdated} from './common.js';
import {Item} from './genesys.js';
import { ListEditor } from './listEditor.js';
import { ConvertSymbols } from './util/prettyText.js';

const ItemName = document.getElementById('edit-item-name');
const ItemDescription = document.getElementById('edit-item-description');
const ItemQuantity = document.getElementById('edit-item-quantity');

const NewItem = document.getElementById('new-item');

const ItemListEditor = new ListEditor(
    () => window.character.inventory,
    "item-template",
    "item-table",
    "modal-edit-item",
    UpdateModal,
    UpdateDisplay,
    UpdateItem,
    () => SendCharacterUpdated(),
);

function UpdateModal(item) {
    ItemName.value = item.name;
    ItemDescription.value = item.description;
    ItemQuantity.value = item.quantity;
}

function UpdateItem(item) {
    item.name = ItemName.value;
    item.description = ItemDescription.value;
    item.quantity = parseInt(ItemQuantity.value);
    SendCharacterUpdated();
}

function UpdateDisplay(item, element) {
    ConvertSymbols(item.name, element.querySelector(".name"));
    ConvertSymbols(item.description, element.querySelector(".description"));
    element.querySelector(".quantity").textContent = item.quantity;
}

NewItem.addEventListener('click', event => {
    ItemListEditor.add(event, new Item("", 1, ""));
    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.inventory) {
        window.character.inventory = [];
    }
    ItemListEditor.regenerate();
});