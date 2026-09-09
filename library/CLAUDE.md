# library/

A canonical source library. Every paper, book, statute, opinion,
patent and archival document that any project cites lives here,
filed by discipline. There are no per-project libraries.

**This template ships it empty.** Sources are the user's to add,
and a template carrying them would distribute other people's
copyrighted material. What ships is this contract and the
`_template/notes.md` field list.

**This directory is portable and is meant to be.** It moves
between projects whole, so it carries its own filing convention
in this file rather than depending on any project's rules. The
corollary is the constraint below on what may not live here.

## Nothing project-specific

The library holds sources and notes on sources. It does not hold
session state, handoffs, task lists, search logs, prior-art
positioning, or any analysis of how a project's own results
stand against the literature. Those belong to the project that
produced them and do not travel with the library.

The test: if a file would be wrong, stale, or meaningless after
this directory is copied into a different project, it does not
belong here.

## Filing

Two shapes, both under a discipline directory.

    <domain>/<author>/<publication>/notes.md
    <domain>/<author>/<publication>/<publication>.pdf

for a source held as a file, and

    <domain>/<short-name>.md

for a source whose file is not held, or where a single note is
the whole of what is kept. Author directories are lowercase and
spell out every author joined by `and`.

`_template/notes.md` is the field-list reference: required
bibliographic fields by source type, and the content discipline
for a `notes.md` body. It sits outside the domain pattern
deliberately.

## Domains

Domains exist when populated. Add a new domain named for the
discipline if a source lands that does not fit. Do not force a
fit. Empty domains stay; they receive filings as they arrive.

Multi-domain works file under the primary domain for the use
that prompted the filing. A work cited from a second discipline
later is not re-filed; it is pointed at.

## Filing model -- just-in-time

Filing happens when a project cites a source, not on a sweep.
When a claim, framing pass, or draft calls a source, that source
files at that moment with `notes.md` extracting the load-bearing
material against the actual use.

**A source held without a `notes.md` is normal and is not a
backlog.** Notes are written against a use; a source with no use
yet has nothing to extract.

## The holding pool, if one arrives

A library that migrates in from elsewhere may bring a
`library-migration-temporary/` directory: a permanent grep-able
holding pool for material that has not been filed by discipline.
Duplicates within it are expected. **It is not a backlog to clear
on a schedule, and it is not deleted.** A fresh library has none,
and one is not created empty.

## Deletion

Nothing here is deleted by an agent. Superseded material moves
to the using project's `.archive/` with a pointer left in place,
and the user performs any actual deletion.
