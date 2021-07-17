// This module contains definitions for types used in the Genesys CharacterSheets.

/**
 * @readonly
 * @enum {string}
 */
export const CHARACTERISTIC = {
    Brawn: "Brawn",
    Agility: "Agility",
    Intellect: "Intellect",
    Cunning: "Cunning",
    Willpower: "Willpower",
    Presence: "Presence"
 };
 
 /**
  * @param {CHARACTERISTIC} characteristic 
  */
 export const ShortenCharacteristic = (characteristic) => {
     switch (characteristic) {
         case CHARACTERISTIC.Brawn: return "Br";
         case CHARACTERISTIC.Agility: return "Ag";
         case CHARACTERISTIC.Intellect: return "Int";
         case CHARACTERISTIC.Cunning: return "Cun";
         case CHARACTERISTIC.Willpower: return "Will";
         case CHARACTERISTIC.Presence: return "Pr";
     }
 }

/**
 * @readonly
 * @enum {string}
 */
export const COMBAT_SKILL_NAME = {
    Brawl: "Brawl",
    Melee: "Melee",
    RangedLight: "Ranged - Light",
    RangedHeavy: "Ranged - Heavy",
    Gunnery: "Gunnery",
};

/**
 * @readonly
 * @enum {string}
 */
export const RANGE = {
    Engaged: "Engaged",
    Short: "Short",
    Medium: "Medium",
    Long: "Long",
    Extreme: "Extreme",
}

/**
 * @typedef {Object} Skill
 * @property {string} name
 * @property {CHARACTERISTIC} characteristic
 * @property {boolean} career
 * @property {number} rank
 */
 export class Skill {
    /**
     * 
     * @param {string} name 
     * @param {CHARACTERISTIC} characteristic
     * @param {boolean} career 
     * @param {number} rank 
     */
    constructor(name, characteristic, career, rank) {
        this.name = name;
        this.characteristic = characteristic;
        this.career = career;
        this.rank = rank;
    }
}

/**
 * @typedef {Object} Favor
 * @property {string} text
 */
export class Favor {
    constructor(text) {
        this.text = text;
    }
}

/**
 * @typedef {Object} Weapon
 * @property {string} name 
 * @property {COMBAT_SKILL_NAME} skill 
 * @property {number} damage 
 * @property {number} crit 
 * @property {RANGE} range 
 * @property {string} special 
 */
export class Weapon {
    /**
     * 
     * @param {string} name 
     * @param {COMBAT_SKILL_NAME} skill 
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

/**
 * @typedef {Object} Item
 * @property {string} name
 * @property {number} quantity
 * @property {string} description
 */
export class Item {
    constructor(name, quantity, description) {
        this.name = name;
        this.quantity = quantity;
        this.description = description;
    }
}

/**
 * @typedef {Object} CriticalInjury
 * @property {number} severity
 * @property {string} result
 */
export class CriticalInjury {
    constructor(severity, result) {
        this.severity = severity;
        this.result = result;
    }
}

/**
 * @typedef {Object} ability
 * @property {string} name
 * @property {string} source
 * @property {string} description
 */