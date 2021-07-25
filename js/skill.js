import {SendCharacterUpdated, RemoveAllChildNodes} from './common.js';
import {Skill} from './genesys.js';
const SkillsElement = document.getElementById("skills");

/**
 * @param {Skill} skill
 * @param {HTMLTableSectionElement} tbody 
 */
function AddToTable(skill, tbody) {
    let skill_row = document.createElement('skill-display');
    SyncDisplay(skill, skill_row);
    tbody.appendChild(skill_row);
}

function SyncDisplay(skill, container) {
    container.career = skill.career;
    container.name = skill.name;
    container.rank = skill.rank;
    container.stat = skill.characteristic;
}

export const AddAllSkills = () => {
    let character = window.character;

    /** @type {HTMLTableSectionElement} */
    const general_skills = document.getElementById("skills-general");
    RemoveAllChildNodes(general_skills);
    character.skills_general.forEach(skill => {
        AddToTable(skill, general_skills);
    });

    /** @type {HTMLTableSectionElement} */
    const magic_skills = document.getElementById("skills-magic");
    RemoveAllChildNodes(magic_skills);
    character.skills_magic.forEach(skill => {
        AddToTable(skill, magic_skills);
    });

    /** @type {HTMLTableSectionElement} */
    const combat_skills = document.getElementById("skills-combat");
    RemoveAllChildNodes(combat_skills);
    character.skills_combat.forEach(skill => {
        AddToTable(skill, combat_skills);
    });

    /** @type {HTMLTableSectionElement} */
    const social_skills = document.getElementById("skills-social");
    RemoveAllChildNodes(social_skills);
    character.skills_social.forEach(skill => {
        AddToTable(skill, social_skills);
    });

    /** @type {HTMLTableSectionElement} */
    const knowledge_skills = document.getElementById("skills-knowledge");
    RemoveAllChildNodes(knowledge_skills);
    character.skills_knowledge.forEach(skill => {
        AddToTable(skill, knowledge_skills);
    });
}

function UpdateSkill(character, target, oldName) {

    //find category
    let category = null;
    if (target.matches("#skills-general *")) category = character.skills_general;
    else if (target.matches("#skills-magic *")) category = character.skills_magic;
    else if (target.matches("#skills-combat *")) category = character.skills_combat;
    else if (target.matches("#skills-social *")) category = character.skills_social;
    else if (target.matches("#skills-knowledge *")) category = character.skills_knowledge;

    //find the skill we want
    let skill = category.find(s => s.name == oldName);

    skill.name = target.name;
    skill.career = target.career;
    skill.rank = target.rank;
    skill.characteristic = target.stat;

    SyncDisplay(skill, target);
}

SkillsElement.addEventListener("change", (event) => {
    let character = window.character;
    let target = event.target;
    let oldName = event.detail;

    UpdateSkill(character, target, oldName);
    SendCharacterUpdated();
});

document.addEventListener('character-loaded', AddAllSkills);