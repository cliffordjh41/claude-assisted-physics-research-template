//! Nested lattice -- hierarchical position with entropy accumulation.
//!
//! Ported from `ephemeratory/crates/lattice/src/nested.rs`. Source header,
//! reproduced:
//!
//! ```text
//! Each level holds a Position and optionally an inner nested lattice.
//! The seed for a cell is derived from the concatenated position bytes
//! at every level. Deeper paths produce larger, more entropic seeds.
//! ```
//!
//! This is a tree, and the port makes no claim that the tree partitions any
//! region. Whether the 3 x 4^N children of a cell tile that cell is open;
//! see `sketch/koch-hexagon-cube.md`, "Open, not resolved here".

use crate::direction::Direction;
use crate::position::Position;

/// A lattice position with optional inner nesting.
#[derive(Debug, Clone)]
pub struct NestedLattice {
    position: Position,
    /// Optional chaos state. Inherited and perturbed at each descent.
    chaos_state: Option<[f64; 3]>,
    inner: Option<Box<NestedLattice>>,
}

impl NestedLattice {
    pub fn root(position: Position) -> Self {
        Self { position, chaos_state: None, inner: None }
    }

    pub fn root_with_chaos(position: Position, chaos_state: [f64; 3]) -> Self {
        Self { position, chaos_state: Some(chaos_state), inner: None }
    }

    pub fn position(&self) -> &Position {
        &self.position
    }

    pub fn chaos_state(&self) -> Option<[f64; 3]> {
        self.chaos_state
    }

    pub fn has_inner(&self) -> bool {
        self.inner.is_some()
    }

    pub fn inner(&self) -> Option<&NestedLattice> {
        self.inner.as_deref()
    }

    pub fn inner_mut(&mut self) -> Option<&mut NestedLattice> {
        self.inner.as_deref_mut()
    }

    /// Descend into an inner position. Inherits and perturbs chaos state.
    pub fn descend(&mut self, inner_position: Position) -> &mut NestedLattice {
        let inner_chaos = self.chaos_state.map(|[x, y, z]| {
            let offset = inner_position.number as f64 / 1000.0;
            [
                (x + offset).fract().abs(),
                (y + offset * 2.0).fract().abs(),
                (z + offset * 3.0).fract().abs(),
            ]
        });
        self.inner = Some(Box::new(NestedLattice {
            position: inner_position,
            chaos_state: inner_chaos,
            inner: None,
        }));
        self.inner.as_deref_mut().unwrap()
    }

    /// Build a nested lattice from a slice of positions.
    pub fn from_path(positions: &[Position]) -> Option<Self> {
        if positions.is_empty() {
            return None;
        }
        let mut root = Self::root(positions[0]);
        let mut current = &mut root;
        for &pos in &positions[1..] {
            current = current.descend(pos);
        }
        Some(root)
    }

    /// Nesting depth: 0 = leaf, 1+ = has inner levels.
    pub fn depth(&self) -> u8 {
        match &self.inner {
            None => 0,
            Some(inner) => 1 + inner.depth(),
        }
    }

    /// All positions from root to deepest level.
    pub fn path(&self) -> Vec<Position> {
        let mut path = vec![self.position];
        if let Some(inner) = &self.inner {
            path.extend(inner.path());
        }
        path
    }

    /// Concatenated entropy seed from all levels.
    /// Each level contributes 10 bytes (position encoding).
    /// Chaos state adds 24 bytes per level if present.
    pub fn seed(&self) -> Vec<u8> {
        let mut seed = self.position_to_bytes().to_vec();
        if let Some([x, y, z]) = self.chaos_state {
            seed.extend_from_slice(&x.to_le_bytes());
            seed.extend_from_slice(&y.to_le_bytes());
            seed.extend_from_slice(&z.to_le_bytes());
        }
        if let Some(inner) = &self.inner {
            seed.extend(inner.seed());
        }
        seed
    }

