const ELEMENT_HTML = /* HTML */ `
<style>
    @import '/css/shared.css';
    :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        border-right: 0.2rem solid var(--ca1-50);
    }
</style>
<button id="up" class="edit" title="Move up">▲</button>
<button id="down" class="edit" title="Move down">▼</button>
`;

export class ListControls extends HTMLElement {
    constructor() {
        super();

        let shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = ELEMENT_HTML;

        shadow.getElementById('up').addEventListener('click', event => {
            event.stopPropagation();
            event.target.blur();
            let e = new CustomEvent('list-move-up', { bubbles: true, composed: true});
            this.dispatchEvent(e);
        });

        shadow.getElementById('down').addEventListener('click', event => {
            event.stopPropagation();
            event.target.blur();
            let e = new CustomEvent('list-move-down', { bubbles: true, composed: true});
            this.dispatchEvent(e);
        });
    }
}
customElements.define('list-controls', ListControls);