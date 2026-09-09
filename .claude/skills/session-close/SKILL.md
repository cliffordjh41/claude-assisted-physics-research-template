---
name: session-close
description: File the session's journal entry and rewrite handoff.md at session end. Use when the user says to wrap up, close, end, or hand off the session, or asks to file the journal. Handles same-day letter suffixes and journal volume rollover.
---

# Session close

Two writes, in this order: append the journal entry, then rewrite
`handoff.md`. The journal captures what happened; the handoff
captures only what the next session needs. Both shapes are below;
this skill is self-contained.

## Order of operations

1. Audit before filing. Re-check every pass/fail claim against
   output actually seen this session, and against `runs/`. A
   result with no run behind it in the log files as `open`, not
   `pass`, whatever was said in conversation.
2. Append one entry to the current `journals/journal-NN.md`
   volume (highest NN). Never edit or reorder prior entries.
3. Rewrite `handoff.md` from scratch. Prior state is captured by
   the entry that just landed; carrying stale sections forward is
   the failure mode.
4. Confirm to the user in one line: entry anchor plus next task.

## Journal entry

```
## YYYY-MM-DD -- <subject>

One short paragraph (<=5 sentences): what happened, load-bearing
measurements, pass/fail flags. Derivation detail lives in the
cited artifacts.

- path/to/artifact.md -- one-clause subject
- path/to/test.rs::test_name -- one-clause subject
```

- Same-day entries get a letter suffix (`YYYY-MM-DD-b` for the
  second of the day; an existing unlettered entry counts as `a`
  and is left unchanged).
- Pointer lines: one per artifact touched this session that
  carries a result.
- Sub-tasks consolidate into the single entry.
- Not in entries: code-diff recitation (git carries it), pass
  language for output not seen, re-narration of source content.

What earns a line is what exists nowhere else: numbers our runs
produced with the parameters that produced them, negative
results, a frame discarded and why, the point where our result
and a published one diverge.

## Handoff rewrite

```
# Handoff

## Open line
<one sentence: what is being worked on>

## Next task
<one sentence: the next concrete step>

## Blocked
<anything blocked and why; otherwise omit>

## Pointer
Last journal entry: journals/journal-NN.md#YYYY-MM-DD-suffix
```

If the session ends mid-derivation, Open line names the slug and
Next task the exact next step. Overwriting `handoff.md` is
correct: the prior state is in the entry that just landed.

## Rollover

If scanning the current volume has gotten slow (roughly: past a
few hundred lines), close it after this entry, create
`journals/journal-{N+1}.md`, and update `journals/journal-index.md`
with one line per volume. State that rollover happened; do not
ask.

## Not part of closing

- New results. Closing files what exists; it does not run one
  more test.
- Editing prior journal entries, even to fix an error -- a
  correction is a new entry.
- Archiving or moving artifacts, unless the user asked for it
  this session.
