import { invoke } from "@tauri-apps/api";
import { OpenForEdit } from "../common";
import { GenericListItem } from "./generic-list-item";

type CharacterListElement = {
    id: number,
    type: "List",
    items: [number]
}

export class ListEditorDisplay extends HTMLElement {
    #state: CharacterListElement | null;
    #children_tag: string | null;

    constructor() {
        super();
        this.#state = null;
        this.#children_tag = null;
    }

    static get observedAttributes() {
        return ['data-element-id', 'children-tag'];
    }

    static get tag() {
        return "list-editor";
    }

    connectedCallback() {
        var newValue = this.getAttribute('data-element-id');
        this.#children_tag = this.getAttribute('children-tag');
        if (this.#state == null && newValue != null) {
            this.attributeChangedCallback('data-element', "0", newValue);
        }
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name == 'data-element-id') {
            this.#update_element(parseInt(newValue))
        } else if (name == 'children-tag') {
            this.#children_tag = newValue;
            this.#update_element(parseInt(this.getAttribute('data-element-id') as string));
        }
    }

    #update_element(new_id: CharacterListElement | number) {
        var promise;

        if (typeof new_id === "number") {
            if (isNaN(new_id)) return;   
            promise = invoke('get_element', { id: new_id });
        } else {
            promise = Promise.resolve(new_id);
        }

        promise.then((element) => {
            this.#state = element as CharacterListElement;
            if (this.#children_tag != null) {
                this.#state.items.forEach((id, index) => {
                    let old = this.children[index]
                    if (old && old.getAttribute('data-element-id') != id.toString()) {
                        let element = this.#create_display_for(id);
                        this.insertBefore(element, old);
                        old.remove();
                    } else if (old == undefined) {
                        this.append(this.#create_display_for(id));
                    } else {
                        console.log("happy day");
                    }
                });
            }
        })
    }

    add(id: number): GenericListItem {
        let element = this.#create_display_for(id);
        this.#state?.items.push(id);
        this.appendChild(element);
        invoke('update_element', { element: this.#state });
        return element;
    }

    #create_display_for(id: number): GenericListItem {
        let element = document.createElement(this.#children_tag as string) as GenericListItem;
        element.setAttribute('data-element-id', id.toString());
        element.onEdit = event => {
            if (event instanceof MouseEvent)
                OpenForEdit(id, event.clientX, event.clientY);
            else 
                OpenForEdit(id, 0, 0);
        };
        invoke('get_element', { id: id })
            .then((item: any) => {
                for (const field in item) {
                    if (field == 'type') {}//Do nothing
                    else if (field == 'id') {}//Do nothing
                    else element.setAttribute(field, item[field]);
                }
            });

        element.addEventListener('list-move-up', _ => this.#moveUp(id));
        element.addEventListener('list-move-down', _ => this.#moveDown(id));

        return element;
    }

    #moveUp(id: number) {
        let idx = this.#state?.items.indexOf(id);
        if (this.#state && idx && idx > 0) {
            this.#state.items[idx] = this.#state.items[idx-1];
            this.#state.items[idx-1] = id;
            let element = this.children[idx];
            element.remove();
            this.insertBefore(element, this.children[idx-1]);
            invoke('update_element', { element: this.#state });
        }
    }

    #moveDown(id: number) {
        let idx = this.#state?.items.indexOf(id);
        if (this.#state && idx !== undefined && idx > -1 && idx < this.#state.items.length - 1) {
            this.#state.items[idx] = this.#state.items[idx+1];
            this.#state.items[idx+1] = id;
            let element = this.children[idx+1];
            element.remove();
            this.insertBefore(element, this.children[idx]);
            invoke('update_element', { element: this.#state });
        }
    }

    onElementChange(element: CharacterListElement) {
        this.#update_element(element);
    }
}
customElements.define(ListEditorDisplay.tag, ListEditorDisplay);