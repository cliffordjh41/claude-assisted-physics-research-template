#!/usr/bin/env python3
"""Regenerate `prior-art/library-index.md` by walking `library/`.

Once the library is large enough that an agent cannot discover what is in it by
listing directories, the failure that costs is specific: a citation gets
resolved against a web API for a source that was already on disk. The index
exists so that a grep answers "do we hold this?" before a search is run.

Derived data. Never edited by hand; re-run this instead.

    python3 tools/index_library.py

Two filing shapes are indexed, matching `library/CLAUDE.md`:

    <domain>/<author>/<publication>/   with notes.md and/or a source file
    <domain>/<short-name>.md           a note whose source file is not held

`library-migration-temporary/` is summarised by count only. It is a holding
pool, deliberately unfiled, and enumerating it would bury the filed corpus.
"""
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir)
LIB = os.path.join(ROOT, "library")
OUT = os.path.join(ROOT, "prior-art", "library-index.md")
POOL = "library-migration-temporary"
SOURCE_EXT = (".pdf", ".djvu", ".epub", ".txt", ".ps")


def works():
    """Yield (domain, author, publication, has_source, has_notes)."""
    for domain in sorted(os.listdir(LIB)):
        dpath = os.path.join(LIB, domain)
        if not os.path.isdir(dpath) or domain.startswith("_") or domain == POOL:
            continue
        for entry in sorted(os.listdir(dpath)):
            epath = os.path.join(dpath, entry)
            if os.path.isfile(epath) and entry.endswith(".md"):
                yield domain, "", entry[:-3], False, True
            elif os.path.isdir(epath):
                for pub in sorted(os.listdir(epath)):
                    ppath = os.path.join(epath, pub)
                    if not os.path.isdir(ppath):
                        continue
                    files = os.listdir(ppath)
                    has_src = any(f.lower().endswith(SOURCE_EXT) for f in files)
                    yield domain, entry, pub, has_src, "notes.md" in files


def main():
    rows = list(works())
    pool = sum(len(f) for _, _, f in os.walk(os.path.join(LIB, POOL)))
    n_src = sum(1 for r in rows if r[3])
    n_notes = sum(1 for r in rows if r[4])
    domains = sorted({r[0] for r in rows})

    out = []
    out.append("# Library index")
    out.append("")
    out.append("**Derived data. Do not edit.** Regenerate with "
               "`python3 tools/index_library.py`.")
    out.append("")
    out.append(f"`library/` holds **{len(rows)} filed works across "
               f"{len(domains)} disciplines**, {n_src} carrying a source file "
               f"and {n_notes} carrying a note. "
               f"`library/{POOL}/` holds a further **{pool} files** as an "
               "unfiled, deliberately grep-able pool, summarised here by count "
               "and not enumerated.")
    out.append("")
    out.append("A work with a note but no source file is a source read "
               "elsewhere and recorded here; a work with a source file but no "
               "note has not yet been cited, which is the just-in-time filing "
               "model in `library/CLAUDE.md` and not a backlog.")
    out.append("")
    out.append("Paths are relative to the repository root. `src` marks a held "
               "source file, `note` a `notes.md` or a domain-level note.")
    out.append("")
    for d in domains:
        sub = [r for r in rows if r[0] == d]
        out.append(f"## {d} ({len(sub)})")
        out.append("")
        for _, author, pub, has_src, has_notes in sub:
            flags = " ".join(x for x in ("src" if has_src else "",
                                         "note" if has_notes else "") if x)
            path = (f"library/{d}/{author}/{pub}/" if author
                    else f"library/{d}/{pub}.md")
            out.append(f"- `{path}` -- {flags or 'empty'}")
        out.append("")
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    print(f"{OUT}: {len(rows)} works, {len(domains)} disciplines, "
          f"{n_src} with a source file, {n_notes} with a note, "
          f"pool {pool} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
