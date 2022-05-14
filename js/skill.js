import {CHARACTER_LOADED} from './common.js';
import {Skill, CHARACTERISTIC} from './genesys.js';
import {SkillDisplay} from './elements/skill-display.js';
import { ListEditor, NewSimpleListEditor } from './listEditor.js';

const ModalTemplate = document.createElement('template');
ModalTemplate.id = 'skills-modal-template';
ModalTemplate.innerHTML = /* HTML */ `
<td19-modal discard-on-close class="modal-edit-skill">
    <h1 slot="title">Skill</h1>
    <div class="two-column-grid">
        <label for="name">Name</label><input id="name" type="text"/>
        <label for="characteristic">Characteristic</label>
        <select id="characteristic">
            <option>Brawn</option>
            <option>Agility</option>
            <option>Intellect</option>
            <option>Cunning</option>
            <option>Willpower</option>
            <option>Presence</option>
        </select>
        <label for="rank">Rank</label><input id="rank" min=0 max=5 type="number"/>
        <label for="career">Career</label><input id="career" type="checkbox"/>
    </div>
</td19-modal>
`;
document.body.append(ModalTemplate);

const GeneralEditor = NewSimpleListEditor(
    document.getElementById("skills-general"),
    SkillDisplay,
    ModalTemplate
);
const MagicEditor = NewSimpleListEditor(
    document.getElementById("skills-magic"),
    SkillDisplay,
    ModalTemplate
);
const CombatEditor = NewSimpleListEditor(
    document.getElementById("skills-combat"),
    SkillDisplay,
    ModalTemplate
);
const SocialEditor = NewSimpleListEditor(
    document.getElementById("skills-social"),
    SkillDisplay,
    ModalTemplate
);
const KnowledgeEditor = NewSimpleListEditor(
    document.getElementById("skills-knowledge"),
    SkillDisplay,
    ModalTemplate
);

document.addEventListener(CHARACTER_LOADED, () => {
    let character = window.character;

    if (!character.notes) character.skills_general = [];
    GeneralEditor.replaceArray(character.skills_general);
    if (!character.notes) character.skills_magic = [];
    MagicEditor.replaceArray(character.skills_magic);
    if (!character.notes) character.skills_combat = [];
    CombatEditor.replaceArray(character.skills_combat);
    if (!character.notes) character.skills_social = [];
    SocialEditor.replaceArray(character.skills_social);
    if (!character.notes) character.skills_knowledge = [];
    KnowledgeEditor.replaceArray(character.skills_knowledge);
});

document.getElementById('new-skill-general')
    .addEventListener('click', () => NewSkill(character.skills_general, GeneralEditor));
document.getElementById('new-skill-general')
    .addEventListener('click', () => NewSkill(character.skills_magic, MagicEditor));
document.getElementById('new-skill-general')
    .addEventListener('click', () => NewSkill(character.skills_combat, CombatEditor));
document.getElementById('new-skill-general')
    .addEventListener('click', () => NewSkill(character.skills_social, SocialEditor));
document.getElementById('new-skill-general')
    .addEventListener('click', () => NewSkill(character.skills_knowledge, KnowledgeEditor));

/**
 * @param {Array} category
 * @param {ListEditor} editor 
 */
function NewSkill(category, editor) {
    //find a unique name for the skill
    let name = "Unnamed Skill ";
    let i = 1;
    while(category.find(s => s.name == name + i)) {
        i += 1;
    }
    name = name + i;
    editor.add(new Skill(name, CHARACTERISTIC.Brawn, false, 0));
}