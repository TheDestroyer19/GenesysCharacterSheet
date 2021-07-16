import {Modal} from './modal.js';

const WeaponTemplate = document.getElementById("weapon-template");
const WeaponTable = document.getElementById("weapons-table");

const WeaponNameInput = document.getElementById("edit-weapon-name");
const WeaponSkillInput = document.getElementById("edit-weapon-skill");
const WeaponDamageInput = document.getElementById("edit-weapon-damage");
const WeaponCriticalInput = document.getElementById("edit-weapon-critical");
const WeaponRangeInput = document.getElementById("edit-weapon-range");
const WeaponSpecialInput = document.getElementById("edit-weapon-special");

const NewWeapon = document.getElementById('new-weapon');

const WeaponModal = new Modal(
    document.getElementById("modal-edit-weapon"),
    UpdateActiveWeaponData,
    DeleteActiveWeapon,
);

let activeWeapon = null;
let activeElement = null;

/**
* @enum {string}
*/
export const RANGE = {
    Engaged: "Engaged",
    Short: "Short",
    Medium: "Medium",
    Long: "Long",
    Extreme: "Extreme",
}

export class Weapon {
    /**
     * 
     * @param {string} name 
     * @param {string} skill 
     * @param {number} damage 
     * @param {number} crit 
     * @param {RANGE} range 
     * @param {string} special 
     */
    constructor(name, skill, damage, crit, range, special) {
        this.name = name;
        this.skill = skill;
        this.damage = damage;
        this.crit = crit;
        this.range = range;
        this.special = special;
    }
}

function UpdateActiveWeaponData() {
    activeWeapon.name = WeaponNameInput.value;
    activeWeapon.skill = WeaponSkillInput.value;
    activeWeapon.damage = parseInt(WeaponDamageInput.value);
    activeWeapon.crit = parseInt(WeaponCriticalInput.value);
    activeWeapon.range = WeaponRangeInput.value;
    activeWeapon.special = WeaponSpecialInput.value;

    UpdateWeaponDisplay(activeElement, activeWeapon);

    let event = new CustomEvent("character-updated", {});
    document.dispatchEvent(event);
}

/**
 * 
 * @param {Weapon} weapon 
 */
function UpdateWeaponDisplay(element, weapon) {
    element.querySelector(".name").textContent = weapon.name;
    element.querySelector(".skill").textContent = weapon.skill;
    element.querySelector(".damage").textContent = weapon.damage;
    element.querySelector(".crit").textContent = weapon.crit;
    element.querySelector(".range").textContent = weapon.range;
    element.querySelector(".special").textContent = weapon.special;
}

/**
 * 
 * @param {Weapon} weapon 
 */
function AddWeapon(weapon, editNow = false) {
    /** @type {HTMLTableRowElement} */
    let weaponRow = WeaponTemplate.content.cloneNode(true);
    weaponRow = weaponRow.querySelector(".weapon");

    UpdateWeaponDisplay(weaponRow, weapon);

    let edit = () => {
        activeElement = weaponRow;
        activeWeapon = weapon;

        WeaponNameInput.value = weapon.name;
        WeaponSkillInput.value = weapon.skill;
        WeaponDamageInput.value = weapon.damage;
        WeaponCriticalInput.value = weapon.crit;
        WeaponRangeInput.value = weapon.range;
        WeaponSpecialInput.value = weapon.special;

        WeaponModal.Open();
    }

    weaponRow.querySelector(".edit").addEventListener("click", edit);

    if (editNow) edit();

    WeaponTable.appendChild(weaponRow);
}

function DeleteActiveWeapon() {
    let character = window.character;

    let idx = character.weapons.findIndex(e => e === activeWeapon);
    if (idx >= 0) character.favors_given.splice(idx, 1);

    activeElement.remove();
    activeWeapon = null;
    activeElement = null;

    var event = new CustomEvent("character-updated", {});
    document.dispatchEvent(event);
}

NewWeapon.addEventListener('click', () => {
    let character = window.character;
    let weapon = new Weapon("Unnamed weapon", "Melee", 0, 0, RANGE.Engaged, "");
    character.weapons.push(weapon);
    AddWeapon(weapon, true);
});

export const AddAllWeapons = (weapons) => {
    weapons.forEach(weapon => {
        AddWeapon(weapon, false);
    });
}