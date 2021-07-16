const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

const modalOverlay = document.querySelector("#modal-overlay");
const modals = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".modal-close");

export class Modal {
    constructor(
        element,
        onSave,
        onDelete
    ) {
        this.element = element;
        this.onSave = onSave;
        this.onDelete = onDelete;

        //setup event handlers
        element.querySelectorAll(".modal-close").forEach(
            btn => btn.addEventListener("click", () => this.Close())
        );
        //setup event handlers
        element.querySelectorAll(".modal-save").forEach(
            btn => btn.addEventListener("click", () => this.Save())
        );
        //setup event handlers
        element.querySelectorAll(".modal-delete").forEach(
            btn => btn.addEventListener("click", () => this.Delete())
        );
    }

    Open() {
        modalOverlay.classList.remove("closed");
        this.element.classList.remove("closed");
    }

    Save() {
        this.onSave();
        this.Close();
    }

    Delete() {
        this.onDelete();
        this.Close();
    }

    Close() {
        CloseModal();
    }
}

function CloseModal() {
    modals.forEach(modal => {
        modal.classList.add("closed");
    });
    modalOverlay.classList.add("closed");
}

closeBtns.forEach(btn => btn.addEventListener("click", CloseModal));