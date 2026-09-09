import { useState } from "react"
import { ArrowLeft, FlaskConical, Activity } from "lucide-react"
import {
  SlidableColumn,
  SlidableColumnHeader,
  SlidableColumnContent,
  SlidableColumnHandles,
  ColumnToolBar,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  useIsMobile,
  cx,
} from "thrifty-ui"
import { SKETCHES } from "./sketches"
import { BridgeStatus } from "./sketches/Wasm"

// Lab workbench on the thrifty-ui slidable-column shell. The active sketch
// fills the viewport; two draggable columns overlay it, so sliding them
// off-edge reclaims the whole work surface. Dark theme (.theme-b). Adding a
// sketch to the registry in ./sketches is all it takes to extend the lab.
//
//   left   — the sketch registry, one button per entry
//   canvas — the active sketch, clipped above the bottom bar
//   right  — readout: the Rust/wasm bridge status and the active entry
//
// Desktop composes `ColumnToolBar` (reset / swap / align / hide); below the
// mobile breakpoint the columns hide and the same two bodies move into bottom
// sheets opened from a mobile bar. Per the kit's authoring contract the
// columns and the toolbar do not branch on viewport themselves — this host
// chooses the surface per breakpoint.
//
// `onBack` is optional: standalone (the lab's own main.tsx) renders no back
// affordance; an embedding host passes a callback to navigate out.

const TOOLBAR_PX = 32 // desktop ColumnToolBar height (h-8)
const MOBILE_BAR_PX = 48 // mobile bar height (h-12)

function barBtnClass(active: boolean) {
  return cx(
    "flex flex-1 items-center justify-center gap-1.5 text-[10px] uppercase tracking-(--theme-letter-spacing) transition-colors",
    active
      ? "bg-mute text-foreground"
      : "text-mute-fg hover:text-foreground hover:bg-mute/50",
  )
}

