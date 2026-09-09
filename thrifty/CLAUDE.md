# thrifty-ui

A small React UI foundation — Radix wrappers, a slidable-column
shell, panel-chrome, and CSS-variable theming — built around one
idea: `usePanelChrome`. This file orients an agent (Claude Code
or otherwise) working in this repo or in a project that consumes
`thrifty-ui`.

**Before building or editing any UI, read
`.claude/rules/authoring-panels.md`.** It is the chrome contract
that lets one panel render correctly in any host (column, sheet,
dialog, drawer). The `panel-from-template` skill scaffolds
against it.

## Stack

- React 19
- `@radix-ui/react-*` (used directly; no shadcn copy-paste tier)
- Tailwind 4
- TypeScript strict
- Vite
- pnpm

## Composition rules

- Wrap Radix primitives. Don't reimplement what Radix gives.
  Accessibility is inherited from Radix when used correctly;
  breaking it is a regression.
- Style with the kit's CSS-variable / Tailwind tokens
  (`bg-background`, `text-foreground`, `border-line`,
  `text-mute-fg`, `bg-mute`, …). Never hardcode hex colors; the
  theme drives the tokens.
- Choose boring technology. Established options first. A new
  dependency requires a stated reason tied to a concrete need.
- Rule of three: don't extract an abstraction until the same
  pattern appears in three concrete places. Three similar lines
  is better than a premature abstraction.
- The public API is the `package.json` "exports" paths. Paths
  not in "exports" are not public API — don't deep-import `src/`
  internals.

## Verification

Three checks, in order:

1. **Build clean.** `tsc` and the build complete with no errors.
   Warnings flagged.
2. **Behavior observed.** The component runs in a consumer app;
   you run the dev server and see it work. TypeScript passing is
   not sufficient.
3. **Accessibility, for interactive components.** Keyboard
   navigation works. axe-core passes. Screen-reader announces
   the expected role and state. WCAG 2.1 AA is the floor.

Don't claim a component works until all three pass.

## Working style

- One focused change at a time. No refactor-while-fixing — bug
  fixes don't ship with surrounding cleanup.
- Don't add features, abstractions, or backwards-compatibility
  shims beyond what the task requires.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`,
  `docs:`, `test:`, `style:`).
- No emojis in code, commit messages, docstrings, or written
  files.
- Docstrings explain *why* and surprising invariants, not *what*
  — well-named identifiers do that.
- Component names describe what they are, not what they're for.
  `Panel` not `StudioPanel`; `Drawer` not `SidebarDrawer`.

## Tests

- Unit: Vitest + Testing Library. Component-level behavior.
- Integration: Testing Library on multi-component flows.
- Distribution: many unit tests, fewer integration tests, few
  or zero E2E tests.

## Skills

User-invocable workflows at `.claude/skills/`. Added when a
workflow surfaces three times worth automating; premature skill
is the same failure mode as premature abstraction.

- `panel-from-template` — scaffold a panel using the Column /
  Sheet / Drawer / Panel anatomy against the `usePanelChrome`
  contract.

## Source layout

- `src/components/` — composed primitives organized by category.
- `src/hooks/` — shared hooks.
- `src/types/` — exported types.
- `src/contexts/` — React contexts.
- `src/lib/` — internal utilities.
- `src/store/` — shared stores.
- `src/assets/` — static assets.
- `src/data/` — shared data fixtures.
- `src/index.ts` — public exports.
- `src/index.css` — base styles.

Exports are surfaced via `package.json` "exports" field. Paths
not in "exports" are not public API.
