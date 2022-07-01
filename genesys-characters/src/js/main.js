import {CHARACTER_UPDATED, SendCharacterLoaded } from './common';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

await listen('toggle_symbols', event => {
    document.getElementById('symbols').Toggle(10, 10);
});

await listen('goto', event => {
    let target = document.getElementById(event.payload);
    target.scrollIntoView({behavior: 'smooth'});
});

await listen('character-updated', event => {
    character = event.payload;
    window.character = character;
    SendCharacterLoaded();
});

await listen('element-updated', event => {
    let element = event.payload;
    let elements = document.querySelectorAll(`[data-element-id='${element.id}']`);
    elements.forEach(node => {
        for (let property in element) {
            node.setAttribute(property, element[property]);
        }
    });
    console.log(`Element ${event.payload.id} was updated`);
});

document.addEventListener(CHARACTER_UPDATED, () => {
    invoke('on_character_edited', { character, });
});

invoke('get_character').then(character => {
    window.character = character;
    SendCharacterLoaded();
});