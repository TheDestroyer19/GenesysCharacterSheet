//const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
const modalTemplate = document.createElement('template');
modalTemplate.id = 'modal-template';
modalTemplate.innerHTML = `
<style>
@import '/css/shared.css';
#wrapper {
    z-index: 110;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4in;
    max-width: 100%;
    background-color: white;
    display: grid;
    column-gap: 0.25rem;
    row-gap: 0.25rem;

    border: 0.2rem solid var(--cp-30);
    border-radius: 0.75rem;
    padding: 0.5rem;
}
.closed {
    display: none;
}
#overlay {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 50%;
}
</style>
<div id="root" class="closed">
    <div id="overlay"></div>
    <div id="wrapper">
        <slot>Default text</slot>
    </div>
</div>
`;
document.body.append(modalTemplate);

export class Modal extends HTMLElement {
    #root;

    constructor(
    ) {
        super();

        let templateContent = modalTemplate.content;

        let shadowRoot = this.attachShadow({mode: 'open'})
            .appendChild(templateContent.cloneNode(true));

        this.#root = this.shadowRoot.querySelector('#root');

        //setup event handlers
        this.querySelectorAll(".modal-close").forEach(
            btn => btn.addEventListener("click", () => this.Close())
        );
        //setup event handlers
        this.querySelectorAll(".modal-save").forEach(
            btn => btn.addEventListener("click", () => this.#Save())
        );
        //setup event handlers
        this.querySelectorAll(".modal-delete").forEach(
            btn => btn.addEventListener("click", () => this.#Delete())
        );
    }

    Open() {
        this.#root.classList.remove("closed");
    }

    Close() {
        this.#root.classList.add("closed");
    }

    #Save() {
        let event = new CustomEvent('save');
        this.dispatchEvent(event);
        this.Close();
    }

    #Delete() {
        let event = new CustomEvent('delete');
        this.dispatchEvent(event);
        this.Close();
    }
}

customElements.define('td19-modal', Modal);