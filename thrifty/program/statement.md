# thrifty — program statement

Purpose and scope of the `thrifty` UI primitive library.

## What this is

UI primitive library for consumer apps. Radix wrappers + shared
layout/panel primitives + hooks + exported types. Package name
`thrifty-ui`.

## What it does

- Wraps Radix primitives with project conventions (Tailwind
  classes, exported types, controlled + uncontrolled patterns).
- Provides shared layout primitives (Column, Sheet, Drawer,
  Panel anatomy) used across consumer apps.
- Provides shared hooks (controlled state, focus management,
  etc.).
- Exports a stable public API via `package.json` "exports"
  field.

## What it doesn't do

- Doesn't reimplement what Radix already implements.
- Doesn't include app-specific components. Studio panels live
  in `apps/studio/`.
- Doesn't include consumer-specific brand identity. Brand is
  per-consumer, layered on top.

## Consumers

- `apps/studio/` (operational; first consumer).
- Future consumer apps under `apps/`.

## Dependencies

- `@radix-ui/react-*` primitives.
- Tailwind 4 (peer; consumer brings its own Tailwind config).
- React 19 (peer).

## Rules

See `CLAUDE.md` in this directory.
