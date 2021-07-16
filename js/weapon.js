import { CHARACTER_LOADED, SendCharacterUpdated } from './common.js';
import {COMBAT_SKILL_NAME, RANGE, Weapon} from './genesys.js';
import { ListEditor } from './listEditor.js';

const WeaponNameInput = document.getElementById("edit-weapon-name");
const WeaponSkillInput = document.getElementById("edit-weapon-skill");
const WeaponDamageInput = document.getElementById("edit-weapon-damage");
const WeaponCriticalInput = document.getElementById("edit-weapon-critical");
const WeaponRangeInput = document.getElementById("edit-weapon-range");
const WeaponSpecialInput = document.getElementById("edit-weapon-special");

const NewWeapon = document.getElementById('new-weapon');

const WeaponListEditor = new ListEditor(
    () => window.character.weapons,
    "weapon-template",
    'weapons-table',
    'modal-edit-weapon',
    UpdateModal, 
    UpdateDisplay,
    UpdateWeapon,
    () => SendCharacterUpdated(),
);

/**
 * @param {Weapon} entry 
 * @param {HTMLElement} element 
 */
function UpdateDisplay(entry, element) {
    element.querySelector(".name").textContent = entry.name;
    element.querySelector(".skill").textContent = entry.skill;
    element.querySelector(".damage").textContent = entry.damage;
    element.querySelector(".crit").textContent = entry.crit;
    element.querySelector(".range").textContent = entry.range;
    element.querySelector(".special").textContent = entry.special;
}

/**
 * @param {Weapon} weapon 
 */
function UpdateModal(weapon) {
    WeaponNameInput.value = weapon.name;
    WeaponSkillInput.value = weapon.skill;
    WeaponDamageInput.value = weapon.damage;
    WeaponCriticalInput.value = weapon.crit;
    WeaponRangeInput.value = weapon.range;
    WeaponSpecialInput.value = weapon.special;
}

function UpdateWeapon(weapon) {
    weapon.name = WeaponNameInput.value;
    weapon.skill = WeaponSkillInput.value;
    weapon.damage = parseInt(WeaponDamageInput.value);
    weapon.crit = parseInt(WeaponCriticalInput.value);
    weapon.range = WeaponRangeInput.value;
    weapon.special = WeaponSpecialInput.value;

    SendCharacterUpdated();
}

NewWeapon.addEventListener('click', () => {
    WeaponListEditor.add(new Weapon("Unnamed weapon", COMBAT_SKILL_NAME.Melee, 0, 0, RANGE.Engaged, ""));
    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, () => WeaponListEditor.regenerate());