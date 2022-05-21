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

 export class Characteristic {
     static Shorten(characteristic) {
        switch (characteristic) {
            case CHARACTERISTIC.Brawn: return "Br";
            case CHARACTERISTIC.Agility: return "Ag";
            case CHARACTERISTIC.Intellect: return "Int";
            case CHARACTERISTIC.Cunning: return "Cun";
            case CHARACTERISTIC.Willpower: return "Will";
            case CHARACTERISTIC.Presence: return "Pr";
        }
        console.warn("tried to shorten '" + characteristic + "' but it wasn't reconised as a characteristic");
        return characteristic;
     }

     static Normalize(characteristic) {

     }
 }
 
 /**
  * @param {CHARACTERISTIC} characteristic 
  */
 export const ShortenCharacteristic = (characteristic) => {
     return Characteristic.Shorten(characteristic);
 }

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
 * @property {string} skill 
 * @property {number} damage 
 * @property {bool} uses_brawn
 * @property {number} crit 
 * @property {RANGE} range 
 * @property {string} special 
 * @property {number} encumberance
 * @property {number} hard_points
 * @property {string} description
 */
export class Weapon {
    /**
     * 
     * @param {string} name 
     * @param {string} skill 
     * @param {number} damage 
     * @param {bool} uses_brawn true if brawn score should be added to damage
     * @param {number} crit 
     * @param {RANGE} range 
     * @param {string} special 
     * @param {number} encumberance
     * @param {number} hard_points
     * @param {string} description
     */
    constructor(name, skill, damage, uses_brawn, crit, range, special, encumberance, hard_points, description) {
        this.name = name;
        this.skill = skill;
        this.damage = damage;
        this.uses_brawn = uses_brawn;
        this.crit = crit;
        this.range = range;
        this.special = special;
        this.encumberance = encumberance;
        this.hard_points = hard_points;
        this.description = description;
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
 * @typedef {Object} Ability
 * @property {string} name
 * @property {number} rank
 * @property {string} source
 * @property {string} description
 */
export class Ability {
    constructor(name, rank, source, description) {
        this.name = name;
        this.rank = rank;
        this.source = source;
        this.description = description;
    }
}

/**
 * @typedef {Object} Mechanic
 * @property {string} mechanic_type
 * @property {number} magnitude
 * @property {string} description
 */
export class Mechanic {
    constructor(type, magnitude, description) {
        this.mechanic_type = type;
        this.magnitude = magnitude;
        this.description = description;
    }
}