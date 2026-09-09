---
paths:
  - "hypotheses/**"
---

# Hypothesis

A claim at stage 5 or beyond uses this literal template, in
`hypotheses/<slug>.md`:

```
## Hypothesis
<one sentence>

## Prediction
<what the test or measurement should show>

## Falsifier
<what outcome would prove this wrong>

## Result
<open | pass | fail> -- pointer to journal entry
```

If the falsifier cannot be stated, the hypothesis is not ready.
A retrodiction pairs with a forward prediction.

## File shape

Above the template, as needed:

- *From.* Pointer to the `sketch/<slug>.md` this came from, and
  the date of the sketch section it was built on. A hypothesis
  with no sketch behind it says so and says why.
- *Claim.* What it claims and means to explain (stage-2 prose,
  one paragraph).
- *Frame.* The framing this rests on, in one or two sentences,
  and what it rules out. Restated and re-answered at each stage
  transition; if it would not be chosen again from scratch, it
  is discarded rather than defended.
- *Math.* Exploratory math not yet in code. Omit if all math is
  in the test docstring.
- *Test.* Path to the test file once code exists.
- *Last journal entry.* Pointer to the most recent result.

One live version only. When superseded, the prior version moves
to `.archive/superseded-<slug>-<date>/` with a one-line pointer
left in place. When the Result is `pass` or `fail`, the file
moves to `.archive/closed-<slug>-<date>/` with a one-line
pointer. A discarded frame moves to
`.archive/framed-<slug>-<date>/`; the sketch it came from stays
where it is and is what the next attempt starts from.

Not in hypothesis files: stacked versions; meta-section headings
("What this does not do," "Honest scope," "Cross-line bearing").
