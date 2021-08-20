import {SendCharacterUpdated, RemoveAllChildNodes, CHARACTER_LOADED} from './common.js';
import {Skill, CHARACTERISTIC} from './genesys.js';

const SkillsElement = document.getElementById("skills");
const GeneralSkills = document.getElementById("skills-general");
const MagicSkills = document.getElementById("skills-magic");
const CombatSkills = document.getElementById("skills-combat");
const SocialSkills = document.getElementById("skills-social");
const KnowledgeSkills = document.getElementById("skills-knowledge");

export function AddAllSkills() {
    let character = window.character;

    RemoveAllChildNodes(GeneralSkills);
    character.skills_general.forEach(skill => AddToTable(skill, GeneralSkills));

    RemoveAllChildNodes(MagicSkills);
    character.skills_magic.forEach(skill => AddToTable(skill, MagicSkills));

    RemoveAllChildNodes(CombatSkills);
    character.skills_combat.forEach(skill => AddToTable(skill, CombatSkills));

    RemoveAllChildNodes(SocialSkills);
    character.skills_social.forEach(skill => AddToTable(skill, SocialSkills));

    RemoveAllChildNodes(KnowledgeSkills);
    character.skills_knowledge.forEach(skill => AddToTable(skill, KnowledgeSkills));
}

/**
 * @param {Skill} skill
 * @param {HTMLTableSectionElement} tbody 
 */
function AddToTable(skill, tbody) {
    let skill_row = document.createElement('skill-display');
    skill_row.career = skill.career;
    skill_row.name = skill.name;
    skill_row.rank = skill.rank;
    skill_row.stat = skill.characteristic;
    tbody.appendChild(skill_row);
    return skill_row;
}

function NewSkill(category, table) {
    //find a unique name for the skill
    let name = "Unnamed Skill ";
    let i = 1;
    while(category.find(s => s.name == name + i)) {
        i += 1;
    }
    name = name + i;
    let skill = new Skill(name, CHARACTERISTIC.Brawn, false, 0);
    category.push(skill);
    let element = AddToTable(skill, table);
    element.setAttribute('open', true);

    SendCharacterUpdated();
}

function FindCategory(character, target) {
    if (target.matches("#skills-general *")) return character.skills_general;
    else if (target.matches("#skills-magic *")) return character.skills_magic;
    else if (target.matches("#skills-combat *")) return character.skills_combat;
    else if (target.matches("#skills-social *")) return character.skills_social;
    else if (target.matches("#skills-knowledge *")) return character.skills_knowledge;
    else return null;
}

SkillsElement.addEventListener("change", (event) => {
    let target = event.target;
    let oldName = event.detail;
    let category = FindCategory(window.character, target);

    //find the skill we want
    let skill = category.find(s => s.name == oldName);

    skill.name = target.name;
    skill.career = target.career;
    skill.rank = target.rank;
    skill.characteristic = target.stat;

    SendCharacterUpdated();
});

SkillsElement.addEventListener('delete', event => {
    let target = event.target;
    let name = event.detail;
    let category = FindCategory(window.character, target);

    let idx = category.findIndex(e => e.name == name);
    if (idx >= 0) category.splice(idx, 1);

    SendCharacterUpdated();
})

document.addEventListener(CHARACTER_LOADED, AddAllSkills);

document.getElementById('new-skill-general')
    .addEventListener('click', () => NewSkill(character.skills_general, GeneralSkills));
document.getElementById('new-skill-magic')
    .addEventListener('click', () => NewSkill(character.skills_magic, MagicSkills));
document.getElementById('new-skill-combat')
    .addEventListener('click', () => NewSkill(character.skills_combat, CombatSkills));
document.getElementById('new-skill-social')
    .addEventListener('click', () => NewSkill(character.skills_social, SocialSkills));
document.getElementById('new-skill-knowledge')
    .addEventListener('click', () => NewSkill(character.skills_knowledge, KnowledgeSkills));