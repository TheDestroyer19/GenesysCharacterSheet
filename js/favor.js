import {Favor} from './genesys.js';
import { ConvertSymbols } from './util/prettyText.js';
import { CHARACTER_LOADED, SendCharacterUpdated } from './common.js';
import { ListEditor } from './listEditor.js';

const FavorTemplate = document.createElement('template');
FavorTemplate.id = "favor-template";
FavorTemplate.innerHTML = /* HTML*/ `
<li class="favor"><div>
    <span class="text"></span><div><button class="edit" title="Edit favor">🖉</button></div>
</div></li>
`;
document.body.append(FavorTemplate);

const GivenFavorModalTemplate = document.createElement('template');
GivenFavorModalTemplate.id = "favor-modal-template";
GivenFavorModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Given Favor</h1>
    <textarea></textarea>
    <div class="horizontal-row">
        <button class="modal-delete">Delete</button>
        <button class="modal-close">Close</button>
    </div>
</td19-modal>
`;
document.body.append(GivenFavorModalTemplate);

const OwedFavorModalTemplate = document.createElement('template');
OwedFavorModalTemplate.id = "favor-modal-template";
OwedFavorModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close>
    <h1 slot="title">Owed Favor</h1>
    <textarea></textarea>
    <div class="horizontal-row">
        <button class="modal-delete">Delete</button>
        <button class="modal-close">Close</button>
    </div>
</td19-modal>
`;
document.body.append(OwedFavorModalTemplate);

function BuildCreateDisplay(listEditor, modalTemplate) {
    return (favor) => {
        let element = FavorTemplate.content.firstElementChild.cloneNode(true);
        ConvertSymbols(favor.text, element.querySelector(".text"));
        element.querySelector(".edit").addEventListener('click', event => {
            //create modal
            let modal = modalTemplate.content.firstElementChild.cloneNode(true);
            document.body.append(modal);
            modal.addEventListener('delete', () => listEditor.remove(favor));
            //fill in details
            let textarea = modal.querySelector('textarea');
            textarea.value = favor.text;
            //hookup listener to input to update favor
            textarea.addEventListener('onchange', event => {
                favor.text = textarea.value;
                ConvertSymbols(favor.text, element.querySelector(".text"));
            });
    
            //display the modal
            modal.Open(event.clientX, event.clientY);
        })
        return element;
    };
}

const GivenFavorListEditor = new ListEditor([], document.getElementById('favors-given'));
GivenFavorListEditor.onChange = () => SendCharacterUpdated();
GivenFavorListEditor.createDisplay = BuildCreateDisplay(GivenFavorListEditor, GivenFavorModalTemplate);

document.getElementById("give-favor").addEventListener('click', event => {
    GivenFavorListEditor.add(event, new Favor("I helped someone out, they owe me now"));
});

const OwedFavorListEditor = new ListEditor([], document.getElementById('favors-owed'));
OwedFavorListEditor.onChange = () => SendCharacterUpdated();
OwedFavorListEditor.createDisplay = BuildCreateDisplay(OwedFavorListEditor, OwedFavorModalTemplate);

document.getElementById("owe-favor").addEventListener('click', event => {
    OwedFavorListEditor.add(event, new Favor("Someone saved my bacon, now I owe them"));
});

document.addEventListener(CHARACTER_LOADED, () => {
    GivenFavorListEditor.replaceArray(window.character.favors_given);
    OwedFavorListEditor.replaceArray(window.character.favors_owed);
});