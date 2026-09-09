# Changelog

All notable changes to thrifty-ui are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow semver.

## [0.2.0] — 2026-06-29

### Added

- **`BottomBar`** — a generic, items-driven mobile bottom bar (icon controls
  pinned to the bottom edge). The host supplies its own items, so the kit no
  longer bakes in any one app's panel names. APG Toolbar semantics
  (`role="toolbar"` + roving tabindex via `useRovingTabindex`).

### Changed

- **BREAKING — `ColumnToolBar` is now desktop-only and a real APG Toolbar.**
  Removed the `isMobile` prop and the mobile-bar render path (and its
  `activeMobileSheet` / `onLeftClick` / `onRightClick` / `onLeftFooterClick` /
  `onRightFooterClick` / `onPrevPanelClick` / `onNextPanelClick` props). The
  mobile bar was a different surface fused into the same component via a boolean
  branch, with studio-specific panel labels hardcoded into the kit. Compose a
  `BottomBar` in the host and choose `isMobile ? <BottomBar …> : <ColumnToolBar …>`
  there. `ColumnToolBar` now renders `role="toolbar"`, an accessible label, and
  arrow / Home / End roving among its controls; icon-only buttons carry
  `aria-label`, and the hide toggles carry `aria-pressed`.
- **BREAKING — `ColorPanel`'s `colorMode` prop renamed to `mode`** to match the
  rest of the kit (`useThemeRoot(theme, mode)`, `ThemeScope`, `ThemeModeToggle`,
  `EffectsPanel`), which all already used `mode`.

### Fixed (accessibility)

- **`Combobox`** — the trigger hardcoded `aria-expanded={undefined}`, masking the
  open state; removed so Radix's `PopoverTrigger` supplies the real value.
- **`Tree` / `TreeItem`** — implemented the APG Treeview pattern: `role="tree"` /
  `treeitem` / `group`, `aria-expanded` / `aria-selected`, one tab stop, and
  arrow / Home / End / Enter / Space keyboard navigation via roving tabindex.
  Previously had no tree semantics or keyboard support.
- **`Sortable`** — added a keyboard path (Space/Enter to grab, arrows to move,
  Esc to cancel), `role="list"` / `listitem` semantics, and an assertive live
  region announcing grab / move / drop. Previously pointer-only with no ARIA.
- **`Drawer`** — applies `inert` + `aria-hidden` when closed so its offscreen
  content leaves the tab order and accessibility tree; added a `label` prop and
  `role="region"`.

### Removed

- **App-domain hooks dropped from the public API** — `useResume`, `useNotes`,
  `useLinks` were CRUD domain models, not UI primitives; they don't belong in a
  UI foundation. (Archived, not deleted.)

## [0.1.0] — 2026-06-25

First public release.

### Added

- **`usePanelChrome`** — the host-agnostic panel-chrome primitive ("one panel,
  four hosts"): a panel's header/footer hoists into a host's slot when the host
  supplies `onHeader`/`onFooter`, or renders inline otherwise.
- **Shell** — `SlidableColumn` (draggable, off-edge-hideable columns),
  `ColumnToolBar`, `Sheet`, `Drawer`, `Popup`, `SlidingPanels`.
- **Theming** — `ThemeScope` / `useThemeRoot`, `ColorPanel` (with Undo +
  copy-CSS), `StylePanel`, `TypographyPanel`, `EffectsPanel`, `themeToCss`,
  `DEFAULT_THEME`, `THEME_PRESETS`, `generateTheme`.
- **Radix wrappers** — Dialog, AlertDialog, Popover, HoverCard, Select,
  Combobox, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Tabs, Toolbar,
  Toggle, Form, and more.
- **Hooks** — `useAudioPlayer` (+ `subscribeFrequency`), `useAnchoredZoom`,
  `useMouseParallax`, `useSwipeDismiss`, `useRovingTabindex`,
  `useFocusOnChange`, `useViewTransition`, `usePanelChrome`.
- **`MusicPlayerPanel`** — showcase panel exercising the chrome primitive over
  the audio singleton + theme-coupled FFT visualizer.
- **Claude Code authoring stack** — `.claude/` rules + a `panel-from-template`
  skill for scaffolding panels against the chrome contract.

[0.1.0]: https://github.com/cliffordjh41/thrifty-ui/releases/tag/v0.1.0
