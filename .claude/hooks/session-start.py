#!/usr/bin/env python3
"""SessionStart hook: inject current state (handoff + last journal entry).

Stdout from a SessionStart hook is added to the model's context before the
first prompt, which makes the session-start protocol deterministic: the
handoff file and the most recent journal entry arrive whether or not the
model remembers to read them. The CLAUDE.md protocol remains the backstop
and the authority; this hook only front-loads the reading.

Fires on startup, resume, and clear (registered without a matcher in
settings.json, so all sources match).
"""
import os
import re
import sys

ROOT = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()


def read(path):
    try:
        with open(path, encoding="utf-8") as f:
            return f.read()
    except OSError:
        return None


def strip_html_comments(text):
    return re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)


def current_journal():
    """Highest-numbered journals/journal-NN.md, or None."""
    jdir = os.path.join(ROOT, "journals")
    try:
        names = os.listdir(jdir)
    except OSError:
        return None
    vols = sorted(n for n in names if re.fullmatch(r"journal-\d+\.md", n))
    if not vols:
        return None
    return os.path.join(jdir, vols[-1])


def last_entry(text):
    """The last '## ' section of a journal volume, comments stripped."""
    body = strip_html_comments(text)
    starts = [m.start() for m in re.finditer(r"(?m)^## ", body)]
    if not starts:
        return None
    return body[starts[-1]:].strip()


def main():
    parts = []
    parts.append(
        "[session-start hook] State below is injected from disk at session "
        "start. It substitutes for reading handoff.md and the journal tail; "
        "CLAUDE.md and .claude/rules/index.md (plus the always-on rules) "
        "still need to be read per the session-start protocol."
    )

    handoff = read(os.path.join(ROOT, "handoff.md"))
    if handoff is not None:
        handoff = strip_html_comments(handoff)
    if handoff is not None and handoff.strip():
        parts.append("--- handoff.md ---\n" + handoff.strip())
    else:
        parts.append("--- handoff.md ---\n(missing or empty)")

    jpath = current_journal()
    if jpath is None:
        parts.append("--- journal ---\n(no journal volume found)")
    else:
        text = read(jpath) or ""
        entry = last_entry(text)
        rel = os.path.relpath(jpath, ROOT)
        if entry is None:
            parts.append(
                "--- %s ---\n(no entries yet -- fresh volume)" % rel
            )
        else:
            parts.append("--- last entry of %s ---\n%s" % (rel, entry))

    sys.stdout.write("\n\n".join(parts) + "\n")
    sys.exit(0)


if __name__ == "__main__":
    main()
