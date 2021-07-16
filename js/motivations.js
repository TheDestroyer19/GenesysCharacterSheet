import { SendCharacterUpdated } from "./common.js";

const MotivationsElement = document.getElementById('motivations');
const Fear = document.getElementById('motivation-fear');
const Strength = document.getElementById('motivation-strength');
const Flaw = document.getElementById('motivation-flaw');
const Desire = document.getElementById('motivation-desire');

function SetMotivations() {
    let character = window.character;

    if (character.motivations == undefined) {
        character.motivations = {
            fear: "",
            strength: "",
            flaw: "",
            desire: "",
        };
    }

    let motivations = character.motivations;

    Fear.value = motivations.fear;
    Strength.value = motivations.strength;
    Flaw.value = motivations.flaw;
    Desire.value = motivations.desire;
}

function SaveMotivations(event) {
    let motivations = window.character.motivations;
    let target = event.target;

    switch(target) {
        case Fear: motivations.fear = Fear.value; break;
        case Strength: motivations.strength = Strength.value; break;
        case Flaw: motivations.flaw = Flaw.value; break;
        case Desire: motivations.desire = Desire.value; break;
        default: return;
    }

    SendCharacterUpdated();
}

MotivationsElement.addEventListener("change", SaveMotivations);
document.addEventListener("character-loaded", SetMotivations);