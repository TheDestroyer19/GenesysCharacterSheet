import { RemoveAllChildNodes, DoOnUpdate } from "/js/common.js";
import { Characteristic } from "/js/genesys.js";
import { } from "/js/elements/list-controls.js";
import { } from "/js/elements/dice-symbols.js";

const STYLE_TEXT = /*css*/`
@import '/css/shared.css';
:host, :host > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    column-gap: 0.25em;
}
:host > div {
    flex-grow: 1;
    flex-wrap: wrap;
}
list-controls {
    align-self: stretch;
}
#career, #stat {
    display: inline-block;
    height: 1.15em;
    min-width: 1.15em;

    color: white;
    text-align: center;
    font-weight: bold;

    border-radius: 0.35em;
}

#career {
    background-color: Var(--ca1-30);
}
.hidden {
    visibility: hidden;
}
#stat {
    padding: 0 0.2em;
    background-color: Var(--ca2-50);
    font-size: small;
}
#ranks {
    flex-grow: 1;
    text-align: end;
}
`;

const ELEMENT_HTML = /*html*/`
<list-controls></list-controls>
<div>
    <button id="edit" class="edit" title="Edit">🖉</button>
    <span id="career">C</span>
    <span id="name"></span>
    <span id="stat"></span>
    <span id="ranks"></span>
</div>
`;

export class SkillDisplay extends HTMLElement {
    #career;
    #name;
    #stat;
    #ranks;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = ELEMENT_HTML;
        this.#career = this.shadowRoot.querySelector('#career');
        this.#name = this.shadowRoot.querySelector('#name');
        this.#stat = this.shadowRoot.querySelector('#stat');
        this.#ranks = this.shadowRoot.querySelector('#ranks');

        this.shadowRoot.getElementById('edit').addEventListener('click', event => {
            event.preventDefault();
            event.target.blur();
            this.#edit(event);
        });

        const style = document.createElement('style');
        style.textContent = STYLE_TEXT;

        //call some methods to get display set up
        // this.attributeChangedCallback('career', undefined, this.getAttribute('career'));
        // this.attributeChangedCallback('name', undefined, this.getAttribute('name'));
        // this.attributeChangedCallback('characteristic', undefined, this.getAttribute('characteristic'));
        // this.attributeChangedCallback('rank', undefined, this.getAttribute('rank'));

        this.shadowRoot.appendChild(style);

        this.onEdit = event => console.warn("Skill-Display needs onEdit set");
    }

    static get observedAttributes() {
        return ['rank', 'name', 'career', 'characteristic'];
    }

    static get tag() {
        return 'skill-display';
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'career':
                if (newValue == "true") {
                    this.#career.classList.remove('hidden');
                } else {
                    this.#career.classList.add('hidden');
                }
                break;
            case 'name':
                this.#name.textContent = newValue;
                break;
            case 'characteristic':
                if (newValue) {
                    this.#stat.textContent = Characteristic.Shorten(newValue);
                } else {
                    this.#stat.textContent = '';
                }
                this.#stat.title = newValue;
                this.updateRanksDisplay();
                break;
            case 'rank': 
                this.updateRanksDisplay();
                break;
        };
    }

    updateRanksDisplay() {
        let rank = this.getAttribute('rank');
        let stat = character.characteristics[this.getAttribute('characteristic')];
        RemoveAllChildNodes(this.#ranks);
        let i = 0;
        for (; i < rank && i < stat; i++) {
            this.#ranks.appendChild(document.createElement('die-proficiency'));
        }
        for (; i < rank || i < stat; i++) {
            this.#ranks.appendChild(document.createElement('die-ability'));
        }
    }

    #edit(event) {
        this.onEdit(event);
    }
}

DoOnUpdate('character.characteristics.Brawn', () => {
    document.querySelectorAll(SkillDisplay.tag + '[characteristic="Brawn"]')
        .forEach(skill => skill.updateRanksDisplay());
});
DoOnUpdate('character.characteristics.Agility', () => {
    document.querySelectorAll(SkillDisplay.tag + '[characteristic="Agility"]')
        .forEach(skill => skill.updateRanksDisplay());
});
DoOnUpdate('character.characteristics.Intellect', () => {
    document.querySelectorAll(SkillDisplay.tag + '[characteristic="Intellect"]')
        .forEach(skill => skill.updateRanksDisplay());
});
DoOnUpdate('character.characteristics.Cunning', () => {
    document.querySelectorAll(SkillDisplay.tag + '[characteristic="Cunning"]')
        .forEach(skill => skill.updateRanksDisplay());
});
DoOnUpdate('character.characteristics.Willpower', () => {
    document.querySelectorAll(SkillDisplay.tag + '[characteristic="Willpower"]')
        .forEach(skill => skill.updateRanksDisplay());
});
DoOnUpdate('character.characteristics.Presence', () => {
    document.querySelectorAll(SkillDisplay.tag + '[characteristic="Presence"]')
        .forEach(skill => skill.updateRanksDisplay());
});

customElements.define('skill-display', SkillDisplay);
