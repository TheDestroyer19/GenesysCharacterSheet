import {SendCharacterUpdated} from './common.js';

const HeaderElement = document.getElementById("page1header");

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

function SetHeader() {
    let header = window.character.header;
    document.getElementById("name").value = header.name;
    document.getElementById("player").value = header.player;
    document.getElementById("archetype").value = header.archetype;
    document.getElementById("career").value = header.career;
    document.getElementById("xp-available").value = header.xpAvailable;
    document.getElementById("xp-total").value = header.xpTotal;
    
}

HeaderElement.addEventListener("change", SaveHeader);
document.addEventListener("character-loaded", SetHeader);