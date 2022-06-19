use serde::{Deserialize, Serialize};
use anyhow::anyhow;

use crate::genesys;

use super::Id;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) enum ElementType {
    List,
    Note,
}

impl ElementType {
    pub fn create(self) -> Element {
        match self {
            ElementType::List => Element::List(List::default()),
            ElementType::Note => Element::Note(Note::default()),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type")]
pub(crate) enum Element {
    Character(Character),
    Note(Note),
    List(List),
}

impl Element {
    pub fn id(&self) -> Id {
        match self {
            Element::Character(c) => c.id,
            Element::Note(n) => n.id,
            Element::List(l) => l.id,
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
}

impl From<genesys::Note> for Element {
    fn from(note: genesys::Note) -> Self {
        let genesys::Note { note_title, subtitle, body } = note;
        Self::Note(Note {
            id: Id::new(),
            note_title,
            subtitle,
            body,
        })
    }
}

impl<'a> TryFrom<&'a Element> for genesys::Note{
    type Error = anyhow::Error;

    fn try_from(element: &'a Element) -> Result<genesys::Note, Self::Error> {
        match element {
            Element::Note(n) => {
                Ok(genesys::Note {
                    note_title: n.note_title.clone(),
                    subtitle: n.subtitle.clone(),
                    body: n.body.clone(),
                })
            },
            _ => Err(anyhow!("Element was not a Note"))
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
        Self { id: Id::new(), items: Default::default() }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Character {
    pub id: Id,
    pub notes: Id,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Note {
    pub id: Id,
    #[serde(default)]
    pub note_title: String,
    #[serde(default)]
    pub subtitle: String,
    #[serde(default)]
    pub body: String,
}
impl Default for Note {
    fn default() -> Self {
        Self { id: Id::new(), note_title: Default::default(), subtitle: Default::default(), body: Default::default() }
    }
}