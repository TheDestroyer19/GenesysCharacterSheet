use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Character {
    pub header: Header,
    pub description: Description,
    pub characteristics: Characteristics,
    pub inventory: Vec<Item>,
    pub motivations: Vec<Mechanic>,
    pub obligations: Vec<Mechanic>,
    pub obligation_total: i32,
    pub notes: Vec<Note>,
    pub skills_general: Vec<Skill>,
    pub skills_magic: Vec<Skill>,
    pub skills_combat: Vec<Skill>,
    pub skills_social: Vec<Skill>,
    pub skills_knowledge: Vec<Skill>,
    pub weapons: Vec<Weapon>,
    pub abilities: Vec<Ability>,
    pub critical_injuries: Vec<CriticalInjury>,
    pub favors_given: Vec<Favor>,
    pub favors_owed: Vec<Favor>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Header {
    pub name: String,
    pub player: String,
    pub archetype: String,
    pub career: String,
    pub specializations: String,
    pub xp_available: i32,
    pub xp_total: i32,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Description {
    pub age: String,
    pub build: String,
    pub eyes: String,
    pub features: String,
    pub hair: String,
    pub gender: String,
    pub height: String,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Characteristics {
    pub brawn: i32,
    pub agility: i32,
    pub intellect: i32,
    pub cunning: i32,
    pub willpower: i32,
    pub presence: i32,
    pub force_rank: i32,
    pub soak: i32,
    pub wounds_theshold: i32,
    pub wounds_current: i32,
    pub strain_threshold: i32,
    pub strain_current: i32,
    pub defense_melee: i32,
    pub defense_ranged: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Mechanic {
    pub mechanic_type: String,
    pub description: String,
    pub magnitude: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Favor {
    pub text: String,
}


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Item {
    pub quantity: i32,
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Characteristic {
    Brawn,
    Agility,
    Intellect,
    Cunning,
    Willpower,
    Presence,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Skill {
    pub name: String,
    pub characteristic: Characteristic,
    pub career: bool,
    pub rank: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(default)]
pub struct Note {
    pub note_title: String,
    pub subtitle: String,
    pub body: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Ability {
    pub name: String,
    pub description: String,
    pub rank: i32,
    pub source: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Weapon {
    pub name: String,
    pub description: String,
    pub damage: i32,
    pub critical: i32,
    pub encumbrance: i32,
    pub hard_points: i32,
    pub range: Range,
    pub skill: String,
    pub special: String,
    pub uses_brawn: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Range {
    Enganged,
    Short,
    Medium,
    Long,
    Extreme,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CriticalInjury {
    pub severity: i32,
    pub result: String,
}