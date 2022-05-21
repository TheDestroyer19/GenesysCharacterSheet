use std::collections::HashMap;

use serde::{Serialize, Deserialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Debug)]
pub struct Character {
    pub header: Header,
    pub description: Description,
    pub characteristics: Characteristics,
    pub inventory: Vec<Item>,
    pub motivations: Vec<Mechanic>,
    pub obligations: Vec<Mechanic>,
    #[serde(alias = "ObligationTotal")]
    pub obligation_total: String, //TODO FIX ME should be i32
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
    #[serde(flatten)]
    pub extra: HashMap<String, Value>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Header {
    pub name: String,
    pub player: String,
    pub archetype: String,
    pub career: String,
    pub specializations: String,
    #[serde(alias = "xpAvailable")]
    pub xp_available: i32,
    #[serde(alias = "xpTotal")]
    pub xp_total: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Description {
    pub age: String,
    pub build: String,
    pub eyes: String,
    pub features: String,
    pub hair: String,
    pub gender: String,
    pub height: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Characteristics {
    #[serde(alias = "Brawn")]
    pub brawn: i32,
    #[serde(alias = "Agility")]
    pub agility: i32,
    #[serde(alias = "Intellect")]
    pub intellect: i32,
    #[serde(alias = "Cunning")]
    pub cunning: i32,
    #[serde(alias = "Willpower")]
    pub willpower: i32,
    #[serde(alias = "Presence")]
    pub presence: i32,
    #[serde(alias = "ForceRank")]
    pub force_rank: i32,
    #[serde(alias = "Soak")]
    pub soak: i32,
    #[serde(alias = "WoundsThreshold")]
    pub wounds_theshold: i32,
    #[serde(alias = "WoundsCurrent")]
    pub wounds_current: i32,
    #[serde(alias = "StrainThreshold")]
    pub strain_threshold: i32,
    #[serde(alias = "StrainCurrent")]
    pub strain_current: i32,
    #[serde(alias = "DefenseMelee")]
    pub defense_melee: i32,
    #[serde(alias = "DefenseRanged")]
    pub defense_ranged: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Mechanic {
    #[serde(alias = "type")]
    pub mechanic_type: String,
    pub description: String,
    pub value: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Item {
    pub quantity: i32,
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Characteristic {
    Brawn,
    Agility,
    Intellect,
    Cunning,
    Willpower,
    Presence,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Skill {
    pub name: String,
    pub characteristic: Characteristic,
    pub career: bool,
    pub rank: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Note {
    pub title: String,
    pub body: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Weapon {
    pub name: String,
    pub description: String,
    pub damage: i32,
    #[serde(alias = "crit")]
    pub critical: i32,
    pub encumberance: String,//TODO FIX ME should be i32
    pub hard_points: String,//TODO FIX ME should be i32
    pub range: Range,
    pub skill: String,
    pub special: String,
    pub uses_brawn: String,//TODO FIX ME should be bool
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Range {
    Enganged,
    Short,
    Medium,
    Long,
    Extreme,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Ability {
    pub name: String,
    pub description: String,
    pub rank: String, //TODO FIX ME Should be i32
    pub source: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CriticalInjury {
    pub severity: i32,
    pub result: String,
}

//TODO unify Favor with mechanic
#[derive(Serialize, Deserialize, Debug)]
pub struct Favor {
    pub text: String,
}