export function App({ onBack }: { onBack?: () => void } = {}) {
  const [active, setActive] = useState(SKETCHES[0].id)
  const [leftOffset, setLeftOffset] = useState(0)
  const [rightOffset, setRightOffset] = useState(0)
  const [leftHidden, setLeftHidden] = useState(false)
  const [rightHidden, setRightHidden] = useState(false)
  const [swapped, setSwapped] = useState(false)
  const [mobileSheet, setMobileSheet] = useState<"sketches" | "readout" | null>(
    null,
  )

  const isMobile = useIsMobile()
  const current = SKETCHES.find((s) => s.id === active)!
  const Current = current.Component

  const barPx = isMobile ? MOBILE_BAR_PX : TOOLBAR_PX
  const toggleSheet = (t: "sketches" | "readout") =>
    setMobileSheet((c) => (c === t ? null : t))

  const backButton = onBack && (
    <button
      type="button"
      onClick={onBack}
      aria-label="Back"
      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors"
    >
      <ArrowLeft className="size-3" />
      back
    </button>
  )

  // Shared bodies — rendered in the desktop columns and the mobile sheets.
  const sketchesBody = (
    <nav className="flex flex-col gap-1 p-2">
      {SKETCHES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setActive(s.id)}
          className={cx(
            "text-left px-3 py-2 rounded text-[11px] uppercase tracking-[0.15em] transition-colors",
            active === s.id
              ? "bg-mute text-foreground"
              : "text-mute-fg hover:text-foreground hover:bg-mute/50",
          )}
        >
          {s.label}
        </button>
      ))}
    </nav>
  )

  const readoutBody = (
    <div className="space-y-3 p-2">
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Bridge
        </p>
        <div className="rounded border border-line px-2 py-1.5">
          <BridgeStatus />
        </div>
      </div>
      <div className="space-y-1 border-t border-line pt-3">
        <p className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Active sketch
        </p>
        <div className="flex items-center justify-between rounded border border-line px-2 py-1.5 text-[11px] text-foreground/80">
          <span className="truncate">{current.label}</span>
          <span className="shrink-0 text-mute-fg">{current.id}</span>
        </div>
      </div>
      <div className="space-y-1 border-t border-line pt-3">
        <p className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Registry
        </p>
        <p className="text-[11px] text-mute-fg">
          {SKETCHES.length} {SKETCHES.length === 1 ? "entry" : "entries"} in
          src/sketches/index.ts
        </p>
      </div>
    </div>
  )

  // Root is `relative` (not `fixed`) on purpose: fixed would create a stacking
  // context and trap the mobile bar's z-60 beneath the thrifty Sheet (which
  // portals to document.body).
  return (
    <div className="theme-b relative h-dvh w-full overflow-hidden bg-background text-foreground select-none">
      {/* Canvas — clipping viewport above the bottom bar. The columns overlay
          it, so hiding them reveals the full sketch. */}
      <div
        className="absolute left-0 right-0 top-0 overflow-hidden"
        style={{ bottom: barPx }}
      >
        <Current />
      </div>

      {/* Left column — the sketch registry. Hidden on mobile (body moves to a
          sheet). */}
      <SlidableColumn
        side="left"
        offset={isMobile ? 0 : leftOffset}
        onOffsetChange={setLeftOffset}
        hidden={isMobile || leftHidden}
        swapped={swapped}
        bottomOffset={barPx}
      >
        <SlidableColumnHeader className="h-11 flex items-center justify-between">
          {backButton}
          <span className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            Sketches
          </span>
        </SlidableColumnHeader>
        <SlidableColumnContent className="!p-0">
          {sketchesBody}
        </SlidableColumnContent>
        <SlidableColumnHandles />
      </SlidableColumn>

      {/* Right column — readout. Hidden on mobile. */}
      <SlidableColumn
        side="right"
        offset={isMobile ? 0 : rightOffset}
        onOffsetChange={setRightOffset}
        hidden={isMobile || rightHidden}
        swapped={swapped}
        bottomOffset={barPx}
      >
        <SlidableColumnHeader className="h-11 flex items-center">
          <span className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            Readout
          </span>
        </SlidableColumnHeader>
        <SlidableColumnContent className="!p-0">
          {readoutBody}
        </SlidableColumnContent>
        <SlidableColumnHandles />
      </SlidableColumn>

      {/* Bottom bar — desktop: column controls; mobile: open the two bodies. */}
      {isMobile ? (
        <div
          data-mobile-bar
          className="absolute bottom-0 left-0 right-0 h-12 bg-background border-t border-line flex items-stretch z-[60]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            onClick={() => toggleSheet("sketches")}
            className={barBtnClass(mobileSheet === "sketches")}
          >
            <FlaskConical className="size-4" />
            <span>Sketches</span>
          </button>
          <button
            onClick={() => toggleSheet("readout")}
            className={barBtnClass(mobileSheet === "readout")}
          >
            <Activity className="size-4" />
            <span>Readout</span>
          </button>
        </div>
      ) : (
        <ColumnToolBar
          label="Lab column controls"
          leftOffset={leftOffset}
          rightOffset={rightOffset}
          setLeftOffset={setLeftOffset}
          setRightOffset={setRightOffset}
          swapped={swapped}
          setSwapped={setSwapped}
          leftHidden={leftHidden}
          setLeftHidden={setLeftHidden}
          rightHidden={rightHidden}
          setRightHidden={setRightHidden}
        />
      )}

      {/* Mobile sheets — non-modal so the bar stays live to switch between
          them; the bar owns its own toggle, so a pointer-down on it is not
          treated as an outside dismissal. */}
      <Sheet
        modal={false}
        open={mobileSheet === "sketches"}
        onOpenChange={(o) => {
          if (!o) setMobileSheet((c) => (c === "sketches" ? null : c))
        }}
      >
        <SheetContent
          side="bottom"
          showCloseButton={false}
          showOverlay={false}
          onFocusOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            const t = e.detail.originalEvent.target as Element | null
            if (t?.closest("[data-mobile-bar]")) e.preventDefault()
          }}
          className="theme-b h-[60dvh] bg-background text-foreground p-0 pb-[calc(3rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="border-b border-line px-4 py-3">
            <div className="flex items-center justify-between">
              {backButton}
              <SheetTitle className="text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">
                Sketches
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">{sketchesBody}</div>
        </SheetContent>
      </Sheet>

      <Sheet
        modal={false}
        open={mobileSheet === "readout"}
        onOpenChange={(o) => {
          if (!o) setMobileSheet((c) => (c === "readout" ? null : c))
        }}
      >
        <SheetContent
          side="bottom"
          showCloseButton={false}
          showOverlay={false}
          onFocusOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            const t = e.detail.originalEvent.target as Element | null
            if (t?.closest("[data-mobile-bar]")) e.preventDefault()
          }}
          className="theme-b h-[60dvh] bg-background text-foreground p-0 pb-[calc(3rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="border-b border-line px-4 py-3">
            <SheetTitle className="text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-center">
              Readout
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">{readoutBody}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
