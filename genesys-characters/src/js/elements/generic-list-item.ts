import { RemoveAllChildNodes } from "../util/utils";
import { } from "./list-controls";

const html = /* HTML */ `

<style>
@import '/src/css/shared.css';

:host {
    display: flex;
    flex-direction: row;
    gap: 0.25em;
    margin-top: 0.25em;
    margin-bottom: 0.25em;
}
h1 {
    display: inline;
}
#body, #badge, #suffix {
    font-size: small;
}
#badge {
    display: inline-block;
    box-sizing: border-box;
    min-width: 1em;

    color: white;
    text-align: center;
    font-weight: bold;

    border-radius: 0.35em;
    padding: 0 0.2em;
    background-color: Var(--ca2-50);
}
.hidden {
    display: none !important;
}
</style>
<list-controls></list-controls>
<div>
    <div id="top-row">
        <button id="edit" class="edit" title="Edit">🖉</button>
        <span id="prefix" class="hidden"></span>
        <h1 id="name" class="hidden"></h1>
        <span id="badge" class="hidden"></span>
        <span id="suffix" class="hidden"></span>
    </div>
    <div id="body" class="hidden">
        body
    </div>
</div>
`;

export class GenericListItem extends HTMLElement {
    onEdit: (event: Event) => void;

    readonly #shadow: ShadowRoot;

    constructor() {
        super();

        this.#shadow = this.attachShadow({mode: 'open'});

        this.#shadow.innerHTML = html;
        this.#shadow.getElementById('edit')?.addEventListener('click', event => {
            event.preventDefault();
            if (event.target instanceof HTMLElement)
                event.target.blur();
            this.#edit(event);
        });

        this.onEdit = _ => { throw "GenericListItem needs to have onEdit set!" };
    }

    updatePrefix(updator: (element: Element) => void) {
        this.#updateHelper('#prefix', updator);
    }

    updateName(updator: (element: Element) => void) {
        this.#updateHelper('#name', updator);
    }

    updateBadge(updator: (element: Element) => void) {
        this.#updateHelper('#badge', updator);
    }

    updateSuffix(updator: (element: Element) => void) {
        this.#updateHelper('#suffix', updator);
    }

    updateBody(updator: (element: Element) => void) {
        this.#updateHelper('#body', updator);
    }

    #edit(event: Event) {
        this.onEdit(event);
    }

    #updateHelper(query: string, updator: (element: Element) => void) {
        let element = this.#shadow.querySelector(query);
        if (element) {
            RemoveAllChildNodes(element);
            updator(element);
            if (element.hasChildNodes()) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    }
}