// This module contains definitions for types used in the Genesys CharacterSheets.

/**
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