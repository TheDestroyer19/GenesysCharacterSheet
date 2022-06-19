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