    /// Ten bytes: eight for the number, one for the iteration, one for the
    /// direction. The source typed `iteration` as `u8` and wrote it whole;
    /// this port types it as `u64` (see `lib.rs`, difference 2) and writes
    /// the low byte, which is the same value for every iteration the source
    /// could represent.
    fn position_to_bytes(&self) -> [u8; 10] {
        let mut bytes = [0u8; 10];
        bytes[0..8].copy_from_slice(&self.position.number.to_le_bytes());
        bytes[8] = self.position.iteration as u8;
        bytes[9] = if self.position.direction == Direction::Future { 1 } else { 0 };
        bytes
    }

    pub fn deepest(&self) -> &NestedLattice {
        match &self.inner {
            None => self,
            Some(inner) => inner.deepest(),
        }
    }

    pub fn deepest_mut(&mut self) -> &mut NestedLattice {
        if self.inner.is_none() {
            self
        } else {
            self.inner.as_deref_mut().unwrap().deepest_mut()
        }
    }
}

impl PartialEq for NestedLattice {
    fn eq(&self, other: &Self) -> bool {
        self.position == other.position && self.inner == other.inner
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn p(n: u64, i: u64, d: Direction) -> Position {
        Position::new(n, i, d)
    }

    #[test]
    fn root_at_depth_zero() {
        let l = NestedLattice::root(p(1, 0, Direction::Future));
        assert_eq!(l.depth(), 0);
        assert!(!l.has_inner());
    }

    #[test]
    fn descend_increments_depth() {
        let mut l = NestedLattice::root(p(1, 0, Direction::Future));
        l.descend(p(3, 1, Direction::Past));
        assert_eq!(l.depth(), 1);
        assert_eq!(l.path().len(), 2);
    }

    #[test]
    fn from_path_empty_is_none() {
        assert!(NestedLattice::from_path(&[]).is_none());
    }

    #[test]
    fn from_path_roundtrips() {
        let positions = [p(1, 0, Direction::Future), p(5, 1, Direction::Past)];
        let l = NestedLattice::from_path(&positions).unwrap();
        assert_eq!(l.path().len(), 2);
        assert_eq!(l.path()[0].number, 1);
        assert_eq!(l.path()[1].number, 5);
    }

    /// Falsifier: distinct paths produce distinct seeds. If two different
    /// addresses seed identically the address space has collapsed and the
    /// tree is not an addressing scheme. This is the null test for `seed`:
    /// the run below with identical paths must produce identical seeds, and
    /// the run with different paths must not.
    #[test]
    fn seed_separates_paths_and_is_deterministic() {
        let a = [p(1, 0, Direction::Future), p(3, 1, Direction::Past)];
        let b = [p(1, 0, Direction::Future), p(4, 1, Direction::Past)];
        let la = NestedLattice::from_path(&a).unwrap();
        let la2 = NestedLattice::from_path(&a).unwrap();
        let lb = NestedLattice::from_path(&b).unwrap();
        assert_eq!(la.seed(), la2.seed(), "same path must seed identically");
        assert_ne!(la.seed(), lb.seed(), "different paths must not collide");
        assert_ne!(
            NestedLattice::root(p(1, 0, Direction::Future)).seed(),
            NestedLattice::root(p(1, 0, Direction::Past)).seed(),
            "direction alone must separate seeds"
        );
    }

    #[test]
    fn seed_grows_with_depth() {
        let mut l = NestedLattice::root_with_chaos(p(1, 0, Direction::Future), [0.1, 0.2, 0.3]);
        let s1 = l.seed().len();
        l.descend(p(3, 1, Direction::Past));
        assert!(l.seed().len() > s1);
    }

    #[test]
    fn chaos_inherited_and_perturbed() {
        let mut l = NestedLattice::root_with_chaos(p(1, 0, Direction::Future), [0.5, 0.5, 0.5]);
        l.descend(p(3, 1, Direction::Past));
        let inner = l.inner().unwrap();
        assert!(inner.chaos_state().is_some());
        assert_ne!(inner.chaos_state().unwrap(), [0.5f64, 0.5, 0.5]);
    }
}
