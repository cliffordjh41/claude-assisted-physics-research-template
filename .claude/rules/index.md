# Index

The rules carry this directory's discipline. They stand in for
the advisor and reviewer the user does not have.

They exist to protect original work, not to prevent claims. A
constraint-only reading produces an agent that reaches for the
literature, because restating something already published is the
easiest way to satisfy a sourcing requirement. That is the
failure these rules are written against. Stage 0 exists so the
picture gets recorded before anything is owed.

## Always-on (loaded every session)

- `honesty.md` -- claims, evidence, reserved words, result
  labels, method before artifact, falsifier hygiene and what to
  do when one fires, surprise-is-a-bug, frame-lock, walls and
  checkable-is-not-unverified, generation before audit,
  anti-patterns.
- `conduct.md` -- the user, direction split, register, terseness,
  domain identification, emojis, preservation, machine rules.
- this file.

## Path-scoped (load when their files are touched)

| File | Binds |
|---|---|
| `sketch.md` | `sketch/**` |
| `hypothesis.md` | `hypotheses/**` |
| `sources.md` | `library/**`, `hypotheses/**`, `papers/**`, `journals/**`, `crates/**/*.rs` |
| `writing.md` | `hypotheses/**`, `papers/**`, `journals/**`, `library/**`, `crates/**/*.rs` |
| `code.md` | `crates/**`, `apps/**` |

Path scoping triggers when a matching file is read. Before
writing the first file into any directory above, read that rule
directly -- a new file in an untouched directory may not have
triggered it.

## Skills

- `session-close` -- journal entry and handoff rewrite at
  session end; carries both shapes.
- `adversary` -- attack pass on a result before it is filed.
- `paper-writing` -- stage 6 only.

## Hooks

In `.claude/hooks/`: `session-start.py` injects state;
`block-delete.py` and `block-emoji.py` deny at the harness
level; `run-log.py` records test runs and their full output to
`runs/`. Hooks enforce; rules instruct.

All four are registered in `.claude/settings.json` as
`type: command` hooks, so each must stay executable. A hook that
loses its executable bit fails silently -- the session simply
proceeds without it.

## When a rule does not cover something

State the gap. Stop. Do not invent rules mid-session. If a rule
conflicts with the work, name the contradiction -- what the rule
says, what the situation needs, why they conflict -- and let the
user decide.
