const CharacteristicsElement = document.getElementById('characteristics');

export function SetCharacteristics(characteristics) {
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

CharacteristicsElement.addEventListener("change", (event) => {
    let character = window.character;
    let target = event.target;

    //handle inputs with an id
    switch (target.id) {
        // Header
        case "name": character.header.name = target.value; break;
        case "player": character.header.player = target.value; break;
        case "archetype": character.header.archetype = target.value; break;
        case "career": character.header.career = target.value; break;
        case "xp-available": character.header.xpAvailable = parseInt(target.value); break;
        case "xp-total": character.header.xpTotal = parseInt(target.value); break;
        // Characteristics
        case "brawn": character.characteristics.Brawn = parseInt(target.value); break;
        case "agility": character.characteristics.Agility = parseInt(target.value); break;
        case "intellect": character.characteristics.Intellect = parseInt(target.value); break;
        case "cunning": character.characteristics.Cunning = parseInt(target.value); break;
        case "willpower": character.characteristics.Willpower = parseInt(target.value); break;
        case "presence": character.characteristics.Presence = parseInt(target.value); break;
        // Conditions
        case "soak": character.characteristics.Soak = parseInt(target.value); break;
        case "wounds-threshold": character.characteristics.WoundsThreshold = parseInt(target.value); break;
        case "wounds-current": character.characteristics.WoundsCurrent = parseInt(target.value); break;
        case "strain-threshold": character.characteristics.StrainThreshold = parseInt(target.value); break;
        case "strain-current": character.characteristics.StrainCurrent = parseInt(target.value); break;
        case "defense-ranged": character.characteristics.DefenseRanged = parseInt(target.value); break;
        case "defense-melee": character.characteristics.DefenseMelee = parseInt(target.value); break;
    }

    var event = new CustomEvent("character-updated", {});
    document.dispatchEvent(event);
});