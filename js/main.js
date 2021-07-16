import {CHARACTERISTIC, CHARACTER_UPDATED, SendCharacterLoaded } from './common.js';
import {Favor} from './favor.js';
import {Skill, COMBAT_SKILL_NAME} from './skill.js';
import {Weapon, RANGE} from './weapon.js';

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

function DownloadCharacter() {
    let element = document.createElement('a');
    let character = window.character;
    let filename = character.header.name + ".json";
    let text = JSON.stringify(character);
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function UploadCharacter() {
    let files = document.getElementById('import-character').files;
    if (files.length <= 0) {
        return;
    }

    let fr = new FileReader();
    fr.onload = (e) => {
        let character = JSON.parse(e.target.result);
        window.character = character;
        SendCharacterLoaded();
        SaveToLocalStorage(window.character);
        console.log("Character imported");
    }

    fr.readAsText(files.item(0));
}

document.getElementById('import-character').addEventListener('change', UploadCharacter);

document.getElementById('export-character').addEventListener('click', DownloadCharacter);

document.addEventListener("DOMContentLoaded", (event) => {
    let character = GetFromLocalStorage();
    window.character = character;
    SendCharacterLoaded();
});

document.addEventListener(CHARACTER_UPDATED, () => {
    SaveToLocalStorage(window.character);
});