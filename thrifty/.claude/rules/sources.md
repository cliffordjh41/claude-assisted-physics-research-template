# Sources

This kit's behavior, APIs, and accessibility decisions stand on official
sources — not memory. When a component implements a spec'd pattern (an ARIA
role, a keyboard interaction, a Radix / Tailwind / React API), verify it
against the source before writing or changing it, and again when auditing it.

## Where to check

Prefer local clones of the official repos if you keep them (offline, no
third parties); point the agent at wherever you cloned them:

- `aria-practices/` — W3C ARIA Authoring Practices (roles, keyboard patterns).
- `radix-ui-primitives/`, `radix-ui-website/` — Radix component APIs + guides.
- `react-dev/` — React docs.
- `tailwindcss-com/` — Tailwind docs.

If a mirror is absent, use the canonical site (`w3.org/WAI`, `radix-ui.com`,
`react.dev`, `tailwindcss.com`). Official sources only — no third-party blogs.

## Citing

Where a behavior is load-bearing — an accessibility pattern, a non-obvious API
contract — cite the source at the point of use: a one-line reference in the
component docstring (spec + clause, or a stable doc URL), and in the CHANGELOG
when it drove a change. Read the cited passage before citing it; don't cite a
clause you haven't read.

Lightweight by design: no formal citation format, no separate citation files.
The complete-enough reference at the point of use is the record.
