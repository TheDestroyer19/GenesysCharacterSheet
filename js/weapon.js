import { CHARACTER_LOADED } from './common.js';
import {COMBAT_SKILL_NAME, RANGE, Weapon} from './genesys.js';
import { NewSimpleListEditor } from './listEditor.js';
import { ConvertSymbols } from './util/prettyText.js';

export class WeaponDisplay extends HTMLElement {
    #state;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = /* HTML */ `
        <style>
        @import '/css/shared.css';

        :host {
            display: flex;
            flex-direction: row;
            gap: 0.25em;
            margin-top: 0.25em;
            margin-bottom: 0.25em;
        }
        h1 {
            display: inline;
        }
        .block {
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            min-width: 2.5em;

            color: white;
            text-align: center;
            font-weight: bold;

            border-radius: 0.35em;
            padding: 0 0.2em;
            background-color: Var(--ca2-50);
        }
        .block > span {
            font-size: x-small;
        }
        .grow {
            flex-grow: 1;
        }
        #damage, #crit {
            font-size: 1.5rem;
            line-height: 1.05;
        }
        #range {
            font-size: Medium;
        }
        #skill {
            display: inline-block;
            height: 1.15em;
            min-width: 1.15em;

            color: white;
            text-align: center;
            font-weight: bold;

            border-radius: 0.35em;
            padding: 0 0.2em;
            background-color: Var(--ca2-50);
        }
        #skill, #special {
            font-size: small;
        }
        </style>
        <list-controls></list-controls>
        <div class="grow">
            <div>
                <button id="edit" class="edit" title="Edit">🖉</button>
                <h1 id="name"></h1>
                <span id="skill"></span>
            </div>
            <div>
            <span id="special"></span>
            </div>
        </div>
        <div class="block">
            <span id="range"></span>
            <span>Range</span>
        </div>
        <div class="block">
            <span id="damage"></span>
            <span>Damage</span>
        </div>
        <div class="block">
            <span id="crit"></span>
            <span>Crit</span>
        </div>
        `;

        this.shadowRoot.getElementById('edit').addEventListener('click', event => {
            event.preventDefault();
            event.target.blur();
            this.#edit(event);
        });
        
        this.#state = {};
        this.onEdit = event => console.warn("Weapon-Display needs onEdit set");
    }

    static get observedAttributes() {
        return ['name', 'skill', 'damage', 'uses_brawn', 'crit', 'range', 'special'];
    }

    static get tag() {
        return "weapon-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        ConvertSymbols(this.#state.name, this.shadowRoot.querySelector('#name'));
        ConvertSymbols(this.#state.skill, this.shadowRoot.querySelector('#skill'));
        ConvertSymbols(this.#state.special, this.shadowRoot.querySelector('#special'));
        this.#updateDamageText();
        this.#updateRangeText();
        this.#updateCritText();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'name': ConvertSymbols(newValue, this.shadowRoot.querySelector('#name')); break;
            case 'skill': ConvertSymbols(newValue, this.shadowRoot.querySelector('#skill')); break;
            case 'range': this.#updateRangeText; break;
            case 'special': ConvertSymbols(newValue, this.shadowRoot.querySelector('#special')); break;
            case 'uses_brawn': case 'damage': this.#updateDamageText(); break;
            case 'Crit': this.#updateCritText(); break;
        }
    }

    #updateDamageText() {
        let uses_brawn = this.#state.uses_brawn == 'true';
        let damageText = uses_brawn ? "Brawn + " : "";
        this.shadowRoot.querySelector('#damage').innerHTML = damageText + this.#state.damage;
    }

    #updateCritText() {
        this.shadowRoot.querySelector('#crit').innerHTML = this.#state.crit;
    }

    #updateRangeText() {
        this.shadowRoot.querySelector('#range').innerHTML = this.#state.range;
    }

    #edit(event) {
        this.onEdit(event);
    }
}
customElements.define(WeaponDisplay.tag, WeaponDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'ability-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal id="modal-edit-weapon">
<h1 slot="title">Weapon</h1>
<div>
    <label>Name<input type="text" id="name" /></label>
    <label>Skill<input type="text" id="skill" /></label>
    <label>Damage<input type="number" id="damage" /></label>
    <label><input type="checkbox" id="uses_brawn"> Add Brawn</label>
    <label >Critical<input type="number" id="crit" /></label>
    <label >Range<select id="range">
        <option>Engaged</option>
        <option>Short</option>
        <option>Medium</option>
        <option>Long</option>
        <option>Extreme</option>
    </select></label>
    <label>Special<input type="text" id="special" /></label>
</div>
</td19-modal>
`;
document.body.append(ModalTemplate);

const listEditor = NewSimpleListEditor(
    document.getElementById('weapons-table'),
    WeaponDisplay,
    ModalTemplate,
)

document.getElementById('new-weapon').addEventListener('click', event => {
    listEditor.add(new Weapon("Unnamed weapon", COMBAT_SKILL_NAME.Melee, 0, false, 0, RANGE.Engaged, "")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.weapons) window.character.weapons = [];
    listEditor.replaceArray(window.character.weapons);
});