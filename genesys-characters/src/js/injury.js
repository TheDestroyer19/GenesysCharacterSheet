import {CHARACTER_LOADED, SendCharacterUpdated} from './common';
import { CriticalInjury } from './genesys';
import { NewSimpleListEditor } from './util/listEditor';
import { ConvertSymbols } from './util/prettyText';
import { attachResize } from './util/growabletextarea';
import { GenericListItem } from './elements/generic-list-item';

export class InjuryDisplay extends GenericListItem {
    #state;

    constructor() {
        super();
        this.#state = {};
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
        this.updateSuffix(element => ConvertSymbols(this.#state.result, element));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#state[name] = newValue;
        switch (name) {
            case 'severity': this.#updateSeverity(newValue); break;
            case 'result': this.updateSuffix(element => ConvertSymbols(this.#state.result, element)); break;
        }
    }

    #updateSeverity(newValue) {
        this.updatePrefix(element => {
            for (let i = 0; i < newValue; i++) {
                element.appendChild(document.createElement('die-difficulty'));
            }
        });
    }
}
customElements.define(InjuryDisplay.tag, InjuryDisplay);

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'item-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal class="modal-edit-injury" discard-on-close>
    <h1 slot="title">Critical Injury</h1>
    <div class="two-column-grid">
        <label>Severity</label>
        <div>
            <input type="checkbox" class="severity" />
            <input type="checkbox" class="severity" />
            <input type="checkbox" class="severity" />
            <input type="checkbox" class="severity" />
        </div>
        <label for="edit-injury-result">Result</label>
        <textarea id="edit-injury-result"></textarea>
    </div>
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