use std::collections::HashMap;

use anyhow::anyhow;
use serde::{Deserialize, Serialize};

use crate::genesys;

use super::Id;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) enum ElementType {
    Character,
    List,
    Note,
    Item,
    Ability,
}

impl ElementType {
    pub fn create(self) -> Result<Element, anyhow::Error> {
        match self {
            ElementType::Character => Err(anyhow::anyhow!(
                "Cannot create a Character w/o creating other elements"
            )),
            ElementType::List => Ok(Element::List(List::default())),
            ElementType::Note => Ok(Element::Note(Note::default())),
            ElementType::Item => Ok(Element::Item(Item::default())),
            ElementType::Ability => Ok(Element::Ability(Ability::default())),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type")]
pub(crate) enum Element {
    Character(Character),
    Note(Note),
    List(List),
    Item(Item),
    Ability(Ability),
}

impl Element {
    pub fn id(&self) -> Id {
        match self {
            Element::Character(c) => c.id,
            Element::Note(n) => n.id,
            Element::List(l) => l.id,
            Element::Item(i) => i.id,
            Element::Ability(a) => a.id,
        }
    }

    pub fn get_type(&self) -> ElementType {
        match self {
            Element::Character(_) => ElementType::Character,
            Element::Note(_) => ElementType::Note,
            Element::List(_) => ElementType::List,
            Element::Item(_) => ElementType::Item,
            Element::Ability(_) => ElementType::Ability,
        }
    }

    pub fn character(&self) -> Option<&Character> {
        match self {
            Element::Character(c) => Some(c),
            _ => None,
        }
    }

    pub fn list(&self) -> Option<&List> {
        match self {
            Element::List(l) => Some(l),
            _ => None,
        }
    }

    pub fn list_mut(&mut self) -> Option<&mut List> {
        match self {
            Element::List(l) => Some(l),
            _ => None,
        }
    }

    pub fn insert_list_into<E>(list: Vec<E>, map: &mut HashMap<Id, Element>) -> Id
    where
        Element: From<E>,
    {
        let id = Id::new();

        let mut items = Vec::with_capacity(list.len());
        map.extend(
            list.into_iter()
                .map(Element::from)
                .map(|e| (e.id(), e))
                .inspect(|(i, _)| items.push(*i)),
        );
        map.insert(id, Element::List(List { id, items }));

        id
    }
}

impl From<genesys::Note> for Element {
    fn from(note: genesys::Note) -> Self {
        let genesys::Note {
            note_title,
            subtitle,
            body,
        } = note;
        Self::Note(Note {
            id: Id::new(),
            note_title,
            subtitle,
            body,
        })
    }
}

impl<'a> TryFrom<&'a Element> for genesys::Note {
    type Error = anyhow::Error;

    fn try_from(element: &'a Element) -> Result<genesys::Note, Self::Error> {
        match element {
            Element::Note(n) => Ok(genesys::Note {
                note_title: n.note_title.clone(),
                subtitle: n.subtitle.clone(),
                body: n.body.clone(),
            }),
            _ => Err(anyhow!("Element was not a Note. It was {:?}", element)),
        }
    }
}

impl From<genesys::Item> for Element {
    fn from(item: genesys::Item) -> Self {
        Element::Item(Item {
            id: Id::new(),
            quantity: item.quantity,
            name: item.name,
            encumbrance: item.encumbrance,
            description: item.description,
        })
    }
}

impl<'a> TryFrom<&'a Element> for genesys::Item {
    type Error = anyhow::Error;

    fn try_from(element: &'a Element) -> Result<Self, Self::Error> {
        match element {
            Element::Item(i) => Ok(genesys::Item {
                quantity: i.quantity,
                name: i.name.clone(),
                encumbrance: i.encumbrance,
                description: i.description.clone(),
            }),
            _ => Err(anyhow!("Element was not a Item. It was {:?}", element)),
        }
    }
}

impl From<genesys::Ability> for Element {
    fn from(item: genesys::Ability) -> Self {
        Element::Ability(Ability {
            id: Id::new(),
            name: item.name,
            description: item.description,
            rank: item.rank,
            source: item.source,
        })
    }
}

impl<'a> TryFrom<&'a Element> for genesys::Ability {
    type Error = anyhow::Error;

    fn try_from(element: &'a Element) -> Result<Self, Self::Error> {
        match element {
            Element::Ability(i) => Ok(genesys::Ability {
                name: i.name.clone(),
                description: i.description.clone(),
                rank: i.rank,
                source: i.source.clone(),
            }),
            _ => Err(anyhow!("Element was not a Ability. It was {:?}", element)),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct List {
    pub id: Id,
    pub items: Vec<Id>,
}
impl Default for List {
    fn default() -> Self {
        Self {
            id: Id::new(),
            items: Default::default(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Character {
    pub id: Id,
    pub notes: Id,
    pub inventory: Id,
    pub abilities: Id,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Note {
    pub id: Id,
    pub note_title: String,
    pub subtitle: String,
    pub body: String,
}
impl Default for Note {
    fn default() -> Self {
        Self {
            id: Id::new(),
            note_title: "Unnamed Note".into(),
            subtitle: Default::default(),
            body: Default::default(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Item {
    pub id: Id,
    pub quantity: i32,
    pub name: String,
    pub encumbrance: i32,
    pub description: String,
}
impl Default for Item {
    fn default() -> Self {
        Self {
            id: Id::new(),
            quantity: 1,
            name: "Unknown Item".into(),
            encumbrance: 0,
            description: "".into(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Ability {
    pub id: Id,
    pub name: String,
    pub description: String,
    pub rank: i32,
    pub source: String,
}
impl Default for Ability {
    fn default() -> Self {
        Self {
            id: Id::new(),
            name: "Unknown Ability".into(),
            description: "".into(),
            rank: 0,
            source: "".into(),
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    prop_compose! {
        fn arb_item(text: &'static str, min: i32, max: i32)
                    (q in min..max, n in text, d in text, e in min..max)
                    -> genesys::Item {
            genesys::Item {
                quantity: q, name: n.clone(), encumbrance: e, description: d.clone()
            }
        }
    }

    prop_compose! {
        fn arb_note(text: &'static str)
                (t in text, s in text, b in text)
                -> genesys::Note {
            genesys::Note { note_title: t, subtitle: s, body: b }
        }
    }

    prop_compose! {
        fn arb_ability(text: &'static str, range: std::ops::Range<i32>)
                (n in text, d in text, s in text, r in range)
                -> genesys::Ability {
            genesys::Ability { name: n, description: d, rank: r, source: s }
        }
    }

    proptest! {
        #[test]
        fn item_round_trip(ref item in arb_item("\\PC*", -1000, 1000)) {
            let engine_item = Element::from(item.clone());
            assert_eq!(&genesys::Item::try_from(&engine_item).unwrap(), item);
        }

        #[test]
        fn note_round_trip(ref note in arb_note("\\PC*")) {
            let engine_note = Element::from(note.clone());
            assert_eq!(&genesys::Note::try_from(&engine_note).unwrap(), note);
        }

        #[test]
        fn ability_round_trip(ref serializable in arb_ability("\\PC*", -1000..1000)) {
            let engine = Element::from(serializable.clone());
            assert_eq!(&genesys::Ability::try_from(&engine).unwrap(), serializable);
        }
    }
}
