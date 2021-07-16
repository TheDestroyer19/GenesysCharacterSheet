import {SendCharacterUpdated, RemoveAllChildNodes} from './common.js';
import {ShortenCharacteristic, Skill} from './genesys.js';
const SkillsElement = document.getElementById("skills");

/**
 * @param {Skill} skill
 * @param {HTMLTemplateElement} template 
 * @param {HTMLTableSectionElement} tbody 
 */
const AddToTable = (skill, template, tbody) => {
    /** @type {HTMLTableRowElement} */
    let skill_row = template.content.cloneNode(true);
    SyncDisplay(skill, skill_row);
    tbody.appendChild(skill_row);
}

const SyncDisplay = (skill, container) => {
    container.querySelector(".skill-name").textContent = skill.name;
    container.querySelector(".skill-characteristic").textContent = ShortenCharacteristic(skill.characteristic);
    container.querySelector(".career").checked = skill.career;

    for (const [key, checkbox] of container.querySelectorAll(".rank").entries()) {
        checkbox.checked = key < skill.rank;
    }
}

export const AddAllSkills = () => {
    let character = window.character;

    /** @type {HTMLTemplateElement} */
    const skill_template = document.getElementById("skill-template");

    /** @type {HTMLTableSectionElement} */
    const general_skills = document.getElementById("skills-general");
    RemoveAllChildNodes(general_skills);
    character.skills_general.forEach(skill => {
        AddToTable(skill, skill_template, general_skills);
    });

    /** @type {HTMLTableSectionElement} */
    const magic_skills = document.getElementById("skills-magic");
    RemoveAllChildNodes(magic_skills);
    character.skills_magic.forEach(skill => {
        AddToTable(skill, skill_template, magic_skills);
    });

    /** @type {HTMLTableSectionElement} */
    const combat_skills = document.getElementById("skills-combat");
    RemoveAllChildNodes(combat_skills);
    character.skills_combat.forEach(skill => {
        AddToTable(skill, skill_template, combat_skills);
    });

    /** @type {HTMLTableSectionElement} */
    const social_skills = document.getElementById("skills-social");
    RemoveAllChildNodes(social_skills);
    character.skills_social.forEach(skill => {
        AddToTable(skill, skill_template, social_skills);
    });

    /** @type {HTMLTableSectionElement} */
    const knowledge_skills = document.getElementById("skills-knowledge");
    RemoveAllChildNodes(knowledge_skills);
    character.skills_knowledge.forEach(skill => {
        AddToTable(skill, skill_template, knowledge_skills);
    });
}

function UpdateSkill(character, target) {
    //go up to a parent with class skill
    const container = target.closest(".skill");
    const name = container.querySelector(".skill-name").textContent;

    let category = null;
    if (target.matches("#skills-general *")) category = character.skills_general;
    else if (target.matches("#skills-magic *")) category = character.skills_magic;
    else if (target.matches("#skills-combat *")) category = character.skills_combat;
    else if (target.matches("#skills-social *")) category = character.skills_social;
    else if (target.matches("#skills-knowledge *")) category = character.skills_knowledge;

    let skill = category.find(s => s.name == name);

    if (target.matches(".career")) {
        skill.career = target.checked;
    } else if (target.matches(".rank")) {
        skill.rank = container.querySelectorAll(".rank:checked").length;
    }

    SyncDisplay(skill, container);
}

SkillsElement.addEventListener("change", (event) => {
    let character = window.character;
    let target = event.target;

    UpdateSkill(character, target);
    SendCharacterUpdated();
});

document.addEventListener('character-loaded', AddAllSkills);