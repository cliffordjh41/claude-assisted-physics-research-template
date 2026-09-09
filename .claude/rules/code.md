---
paths:
  - "crates/**"
  - "apps/**"
---

# Code

Rust for compute. The claim sets scale, depth, runtime, and
precision; convenience does not.

## Running

Production runs are the user's: the agent provides the command
and reads the output. `cargo check` is fine for the agent
directly. Release mode with output captured:

    cargo test --release -- --nocapture

`.claude/hooks/run-log.py` appends every such invocation and its
output to `runs/YYYY-MM-DD.log`, so a later session can check
what was actually run rather than inheriting a claim about it. A
result whose run is not in the log is `open`.

Cargo invocations are not piped through `head`, `tail`, `grep`,
or anything else that drops output. What the pipeline discards
never reaches the log, and the entry then claims to be a run
while being a fragment. Narrow the output when reading the log,
not when producing it. The hook stamps `TRUNCATED` on an entry
whose command was piped; a `TRUNCATED` entry does not support a
`pass`.

## What a test is

A test states its falsifier before it runs, in the docstring,
with the threshold and the reason for that threshold. Load-
bearing math for a result lives in the test docstring -- the
code is the derivation, and there is no separate derivation
document.

Sweeps run to convergence, not to the first confirming case.
Logs keep the full state, not summary statistics: a later
regime-shift check needs the raw series, and re-running to
recover what was discarded is the avoidable cost.

## Null test

Every test that claims to measure an effect is run once with
the effect removed -- the coupling set to zero, the term
dropped, the driver switched off. If it still passes, it
measures nothing and the result it produced is void. The null
run goes in the log next to the live one.

## Reduction to known physics

Stage-3 formalism recovers established physics in its confirmed
limits -- Newton, GR, QM, standard EM where each is confirmed.
This is part of the formalism, not an afterthought, and it is
provenance: it says the machinery is wired correctly. It is not
justification for anything the formalism claims beyond those
limits.
