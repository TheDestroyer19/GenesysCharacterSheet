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
        case "specializations": header.specializations = target.value; break;
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
    document.getElementById("specializations").value = header.specializations;
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

    let modPath = "character.characteristics.";

    //handle inputs with an id
    switch (target.id) {
        // Characteristics
        case "brawn": stats.Brawn = value; modPath += "Brawn"; break;
        case "agility": stats.Agility = value; modPath += "Agility"; break;
        case "intellect": stats.Intellect = value; modPath += "Intellect"; break;
        case "cunning": stats.Cunning = value; modPath += "Cunning"; break;
        case "willpower": stats.Willpower = value; modPath += "Willpower"; break;
        case "presence": stats.Presence = value; modPath += "Presence"; break;
        case "force-rank": stats.ForceRank = value; modPath += "ForceRank"; break;
        // Conditions
        case "soak": stats.Soak = value; modPath += "Soak"; break;
        case "wounds-threshold": stats.WoundsThreshold = value; modPath += "WoundsThreshold"; break;
        case "wounds-current": stats.WoundsCurrent = value; modPath += "WoundsCurrent"; break;
        case "strain-threshold": stats.StrainThreshold = value; modPath += "StrainThreshold"; break;
        case "strain-current": stats.StrainCurrent = value; modPath += "StrainCurrent"; break;
        case "defense-ranged": stats.DefenseRanged = value; modPath += "DefenseRanged"; break;
        case "defense-melee": stats.DefenseMelee = value; modPath += "DefenseMelee"; break;
        default: return;
    }

    SendCharacterUpdated(modPath);
});

document.addEventListener("character-loaded", () => {
    let characteristics = window.character.characteristics;

    document.getElementById("brawn").value = characteristics.Brawn;
    document.getElementById("agility").value = characteristics.Agility;
    document.getElementById("intellect").value = characteristics.Intellect;
    document.getElementById("cunning").value = characteristics.Cunning;
    document.getElementById("willpower").value = characteristics.Willpower;
    document.getElementById("presence").value = characteristics.Presence;
    document.getElementById("force-rank").value = characteristics.ForceRank;

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
    SendRecalcSize(document.getElementById("bio-hair"));
    SendRecalcSize(document.getElementById("bio-features"));
});

// ========================================================================= //
// MISCELANIOUS ============================================================ //
// ========================================================================= //

document.getElementById("obligation-total").addEventListener('change', event => {
    window.character.ObligationTotal = event.target.value;
    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, () => {
    let obligation_total = window.character.ObligationTotal;
    if (obligation_total) {
        document.getElementById('obligation-total').value = obligation_total;
    }
})