import { SendCharacterUpdated } from "./common.js";

const CharacteristicsElement = document.getElementById('characteristics');

function SetCharacteristics() {
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
}

function SaveChange(event) {
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
}

CharacteristicsElement.addEventListener("change", SaveChange);

document.addEventListener("character-loaded", SetCharacteristics);