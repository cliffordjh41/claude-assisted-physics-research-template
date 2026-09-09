//! Generic numerical methods: ODE integrators and scalar root finding.
//!
//! Scope: fixed-step classical Runge-Kutta (RK4), fixed-step velocity Verlet
//! for second-order systems q'' = a(t, q), an adaptive Dormand-Prince 5(4)
//! embedded pair, and bisection / Newton root finders. All methods are
//! dimension-generic over `&[f64]` state slices and allocation-light.
//!
//! Verification lives in `tests/`: convergence orders are measured against
//! the theoretical orders on a problem with a solution verified by direct
//! differentiation, and the Dormand-Prince tableau is checked against its
//! own consistency conditions.
//!
//! References:
//!   - Dormand-Prince 5(4) embedded pair: J. R. Dormand and P. J. Prince,
//!     "A family of embedded Runge-Kutta formulae," Journal of
//!     Computational and Applied Mathematics 6 (1), 19-26 (1980),
//!     DOI 10.1016/0771-050X(80)90013-3. The tableau coded here was
//!     cross-checked against the consistency conditions (row sums equal
//!     the nodes; weights sum to one) in `tests/tableau.rs`, and its
//!     convergence order is measured in `tests/convergence.rs`.
//!   - Velocity Verlet (position-velocity form): W. C. Swope,
//!     H. C. Andersen, P. H. Berens, and K. R. Wilson, "A computer
//!     simulation method for the calculation of equilibrium constants
//!     for the formation of physical clusters of molecules: Application
//!     to small water clusters," Journal of Chemical Physics 76 (1),
//!     637-649 (1982), DOI 10.1063/1.442716.

pub mod ode;
pub mod root;

pub use ode::{DormandPrince54, OdeSystem, SecondOrderSystem, StepOutcome};
pub use root::{bisect, newton, newton_bracketed, RootError};
