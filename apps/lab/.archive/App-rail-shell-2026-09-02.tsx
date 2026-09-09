import { useState } from "react"
import { ArrowLeft, ArrowUp } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  VisuallyHidden,
  useIsMobile,
  cx,
} from "thrifty-ui"
import { SKETCHES } from "./sketches"

// Lab workbench: a rail of sketches on the left, the active sketch in the
// viewport. Dark theme (.theme-b). Adding a sketch to the registry is all
// it takes to extend the lab.
//
// Chrome mirrors the cliffordjh site (thrifty `useIsMobile` + `Sheet`): on
// desktop the sketch rail is a persistent left column; below the mobile
// breakpoint the rail collapses and a bottom bar's single slot opens it as a
// left sheet — the same mechanism the site's /home route uses.
//
// `onBack` is optional: standalone (lab's own main.tsx) renders no back
// affordance; when the cliffordjh site embeds this App at /lab it passes a
// callback that navigates back to the claude-research page via react-router.
export function App({ onBack }: { onBack?: () => void } = {}) {
  const [active, setActive] = useState(SKETCHES[0].id)
  const [sheetOpen, setSheetOpen] = useState(false)
  const isMobile = useIsMobile()
  const Current = SKETCHES.find((s) => s.id === active)!.Component

  // "← back" — matches cliffordjh's own L-column header button. Lives in the
  // desktop rail header and, on mobile, the sheet header (same place).
  const backButton = onBack && (
    <button
      type="button"
      onClick={onBack}
      aria-label="Back to claude research"
      className="h-7 px-2 inline-flex items-center justify-center gap-1.5 rounded text-mute-fg hover:text-foreground hover:bg-mute/50 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">
        back
      </span>
    </button>
  )

  const sketchNav = (
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

  // Root is `relative` (not `fixed`) on purpose: fixed would create a stacking
  // context and trap the mobile bar's z-60 beneath the thrifty Sheet (which
  // portals to document.body). Matching the site's Layout root keeps the bar
  // above the sheet.
  return (
    <div className="theme-b relative h-dvh w-full flex overflow-hidden bg-background text-foreground">
      {/* Desktop: persistent left rail. */}
      {!isMobile && (
        <aside className="w-56 shrink-0 flex flex-col border-r border-line">
          <div className="h-11 shrink-0 flex items-center justify-start pl-2 border-b border-line">
            {backButton}
          </div>
          {sketchNav}
        </aside>
      )}

      <main className="relative flex-1 min-w-0">
        <Current />
      </main>

      {/* Mobile bar — one slot (up-arrow) opens the sketch rail as a bottom
          sheet. z-60 keeps the bar (and its icon) above the sheet so the
          up-arrow stays tappable to close; the sheet clears it via bottom
          padding below. Mirrors the site's mobile bar (safe-area, h-12). */}
      {isMobile && (
        <div
          data-mobile-bar
          className="absolute bottom-0 left-0 right-0 bg-background text-foreground border-t border-line z-[60]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="h-12 flex items-stretch">
            <button
              type="button"
              onClick={() => setSheetOpen((o) => !o)}
              className={cx(
                "flex-1 flex items-center justify-center transition-colors",
                sheetOpen
                  ? "bg-mute text-foreground"
                  : "text-mute-fg hover:text-foreground hover:bg-mute/50",
              )}
              title="Sketches"
            >
              <ArrowUp className="h-4 w-4" />
              <VisuallyHidden>Sketches</VisuallyHidden>
            </button>
          </div>
        </div>
      )}

      {/* Mobile sketches sheet — a bottom sheet holding the same rail. The
          bottom padding = the h-12 bar + safe area, so the sheet's content
          sits above the bar rather than behind it. Non-modal so the bar
          stays live; the bar owns its own toggle (guarded below). */}
      <Sheet modal={false} open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          showOverlay={false}
          onFocusOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            const t = e.detail.originalEvent.target as Element | null
            if (t?.closest("[data-mobile-bar]")) e.preventDefault()
          }}
          className="theme-b h-[85dvh] bg-background text-foreground p-0 pb-[calc(3rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="border-b border-line pl-2 pr-4 py-3">
            <VisuallyHidden asChild>
              <SheetTitle>Sketches</SheetTitle>
            </VisuallyHidden>
            <div className="flex items-center justify-start">{backButton}</div>
          </SheetHeader>
          {sketchNav}
        </SheetContent>
      </Sheet>
    </div>
  )
}
