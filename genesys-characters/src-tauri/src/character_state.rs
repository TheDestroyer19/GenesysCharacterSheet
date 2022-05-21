use std::fs::File;
use std::path::PathBuf;
use std::sync::{Mutex, MutexGuard};

use anyhow::Context;

use crate::genesys::Character;

pub(crate) struct CharacterState {
    inner: Mutex<Inner>,
}

pub(crate) struct Inner {
    character: Character,
    path: Option<PathBuf>,
    dirty: bool,
}

impl Inner {
    pub fn character(&self) -> &Character {
        &self.character
    }
    pub fn path(&self) -> Option<&PathBuf> {
        self.path.as_ref()
    }
    pub fn dirty(&self) -> bool {
        self.dirty
    }

    pub fn character_mut(&mut self) -> &mut Character {
        self.dirty = true;
        &mut self.character
    }

    pub fn new_character(&mut self) {
        self.dirty = false;
        self.path = None;
        self.character = Character::default();
    }

    pub fn save(&mut self) -> Result<(), anyhow::Error> {
        let path = match &self.path {
            Some(path) => path,
            None => return Err(anyhow::anyhow!("No path - use save as")),
        };
        
        let file = File::create(&path).with_context(|| format!("Failed to create file '{}'", path.display()))?;

        serde_json::to_writer_pretty(file, &self.character).context("Failed to save character")?;

        self.dirty = false;

        Ok(())
    }

    pub fn save_as(&mut self, path: PathBuf) -> Result<(), anyhow::Error> {
        self.path = Some(path);
        self.save()
    }

    pub fn load(&mut self, path: PathBuf) -> Result<(), anyhow::Error> {
        let file = File::open(&path)
            .with_context(|| format!("Failed to open '{}'", path.display()))?;
        
        self.character = serde_json::from_reader(file).context("Failed to load character")?;
        self.path = Some(path);
        self.dirty = false;

        Ok(())
    }
}

impl CharacterState {
    pub fn new() -> Self {
        CharacterState {
            inner: Mutex::new(Inner {
                character: Character::default(),
                dirty: false,
                path: None,
            })
        }
    }

    pub fn lock(&self) -> MutexGuard<Inner> {
        self.inner.lock().unwrap()
    }

    pub fn dirty(&self) -> bool {
        self.lock().dirty()
    }
}

