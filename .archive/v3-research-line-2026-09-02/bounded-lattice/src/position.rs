//! Lattice position: (number, iteration, direction).
//!
//! Ported from `ephemeratory/crates/ephem-core/src/position.rs`. Source
//! header, reproduced:
//!
//! ```text
//! number:    1-indexed, 1..=count(iteration)
//! iteration: 0 = root (3 positions), 1 = first expansion (12), etc.
//! direction: Future (+) or Past (-)
//! ```

use crate::direction::Direction;
use crate::formulas::{count, distance_scaling, is_address_space, is_encoding_space};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Position {
    /// 1-indexed position number. 1..=count(iteration).
    pub number: u64,
    /// Iteration (depth) in the lattice. 0 = root.
    pub iteration: u64,
    /// Direction: Future (+) or Past (-).
    pub direction: Direction,
}

/// Error type for invalid position construction.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PositionError {
    ZeroNumber,
    ExceedsCount { number: u64, max: u64, iteration: u64 },
    IterationOverflow { iteration: u64 },
}

impl std::fmt::Display for PositionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::ZeroNumber => write!(f, "position number must be > 0"),
            Self::ExceedsCount { number, max, iteration } => {
                write!(f, "position {} exceeds max {} at iteration {}", number, max, iteration)
            }
            Self::IterationOverflow { iteration } => {
                write!(f, "iteration {} overflows position count", iteration)
            }
        }
    }
}

impl std::error::Error for PositionError {}

impl Position {
    /// Create a validated position. Panics on invalid input.
    /// For iterations > ~31 where count() overflows, use new_unchecked().
    pub fn new(number: u64, iteration: u64, direction: Direction) -> Self {
        match Self::try_new(number, iteration, direction) {
            Ok(p) => p,
            Err(e) => panic!("{}", e),
        }
    }

    /// Create a validated position. Returns Err on invalid input.
    pub fn try_new(
        number: u64,
        iteration: u64,
        direction: Direction,
    ) -> Result<Self, PositionError> {
        if number == 0 {
            return Err(PositionError::ZeroNumber);
        }
        if let Some(max) = count(iteration) {
            if number > max {
                return Err(PositionError::ExceedsCount { number, max, iteration });
            }
        } else {
            return Err(PositionError::IterationOverflow { iteration });
        }
        Ok(Self { number, iteration, direction })
    }

    /// Create without validation. Use for high iterations (> ~31) where
    /// count() overflows, or on performance-critical paths.
    pub fn new_unchecked(number: u64, iteration: u64, direction: Direction) -> Self {
        Self { number, iteration, direction }
    }

    /// Position 1 is the anchor at every iteration.
    pub fn is_anchor(self) -> bool {
        self.number == 1
    }

    /// The paired position: same number and iteration, opposite direction.
    pub fn pair(self) -> Self {
        Self {
            number: self.number,
            iteration: self.iteration,
            direction: self.direction.opposite(),
        }
    }

    /// Distance from observer at this iteration: 3^iteration.
    pub fn distance_from_observer(self) -> f64 {
        distance_scaling(self.iteration)
    }

    /// True if this position is in the encoding space (iteration 0-512).
    pub fn is_encoding_space(self) -> bool {
        is_encoding_space(self.iteration)
    }

    /// True if this position is in the address space (iteration > 512).
    pub fn is_address_space(self) -> bool {
        is_address_space(self.iteration)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Falsifier: position 1 is the anchor at every iteration. The source
    /// states this as a property of the structure, not of iteration 0, so
    /// it is checked across depths.
    #[test]
    fn anchor_at_every_iteration() {
        for iter in 0..8u64 {
            assert!(Position::new(1, iter, Direction::Future).is_anchor());
            assert!(Position::new(1, iter, Direction::Past).is_anchor());
        }
        assert!(!Position::new(2, 0, Direction::Future).is_anchor());
    }

    /// Falsifier: pairing is an involution that changes only the direction.
    #[test]
    fn pair_is_involution_on_direction_only() {
        let f = Position::new(2, 1, Direction::Future);
        let p = f.pair();
        assert_eq!(p.direction, Direction::Past);
        assert_eq!(p.number, f.number);
        assert_eq!(p.iteration, f.iteration);
        assert_eq!(p.pair(), f);
    }

    /// Falsifier: construction rejects number 0 and any number above the
    /// count at that iteration. A position outside the count is an address
    /// with no cell behind it.
    #[test]
    fn construction_rejects_out_of_range() {
        assert_eq!(Position::try_new(0, 0, Direction::Future), Err(PositionError::ZeroNumber));
        assert_eq!(
            Position::try_new(4, 0, Direction::Future),
            Err(PositionError::ExceedsCount { number: 4, max: 3, iteration: 0 })
        );
        assert!(Position::try_new(3, 0, Direction::Future).is_ok());
        assert!(Position::try_new(12, 1, Direction::Future).is_ok());
        assert!(Position::try_new(13, 1, Direction::Future).is_err());
        assert!(matches!(
            Position::try_new(1, 32, Direction::Future),
            Err(PositionError::IterationOverflow { .. })
        ));
    }

    #[test]
    fn distance_from_observer_is_three_to_the_iteration() {
        assert_eq!(Position::new(1, 0, Direction::Future).distance_from_observer(), 1.0);
        assert_eq!(Position::new(1, 3, Direction::Future).distance_from_observer(), 27.0);
    }
}
