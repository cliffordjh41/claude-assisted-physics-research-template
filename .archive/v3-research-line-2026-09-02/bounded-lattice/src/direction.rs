//! Lattice direction: Future (+) or Past (-).
//!
//! Ported from `ephemeratory/crates/ephem-core/src/direction.rs`.
//! Source doc comment: "Every lattice position exists in both directions
//! simultaneously -- Future (additive, +1) and Past (subtractive, -1)."

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Direction {
    /// Positive / additive (+1).
    Future,
    /// Negative / subtractive (-1).
    Past,
}

impl Direction {
    pub fn opposite(self) -> Self {
        match self {
            Direction::Future => Direction::Past,
            Direction::Past => Direction::Future,
        }
    }

    pub fn is_future(self) -> bool {
        matches!(self, Direction::Future)
    }

    pub fn is_past(self) -> bool {
        matches!(self, Direction::Past)
    }

    /// Signed value: Future = +1, Past = -1.
    pub fn sign(self) -> i8 {
        match self {
            Direction::Future => 1,
            Direction::Past => -1,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Falsifier: `opposite` is an involution. If applying it twice does not
    /// return the original, the Future/Past pairing is not a sign flip and
    /// every downstream statement about pairs is void. Exact equality is the
    /// threshold because the type is an enum with two inhabitants.
    #[test]
    fn opposite_is_involution() {
        assert_eq!(Direction::Future.opposite(), Direction::Past);
        assert_eq!(Direction::Past.opposite(), Direction::Future);
        assert_eq!(Direction::Future.opposite().opposite(), Direction::Future);
        assert_eq!(Direction::Past.opposite().opposite(), Direction::Past);
    }

    /// Falsifier: the sign of a direction is its opposite's negation.
    #[test]
    fn sign_negates_under_opposite() {
        for d in [Direction::Future, Direction::Past] {
            assert_eq!(d.sign(), -d.opposite().sign());
        }
    }
}
