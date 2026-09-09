import Mathlib.Data.Real.Basic
import Mathlib.Tactic.Linarith
import Mathlib.Tactic.Ring

set_option linter.style.header false

/-!
A worked example of what this directory is for.

Machine-checking every derivation is not the point and does not pay. What pays
is pinning the algebra a result *rests on*, especially an equality condition or
a case split, because those are where a prose proof quietly drops a hypothesis
and nobody notices.

# The pattern

Supply the analytic inputs as **data** rather than deriving them. If a result
depends on derivatives, pass the derivatives in as real variables and prove the
algebraic identity relating them; formalising the chain rule needs Mathlib's
analysis layer and is a different exercise with a different payoff. Stated that
way, most of this directory's load-bearing algebra becomes decidable by ordered
field arithmetic and closes in seconds.

# Why the second theorem below matters more than the first

A prose proof carries its hypotheses in the surrounding text. A formal statement
carries them in the statement, so writing the statement is what reveals a
hypothesis that was being used without being stated. The second theorem here is
the shape to imitate: it exhibits the counterexample that shows a side condition
is load-bearing rather than decorative.

After proving something, run `#print axioms <name>`. Anything beyond
`propext, Classical.choice, Quot.sound` means an axiom was leaned on; a `sorry`
shows up here too.
-/

namespace Example

/-- A sum of squares vanishes exactly when both terms do. -/
theorem sq_add_sq_eq_zero_iff (x y : ℝ) : x ^ 2 + y ^ 2 = 0 ↔ x = 0 ∧ y = 0 := by
  constructor
  · intro h
    have hx : 0 ≤ x ^ 2 := sq_nonneg x
    have hy : 0 ≤ y ^ 2 := sq_nonneg y
    have hx0 : x ^ 2 = 0 := by linarith
    have hy0 : y ^ 2 = 0 := by linarith
    exact ⟨pow_eq_zero_iff (n := 2) (by norm_num) |>.mp hx0,
           pow_eq_zero_iff (n := 2) (by norm_num) |>.mp hy0⟩
  · rintro ⟨hx, hy⟩
    rw [hx, hy]
    ring

/-- The same statement for a plain sum is **false**, and this is the
counterexample. The non-negativity that made the theorem above work was doing
real work, not decorating it.

Write one of these whenever a proof's prose carries a side condition that its
statement does not. It is the cheapest way to find out that the condition is
load-bearing. -/
theorem add_eq_zero_is_not_the_same :
    (1 : ℝ) + (-1) = 0 ∧ ¬((1 : ℝ) = 0 ∨ (-1 : ℝ) = 0) := by
  refine ⟨by norm_num, ?_⟩
  rintro (h | h) <;> norm_num at h

end Example
