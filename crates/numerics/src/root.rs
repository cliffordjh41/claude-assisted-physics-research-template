//! Scalar root finding: bisection, Newton, and Newton with a bisection
//! fallback inside a bracket.

/// Why a root search stopped without a result.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum RootError {
    /// f(a) and f(b) do not have opposite signs.
    NoSignChange,
    /// Iteration budget exhausted before the tolerance was met.
    MaxIterations,
    /// The derivative vanished (Newton) or an iterate became non-finite.
    Degenerate,
}

/// Bisection on [a, b], requiring sign(f(a)) != sign(f(b)). Halves the
/// bracket until its width is below `tol`, then returns the midpoint. The
/// bracket-halving argument gives an error bound of (b - a) / 2^(k+1)
/// after k halvings, so the returned point is within `tol` of a root of
/// any continuous f.
pub fn bisect<F: Fn(f64) -> f64>(
    f: F,
    mut a: f64,
    mut b: f64,
    tol: f64,
    max_iter: usize,
) -> Result<f64, RootError> {
    let mut fa = f(a);
    let fb = f(b);
    if fa == 0.0 {
        return Ok(a);
    }
    if fb == 0.0 {
        return Ok(b);
    }
    if fa.signum() == fb.signum() {
        return Err(RootError::NoSignChange);
    }
    for _ in 0..max_iter {
        let m = 0.5 * (a + b);
        if (b - a).abs() < tol {
            return Ok(m);
        }
        let fm = f(m);
        if fm == 0.0 {
            return Ok(m);
        }
        if fm.signum() == fa.signum() {
            a = m;
            fa = fm;
        } else {
            b = m;
        }
    }
    Err(RootError::MaxIterations)
}

/// Newton's iteration x <- x - f(x)/f'(x) from `x0`, stopping when the
/// update is below `tol`. No global convergence guarantee: far from a
/// root, or near a zero of f', the iteration can diverge — use
/// `newton_bracketed` when a sign-change bracket is available.
pub fn newton<F, D>(f: F, df: D, x0: f64, tol: f64, max_iter: usize) -> Result<f64, RootError>
where
    F: Fn(f64) -> f64,
    D: Fn(f64) -> f64,
{
    let mut x = x0;
    for _ in 0..max_iter {
        let d = df(x);
        if d == 0.0 || !d.is_finite() {
            return Err(RootError::Degenerate);
        }
        let step = f(x) / d;
        x -= step;
        if !x.is_finite() {
            return Err(RootError::Degenerate);
        }
        if step.abs() < tol {
            return Ok(x);
        }
    }
    Err(RootError::MaxIterations)
}

/// Newton inside a sign-change bracket [a, b]: a Newton step is taken when
/// it lands inside the current bracket, and a bisection step otherwise, so
/// each iterate stays bracketed and the bracket width is non-increasing.
/// Inherits bisection's robustness with Newton's local speed.
pub fn newton_bracketed<F, D>(
    f: F,
    df: D,
    mut a: f64,
    mut b: f64,
    tol: f64,
    max_iter: usize,
) -> Result<f64, RootError>
where
    F: Fn(f64) -> f64,
    D: Fn(f64) -> f64,
{
    let mut fa = f(a);
    let fb = f(b);
    if fa == 0.0 {
        return Ok(a);
    }
    if fb == 0.0 {
        return Ok(b);
    }
    if fa.signum() == fb.signum() {
        return Err(RootError::NoSignChange);
    }
    let mut x = 0.5 * (a + b);
    for _ in 0..max_iter {
        let fx = f(x);
        if fx == 0.0 {
            return Ok(x);
        }
        // Shrink the bracket around the sign change.
        if fx.signum() == fa.signum() {
            a = x;
            fa = fx;
        } else {
            b = x;
        }
        if (b - a).abs() < tol {
            return Ok(0.5 * (a + b));
        }
        // Newton trial; fall back to the midpoint when it leaves [a, b]
        // or the derivative degenerates.
        let d = df(x);
        let newton_x = if d != 0.0 && d.is_finite() {
            x - fx / d
        } else {
            f64::NAN
        };
        x = if newton_x.is_finite() && newton_x > a && newton_x < b {
            newton_x
        } else {
            0.5 * (a + b)
        };
    }
    Err(RootError::MaxIterations)
}
