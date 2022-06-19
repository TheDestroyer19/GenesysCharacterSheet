const ELEMENT_HTML = /* HTML */ `
<style>
    @import '/src/css/shared.css';
    :host {
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        align-items: stretch;
        max-width: 1.15em;

        border-right: 0.2rem solid var(--ca1-50);
    }
    button.edit {
        height: auto;
        max-height: 1.15em;
        width: 1.15em;
        flex-grow: 1;
    }
    button > div {
        background: #fff;
        width: 60%;
        height: 60%;
        margin: auto auto;
    }
    div.up {
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }
    div.down {
        clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
    }
</style>
<button id="up" class="edit" title="Move up"><div class="up"></div></button>
<button id="down" class="edit" title="Move down"><div class="down"></div></button>
`;

export class ListControls extends HTMLElement {
    constructor() {
        super();

        let shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = ELEMENT_HTML;

        shadow.getElementById('up')?.addEventListener('click', event => {
            event.stopPropagation();
            if (event.target instanceof HTMLElement) {
                (event.target as HTMLElement).blur();
            }
            let e = new CustomEvent('list-move-up', { bubbles: true, composed: true});
            this.dispatchEvent(e);
        });

        shadow.getElementById('down')?.addEventListener('click', event => {
            event.stopPropagation();
            if (event.target instanceof HTMLElement) {
                (event.target as HTMLElement).blur();
            }
            let e = new CustomEvent('list-move-down', { bubbles: true, composed: true});
            this.dispatchEvent(e);
        });
    }
}
customElements.define('list-controls', ListControls);