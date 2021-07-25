import { setBoolAttribute } from "/js/common.js";
import { Characteristic } from "/js/genesys.js";

const STYLE_TEXT = `
:host {
    display: block;
}

summary {
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.2em;

    line-height: 1.15;
}

#root {
    cursor: pointer;
    background: #dddddd;
    border-radius: 0.35em;
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
    background-color: #007186;
}
#career.hidden {
    visibility: hidden;
}

#stat {
    padding: 0 0.2em;
    background-color: orange;
}

#edit {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 0.25rem;
    grid-row-gap: 0.25rem;
    align-items: center;
    padding: 0.25rem;
}
#edit label {
    text-align: end;
}
input:not([type="checkbox"]), select {
    min-width: 2rem;
    justify-self: stretch;
}

#ranks {
    display: flex;
    align-items: center;
    border: 1px solid black;
    border-radius: 0.35em;
    overflow: hidden;
    height: 0.7em;
}
.rank {
    display: inline-block;
    box-sizing: border-box;
    width: 1.15em;
    height: 100%;

    background-color: white;
    border-right: 1px solid black;
}
.rank:last-child {
    width: calc(1.15em - 1px);
    border-right: none;
}
.rank.filled {
    background-color: #06D8FF;
}
`;
const ELEMENT_HTML = `
<details id="root">
    <summary>
        <span id="career" title="Career Skill">C</span>
        <span id="name"></span>
        <span id="stat"></span>
        <span style="flex-grow: 1"></span>
        <span id="ranks">
            <span class="rank"></span>
            <span class="rank"></span>
            <span class="rank"></span>
            <span class="rank"></span>
            <span class="rank"></span>
        </span>
    </summary>
    <div id="edit">
        <label for="name-input">Name</label>
        <input id="name-input"></input>
        <label for="career-input">Career</label>
        <div><input id="career-input" type="checkbox"></input></div>
        <label for="stat-input">Characteristic</label>
        <select id="stat-input">
            <option>Brawn</option>
            <option>Agility</option>
            <option>Intellect</option>
            <option>Cunning</option>
            <option>Willpower</option>
            <option>Presence</option>
        </select>
        <label for="rank-input">Rank</label>
        <input id="rank-input" type="number"></input>
    </div>
</details>
`;

class SkillDisplay extends HTMLElement {
    #root;
    #career_h;
    #career_i;
    #name_h;
    #name_i;
    #stat_h;
    #stat_i;
    #ranks_h;
    #rank_i;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = ELEMENT_HTML;
        this.#root = this.shadowRoot.querySelector("#root");
        this.#career_h = this.#root.querySelector('#career');
        this.#career_i = this.#root.querySelector('#career-input');
        this.#name_h = this.#root.querySelector('#name');
        this.#name_i = this.#root.querySelector('#name-input');
        this.#stat_h = this.#root.querySelector('#stat');
        this.#stat_i = this.#root.querySelector('#stat-input');
        this.#ranks_h = this.#root.querySelectorAll('.rank');
        this.#rank_i = this.#root.querySelector('#rank-input')

        const style = document.createElement('style');
        style.textContent = STYLE_TEXT;

        //setup input event handlers
        this.#name_i.addEventListener('input', event => {
            let oldName = this.name;
            this.name = event.target.value;
            this.#send_change_event(oldName);
        });
        this.#career_i.addEventListener('input', event => {
            this.career = event.target.checked;
            this.#send_change_event(this.name);
        });
        this.#stat_i.addEventListener('input', event => {
            this.stat = event.target.value;
            this.#send_change_event(this.name);
        });
        this.#rank_i.addEventListener('input', event => {
            this.rank = event.target.value;
            this.#send_change_event(this.name);
        });
        for(const [key, box] of this.#ranks_h.entries()) {
            box.addEventListener('click', () => {
                let old = this.rank;
                if (key >= this.rank) {
                    this.rank += 1;
                } else {
                    this.rank -= 1;
                }
                this.#send_change_event(this.name);
                if (this.#root.hasAttribute('open')) {
                    this.#root.removeAttribute('open');
                } else {
                    this.#root.setAttribute('open', true);
                }
                return true;
            });
        }

        //call some methods to get display set up
        this.attributeChangedCallback('career', undefined, this.career);
        this.attributeChangedCallback('name', undefined, this.name);
        this.attributeChangedCallback('rank', undefined, this.rank);
        this.attributeChangedCallback('stat', undefined, this.stat);

        this.shadowRoot.appendChild(style);
    }

    static get observedAttributes() {
        return ['rank', 'name', 'career', 'stat', 'open'];
    }

    #send_change_event(oldName) {
        var event = new CustomEvent('change', {
            bubbles: true,
            detail: oldName,
        });
        this.dispatchEvent(event);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'career':
                if (this.career) {
                    this.#career_h.classList.remove('hidden');
                    this.#career_i.setAttribute('checked', true);
                } else {
                    this.#career_h.classList.add('hidden');
                    this.#career_i.removeAttribute('checked');
                }
                break;
            case 'name':
                this.#name_h.textContent = this.name;
                this.#name_i.value = this.name;
                break;
            case 'stat':
                if (this.stat) {
                    this.#stat_h.textContent = Characteristic.Shorten(this.stat);
                    this.#stat_h.title = this.stat;
                    this.#stat_i.value = this.stat;
                } else {
                    this.#stat_h.textContent = "";
                    this.#stat_i.value = "";
                }
                break;
            case 'rank':
                this.#rank_i.value = this.rank;
                for (const [key, box] of this.#ranks_h.entries()) {
                    if (key < this.rank) {
                        box.classList.add('filled');
                    } else {
                        box.classList.remove('filled');
                    }
                }
                break;
            case 'open':
                setBoolAttribute(this.#root, 'open', newValue);
                break;
        };
    }

    get open() {
        return this.hasAttribute('open');
    }
    set open(value) {
        setBoolAttribute(this, 'open', value);
        setBoolAttribute(this.#root, 'open', value);
    }

    get rank() {
        let value = parseInt(this.getAttribute('rank'));
        if (isNaN(value)) return 0;
        return value;
    }
    set rank(value) {
        if (value) {
            this.setAttribute('rank', value);
        } else {
            this.removeAttribute('rank');
        }
    }

    get name() {
        return this.getAttribute('name');
    }
    set name(value) {
        if (value) {
            this.setAttribute('name', value);
        } else {
            this.removeAttribute('name');
        }
    }

    get career() {
        return this.hasAttribute('career');
    }
    set career(value) {
        if (value) {
            this.setAttribute('career', true);
        } else {
            this.removeAttribute('career');
        }
    }

    get stat() {
        return this.getAttribute('stat');
    }
    set stat(value) {
        if (value) {
            this.setAttribute('stat', value);
        } else {
            this.removeAttribute('stat');
        }
    }
}

customElements.define('skill-display', SkillDisplay);
