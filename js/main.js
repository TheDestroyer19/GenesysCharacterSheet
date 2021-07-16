import {CHARACTERISTIC, SendCharacterUpdated, SendCharacterLoaded } from './common.js';
import {Favor, AddAllFavors} from './favor.js';
import {Skill, COMBAT_SKILL_NAME, AddAllSkills} from './skill.js';
import {Weapon, AddAllWeapons, RANGE} from './weapon.js';

const default_character = {
    header: {
        name: "Akio",
        player: "Chris Clegg",
        archetype: "G-Mod",
        career: "Investigator",
        xpAvailable: 0,
        xpTotal: 110,
    },
    characteristics: {
        Brawn: 2,
        Agility: 2,
        Intellect: 2,
        Cunning: 2,
        Willpower: 2,
        Presence: 2,
        Soak: 10,
        WoundsThreshold: 10,
        WoundsCurrent: 0,
        StrainThreshold: 10,
        StrainCurrent: 0,
        DefenseMelee: 0,
        DefenseRanged: 0,
    },
    motivations: {
        fear: "",
        strength: "",
        flaw: "",
        desire: "",
    },
    skills_general: [
        new Skill("Athletics", CHARACTERISTIC.Brawn, false, 0),
        new Skill("Computer - Hacking", CHARACTERISTIC.Intellect, false, 0),
        new Skill("Computer - Sysops", CHARACTERISTIC.Intellect, false, 0),
        new Skill("Cool", CHARACTERISTIC.Presence, true, 1),
        new Skill("Coordination", CHARACTERISTIC.Agility, false, 2),
        new Skill("Discipline", CHARACTERISTIC.Willpower, false, 3),
        new Skill("Driving", CHARACTERISTIC.Agility, false, 4),
        new Skill("Mechanics", CHARACTERISTIC.Intellect, false, 5),
        new Skill("Medicine", CHARACTERISTIC.Intellect, false, 0),
        new Skill("Operating", CHARACTERISTIC.Intellect, false, 0),
        new Skill("Perception", CHARACTERISTIC.Cunning, false, 0),
        new Skill("Piloting", CHARACTERISTIC.Agility, false, 0),
        new Skill("Resilience", CHARACTERISTIC.Brawn, false, 0),
        new Skill("Skulduggery", CHARACTERISTIC.Cunning, false, 0),
        new Skill("Stealth", CHARACTERISTIC.Agility, false, 0),
        new Skill("Survival", CHARACTERISTIC.Cunning, false, 0),
        new Skill("Vigilance", CHARACTERISTIC.Willpower, false, 0),
    ],
    skills_magic: [

    ],
    skills_combat: [
        new Skill(COMBAT_SKILL_NAME.Brawl, CHARACTERISTIC.Brawn, false, 0),
        new Skill(COMBAT_SKILL_NAME.Melee, CHARACTERISTIC.Brawn, false, 0),
        new Skill(COMBAT_SKILL_NAME.RangedLight, CHARACTERISTIC.Agility, false, 0),
        new Skill(COMBAT_SKILL_NAME.RangedHeavy, CHARACTERISTIC.Agility, false, 0),
        new Skill(COMBAT_SKILL_NAME.Gunnery, CHARACTERISTIC.Agility, false, 0),
    ],
    skills_social: [
        new Skill("Charm", CHARACTERISTIC.Presence, false, 0),
        new Skill("Coercion", CHARACTERISTIC.Willpower, false, 0),
        new Skill("Deception", CHARACTERISTIC.Cunning, false, 0),
        new Skill("Leadership", CHARACTERISTIC.Presence, false, 0),
        new Skill("Negotiation", CHARACTERISTIC.Presence, false, 0),
    ],
    skills_knowledge: [
        new Skill("Science", CHARACTERISTIC.Intellect, false, 0),
        new Skill("Society", CHARACTERISTIC.Intellect, false, 0),
        new Skill("The Net", CHARACTERISTIC.Intellect, false, 0),
    ],
    favors_owed: [
        new Favor("Doctor joe is a good secret keeper")
    ],
    favors_given: [
        new Favor("Andrew needed a job, so I helped him out"),
        new Favor("a very very very long favor whose text definitely wraps at least one, but preferrabley two or three times"),
    ],
    weapons: [
        new Weapon("Fletcher Pistol", COMBAT_SKILL_NAME.RangedLight, 4, 2, RANGE.Medium, "Pierce 2, Vicious 2"),
    ],
}

document.getElementById("page1header").addEventListener("change", SaveHeader);

function SaveHeader(event) {
    let header = window.character.header;
    let target = event.target;

    //handle inputs with an id
    switch (target.id) {
        case "name": header.name = target.value; break;
        case "player": header.player = target.value; break;
        case "archetype": header.archetype = target.value; break;
        case "career": header.career = target.value; break;
        case "xp-available": header.xpAvailable = parseInt(target.value); break;
        case "xp-total": header.xpTotal = parseInt(target.value); break;
        default: return;
    }

    SendCharacterUpdated();
}

function set_header(header) {
    document.getElementById("name").value = header.name;
    document.getElementById("player").value = header.player;
    document.getElementById("archetype").value = header.archetype;
    document.getElementById("career").value = header.career;
    document.getElementById("xp-available").value = header.xpAvailable;
    document.getElementById("xp-total").value = header.xpTotal;
    
}

function SaveToLocalStorage(character) {
    let localstorage = window.localStorage;
    localstorage.setItem("character", JSON.stringify(character));
    console.log("Character saved to LocalStorage");
}

function GetFromLocalStorage() {
    let localstorage = window.localStorage;
    
    let value = localstorage.getItem("character");

    if (!value) {
        console.log("No character found");
        return JSON.parse(JSON.stringify(default_character));
    }

    try {
        let character = JSON.parse(value);
        console.log("Character loaded from LocalStorage");
        return character;
    } catch (error) {
        console.error("Failed to parse character: " + error);
        return JSON.parse(JSON.stringify(default_character));
    }

}

document.addEventListener("DOMContentLoaded", (event) => {
    let character = GetFromLocalStorage();
    window.character = character;
    SendCharacterLoaded();

    set_header(character.header);
    AddAllSkills(character);
    AddAllFavors(character);
    AddAllWeapons(character.weapons);

});

document.addEventListener("character-updated", () => {
    SaveToLocalStorage(window.character);
});