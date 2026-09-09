# thrifty — audit + cleanup record, 2026-05-25

Historical detail of the panel audit and apparatus-strip cleanup completed
2026-05-25. Current state and forward work live in `thrifty/handoff.md`; this
file is the "what happened" log moved out of the handoff.

## Panels cut (16 → archived to `.archive/cut-panels-2026-05-25/`)

Book, BrandKit, CardGame, Contact, FlipCard, Folio, Lattice, SubstrateLattice2D,
Page, Tattoo, Icons, HoloText, DataTable, Credential, Form, Video.

(Library started at 32 panels; 17 remain after the cuts + the new Journal panel.)

## Cleanup pass — completed

- **panel-catalog** — `apps/studio/src/data/panel-catalog.ts` archived to
  `apps/studio/.archive/dashboard-apparatus-2026-05-25/` (dead; no importers).
- **Carousel scaffolding** — removed the temporary studio-carousel
  Consumer/Provider toggle + `role` plumbing.
- **Role removal** — removed `role` / `liveData` from `PanelProps`. Stripped the
  role-gated UI from the three panels that read it:
  - AIChat — BYOK key/model dropped → plain chat shell (Export/Clear kept).
  - Messages — `liveData` inbound dropped.
  - MusicPlayer — defaults read-only (`isReadOnly = true`); the manage UI is
    retained dormant, to be re-exposed as the panel's standalone props.
  - cliffordjh `Layout` — `role="consumer"` props removed from its AIChat mounts.
- **Apparatus strip** — deleted every panel's `*ConfigSurface` function + `meta`
  export; un-exported (or removed genuinely-dead) `defaultConfig`; removed
  orphaned imports. ~1,600 lines deleted across 16 panels.
  - *Deliberate side effect:* the CSV/JSON file-import that lived inside the
    Calendar/Journal/Library ConfigSurfaces went with them. Intentional — it was
    overkill for hand-entry tools; Library will get proper PDF upload instead.
- **Rename** — `PaperReaderPanel` → `PdfReaderPanel` (file, export, consumers).

## Other panel work this session

- **Calendar** rewritten to a three-view drill-in (month grid → day list → entry
  editor), model `{date,time,heading,body}`, day-list drag reassigns time slots
  by position, `onData` on save/delete.
- **Journal** added — Calendar's sibling: dated free-text, day list not sortable,
  `time` a read-only creation stamp.
- **SlidingPanels** transition retuned `duration-300 ease-in-out` →
  `duration-[400ms] ease-out` (all consumers).
- **DepthPanel** — footer "N layers" label + decorative depth dots removed.

## Bug resolved

- **PdfReader "Invalid PDF structure"** — origin mismatch, not the reader. The
  demo `/examplepdf.pdf` was only in `studio/public`, so through cliffordjh's
  `/demo` route it 404'd and pdfjs received cliffordjh's `index.html` (the
  hex-parse warnings decode to `<!doctype html><script>`). Fixed by copying
  `examplepdf.pdf` into `apps/cliffordjh/public/`. Browser confirm still pending.

All three packages tsc-clean after the pass (apart from the pre-existing thrifty
`vite/client` tsconfig error).
