#!/usr/bin/env python3
"""PreToolUse hook (Write/Edit): block emojis and pictographic glyphs in
filed-artifact content.

Scans content being written for emoji / pictographic characters and banned
status glyphs (checkmarks, crosses, stars). Mathematical Unicode is
deliberately NOT blocked: arrows (U+2190-U+21FF), technical symbols
(U+2300-U+23FF), operators, and Greek letters all pass, so physics notation
is unaffected. Ranges are integer codepoints, so this file stays pure ASCII
and editable without tripping its own rule.
"""
import json
import sys

# (low, high) inclusive codepoint ranges for emoji / pictographic glyphs.
EMOJI_RANGES = [
    (0x1F000, 0x1FAFF),  # emoji, pictographs, supplemental symbols
    (0x2600, 0x26FF),    # miscellaneous symbols
    (0x2700, 0x27BF),    # dingbats (checkmarks, crosses, scissors, etc.)
    (0x2B00, 0x2BFF),    # misc symbols and arrows (stars, etc.)
    (0xFE00, 0xFE0F),    # variation selectors (emoji presentation)
    (0x200D, 0x200D),    # zero-width joiner (emoji sequences)
]

REASON = (
    "Emojis and pictographic glyphs are not allowed in filed artifacts "
    "(includes checkmarks, crosses, stars). Use plain-text status markers "
    "(\"done\", \"pending\", \"open\"). Mathematical Unicode is fine."
)


def has_emoji(text):
    for ch in text:
        o = ord(ch)
        for lo, hi in EMOJI_RANGES:
            if lo <= o <= hi:
                return True
    return False


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)
    ti = data.get("tool_input") or {}
    # Write -> content; Edit -> new_string; collect candidate text fields.
    text = " ".join(
        str(ti.get(k, "") or "") for k in ("content", "new_string", "new_str")
    )
    if has_emoji(text):
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
