import {CHARACTER_LOADED, SendCharacterUpdated} from './common.js';
import { CriticalInjury } from './genesys.js';
import { NewSimpleListEditor } from './util/listEditor.js';
import { ConvertSymbols } from './util/prettyText.js';
import { } from "./elements/list-controls.js";
import { } from "./elements/dice-symbols.js";
import { attachResize } from './util/growabletextarea.js';
import { RemoveAllChildNodes } from './util/utils.js';

export class InjuryDisplay extends HTMLElement {
    #state;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = /* HTML */ `
        <style>
        @import './css/shared.css';
        
        :host {
            display: flex;
            flex-direction: row;
            gap: 0.25em;
            margin-top: 0.25em;
            margin-bottom: 0.25em;
        }
        </style>
        <list-controls></list-controls>
        <button id="edit" class="edit" title="Edit">🖉</button>
        <span id="severity"></span>
        <span id="result"></span>
        `;

        this.shadowRoot.getElementById('edit').addEventListener('click', event => {
            event.preventDefault();
            event.target.blur();
            this.#edit(event);
        });
        
        this.#state = {};
        this.onEdit = event => console.warn("Injury-Display needs onEdit set");

    }

    static get observedAttributes() {
        return ['severity', 'result'];
    }

    static get tag() {
        return "injury-display";
    }

    connectedCallback() {
        if (!this.isConnected) return;

        this.#updateSeverity(this.#state.severity);
        ConvertSymbols(this.#state.result, this.shadowRoot.querySelector('#result'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'severity': this.#updateSeverity(newValue); break;
            case 'result': ConvertSymbols(newValue, this.shadowRoot.querySelector('#result')); break;
        }
    }

    #edit(event) {
        this.onEdit(event);
    }

    #updateSeverity(newValue) {
        let severity = this.shadowRoot.querySelector('#severity');
        RemoveAllChildNodes(severity);
        for (let i = 0; i < newValue; i++) {
            severity.appendChild(document.createElement('die-difficulty'));
        }
    }
}
customElements.define(InjuryDisplay.tag, InjuryDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'item-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Critical Injury</h1>
    <fieldset>
        <legend>Severity</legend>
        <input type="checkbox" class="severity">
        <input type="checkbox" class="severity">
        <input type="checkbox" class="severity">
        <input type="checkbox" class="severity">
    </fieldset>
    <label for="edit-injury-result">Result</label>
    <textarea id="edit-injury-result"></textarea>
</td19-modal>
`;
document.body.append(ModalTemplate);

const listEditor = NewSimpleListEditor(
    document.getElementById('injury-table'),
    InjuryDisplay,
    ModalTemplate,
);
listEditor.createDisplay = (injury) => {
    let element = document.createElement(InjuryDisplay.tag);
    let fields = InjuryDisplay.observedAttributes; 
    fields.forEach(field => {
        element.setAttribute(field, injury[field]);
    });

    element.onEdit = event => {
        //create modal
        /** @type { Element} */
        let modal  = ModalTemplate.content.firstElementChild.cloneNode(true);
        document.body.append(modal);
        //fill in details
        const checkboxes = modal.querySelectorAll('.severity');
        const resultinput = modal.querySelector('#edit-injury-result');
        for (const [key, checkbox] of checkboxes.entries()) {
            checkbox.checked = key < injury.severity;
        }
        resultinput.value = injury.result;

        //hookup listeners
        attachResize(resultinput);
        resultinput.addEventListener('change', event => {
            injury.result = resultinput.value;
            element.setAttribute('result', resultinput.value);
            SendCharacterUpdated();
        });
        for (const [key, checkbox] of checkboxes.entries()) {
            checkbox.addEventListener('change', event => {
                if (checkbox.checked)
                    injury.severity = key + 1;
                else
                    injury.severity = key;
                for (const [key, checkbox] of checkboxes.entries()) {
                    checkbox.checked = key < injury.severity;
                }
                element.setAttribute('severity', injury.severity);
                SendCharacterUpdated();
            });
        }
        modal.addEventListener('delete', () => listEditor.remove(injury));

        //display
        modal.Open(event.clientX, event.clientY);
    };
    return element;
};   

document.getElementById('new-injury').addEventListener('click', event => {
    listEditor.add(new CriticalInjury(1, "a deep cut")).onEdit(event);
});

document.addEventListener(CHARACTER_LOADED, () => {
    if (!window.character.critical_injuries) window.character.critical_injuries = [];
    listEditor.replaceArray(window.character.critical_injuries);
});