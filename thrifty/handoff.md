# thrifty — handoff

Current state + forward work. Rewritten as state changes. Older audit/cleanup
logs are archived under `.archive/`; superseded 0.1.0/0.2.0 planning detail
(the 2026-06 direction calls and PR breakdowns) lives in git history.

## Current state — thrifty-ui 0.2.0, published

`thrifty-ui` is public: **0.2.0 on npm**, mirrored to
`github.com/cliffordjh41/thrifty-ui` (v0.2.0 release, About text matched to the
npm description; the mirror README rode the 0.2.0 source push and wasn't
separately re-read). `PUBLISH.md` (repo root) is the release + re-mirror
runbook.

> **README status line — GitHub synced, npm pending (2026-07-10).** The
> README's status line read `0.1.0`; corrected to `0.2.0` in `thrifty/README.md`.
> The **GitHub mirror is now current** — pushed the one-line fix directly onto
> the mirror's history (normal push, no force, no re-mirror). **npm still shows
> `0.1.0`**: npm serves the latest *published version's* README and versions are
> immutable, so the npm page won't update until a new publish. Not worth a
> `0.2.1` for one doc line — let npm ride the next real change.

The published surface is **primitives + shell + theming panels + one showcase
panel + a Claude authoring stack** — deliberately not a panel catalog:

- **Primitives / shell:** `usePanelChrome` (the headline — see below),
  `SlidableColumn`, `ColumnToolBar` + `BottomBar` (0.2.0 split these; desktop
  vs mobile is composed by the host, not forked on `isMobile` inside one
  component), `Drawer`, `Sheet`, `Popup`, `SlidingPanels`, `ThemeScope`,
  color-utils, Radix wrappers, hooks (incl. `useAnchoredZoom` — asymmetric
  artboard zoom).
- **Theming panels (extracted from studio into the kit):** `ColorPanel` (with
  working Undo + Copy CSS), `StylePanel`, `TypographyPanel`, `EffectsPanel`,
  `themeToCss`, and the default-theme data (`DEFAULT_THEME` / `THEME_PRESETS` /
  `generateTheme`). `ColorPanel`'s prop is `mode` (renamed from `colorMode` in
  0.2.0).
- **MusicPlayer** — the single showcase panel: exercises `usePanelChrome` in
  both modes (transport hoists to a host footer slot or falls back inline),
  backed by the module-scoped `useAudioPlayer` singleton, a 30fps FFT channel
  (`subscribeFrequency`), and visualizer tiles recolored from the same
  `--theme-*` tokens that drive the kit.
- **Claude Code authoring stack** (`.claude/` shipped in the public repo):
  rules for the chrome contract, `panelData`-typed presentational panels, and
  "public API = the `package.json` exports paths"; a `panel-from-template`
  skill; the repo-root `CLAUDE.md`.

Any 18-panel inventory in older revisions is **pre-cull**. The rest (Wallet,
ProductPortal, Messages, Marquee, Library, Journal, Gate, Announce,
Attributions, CircleOfFifths, plus the 6 the site now owns app-locally) were
archived to `.archive/panels-cull-2026-06-23/` — reversible.

## The chrome primitive (`usePanelChrome`)

`src/hooks/use-panel-chrome.tsx` is the single mechanism for header/footer
chrome, and the product's one deliverable: a panel renders correctly in a
desktop column, a mobile sheet, a dialog, or a drawer **without knowing which
host it's in**. A panel declares whichever chrome it has as **content only** (no
slot border/height). The hook:

- **Host provides `onHeader`/`onFooter`** → hoist that piece into the host's
  slot (a column/sheet/dialog/drawer header or footer).
- **No host callback** → render that piece inline, wrapped in a matching `h-11`
  bordered slot, so the panel is self-contained in a bare body.
- No header/footer → pass neither, render neither.

That is what makes desktop/mobile portability free: one code path, no
`useIsMobile` branching or media queries inside the panel. Pass MEMOIZED chrome
nodes (`useMemo` with real deps) so the hoist effect only re-pushes on real
changes; hosts pass stable setters so it can't loop. The panels are **examples**
of the primitive in real surfaces, not the product.

## Accessibility

- **jsdom suite** (`pnpm test`) — Radix wrappers, menus, dialogs, forms,
  panels, keyboard-nav + focus-trap. Structural CI gate; inherits Radix focus
  management and verifies the wrappers haven't broken it.
- **Real-browser per-panel sweep**: `scripts/a11y-sweep.mjs` (Playwright + axe,
  full ruleset incl. contrast) against the studio on :5173. 0.2.0 landed a11y
  fixes for `Combobox`, `Tree`/`TreeItem`, `Sortable`, and `Drawer` (see
  CHANGELOG). Re-run against the current surface when it changes.

## Forward work — parked, nothing scheduled

The releases shipped and Cliff has stepped back from active kit work. Parked:

- **ThemeScope extensions** — the gaps if theming is pushed past Radix Themes +
  Tailwind: portal-aware theming (Radix portals escape ThemeScope and read
  `:root` — ship an auto-wrapper or expose theme via context), N named modes
  beyond the built-in A/B pair, and CSS transitions on variable swaps without
  flashing on first paint.
- **Artboard host-shell** — the slidable-columns-for-design showcase over
  `useAnchoredZoom` (wheel-in anchors on the cursor, wheel-out recenters to
  home). Built as cliffordjh's `/artboard`; folding it into a studio showcase
  is unstarted.

**Dropped** (no promotion push — Cliff, 2026-07): the launch write-up, the
`apps/docs/` docs application, the hosted theme exporter, and the standalone
Library / Links / Resume panels.

## Pointer

Release-drop detail is archived at
`.archive/release-docs-2026-07-03/RELEASE.md`. Last journal entry:
`journals/journal-01.md`.
