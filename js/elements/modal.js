//const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
const modalTemplate = document.createElement('template');
modalTemplate.id = 'modal-template';
modalTemplate.innerHTML = `
<style>
@import '/css/shared.css';
#wrapper {
    box-sizing: border-box;
    z-index: 110;
    position: fixed;
    top: 0px;
    left: 0px;
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
    #wrapper;

    constructor(
    ) {
        super();

        let templateContent = modalTemplate.content;

        //setup shadowroot
        let shadowRoot = this.attachShadow({mode: 'open'})
            .appendChild(templateContent.cloneNode(true));

        this.#root = this.shadowRoot.querySelector('#root');
        this.#wrapper = this.shadowRoot.querySelector('#wrapper');

        //setup event handlers
        this.querySelectorAll(".modal-close").forEach(
            btn => btn.addEventListener("click", () => this.Close())
        );
        this.querySelectorAll(".modal-save").forEach(
            btn => btn.addEventListener("click", () => this.#Save())
        );
        this.querySelectorAll(".modal-delete").forEach(
            btn => btn.addEventListener("click", () => this.#Delete())
        );

    }

    Open(x, y) {
        const one_rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

        this.#root.classList.remove("closed");

        x -= this.#wrapper.clientWidth / 2;

        x = Math.max(x, one_rem);
        x = Math.min(x, window.innerWidth - this.#wrapper.clientWidth - one_rem);
        y = Math.max(y, one_rem);
        y = Math.min(y, window.innerHeight - this.#wrapper.clientHeight - one_rem);
        this.#wrapper.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
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