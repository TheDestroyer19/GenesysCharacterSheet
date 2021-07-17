import { CHARACTER_LOADED, SendCharacterUpdated } from "./common.js";
import { SendRecalcSize } from "./growabletextarea.js";

// ========================================================================= //
// HEADER ================================================================== //
// ========================================================================= //

document.getElementById("page1header").addEventListener('change', (event) => {
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
})

document.addEventListener(CHARACTER_LOADED, () => {
    let header = window.character.header;
    document.getElementById("name").value = header.name;
    document.getElementById("player").value = header.player;
    document.getElementById("archetype").value = header.archetype;
    document.getElementById("career").value = header.career;
    document.getElementById("xp-available").value = header.xpAvailable;
    document.getElementById("xp-total").value = header.xpTotal;
});

// ========================================================================= //
// CHARACTERISTICS ========================================================= //
// ========================================================================= //

document.getElementById('characteristics').addEventListener("change", (event) => {
    let stats = window.character.characteristics;
    let target = event.target;
    let value = parseInt(target.value);

    //handle inputs with an id
    switch (target.id) {
        // Characteristics
        case "brawn": stats.Brawn = value; break;
        case "agility": stats.Agility = value; break;
        case "intellect": stats.Intellect = value; break;
        case "cunning": stats.Cunning = value; break;
        case "willpower": stats.Willpower = value; break;
        case "presence": stats.Presence = value; break;
        // Conditions
        case "soak": stats.Soak = value; break;
        case "wounds-threshold": stats.WoundsThreshold = value; break;
        case "wounds-current": stats.WoundsCurrent = value; break;
        case "strain-threshold": stats.StrainThreshold = value; break;
        case "strain-current": stats.StrainCurrent = value; break;
        case "defense-ranged": stats.DefenseRanged = value; break;
        case "defense-melee": stats.DefenseMelee = value; break;
        default: return;
    }

    SendCharacterUpdated();
});

document.addEventListener("character-loaded", () => {
    let characteristics = window.character.characteristics;

    document.getElementById("brawn").value = characteristics.Brawn;
    document.getElementById("agility").value = characteristics.Agility;
    document.getElementById("intellect").value = characteristics.Intellect;
    document.getElementById("cunning").value = characteristics.Cunning;
    document.getElementById("willpower").value = characteristics.Willpower;
    document.getElementById("presence").value = characteristics.Presence;

    document.getElementById("soak").value = characteristics.Soak;
    document.getElementById("wounds-threshold").value = characteristics.WoundsThreshold;
    document.getElementById("wounds-current").value = characteristics.WoundsCurrent;
    document.getElementById("strain-threshold").value = characteristics.StrainThreshold;
    document.getElementById("strain-current").value = characteristics.StrainCurrent;
    document.getElementById("defense-melee").value = characteristics.DefenseMelee;
    document.getElementById("defense-ranged").value = characteristics.DefenseRanged;
});

// ========================================================================= //
// CHARACTER DESCRIPTION =================================================== //
// ========================================================================= //

document.getElementById('character-description').addEventListener('change', (event) => {
    let desc = window.character.description;
    let target = event.target;
    let value = target.value;

    switch (target.id) {
        case "bio-gender": desc.gender = value; break;
        case "bio-age": desc.age = value; break;
        case "bio-height": desc.height = value; break;
        case "bio-build": desc.build = value; break;
        case "bio-hair": desc.hair = value; break;
        case "bio-eyes": desc.eyes = value; break;
        case "bio-features": desc.features = value; break;
        default: return;
    }

    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, () => {
    let desc = character.description;
    if (!desc) {
        desc = {
            gender: "",
            age: "",
            height: "",
            build: "",
            hair: "",
            eyes: "",
            features: "",
        };
        character.description = desc;
    }
    document.getElementById("bio-gender").value = desc.gender;
    document.getElementById("bio-age").value = desc.age;
    document.getElementById("bio-height").value = desc.height;
    document.getElementById("bio-build").value = desc.build;
    document.getElementById("bio-hair").value = desc.hair;
    document.getElementById("bio-eyes").value = desc.eyes;
    document.getElementById("bio-features").value = desc.features;
});

// ========================================================================= //
// MOTIVATIONS ============================================================= //
// ========================================================================= //

document.getElementById('motivations').addEventListener('change', (event) => {
    let motivations = window.character.motivations;
    let target = event.target;
    let value = target.value;

    switch(target.id) {
        case 'motivation-fear': motivations.fear = value; break;
        case 'motivation-strength': motivations.strength = value; break;
        case 'motivation-flaw': motivations.flaw = value; break;
        case 'motivation-desire': motivations.desire = value; break;
        default: return;
    }

    SendCharacterUpdated();
})

document.addEventListener(CHARACTER_LOADED, () => {
    let motivations = window.character.motivations;
    if (!motivations) {
        motivations = {
            fear: "",
            strength: "",
            flaw: "",
            desire: "",
        };
        window.character.motivations = motivations;
    }

    const fear = document.getElementById('motivation-fear');
    fear.value = motivations.fear;
    SendRecalcSize(fear);
    const strength = document.getElementById('motivation-strength');
    strength.value = motivations.strength;
    SendRecalcSize(strength);
    const flaw = document.getElementById('motivation-flaw');
    flaw.value = motivations.flaw;
    SendRecalcSize(flaw);
    const desire = document.getElementById('motivation-desire');
    desire.value = motivations.desire;
    SendRecalcSize(desire);
});