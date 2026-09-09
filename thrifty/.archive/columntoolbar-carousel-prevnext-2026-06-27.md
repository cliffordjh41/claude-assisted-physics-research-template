# ColumnToolBar — mobile prev/next slots (carousel leftover)

Archived 2026-06-27. Removed from
`thrifty/src/components/ui/tool-bar.tsx` (mobile branch).

These two slots drove a preview carousel that was retired with the
minimal-kit cull. Studio (the only `ColumnToolBar` consumer) had already
stopped passing the handlers, so the arrows rendered as dead taps in the
mobile bottom bar between Typography and Effects. Removing the slots
returns the mobile bar to 4 evenly-spaced slots:
`[Style] [Typography] [Effects] [Color]`.

## Removed

Imports (`lucide-react`):

```ts
ArrowLeft,
ArrowRight,
```

Props (`ColumnToolBarProps` + destructuring):

```ts
onPrevPanelClick?: () => void
onNextPanelClick?: () => void
```

Mobile `items` entries:

```tsx
{ label: "Prev", icon: ArrowLeft, onClick: onPrevPanelClick },
{ label: "Next", icon: ArrowRight, onClick: onNextPanelClick },
```

## Restore

Re-add the two imports, the two props (interface + destructuring), and
the two `items` entries between the Typography and Effects slots. A
consumer then wires `onPrevPanelClick` / `onNextPanelClick` to whatever
carousel/preview position state replaces the retired one.
