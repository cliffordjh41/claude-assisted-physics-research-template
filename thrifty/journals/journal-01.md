# journal-01

Append-only log for `thrifty`. Entries chronological, one per
session or per shipped feature. Pointer plus one-clause subject
per artifact; the work lives in commits and code, not the
journal.

## 2026-05-23 — initial scaffold

Workspace scaffolded at `/Users/cliff/Desktop/cliffordjh/`.
Source copied from prior `@cjh-works/ui` workspace; package
renamed to `thrifty-ui`; directory named `thrifty/`.
`pnpm install` clean. Initial migration committed in
`649a02b`; bug fix in `01f053f` (see below).

- `package.json` — name `thrifty-ui`, exports surface
  unchanged from prior.
- `CLAUDE.md` — per-directory rules.
- `program/statement.md` — purpose and scope.
- `src/` — inherited component catalog; not yet re-audited
  against current rules. Audit triggers on next touch per
  scope rule.

Studio rendered broken on first dev-server load after
migration; root cause was a stale Tailwind `@source` path in
`apps/studio/src/index.css` (still pointing at the prior
`cjh-works` directory structure). Bulk sed during the migration
renamed package identifiers but not relative paths. Fix in
`01f053f`. Lesson: any future cross-package migration in this
workspace should grep for relative paths in addition to
package identifiers.

## 2026-06-29 — 0.2.0: a11y + API audit, published

Audited the published kit against official sources (W3C APG, Radix, Tailwind,
React) and shipped 0.2.0 to npm. Split `ColumnToolBar` into a desktop-only APG
toolbar plus a new generic `BottomBar` (it had been one component branching on
`isMobile` with studio-specific labels baked in). Fixed a11y on `Combobox`
(aria-expanded), `Tree` (APG treeview + keyboard + roving), `Sortable`
(keyboard reorder + list semantics + live region), `Drawer` (inert/aria-hidden
when closed). Renamed `ColorPanel` `colorMode` → `mode`. Removed app-domain
hooks (`useResume`/`useNotes`/`useLinks`) from the public API. Consumers
(studio, cliffordjh) updated to stay green. Scrubbed internal refs from
shipped code/docs before publishing + mirroring.

- `src/components/ui/{tool-bar,bottom-bar,tree,sortable,drawer,combobox}.tsx`
- `src/components/ui/dnd-tree.a11y.test.tsx` — new a11y/keyboard tests (49/49)
- `.claude/rules/sources.md` — new source-checking rule
- CHANGELOG.md — [0.2.0]; published to npm; `cliffordjh41/thrifty-ui` synced
- External: `cliffordjh41/thrifty-starter` GitHub template stood up
