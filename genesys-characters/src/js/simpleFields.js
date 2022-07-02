import { CHARACTER_LOADED, DoOnUpdate, SendCharacterUpdated } from "./common";
import { SendRecalcSize } from "./util/growabletextarea.js";

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
        case "xp-available": header.xp_available = parseInt(target.value); break;
        case "xp-total": header.xp_total = parseInt(target.value); break;
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
    document.getElementById("xp-available").value = header.xp_available;
    document.getElementById("xp-total").value = header.xp_total;
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
        case "brawn": stats.brawn = value; modPath += "brawn"; break;
        case "agility": stats.agility = value; modPath += "agility"; break;
        case "intellect": stats.intellect = value; modPath += "intellect"; break;
        case "cunning": stats.cunning = value; modPath += "cunning"; break;
        case "willpower": stats.willpower = value; modPath += "willpower"; break;
        case "presence": stats.presence = value; modPath += "presence"; break;
        case "force-rank": stats.force_rank = value; modPath += "force_rank"; break;
        // Conditions
        case "soak": stats.soak = value; modPath += "soak"; break;
        case "wounds-threshold": stats.wounds_theshold = value; modPath += "wounds_theshold"; break;
        case "wounds-current": stats.wounds_current = value; modPath += "wounds_current"; break;
        case "strain-threshold": stats.strain_threshold = value; modPath += "strain_threshold"; break;
        case "strain-current": stats.strain_current = value; modPath += "strain_current"; break;
        case "defense-ranged": stats.defense_melee = value; modPath += "defense_melee"; break;
        case "defense-melee": stats.defense_ranged = value; modPath += "defense_ranged"; break;
        default: return;
    }

    SendCharacterUpdated(modPath);
});

document.addEventListener("character-loaded", () => {
    let characteristics = window.character.characteristics;

    document.getElementById("brawn").value = characteristics.brawn;
    document.getElementById("agility").value = characteristics.agility;
    document.getElementById("intellect").value = characteristics.intellect;
    document.getElementById("cunning").value = characteristics.cunning;
    document.getElementById("willpower").value = characteristics.willpower;
    document.getElementById("presence").value = characteristics.presence;
    document.getElementById("force-rank").value = characteristics.force_rank;

    document.getElementById("soak").value = characteristics.soak;
    document.getElementById("wounds-threshold").value = characteristics.wounds_theshold;
    document.getElementById("wounds-current").value = characteristics.wounds_current;
    document.getElementById("strain-threshold").value = characteristics.strain_threshold;
    document.getElementById("strain-current").value = characteristics.strain_current;
    document.getElementById("defense-melee").value = characteristics.defense_melee;
    document.getElementById("defense-ranged").value = characteristics.defense_ranged;
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

    document.getElementById('encumbrance').value = character.encumbrance;
    document.getElementById('encumbrance-threshold').value = character.encumbrance_threshold;
});

document.getElementById('encumbrance').addEventListener('change', event => {
    window.character.encumbrance = parseInt(event.target.value);
    SendCharacterUpdated();
});
document.getElementById('encumbrance-threshold').addEventListener('change', event => {
    window.character.encumbrance_threshold = parseInt(event.target.value);
    SendCharacterUpdated();
});

// ========================================================================= //
// MISCELANIOUS ============================================================ //
// ========================================================================= //

document.addEventListener(CHARACTER_LOADED, () => {
    let obligation_total = window.character.obligation_total;
    if (obligation_total) {
        document.getElementById('obligation-total').textContent = obligation_total;
    }

});

DoOnUpdate('character.obligations', () => {
    let total = 0;
    window.character.obligations.forEach(element => total += element.magnitude);
    document.getElementById('obligation-total').textContent = total;
    window.character.obligation_total = total;
    SendCharacterUpdated();
});