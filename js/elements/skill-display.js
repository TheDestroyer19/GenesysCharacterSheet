import { RemoveAllChildNodes } from "/js/common.js";
import { Characteristic } from "/js/genesys.js";
import { } from "/js/elements/list-controls.js";
import { } from "/js/elements/dice-symbols.js";

const STYLE_TEXT = /*css*/`
@import '/css/shared.css';
:host {
    display: flex;
    flex-direction: row;
    gap: 0.25em;
    margin-top: 0.25em;
    margin-bottom: 0.25em;
}
#spacer {
    flex-grow: 1;
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
#career.hidden {
    visibility: hidden;
}
#stat {
    padding: 0 0.2em;
    background-color: Var(--ca2-50);
}
`;

const ELEMENT_HTML = /*html*/`
<list-controls></list-controls>
<button id="edit" class="edit" title="Edit">🖉</button>
<span id="career">C</span>
<span id="name"></span>
<span id="stat"></span>
<span id="spacer"></span>
<span id="ranks">
</span>
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
        this.attributeChangedCallback('career', undefined, this.getAttribute('career'));
        this.attributeChangedCallback('name', undefined, this.getAttribute('name'));
        this.attributeChangedCallback('rank', undefined, this.getAttribute('rank'));
        this.attributeChangedCallback('characteristic', undefined, this.getAttribute('characteristic'));

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
                this.#stat.textContent = Characteristic.Shorten(newValue);
                this.#stat.title = newValue;
                break;
            case 'rank':
                RemoveAllChildNodes(this.#ranks);
                for (let i = 0; i < newValue; i++) {
                    this.#ranks.appendChild(document.createElement('die-ability'));
                }
                break;
        };
    }

    #edit(event) {
        this.onEdit(event);
    }
}

customElements.define('skill-display', SkillDisplay);
