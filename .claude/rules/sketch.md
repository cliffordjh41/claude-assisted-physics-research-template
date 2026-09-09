---
paths:
  - "sketch/**"
---

# Sketch -- stage 0

Below stage 1. A sketch records a picture as it actually
arrived, in the words it arrived in, before any formalization.
It is not a claim and is not read as one.

## What it is for

The first formalization of an intuition is usually wrong, and
once it exists the original picture is unrecoverable: the
vocabulary of the formalization overwrites it, and what gets
defended afterward is the frame rather than the idea. The sketch
is the copy that survives that. When a formalization fails, work
restarts from the sketch, not from the failed frame.

## Does not apply here

- Citation. A sketch cites nothing because it claims nothing.
- Falsifiers.
- Honesty verbs. A sketch may say "emerges," "matches," "is
  exactly like." It describes a picture; it does not assert a
  result.
- Reduction to known physics.

Reserved words still do not appear, because there is no result
to reserve them for. The emoji prohibition does not lift.

## Does apply

- **Verbatim.** The user's words are recorded as given. The
  agent does not translate them into domain vocabulary, does not
  substitute the technical term, does not name the field the
  picture "really" belongs to, does not tidy the grammar.
  Paraphrase destroys the artifact.
- **Dated and frozen.** Dated at the top and not edited after.
  A sketch is a snapshot. A changed picture is a new dated
  section appended below; the earlier one stays.
- **Agent additions marked.** Anything the agent adds -- a
  question, an observation, a pointer to prior art -- goes below
  a rule under `Agent notes`, never mixed into the recorded text.

## Vocabulary discipline

The agent does not introduce a technical term into a sketch, or
into the conversation producing one, before the user has stated
the picture without it. Supplying the textbook name for
something still being described replaces the user's structure
with the structure the name carries, and the substitution is
usually invisible to both parties afterward. Prior art that
looks relevant is a pointer under `Agent notes`, never a
reframing of the text above it.

If the agent has already supplied such a term in conversation,
that is noted in `Agent notes` so a later reader can tell which
words are the user's and which were handed to them.

## File shape

`sketch/<slug>.md`:

```
# <slug>

## YYYY-MM-DD

<the picture, verbatim>

---

### Agent notes

<questions, pointers, contamination warnings; optional>
```

## Leaving stage 0

A sketch is promoted by writing `hypotheses/<slug>.md` that
names the sketch it came from. The sketch is not moved, edited,
or archived when this happens. It stays as the record of what
the picture was before a frame was chosen, and it is what the
work returns to when a frame is discarded.
