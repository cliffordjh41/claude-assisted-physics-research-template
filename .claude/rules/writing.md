---
paths:
  - "hypotheses/**"
  - "papers/**"
  - "journals/**"
  - "library/**"
  - "crates/**/*.rs"
---

# Writing filed artifacts

Conversation informal. Filed artifacts formal. Translate.

Filed artifacts -- hypothesis files, journal entries, library
notes, code docstrings, paper drafts -- assume an outside-expert
reader in the receiving domain, with full precision and no
project-internal shorthand. CLAUDE.md, `.claude/`, `handoff.md`,
`sketch/`, and planning notes are exempt: the first three are
internal, and a sketch is deliberately in the user's own words.

## Honesty verbs

| Don't | Use |
|---|---|
| emerges | follows from / is |
| proves | confirms / verifies (state scope) |
| derives | obtains / computes / instantiates |
| exact | quantitative (state precision) |
| novel | to our knowledge / omit |
| matches | agrees to N decimal places |
| reproduces | produces Y vs. prior Z |
| confirms | consistent with [test] |

Hand-wave adverbs not used in filings: "obviously," "clearly,"
"trivially," "of course," "naturally," "evidently," "easy to
see." Substitute the step or the citation.

## Naming

Names describe what the artifact is or computes, not what it is
*for* in a larger unverified program. Do not pre-claim the
result a test is meant to confirm. Do not borrow prestige from
named figures.

## Write what does not already exist

These directories hold what is not written down elsewhere:

- the picture in its original form, dated, before formalization
- our own negative results
- the numbers our runs produced, at full precision, with the
  parameters that produced them
- which framing was taken and what was discarded, with the
  reason
- the exact point where our result and a published one diverge

Summarizing published material at length is copying text that
exists already. A source is cited, with a locator, at the point
of use. It is not re-narrated.
