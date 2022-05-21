import {CHARACTER_UPDATED, SendCharacterLoaded } from './common.js';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

document.getElementById('toggle-symbols-modal').addEventListener('click', e => document.getElementById('symbols').Toggle(e.clientX, e.clientY));

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
})