//const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
const modalTemplate = document.createElement('template');
modalTemplate.id = 'modal-template';
modalTemplate.innerHTML = /* HTML */`
<style>
@import './css/shared.css';
#wrapper {
    box-sizing: border-box;
    z-index: 110;
    position: fixed;
    top: 0px;
    left: 0px;
    min-width: fit-content;
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
:host(:not([open])) {
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
.horizontal-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
<div id="root">
    <div id="wrapper">
        <div id="titlebar"><slot name="title"></slot></div>
        <slot>Default text</slot>
        <slot name="footer">
            <div class="horizontal-row">
                <button class="modal-delete">Delete</button>
                <button class="modal-close">Close</button>
            </div>
        </slot>
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
    #onClose;
    #onSave;
    #onDelete

    constructor( ) {
        super();

        let templateContent = modalTemplate.content;

        //setup shadowroot
        this.attachShadow({mode: 'open'})
            .appendChild(templateContent.cloneNode(true));

        this.#root = this.shadowRoot.querySelector('#root');
        this.#wrapper = this.shadowRoot.querySelector('#wrapper');
        this.#title = this.shadowRoot.querySelector('#titlebar');
        this.#onClose = () => this.Close();
        this.#onSave = () => this.#Save();
        this.#onDelete = () => this.#Delete();
        this.#title.addEventListener('mousedown', e => this.#onDragDown(e), false);

        this.shadowRoot.querySelectorAll('slot').forEach(slot => {
            slot.addEventListener('slotchange', event => {
                let children = event.target.assignedElements();
                children.forEach(child => this.#attachEvents(child));
            });
        });
    }

    connectedCallback() {
        if (!this.isConnected) return;
        this.#attachEvents(this.shadowRoot);
    }
    
    #attachEvents(element) {
        if (element.classList) {
            if (element.classList.contains('modal-close')) {
                element.addEventListener("click", this.#onClose)
            }
            if (element.classList.contains('modal-save')) {
                element.addEventListener("click", this.#onSave)
            }
            if (element.classList.contains('modal-delete')) {
                element.addEventListener("click", this.#onDelete)
            }
        }
        //setup event handlers
        element.querySelectorAll(".modal-close").forEach(
            btn => btn.addEventListener("click", this.#onClose)
        );
        element.querySelectorAll(".modal-save").forEach(
            btn => btn.addEventListener("click", this.#onSave)
        );
        element.querySelectorAll(".modal-delete").forEach(
            btn => btn.addEventListener("click", this.#onDelete)
        );
    }

    get open() {
        return this.hasAttribute('open');
    }

    set open(isOpen) {
        if (isOpen) {
            this.setAttribute('open', "");
        } else {
            this.removeAttribute('open');
        }
    }

    get discardOnClose() {
        return this.hasAttribute('discard-on-close');
    }

    set discardOnClose(shouldDiscard) {
        if (shouldDiscard) {
            this.setAttribute('discard-on-close', "");
        } else {
            this.removeAttribute('discard-on-close');
        }
    }

    Toggle(x, y) {
        if (!this.hasAttribute('open')) {
            this.Open(x, y);
        } else {
            this.Close();
        }
    }

    Open(x, y) {
        this.setAttribute('open', "");

        x -= this.#wrapper.clientWidth / 2;
        setElementPos(x, y, this.#wrapper);
    }

    Close() {
        this.removeAttribute('open');
        if (this.discardOnClose) {
            this.parentElement.removeChild(this);
        }
    }

    #Save() {
        let event = new CustomEvent('save', { bubbles: true, composed: true});
        this.dispatchEvent(event);
        this.Close();
    }

    #Delete() {
        let event = new CustomEvent('delete', { bubbles: true, composed: true});
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