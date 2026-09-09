---
name: adversary
description: Attack a result before it is filed. Use when a computation has produced a number that is about to be written into a hypothesis file, journal entry, or paper, when a result looks surprising or clean, or when the user asks for the result to be challenged, stress-tested, or checked. Runs assumption enumeration, the null test, and the regime-shift check, then reports what survived.
---

# Adversary

A solo researcher has no reviewer. This pass is the substitute,
and it is structurally weak in a way that must be stated up
front: the agent running it wrote the code being attacked and
shares its blind spots. It therefore proceeds by executing
checks, not by reasoning about whether the result seems right.
Nothing here is settled by judgement. Every line of the verdict
points at output.

Run it before a result is filed, not after.

## 1. State the target

One sentence: the claim. Then the numbers, at full precision,
with every parameter that produced them and the path to the run
in `runs/`. If the numbers cannot be traced to a logged run,
stop -- the result is `open` and there is nothing to attack yet.

Separately, in one sentence: the mechanism the claim asserts.
Most failures live in the gap between a right number and a wrong
mechanism, and that gap is invisible unless the mechanism is
written down on its own.

## 2. Enumerate what must be true

List every assumption the claim rests on. Not the interesting
ones -- all of them. The integrator's stability at the step size
used. Unit consistency across every constant. The initial
condition being the one intended. The convergence criterion
actually reached rather than the iteration cap. The test
measuring the quantity its name says. Floating-point range at
the magnitudes involved. Boundary handling at the first and last
sample.

For each: state how it fails, and what would be observable if it
did. An assumption whose failure has no observable is untestable
and is recorded as such rather than waved through.

## 3. Null test

Run the test with the effect removed -- coupling set to zero,
term dropped, driver switched off, whichever removal
corresponds to the claim being false.

If it still passes, the test measures nothing and every result
it has produced is void. This outcome is not rare and is the
single highest-yield check in the pass. Log the null run beside
the live one.

## 4. Regime-shift

Write down first what the asserted mechanism predicts when the
regime changes. Then change it: step size by an order of
magnitude in each direction, amplitude, initial condition, the
sign of a term, units.

Compare against the written prediction. A result that holds
while the mechanism's prediction fails is a wrong mechanism with
a right number: `fail`, not a partial pass.

## 5. Attack the construction

- Would this test have produced a similar-looking number under a
  different mechanism entirely? Name one and check.
- Is any threshold, window, or tolerance in the test one that
  was chosen after a result was seen? If the history is not
  recoverable from the run log or git, treat it as fitted.
- Does any quantity get defined in terms of the target it is
  compared against?
- Are round numbers appearing where a physical calculation
  should give irrational ones?
- Does the reported precision exceed what the step size and
  float width support?

## 6. Verdict

Four lists, no prose summary:

- **Survived** -- checks run, output seen, result held.
- **Failed** -- checks run, result did not hold.
- **Untested** -- assumptions with no observable, or checks not
  run, each with the reason.
- **Void** -- results invalidated by a null-test failure.

Then the label: `open`, `pass`, or `fail`. A pass requires the
null test and the regime-shift check both run with output seen.
Without those two, the verdict is `open` regardless of how the
other checks went.

## Concessions

If the user disputes a finding from this pass, the finding is
not withdrawn on the strength of the objection. It is withdrawn
when a check that settles it has been run and its output seen,
and the withdrawal names that check. Agreeing because the user
pushed is the failure this section exists to prevent.

## Not part of this pass

- Rewriting the code to make a check pass. Findings are
  reported; fixes are a separate, subsequent task.
- Softening a finding because the result is wanted.
- Judgement calls presented as checks.
