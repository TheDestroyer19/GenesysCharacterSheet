use std::collections::HashMap;

use anyhow::Context;

mod element;
mod id;

pub(crate) use element::*;
pub(crate) use id::Id;

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
        let notes_id = Element::insert_list_into(character.notes, &mut elements);
        let items_id = Element::insert_list_into(character.inventory, &mut elements);
        let abilities_id = Element::insert_list_into(character.abilities, &mut elements);

        elements.insert(
            character_id,
            Element::Character(Character {
                id: character_id,
                notes: notes_id,
                inventory: items_id,
                abilities: abilities_id,
            }),
        );

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

        let Character {
            id: _id,
            notes,
            inventory,
            abilities,
        } = engine
            .elements
            .get(&engine.character)
            .context("Missing Character ids table")?
            .character()
            .context("Character id didn't point to a character id table")?;

        //Notes
        character.notes = engine
            .elements
            .get(notes)
            .context("Notes list missing")?
            .list()
            .context("Notes was not a list")?
            .items
            .iter()
            .map(|id| {
                engine
                    .elements
                    .get(id)
                    .context("Note was missing")
                    .and_then(genesys::Note::try_from)
            })
            .collect::<Result<_, anyhow::Error>>()?;

        //items
        character.inventory = engine
            .elements
            .get(inventory)
            .context("Inventory list missing")?
            .list()
            .context("Inventory was not a list")?
            .items
            .iter()
            .map(|id| {
                engine
                    .elements
                    .get(id)
                    .context("Item was missing")
                    .and_then(genesys::Item::try_from)
            })
            .collect::<Result<_, anyhow::Error>>()?;

        character.abilities = engine
            .elements
            .get(abilities)
            .context("Ability list missing")?
            .list()
            .context("Ability was not a list")?
            .items
            .iter()
            .map(|id| {
                engine
                    .elements
                    .get(id)
                    .context("Ability was missing")
                    .and_then(genesys::Ability::try_from)
            })
            .collect::<Result<_, anyhow::Error>>()?;

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

    /// Deltes the element with given id, and returns a list of affected elements
    pub fn delete_element(&mut self, id: Id) -> Vec<Id> {
        let mut affected = Vec::with_capacity(1);

        let _element = self.elements.remove(&id);
        for e in self.elements.values_mut().filter_map(Element::list_mut) {
            let count = e.items.len();
            e.items.retain(|i| *i != id);
            if count != e.items.len() {
                affected.push(e.id);
            }
        }
        //TODO handle children

        affected
    }

    pub fn write_into(&self, character: &mut genesys::Character) -> Result<(), anyhow::Error> {
        let data = genesys::Character::try_from(self)?;

        character.inventory = data.inventory;
        character.notes = data.notes;

        Ok(())
    }
}
