# lean/example

A minimal Lean 4 + Mathlib project, and the pattern for adding more.

## Build

    PATH="$HOME/.elan/bin:$PATH" lake build

**The first build downloads Mathlib**: roughly twenty minutes, almost all of it
transfer, producing a `.lake/` directory of several gigabytes. That directory is
a cache. It is disposable, it is rebuilt by `lake build`, it is git-ignored here,
and it is **never** copied into a publication repository.

Lean itself is installed with `elan`; the toolchain this project pins is in
`lean-toolchain`.

## What this is for

Machine-checking every derivation does not pay. What pays is pinning the algebra
a result *rests on* -- an equality condition, a case split, a claimed
equivalence -- because that is where a prose proof drops a hypothesis without
anyone noticing.

`Example/Basic.lean` carries two theorems and the second is the point: it
exhibits a counterexample showing that a side condition is load-bearing rather
than decorative. Writing the formal statement is what forces the hypothesis into
the open, since prose can carry it in the surrounding text and a statement
cannot.

## Adding an equation

One `lean_lib` per equation, all inside this one project, so the Mathlib cache
is shared rather than duplicated per equation:

    [[lean_lib]]
    name = "Eq4"

with `Eq4.lean` importing `Eq4.Basic`. Adding a second library costs seconds;
a second *project* costs another full Mathlib download.

Name the directory for what it holds, not for the first equation put in it.

## After proving anything

    #print axioms YourNamespace.your_theorem

Anything beyond `propext, Classical.choice, Quot.sound` means an axiom was
leaned on, and a `sorry` shows up here too.
