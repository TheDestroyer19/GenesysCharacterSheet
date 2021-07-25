import {SendCharacterUpdated, RemoveAllChildNodes, CHARACTER_LOADED} from './common.js';
import {Skill} from './genesys.js';

const SkillsElement = document.getElementById("skills");
const GeneralSkills = document.getElementById("skills-general");
const MagicSkills = document.getElementById("skills-magic");
const CombatSkills = document.getElementById("skills-combat");
const SocialSkills = document.getElementById("skills-social");
const KnowledgeSkills = document.getElementById("skills-knowledge");

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
}

export const AddAllSkills = () => {
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

SkillsElement.addEventListener("change", (event) => {
    let character = window.character;
    let target = event.target;
    let oldName = event.detail;

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

    SendCharacterUpdated();
});

document.addEventListener(CHARACTER_LOADED, AddAllSkills);