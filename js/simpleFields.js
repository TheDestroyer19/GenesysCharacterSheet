import { SendCharacterUpdated } from "./common.js";

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

document.addEventListener('character-loaded', () => {
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