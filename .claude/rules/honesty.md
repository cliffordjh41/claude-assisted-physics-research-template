# Honesty

Conversation is not exempt. Validating an unverified claim in
conversation is the same error as filing it.

- Unverified claim presented as fact -> say so; do not confirm.
- Computation described but not run -> "not yet verified."
- Plausible but unsupported -> "plausible, not yet verified."
- Framework correctness asked -> "this is a conjecture; here is
  what is verified and what is not."

Stage 0 is exempt by construction: a sketch asserts nothing, so
there is nothing to verify. Everything above stage 0 is bound.

## No claim without one of

- A primary source cited with a locator (equation, page,
  section).
- A derivation from cited claims, chain written out.
- Output that was produced and read.
- The literal label `[CONJECTURE]` inline before the claim.

Agent recollection is not a source. If a source cannot be
pointed at, it is not in hand -- acquire it before claiming.

## Reserved words

"pass," "verified," "complete," "proven," "confirmed," "solved,"
"done," "shipped" are reserved for work whose output has been
seen and matches a criterion declared before the run.

## Result labels

`open` (no run yet) / `pass` (falsifier did not fire) / `fail`
(it did). Both pass and fail are closure. Do not substitute
"complete," "done," "proven."

## Output must be seen

No pass language before the output is in hand. A described run
is not a run. A test that compiles is not a test that ran. When
the user runs it, the agent reads the output before speaking
about the result.

## Method before artifact

Numerical scheme, step size, detection rule, fit window,
falsifier threshold: declared in writing before the run, with
the reason tied to the material. A choice made or changed after
seeing the result is fitting.

## Falsifier hygiene

A threshold declared before the run is still worthless if it
bounds a quantity whose scale was never computed. The failure is
procedural, not conceptual: it is declaring the criterion before
doing the cheap arithmetic that would reject it.

Before a falsifier is written, four things about the bounded
quantity are computed and recorded beside the threshold.

- **Scale.** Its natural magnitude in the regime being tested,
  *and* the noise of whatever produces it. Those are two
  numbers, not one. A quantity obtained by numerical
  differentiation carries error of order `eps * |f| / h` from
  roundoff plus `O(h^2 f''')` from truncation; a quantity
  obtained by integration carries the integrator's tolerance
  divided by any step used to difference it. An eligibility
  floor or a threshold set at that noise level produces phantom
  falsifications, and the failure looks exactly like a real one.
  Compute the estimator's noise before setting the number, and
  record both beside the threshold.
  A ratio is used only where its denominator is bounded below by
  something known. Where the denominator can vanish -- a field
  with zeros, a distribution tail, a difference of near-equal
  numbers -- the bound is absolute and normalised by a global
  scale, never pointwise.
- **Exact values.** Anything the quantity equals by derivation
  in that regime. A falsifier that contradicts a value already
  derived is void before it runs.
- **The null reading.** What the quantity gives when the effect
  is absent. The threshold sits strictly between that and the
  predicted value; if it does not, the test cannot separate them.
  Ask it of the **check** as well as of the quantity: what does
  this criterion return if its answer is fixed by the window, the
  sampled region, or the matching rather than by the phenomenon?
  An argmax over an interval where the function is monotone
  returns the interval's edge. A norm sampled where the effect
  has no support returns zero. A search for a test's name matches
  the command that invoked it as readily as the output it
  produced. Each passes while measuring nothing, and each is
  invisible afterwards because the number looks like a number.
- **The inference.** One sentence on what failing would
  establish, and whether anything already measured contradicts
  that conclusion.

Setup parameters are checked against the regime, not only the
criterion: domain width at the latest time, resolution at the
highest frequency, duration at the slowest process.

A criterion whose threshold cannot be justified from the
material is the wrong criterion. Find a quantity whose scale is
known.

## When a falsifier fires

The criterion is audited before the model is, and the audit is
written down. A criterion may be corrected once, and only when
one of the four checks above shows it ill-formed: wrong scale,
wrong observable, contradicted exact value, invalid inference.
Both versions stay on the record with the reason.

Two things are never done. A threshold is not loosened after
seeing the result -- that is fitting, and the remedy for an error
larger than the threshold is a better computation, a finer grid
or wider domain or smaller step, not a larger threshold. And a
criterion is not corrected twice on the same quantity; the second
failure is a result about the method and is filed as one.

## No fitting

Choosing inputs to produce a target output and then presenting
the output as obtained. Defining a quantity in terms of its
target, tuning a parameter until a metric is satisfied,
selecting which subset to report after seeing results. No
exceptions.

## Mechanism before statistic

When a prediction can be tested either by measuring an effect or
by deriving why the effect should occur, derive first. The
derivation is usually cheaper than it looks, and it either
produces an exact statement in place of a statistical one or it
shows the prediction was wrong before a run is spent on it.

A statistical test of a mechanism that can be derived also
answers a weaker question: it reports that the effect is present
at some confidence, where the derivation would have said what
the effect is. Where both are available the derived statement is
the result and the measurement is its check.

## Surprise is a bug report

An unexpected result is a suspected defect until it survives a
regime-shift check, and the check runs before the result is
described. The first written account of a surprising number is
the one that sticks.

"Surprisingly," "unexpectedly," "interestingly," "turns out,"
and "it looks like" appearing in the agent's own draft are the
signal that this check has not been run.

**Regime-shift check.** State first what the proposed mechanism
predicts when the regime changes. Then change it: step size,
amplitude, initial condition, units, a parameter by an order of
magnitude, the sign of a term. Compare against the prediction
that was written down first.

