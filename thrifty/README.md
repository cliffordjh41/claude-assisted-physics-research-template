# thrifty-ui

A Radix + Tailwind React UI **foundation**, not a comprehensive component
catalog. It hands you the parts that are tedious to stand up yourself — an
accessible primitive layer, a slidable-column shell, live theming — built
around one sharp idea (`usePanelChrome`), plus a **Claude Code authoring
stack** so you can grow it into your own kit instead of starting from a blank
page.

It's deliberately small. The point isn't breadth; it's a clean base you extend.

- **MIT**, React 19, Tailwind v4.
- Ships as **source** (TypeScript/TSX) — your bundler + Tailwind compile it, so
  utility classes and theme tokens resolve in your app with no extra step.

> Status: `0.2.0`. Expect a focused surface, not a kitchen sink.

## The idea: one panel, four hosts

The headline primitive is **`usePanelChrome`**. A panel declares its
header/footer as *content only* — it doesn't know or care where it's mounted.
The hook does the rest:

- If the **host supplies `onHeader`/`onFooter`** (a column, a sheet, a dialog,
  a drawer), the panel's chrome is hoisted into that host's slot.
- If **no host callback** is present, the same chrome renders inline in a
  matching bordered slot, so the panel is self-contained in a bare body.

So the *same* panel renders correctly in a desktop column, a mobile bottom
sheet, a dialog, or a drawer — no `useIsMobile` branching, no media queries,
no per-host variants inside the panel. Desktop/mobile portability falls out of
the primitive for free.

```tsx
import { usePanelChrome } from "thrifty-ui"

function MyPanel({ onHeader, onFooter }) {
  const header = useMemo(() => <h2>Title</h2>, [])
  const footer = useMemo(() => <button>Action</button>, [])
  // Pass MEMOIZED nodes so the hoist only re-pushes on real changes.
  const { header: h, footer: f } = usePanelChrome({ onHeader, header, onFooter, footer })
  return (
    <div className="flex flex-col h-full">
      {h}
      <div className="flex-1 overflow-auto">…body…</div>
      {f}
    </div>
  )
}
```

## What's in it

- **The chrome primitive** — `usePanelChrome`.
- **The shell** — `SlidableColumn` (draggable, off-edge-hideable columns),
  `ColumnToolBar`, `Sheet`, `Drawer`, `Popup`, `SlidingPanels`.
- **Theming** — `ThemeScope` / `useThemeRoot` (scoped or `:root` CSS-variable
  theming), a `ColorPanel` picker (with Undo + copy-CSS), `StylePanel`,
  `TypographyPanel`, `EffectsPanel`, `themeToCss`, a `DEFAULT_THEME` and a
  `generateTheme` helper.
- **Radix wrappers** — Dialog, Popover, Select, Combobox, Menus, Tabs, Form,
  Toolbar, and more (accessibility inherited from Radix).
- **Hooks** — `useAudioPlayer` (+ FFT `subscribeFrequency`), `useAnchoredZoom`,
  `useMouseParallax`, `useSwipeDismiss`, `useRovingTabindex`, and others.
- **A showcase panel** — `MusicPlayerPanel`, which exercises the chrome
  primitive in both modes (its transport hoists to a footer slot, or falls
  back inline) over the audio singleton + theme-coupled visualizer.

### Feeding the MusicPlayer

`MusicPlayerPanel` is controlled and presentational. Pass playlists in through
`panelData` — `{ playlists: [{ id, name, tracks: [{ id, title, url }] }] }` —
and turn on editing with presence-driven callbacks: each affordance renders
only when its handler is supplied.

- `onCreatePlaylist` / `onRenamePlaylist` / `onDeletePlaylist` / `onReorderPlaylists`
- `onAddTrack` (opens a file picker) / `onRemoveTrack` / `onReorderTracks`

Omit them all for a read-only player. The host owns the playlist state and its
persistence; the panel renders that data and reports edits back through the
callbacks.

## Install

```bash
npm i thrifty-ui
# peers:
npm i react react-dom
```

Requires **Tailwind v4**. Import the kit's base styles once, and make sure
Tailwind scans the package source so its utilities are generated:

```css
/* your app's CSS entry */
@import "tailwindcss";
@import "thrifty-ui/styles.css";
@source "../node_modules/thrifty-ui";
```

```tsx
import { ThemeScope, DEFAULT_THEME, MusicPlayerPanel } from "thrifty-ui"

export function App() {
  return (
    <ThemeScope theme={DEFAULT_THEME}>
      <MusicPlayerPanel />
    </ThemeScope>
  )
}
```

For top-level theming that also reaches Radix portals (sheets, dialogs,
popovers), use `useThemeRoot(theme, mode)` instead of `ThemeScope`.

## The Claude Code authoring stack

thrifty-ui ships a `.claude/` stack — rules that teach an agent the kit's
contracts (the `usePanelChrome` host-claims-or-falls-back model, `panelData`
typing, the public API surface) plus a `panel-from-template` skill — so if you
build with Claude Code, the agent scaffolds new panels correctly against the
primitive. It's the fastest way to extend the foundation into *your* kit; if
you don't use Claude Code it's inert and harmless.

## Over Radix Themes + Tailwind alone

Radix gives you accessible primitives; Tailwind gives you styling. thrifty-ui
adds the layer between them that you'd otherwise hand-roll: the host-agnostic
panel-chrome contract, a draggable column shell, CSS-variable theming with a
live picker and copy-to-CSS, and the agent stack to author against it.

## License

MIT © Clifford James Heenan
