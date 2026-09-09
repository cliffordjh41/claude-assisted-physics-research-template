#!/usr/bin/env python3
"""PreToolUse hook (Bash): block deletion commands.

Deletion is user-managed here. The agent moves files to .archive/ instead,
with the user's sign-off; genuine deletes are run by the user directly. This
hook is the deterministic backstop for the preservation rule.
"""
import json
import re
import sys

REASON = (
    "Deletion is disabled in this directory. Move the file to .archive/ "
    "instead (preservation), and only with the user's sign-off. To genuinely "
    "delete, the user runs the command themselves."
)

# Deletion vectors, matched as command tokens (not substrings). A leading
# boundary plus a trailing space/end keeps paths like ./farm or rm.txt clear.
PATTERNS = [
    r"(?:^|[\s;&|(])(?:/usr/bin/|/bin/|command\s+|\\)?rm(?:\s|$)",
    r"(?:^|[\s;&|(])rmdir(?:\s|$)",
    r"(?:^|[\s;&|(])unlink(?:\s|$)",
    r"(?:^|[\s;&|(])git\s+rm(?:\s|$)",
    r"(?:^|[\s;&|(])find\s.*(?:-delete|-execdir\s+rm|-exec\s+rm)",
    r"(?:^|[\s;&|(])shred(?:\s|$)",
    r"(?:^|[\s;&|(])srm(?:\s|$)",
    r"(?:^|[\s;&|(])trash(?:\s|$)",
    r"(?:^|[\s;&|(])xargs\s+(?:-\S+\s+)*(?:/usr/bin/|/bin/)?rm(?:\s|$)",
]


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)  # unparseable input: defer to the normal permission flow
    cmd = (data.get("tool_input") or {}).get("command", "") or ""
    for pat in PATTERNS:
        if re.search(pat, cmd):
            print(json.dumps({
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": REASON,
                }
            }))
            sys.exit(0)
    sys.exit(0)


if __name__ == "__main__":
    main()