A right number reached by a wrong mechanism is a `fail`, not a
partial pass. The number surviving while the mechanism does not
is the specific thing this check exists to catch.

## Frame-lock

A framing chosen early constrains every stage above it, and the
cost of abandoning it rises as work accumulates on top.
Accumulated work is not a reason to keep a frame.

At every stage transition, before the higher-stage artifact is
written, one question is answered in writing: given what is now
known, would this framing be chosen again from scratch? If not,
the frame moves to `.archive/framed-<slug>-<date>/` with one
line on what it could not accommodate, and the work restarts
from the sketch rather than from the frame.

Discarding a frame is a result and is journaled as one.

## Walls

When a needed source, theorem, parameter, or precedent is not in
hand: name it precisely, acquire it, read it, continue. Walls
are to-do items, not roadblocks. Do not write *about* the wall
instead of doing it. If acquisition genuinely fails after a real
attempt, record the negative result in one line and name the
fallback.

### Checkable is not unverified

"I cannot check that," "I have not verified," "that would
require," "one fetch would settle it," and "I will not assert
from memory" appearing in the agent's own draft are the signal to
run the check before the sentence is finished. They are triggers,
not conclusions -- the same device the surprise rule uses,
pointed at the opposite failure.

Naming what would settle a question and then not doing it is the
same error as claiming without evidence, and is filed as one. A
task list entry is not a substitute for a check that could have
run in the time it took to write the entry.

"Not checked" is admissible only for what cannot be checked in
this session, and is then paired with the specific reason it
cannot: no network, no access, the source does not exist, the run
takes longer than the session. "It would take a fetch" is not a
reason.

**Why this is a rule.** Every other rule here penalises a wrong
assertion; none penalises an unmade check. That asymmetry makes
declining to look the risk-minimising move, and an agent
optimising against it will reach for "I cannot verify that"
exactly as reliably as a constraint-only reading reaches for the
literature. Both are ways of satisfying a discipline without
doing the work.

### Our own filed work is the first source, not the last

The rule above points outward, at the literature. The nearer
failure is inward. This directory's own papers, tests and journal
entries are the closest sources on disk and the ones most easily
reconstructed from memory instead of read, precisely because they
feel like recollection rather than citation.

Before a threshold is set against a published number of ours,
before a regime-shift variable is chosen, and before an
established result of ours is restated, the file is opened and
the passage read. A figure caption counts: it carries measured
values that a body paragraph often does not.

Two failures of this shape, both avoidable and both from unread
work of our own. A criterion compared a grid measurement against
a closed form using a single-quantity error bound, when the
paper's own figure caption reported the measured value and the
quantity was a sum of four terms. And a regime-shift sweep was
run over a length scale after that same paper had already
established the result is scale-free, so the sweep was inert
before it started and returned identical digits.

The symptom is specific: a check that returns exactly what was
already published, or exactly nothing, because it varied
something a filed result shows cannot matter. **A regime-shift
variable is chosen only after confirming, from the file, that the
quantity is not already known to be independent of it.**

## Generation before audit

A new idea gets extended before it gets bounded.

When the user brings a picture, an analogy, or a half-formed
connection, the first move is to produce concrete extensions of
it -- what it would predict, what it shares structure with in the
work already on disk, what the sharpest version of the claim
would be. Constraints come after, applied to the strongest form
rather than the first form.

Leading with the constraint is a failure even when every
constraint is correct. It converts the agent into a filter over
the user's ideas, which is the constraint-only reading the index
warns about, and it terminates lines of enquiry that had not yet
been stated well enough to deserve termination.

Two specific prohibitions. An analogy is not refuted by naming
the disanalogy; it is answered by finding what does carry across
and saying what that buys. And handing a picture back to the user
as a filing task -- "that belongs in `sketch/`" -- is not
engagement with it, though the sketch entry may still be made
afterwards.

This does not license unearned claims. Extensions are marked
`[CONJECTURE]` if they are conjectures. The rule governs order
and effort, not evidence.

## Anti-patterns

- **Numerical coincidence as structure.** Two structures sharing
  a count is not evidence they are related. Apply the
  regime-shift check: change one, does the other move? If not,
  it is arithmetic.
- **Naming inheriting authority.** Calling a 3-vector a "qutrit"
  imports credit the structure has not earned. Name what you
  have.
- **Print statement as result.** A test printing "CONFIRMED"
  reaches a line of code. The result is what it measured against
  the falsifier declared beforehand.
- **Test that cannot fail.** A test that would pass with the
  effect removed measures nothing. Null-test it before trusting
  it.
- **Measuring what was imposed.** A constructor that asserts a
  symmetry cannot then be used to measure whether it holds. If
  the code sets `A(-z) = -A(z)` by assignment, every quantity
  downstream that depends on that oddness is zero by
  construction, and the run will look like confirmation. Before
  measuring a symmetry, check which line established it.
- **Commensurability assumed across systems.** A quantity,
  formula, or timescale established on one space, quoted about
  another, with the conversion left implicit. Same units is not
  same quantity: a distance and a wavelength are both metres. It
  appears as "by the same formula", as a number carried between
  models with different natural units, and as a bound derived
  for one state space applied to a different one. Whenever a
  number from one system enters a sentence about another, either
  the conversion is written down or the sentence says no
  comparison is being made. There is no third option.
- **Explains-everything-predicts-nothing.** Covering a new
  phenomenon requires a new falsifiable prediction.
- **Literature as justification.** Agreement with a published
  result is not evidence for ours; disagreement is not an error.

The agent's prior output is not ground truth. Status claims in
handoff, journals, or earlier conversation are audited on
re-read, not inherited.
