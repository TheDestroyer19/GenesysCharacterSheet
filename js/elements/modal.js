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
    /*display: grid;
    column-gap: 0.25rem;
    row-gap: 0.25rem;*/

    border: 0.2rem solid var(--cp-30);
    border-radius: 0.75rem;
    padding: 0.5rem;
}
.closed {
    display: none;
}
#titlebar {
    /* neg margin and rem stuff is to grow target area to edges of modal */
    width: calc(4in + 1rem);
    padding: 0.5rem;
    margin: -0.5rem;
    margin-bottom: 0;
    cursor: move;
}
</style>
<div id="root" class="closed">
    <div id="wrapper">
        <div id="titlebar"><slot name="title"></slot></div>
        <slot>Default text</slot>
    </div>
</div>
`;
document.body.append(modalTemplate);

function setElementPos(x, y, target) {
    const one_rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    x = Math.max(x, one_rem);
    x = Math.min(x, window.innerWidth - target.clientWidth - one_rem);
    y = Math.max(y, one_rem);
    y = Math.min(y, window.innerHeight - target.clientHeight - one_rem);

    target.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
}

export class Modal extends HTMLElement {
    #root;
    #wrapper;
    #title;

    constructor(
    ) {
        super();

        let templateContent = modalTemplate.content;

        //setup shadowroot
        let shadowRoot = this.attachShadow({mode: 'open'})
            .appendChild(templateContent.cloneNode(true));

        this.#root = this.shadowRoot.querySelector('#root');
        this.#wrapper = this.shadowRoot.querySelector('#wrapper');
        this.#title = this.shadowRoot.querySelector('#titlebar');

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
        this.#title.addEventListener('mousedown', e => this.#onDragDown(e), false);
    }

    Open(x, y) {

        this.#root.classList.remove("closed");

        x -= this.#wrapper.clientWidth / 2;
        setElementPos(x, y, this.#wrapper);
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

    #onDragDown(event) {
        let stuff = this.#wrapper.style.transform.match(/\((\d+)px, (\d+)px/);
        let x = stuff[1];
        let y = stuff[2];
        dragging = this.#wrapper;
        dragX = event.clientX - x;
        dragY = event.clientY - y;
        window.addEventListener('mousemove', onDragMove, true);
    }
}

customElements.define('td19-modal', Modal);

let dragging = undefined;
let dragX = 0;
let dragY = 0;

function onDragUp(event) {
    if (dragging) {
        console.log("Drag ended");
        window.removeEventListener('mousemove', onDragMove, true);
        dragging = undefined;
        dragX = 0;
        dragY = 0;
    }
}

function onDragMove(event) {
    if (dragging) {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
              window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
              window.getSelection().removeAllRanges();
            }
          } else if (document.selection) {  // IE?
            document.selection.empty();
          }
        setElementPos(event.clientX - dragX, event.clientY - dragY, dragging);
    }
}

window.addEventListener('mouseup', e => onDragUp(e), false);