# Physics research directory

A workspace for theoretical-physics work with an AI assistant.

What gets recorded here is what is not written down anywhere
else: a picture in its original form before formalization, our
own negative results, numbers our runs produced with the
parameters that produced them, which framing was taken and what
was discarded, and the exact point where our result and a
published one diverge. Prior art is cited for provenance, at the
point of use, with a locator. It is not restated at length and
it does not justify anything.

## The seven stages

A rigor ladder, not a pipeline. Discipline scales with stage;
lower-stage discipline is met before a claim lifts higher.
Stages can run partly in parallel. Enter at the stage matching
what you bring and climb only as far as the work warrants. Many
projects never start at 0 or 1; many never aim at a paper.

0. Sketch -- the picture verbatim, dated, claims nothing. At
   `sketch/<slug>.md`.
1. Intuition -- a paragraph. No formality, no falsifier yet.
2. Conceptual framework -- prose; defines terms, states claims,
   names what stays vague, names its frame. At
   `hypotheses/<slug>.md`.
3. Mathematical formalism -- equations plus Rust tests;
   includes reduction to known physics (Newton / GR / QM / EM in
   their confirmed limits).
4. Internal consistency -- conservation laws, no hidden
   infinities. Test code plus an audit note. Output seen before
   any pass language.
5. Predictions -- the template in `.claude/rules/hypothesis.md`.
   A retrodiction pairs with a forward prediction.
6. Thesis / paper -- optional; the `paper-writing` skill fires
   only here. Drafts at `papers/<paper-name>/`.

At every transition upward, the frame is restated and
re-answered: given what is now known, would it be chosen again
from scratch? If not, it is discarded and the work restarts from
the sketch. Discarding a frame is a result.

Stages beyond 6 -- peer review, independent testing, empirical
confirmation -- need humans in the field and are out of scope.

## Who writes, who reads

The agent writes and reads all files. The user verifies state
through conversation; they do not read the files directly. Every
file is therefore self-contained -- a future session
reconstructs state from the file alone, with no human fallback
to catch ambiguity. Terms are defined in the file or pointed at
a file and section that defines them; every pointer resolves to
something on disk.

The user drives direction. The agent executes inside it with the
discipline in `.claude/rules/`.

## Session start

A session is one terminal invocation (process start to exit or
`/clear`). `.claude/hooks/session-start.py` injects `handoff.md`
and the last journal entry at startup, resume, and clear; that
satisfies step 3 unless it is missing or looks stale.

1. Read this file.
2. Read `.claude/rules/index.md` and the always-on rules it
   lists (`.claude/rules/honesty.md`,
   `.claude/rules/conduct.md`).
3. Read `handoff.md` and the current `journals/` volume, or take
   both from the session-start injection.
4. State current state in one or two sentences -- open line,
   last result, next concrete task -- then wait.

Fresh directory (blank handoff, empty journal): say so, and on a
true first run point the user at README.md. Then ask what they
want to work on and how far to take it, rather than assuming a
start at intuition.

Plan and confirm before acting for anything touching more than
~3 steps, more than one file, or a stage transition. Single-file
edits, journal appends, sketch entries, and direct answers need
no plan.

## Layout

- `.claude/rules/` -- discipline. `index.md` routes.
- `.claude/skills/` -- `session-close`, `adversary`,
  `paper-writing`.
- `.claude/hooks/` -- state injection, deletion block, emoji
  block, run log.
- `sketch/` -- stage 0.
- `hypotheses/<slug>.md` -- live framework and hypothesis files.
- `library/` -- a canonical, portable source library, filed by
  discipline: `<domain>/<author>/<publication>/` carrying
  `notes.md` and the source file, or `<domain>/<short-name>.md`
  where the file is not held. It carries its own filing contract
  at `library/CLAUDE.md` and travels between projects whole, so
  nothing project-specific goes in it. **Ships empty of sources
  and is checked before searching the web for one.**
  `tools/index_library.py` regenerates
  `prior-art/library-index.md`; `tools/cite.py` generates a note
  skeleton.
- `prior-art/` -- what our searching concluded, which is not the
  same thing as what a source says: the search log with every
  query verbatim, syntheses setting our results against
  published ones, and the generated library index. Sources go in
  `library/`; our verdicts on them go here. The dividing test is
  portability -- a file that would be meaningless after the
  library is copied into another project is not a library file.
- `journals/journal-NN.md` -- append-only;
  `journals/journal-index.md` indexes volumes. `handoff.md` --
  current state.
- `runs/` -- automatic log of cargo invocations and their full
  output. What makes "output was seen" checkable later.
- `crates/`, `apps/lab/` -- Rust compute and the Vite + React
  workbench. See README.md.
- `thrifty/` -- the `thrifty-ui` React kit, vendored as a pnpm
  workspace package so `apps/lab` resolves it as
  `"thrifty-ui": "workspace:*"` with no registry version to
  track. `apps/lab` builds its shell from the kit's
  `SlidableColumn` primitives; the kit's own authoring contract
  is at `thrifty/.claude/rules/authoring-panels.md` and is read
  before writing or editing a panel.
- `lean/<name>/` -- machine-checked algebra, Lean 4 with Mathlib,
  for results whose algebra is worth pinning. Build with
  `PATH="$HOME/.elan/bin:$PATH" lake build` from the project
  directory; the first build downloads Mathlib and takes roughly
  twenty minutes. Each project's `.lake/` is a multi-gigabyte
  cache: disposable, rebuilt by `lake build`, **never** copied
  into a publication repository.
- `.archive/` -- held material; read only when pointed at.
  `.archive/PENDING-USER-REVIEW.md` lists what awaits the
  user's manual deletion.

## Defaults

- Subagents not used; `Task` denied in `.claude/settings.json`.
- Auto-memory disabled; CLAUDE.md still loads.
- Deletion is disabled. The agent moves to `.archive/` and marks
  it in `.archive/PENDING-USER-REVIEW.md`; the user deletes.
- No reading images, PDFs, or long archives unless the user
  points at a specific file.
- Rust only for compute; release-mode runs with `--nocapture`.
- Cost is not a value. Nothing is recommended on the grounds
  that it is cheap, quick, or easy to run.
