import {Characteristic} from "/js/genesys.js";

const STYLE_TEXT = `
:host {
    display: block;
}

summary {
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

#root {
    cursor: pointer;
    background: #dddddd;
    border-radius: 0.35rem;
}

#career {
    display: inline-block;
    width: 1rem;
    height: 1rem;

    color: white;
    text-align: center;
    font-weight: bold;
    line-height: 1rem;

    background-color: orange;
    border-radius: 0.35rem;
}
#career.hidden {
    color: transparent;
    background-color: transparent;
}

#stat {
    display: inline-block;
    height: 1rem;
    min-width: 1rem;
    padding: 0 0.2rem;

    color: white;
    line-height: 1rem;
    text-align: center;

    background-color: orange;
    border-radius: 0.25rem;
}

#ranks {
    display: flex;
    align-items: center;
}

#edit {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 0.25rem;
    grid-row-gap: 0.25rem;
    padding: 0.25rem;
}
#edit label {
    text-align: end;
}

.rank:first-child {
    border-top-left-radius: 0.35rem;
    border-bottom-left-radius: 0.35rem;
}
.rank:last-child {
    border-top-right-radius: 0.35rem;
    border-bottom-right-radius: 0.35rem;
}
.rank {
    display: inline-block;
    box-sizing: border-box;
    width: 1rem;
    height: 1rem;

    background-color: white;
    border: 0.1rem solid black;
}
.rank.filled {
    background-color: #06D8FF;
}


`;
const ELEMENT_HTML = `
<details id="root">
    <summary>
        <span id="career">C</span>
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
            this.name = event.target.value;
            this.#send_change_event();
        });
        this.#career_i.addEventListener('input', event => {
            this.career = event.target.value;
            this.#send_change_event();
        });
        this.#stat_i.addEventListener('input', event => {
            this.stat = event.target.value;
            this.#send_change_event();
        });
        this.#rank_i.addEventListener('input', event => {
            this.rank = event.target.value;
            this.#send_change_event();
        });

        //call some methods to get display set up
        this.attributeChangedCallback('career', undefined, this.career);
        this.attributeChangedCallback('name', undefined, this.name);
        this.attributeChangedCallback('rank', undefined, this.rank);
        this.attributeChangedCallback('stat', undefined, this.stat);

        this.shadowRoot.appendChild(style);
    }

    static get observedAttributes() {
        return ['rank', 'name', 'career', 'stat'];
    }

    #send_change_event() {
        var event = new CustomEvent('change', {});
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
                this.#stat_h.textContent = Characteristic.Shorten(this.stat);
                this.#stat_i.value = this.stat;
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
        };
    }

    get rank() {
        return this.getAttribute('rank');
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
