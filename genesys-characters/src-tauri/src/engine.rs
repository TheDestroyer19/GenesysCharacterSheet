use std::collections::HashMap;

use anyhow::Context;

mod element;
mod id;

pub(crate) use id::Id;
pub(crate) use element::*;

use crate::genesys;


#[derive(Debug)]
pub(crate) struct Engine {
    pub elements: HashMap<Id, Element>,
    pub character: Id,
}

impl From<genesys::Character> for Engine {
    fn from(character: genesys::Character) -> Self {
        let mut elements = HashMap::new();

        let character_id = Id::new();

        //Notes
        let notes_id = Id::new();
        {
            let mut items = Vec::with_capacity(character.notes.len());
            elements.extend(character.notes.into_iter()
                .map(Element::from)
                .map(|e| (e.id(), e))
                .inspect(|(i, _)| items.push(*i)));
            elements.insert(notes_id, Element::List(List {
                id: notes_id,
                items
            }));
        }

        elements.insert(character_id, Element::Character(Character {
            id: character_id,
            notes: notes_id,
        }));

        Self {
            elements,
            character: character_id,
        }
    }
}
impl<'a> TryFrom<&'a Engine> for genesys::Character {
    type Error = anyhow::Error;

    fn try_from(engine: &'a Engine) -> Result<genesys::Character, Self::Error> {
        let mut character = genesys::Character::default();

        let ids = engine.elements.get(&engine.character).context("Missing Character ids table")?
            .character().context("Character id didn't point to a character id table")?;

        //Notes
        character.notes = engine.elements.get(&ids.notes).context("Notes list missing")?
            .list().context("Notes was not a list")?
            .items
            .iter()
            .map(|id| engine.elements.get(id).context("Note was missing")
                .and_then(genesys::Note::try_from)
            ).collect::<Result<_, anyhow::Error>>()?;

        Ok(character)
    }
}

impl Engine {
    pub fn new() -> Self {
        genesys::Character::default().into()
    }

    pub fn create_element(&mut self, element_type: ElementType) -> Element {
        let element = element_type.create();
        self.elements.insert(element.id(), element.clone());
        element
    }

    pub fn write_into(&self, character: &mut genesys::Character) -> Result<(), anyhow::Error> {
        let data = genesys::Character::try_from(self)?;

        character.notes = data.notes;

        Ok(())
    }
}