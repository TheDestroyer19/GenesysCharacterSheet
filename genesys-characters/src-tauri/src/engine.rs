use std::collections::HashMap;

use serde::{Deserialize, Serialize};


mod id {
    use std::sync::atomic::AtomicUsize;

    use serde::{Serialize, Deserialize};

    static NEXT_ID: AtomicUsize = AtomicUsize::new(1);

    #[derive(Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord, Hash, Debug, Clone, Copy)]
    pub(crate) struct Id(usize);

    impl Id {
        pub fn new() -> Id {
            Id(NEXT_ID.fetch_add(1, std::sync::atomic::Ordering::Relaxed))
        }
    }
}

pub(crate) use id::Id;
use std::sync::Mutex;

use crate::genesys::{Character, self};

#[derive(Debug)]
pub(crate) struct Engine {
    pub elements: Mutex<HashMap<Id, Element>>,
}

impl Engine {
    pub fn new() -> Self {
        Self { elements: Mutex::new(HashMap::new()) }
    }

    pub fn replace_from(&self, character: &Character) {
        let mut elements = self.elements.lock().unwrap();
        elements.clear();

        for genesys::Note { note_title, subtitle, body } in &character.notes {
            let element = Element::Note(Note {
                id: Id::new(),
                note_title: note_title.clone(),
                subtitle: subtitle.clone(),
                body: body.clone(),
            });
            elements.insert(element.id(), element);
        }
    }

    pub fn clear(&self) {
        self.elements.lock().unwrap().clear();
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type")]
pub(crate) enum Element {
    Note(Note),
}
impl Element {
    pub fn id(&self) -> Id {
        match self {
            Element::Note(n) => n.id,
        }
    }
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