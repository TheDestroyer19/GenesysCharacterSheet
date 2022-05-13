import { CHARACTER_LOADED } from './common.js';
import { RANGE, Weapon} from './genesys.js';
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
            box-sizing: border-box;
            display: flex;
            justify-content: space-evenly;
            flex-direction: column;
            min-width: 2.5em;
            flex-shrink: 0;

            color: white;
            text-align: center;
            font-weight: bold;

            border-radius: 0.35em;
            padding: 0 0.2em;
        }
        #media print {
            .block {
                border: 0.2em solid var(--bg);
            }
        }
        .block > span:last-child {
            font-size: x-small;
        }
        .a2 {
            --bg: Var(--ca2-50);
            background-color: Var(--bg);
        }
        .a1 {
            --bg: Var(--ca1-30);
            background-color: Var(--bg);
        }
        .grow {
            flex-grow: 1;
        }
        #damage, #crit, #encumberance, #hard_points {
            font-size: 1.5rem;
            line-height: 1.05;
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
        }
        #skill, #special, #description {
            font-size: small;
        }
        </style>
        <list-controls></list-controls>
        <div class="grow">
            <div>
                <button id="edit" class="edit" title="Edit">🖉</button>
                <h1 id="name"></h1>
                <span id="skill" class="a1"></span>
                <span id="special"></span>
            </div>
            <div id="description">
            </div>
        </div>
        <div class="block a1">
            <span id="range"></span>
            <span>Range</span>
        </div>
        <div class="block a2">
            <span id="damage"></span>
            <span>Damage</span>
        </div>
        <div class="block a2">
            <span id="crit"></span>
            <span>Crit</span>
        </div>
        <div class="block a1">
            <span id="encumberance"></span>
            <span>Encum</span>
        </div>
        <div class="block a1">
            <span id="hard_points"></span>
            <span>HP</span>
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
        return ['name', 'skill', 'damage', 
            'uses_brawn', 'crit', 'range', 'special', 
            'encumberance', 'hard_points', 'description'];
    }

    static get tag() {
        return "weapon-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        this.constructor.observedAttributes.forEach(name => {
            this.attributeChangedCallback(name, "", this.#state[name]);
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        let shadow = this.shadowRoot;
        switch (name) {
            case 'name': ConvertSymbols(newValue, shadow.querySelector('#name')); break;
            case 'skill': ConvertSymbols(newValue, shadow.querySelector('#skill')); break;
            case 'range': shadow.querySelector('#range').innerHTML = this.#state.range;; break;
            case 'special': ConvertSymbols(newValue, shadow.querySelector('#special')); break;
            case 'uses_brawn': case 'damage': this.#updateDamageText(); break;
            case 'crit': shadow.querySelector('#crit').innerHTML = this.#state.crit; break;
            case 'encumberance': shadow.querySelector('#encumberance').innerHTML = this.#state.encumberance;
            case 'hard_points': shadow.querySelector('#hard_points').innerHTML = this.#state.hard_points;
            case 'description': ConvertSymbols(newValue, shadow.querySelector('#description')); break;
        }
    }

    #updateDamageText() {
        let uses_brawn = this.#state.uses_brawn == 'true';
        let damageText = uses_brawn ? "Brawn + " : "";
        this.shadowRoot.querySelector('#damage').innerHTML = damageText + this.#state.damage;
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
    <label>Encumberance<input type="number" id="encumberance" /></label>
    <label>Hard Points<input type="number" id="hard_points" /></label>
    <label>Special<input type="text" id="special" /></label>
    <label for="description">description</label>
    <textarea id="description" class="growable"></textarea>
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
    listEditor.add(new Weapon("Unnamed weapon", "Melee", 0, false, 0, RANGE.Engaged, "", 0, 0, "")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.weapons) window.character.weapons = [];
    listEditor.replaceArray(window.character.weapons);
});