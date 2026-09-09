#!/usr/bin/env python3
"""PostToolUse hook (Bash): append cargo test / run / bench invocations and
their output to runs/YYYY-MM-DD.log.

The discipline this directory runs on is that no pass language precedes
output being seen. That rule is unenforceable across sessions without a
record: a later session reading "pass" in a journal entry has no way to
tell whether output was read or asserted. This hook makes the record
automatic, so a result is checkable against what the machine printed
rather than against a claim about it.

Two things this has to get right, both learned from getting them wrong:

1. A substring match on "cargo test" fires on any command that merely
   contains the phrase -- a heredoc writing documentation about cargo, a
   grep for it, a python script with it in a string. Those entries look
   like runs in the log and make the whole record untrustworthy. So the
   command is parsed: heredoc bodies are stripped, the pipeline is split
   into segments, and a segment counts only when cargo is the command
   being invoked in it.

2. A cargo invocation piped through head/tail/grep reaches the tool as
   already-truncated output. Logging that silently produces a record that
   claims to be a full run and is not. Truncation is detected from the
   pipeline and stamped on the entry.

Silent on success. Never blocks: a logging failure must not stop work.
"""
import datetime
import json
import os
import re
import sys

ROOT = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
LOGDIR = os.path.join(ROOT, "runs")

SUBCOMMANDS = ("test", "run", "bench")
# Downstream stages that drop or reshape output before the tool sees it.
TRUNCATORS = ("head", "tail", "grep", "sed", "awk", "cut", "wc", "tr",
              "sort", "uniq", "jq", "rg")
HEREDOC = re.compile(r"<<-?\s*(['\"]?)([A-Za-z_][A-Za-z0-9_]*)\1")
ENV_ASSIGN = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*=\S*$")


def strip_heredocs(command):
    """Remove heredoc bodies. Their contents are data, not commands, and
    matching inside them is how the log fills with phantom runs."""
    lines = command.split("\n")
    out, i = [], 0
    while i < len(lines):
        line = lines[i]
        out.append(line)
        m = HEREDOC.search(line)
        i += 1
        if not m:
            continue
        tag = m.group(2)
        while i < len(lines) and lines[i].strip() != tag:
            i += 1
        i += 1  # drop the terminator too
    return "\n".join(out)


def segments(command):
    """Split a command line into pipeline stages on ; && || | and newline."""
    return [s.strip() for s in re.split(r"\|\||&&|[;|\n]", command) if s.strip()]


def head_word(segment):
    """The command a segment actually invokes, past env assignments."""
    toks = segment.split()
    while toks and (ENV_ASSIGN.match(toks[0]) or toks[0] in ("env", "time",
                                                             "nice", "exec")):
        toks.pop(0)
    return toks


def classify(command):
    """(is_cargo_run, is_truncated). Truncation is only reported for a
    command that actually contains a cargo run."""
    cleaned = strip_heredocs(command)
    segs = segments(cleaned)
    hit = -1
    for idx, seg in enumerate(segs):
        toks = head_word(seg)
        if len(toks) >= 2 and toks[0] == "cargo" and toks[1] in SUBCOMMANDS:
            hit = idx
            break
    if hit < 0:
        return False, False
    downstream = [head_word(s)[:1] for s in segs[hit + 1:]]
    truncated = any(d and d[0] in TRUNCATORS for d in downstream)
    return True, truncated


def text_of(response):
    """Bash tool_response is a dict of stdout/stderr, or occasionally a
    bare string. Accept both rather than assuming one."""
    if isinstance(response, str):
        return response
    if not isinstance(response, dict):
        return ""
    parts = []
    for key in ("stdout", "output", "content"):
        val = response.get(key)
        if isinstance(val, str) and val:
            parts.append(val)
            break
    err = response.get("stderr")
    if isinstance(err, str) and err.strip():
        parts.append("[stderr]\n" + err)
    if response.get("interrupted"):
        parts.append("[interrupted before completion]")
    return "\n".join(parts)


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    command = str((data.get("tool_input") or {}).get("command", "") or "")
    is_run, truncated = classify(command)
    if not is_run:
        sys.exit(0)

    body = text_of(data.get("tool_response"))
    now = datetime.datetime.now()
    header = ["=" * 72, now.isoformat(timespec="seconds"),
              "cwd: %s" % (data.get("cwd") or ROOT)]
    if truncated:
        header.append(
            "TRUNCATED: output was piped before it reached the log. This "
            "entry is a fragment, not a record of the run. Re-run without "
            "the pipeline before citing any result from it."
        )
    entry = header + ["$ " + command.replace("\n", "\n  "), "-" * 72,
                      body if body.strip() else "(no output captured)", ""]

    try:
        os.makedirs(LOGDIR, exist_ok=True)
        path = os.path.join(LOGDIR, "%s.log" % now.strftime("%Y-%m-%d"))
        with open(path, "a", encoding="utf-8") as f:
            f.write("\n".join(entry) + "\n")
    except OSError:
        pass
    sys.exit(0)


if __name__ == "__main__":
    main()
