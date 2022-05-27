import {CHARACTER_UPDATED, SendCharacterLoaded } from './common.js';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

await listen('toggle_symbols', event => {
    document.getElementById('symbols').Toggle(10, 10);
});

await listen('goto', event => {
    let target = document.getElementById(event.payload);
    target.scrollIntoView({behavior: 'smooth'});
});

document.addEventListener(CHARACTER_UPDATED, () => {
    invoke('on_character_edited', { character, });
});

await listen('character-updated', event => {
    character = event.payload;
    window.character = character;
    SendCharacterLoaded();
});

invoke('get_character').then(character => {
    window.character = character;
    SendCharacterLoaded();
});