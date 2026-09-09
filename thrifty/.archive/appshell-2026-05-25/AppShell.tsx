// ── Shell Config ──────────────────────────────────────────────
// Adjust these values to customize your app after export.
export const MAX_PAGES = 6
export const MAX_PANELS_PER_PAGE = 4
export const COLUMN_WIDTH = 320
// ─────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect } from "react"
import type { ReactNode } from "react"
import { cx } from "../lib/utils"
import { useIsMobile } from "../hooks/use-mobile"
import { ChevronLeft, ChevronRight, PanelLeft, PanelRight } from "lucide-react"
import { Sheet, SheetContent } from "./ui/sheet"
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog"
import { SlidingPanels, SlidingPanel, SlidingPanelContent } from "./ui/sliding-panels"
import { VisuallyHidden } from "./ui/visually-hidden"
import type { Theme } from "../types/theme"
import { ThemeScope, type ThemeMode } from "./ThemeScope"

// The picker writes theme.styling.fontWeight and letterSpacing into the
// --theme-font-weight and --theme-letter-spacing CSS variables (via
// useThemeRoot / ThemeScope). Chrome opts in to the themed values via
// these utility class strings.
const WEIGHT_CLASS = "font-(--theme-font-weight)"
const TRACKING_CLASS = "tracking-(--theme-letter-spacing)"

export type MobilePresentation = "sheet-left" | "sheet-right" | "sheet-bottom" | "dialog"

export interface PageConfig {
  id: string
  label: string
  panelCount: number
}

export interface ShellDevOverrides {
  maxPages?: number
  maxPanelsPerPage?: number
  columnWidth?: number
  forceMobile?: boolean
  pages?: PageConfig[]
  navSide?: "left" | "right"
}

export const DEFAULT_PAGES: PageConfig[] = [
  { id: "shell-page-0", label: "Page 1", panelCount: 1 },
]

function ColumnOverlay({
  open,
  onOpenChange,
  presentation,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  presentation: MobilePresentation
  children: React.ReactNode
}) {
  if (presentation === "dialog") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} className="p-0 gap-0 h-[70dvh] flex flex-col sm:max-w-sm">
          <VisuallyHidden asChild><DialogTitle>Column</DialogTitle></VisuallyHidden>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  const side =
    presentation === "sheet-left" ? "left" :
    presentation === "sheet-right" ? "right" :
    "bottom"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        showCloseButton={false}
        className={cx("p-0 gap-0", side === "bottom" && "h-[70dvh]")}
      >
        {children}
      </SheetContent>
    </Sheet>
  )
}

interface AppShellProps {
  leftPresentation?: MobilePresentation
  rightPresentation?: MobilePresentation
  pages?: PageConfig[]
  devOverrides?: ShellDevOverrides
  theme?: Theme
  projectName?: string
  navSide?: "left" | "right"
  leftColumnFooter?: ReactNode
  rightColumnContent?: ReactNode
  rightColumnFooter?: ReactNode
  rightColumnHeader?: ReactNode
  colorMode?: ThemeMode
  onColorModeChange?: (mode: ThemeMode) => void
  pageSlots?: Record<string, ReactNode[]>
  pageSlotFooters?: Record<string, (ReactNode | null)[]>
  dialogOverlay?: ReactNode
  dialogTriggers?: { id: string; name: string }[]
  onDialogOpen?: (id: string) => void
  activeDialogId?: string | null
}

export function AppShell({
  leftPresentation = "sheet-left",
  rightPresentation = "sheet-right",
  pages = DEFAULT_PAGES,
  devOverrides,
  theme,
  projectName,
  navSide = "left",
  leftColumnFooter,
  rightColumnContent,
  rightColumnFooter,
  rightColumnHeader,
  colorMode,
  onColorModeChange,
  pageSlots,
  pageSlotFooters,
  dialogOverlay,
  dialogTriggers,
  onDialogOpen,
  activeDialogId,
}: AppShellProps) {
  const isMobileHook = useIsMobile()
  const isMobile = devOverrides?.forceMobile ?? isMobileHook
  const navOnLeft = (devOverrides?.navSide ?? navSide) !== "right"

  const colWidth = devOverrides?.columnWidth ?? COLUMN_WIDTH
  const maxPanelsPerPage = devOverrides?.maxPanelsPerPage ?? MAX_PANELS_PER_PAGE
  const maxPages = devOverrides?.maxPages ?? MAX_PAGES

  // Clamp pages to maxPages
  const activePages = (devOverrides?.pages ?? pages).slice(0, maxPages)

  const [pageIndex, setPageIndex] = useState(0)
  const [panelIndices, setPanelIndices] = useState(() => activePages.map(() => 0))
  const [dialogTriggerIndex, setDialogTriggerIndex] = useState(0)
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const [internalMode, setInternalMode] = useState<ThemeMode>("A")
  const mode: ThemeMode = colorMode ?? internalMode
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false)

  function handleSetMode(m: ThemeMode) {
    setInternalMode(m)
    onColorModeChange?.(m)
  }

  // Sync panelIndices length when pages change
  useEffect(() => {
    setPanelIndices(prev => activePages.map((_, i) => prev[i] ?? 0))
  }, [activePages.length])

  // Clamp pageIndex if pages are removed
  useEffect(() => {
    if (pageIndex >= activePages.length) {
      setPageIndex(Math.max(0, activePages.length - 1))
    }
  }, [activePages.length, pageIndex])

  // Clamp dialogTriggerIndex if dialogs are removed
  useEffect(() => {
    const len = dialogTriggers?.length ?? 0
    if (len > 0 && dialogTriggerIndex >= len) {
      setDialogTriggerIndex(len - 1)
    }
  }, [dialogTriggers?.length, dialogTriggerIndex])

  const panelCount = Math.min(activePages[pageIndex]?.panelCount ?? 1, maxPanelsPerPage)
  const panelIndex = panelIndices[pageIndex] ?? 0

  const setPanelIndex = useCallback((idx: number) => {
    setPanelIndices(prev => {
      const next = [...prev]
      next[pageIndex] = idx
      return next
    })
  }, [pageIndex])

  const scrollToPage = useCallback((idx: number) => {
    setPageIndex(idx)
    document.getElementById(activePages[idx]?.id ?? "")?.scrollIntoView({ behavior: "smooth" })
  }, [activePages])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    activePages.forEach(({ id }, idx) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setPageIndex(idx) },
        { threshold: 0.5 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(obs => obs.disconnect())
  }, [activePages.map(p => p.id).join(",")])

  const topBar = (
    <div className="shrink-0 h-11 border-b border-line flex items-center justify-center px-2">
      <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
        {activePages[pageIndex]?.label}
        {panelCount > 1 ? ` — ${panelIndex + 1} / ${panelCount}` : ""}
      </span>
    </div>
  )

  const currentPanelFooter = pageSlotFooters?.[activePages[pageIndex]?.id]?.[panelIndex] ?? null

  const panelBar = (
    <div className="shrink-0 h-11 border-t border-line flex items-stretch">
      {/* Left zone — panel nav */}
      <div className="flex items-center shrink-0">
        {panelCount > 1 && (
          <>
            <button
              onClick={() => setPanelIndex(Math.max(0, panelIndex - 1))}
              disabled={panelIndex === 0}
              className={cx("p-1 transition-colors", panelIndex > 0 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20")}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg px-2">
              Panel {panelIndex + 1}
            </span>
            <button
              onClick={() => setPanelIndex(Math.min(panelCount - 1, panelIndex + 1))}
              disabled={panelIndex === panelCount - 1}
              className={cx("p-1 transition-colors", panelIndex < panelCount - 1 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20")}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
      {/* Center zone — panel onFooter injection */}
      <div className="flex-1 flex items-stretch">
        {currentPanelFooter}
      </div>
      {/* Right zone — dialog popup triggers */}
      {dialogTriggers && dialogTriggers.length > 0 && (() => {
        const current = dialogTriggers[dialogTriggerIndex] ?? dialogTriggers[0]
        const isActive = activeDialogId === current.id
        const canPrev = dialogTriggerIndex > 0
        const canNext = dialogTriggerIndex < dialogTriggers.length - 1
        return (
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setDialogTriggerIndex(i => Math.max(0, i - 1))}
              disabled={!canPrev}
              className={cx("p-1 transition-colors", canPrev ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20")}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDialogOpen?.(current.id)}
              className={cx(
                "text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) px-1 transition-colors",
                isActive ? "text-foreground" : "text-mute-fg hover:text-foreground"
              )}
            >
              {current.name}
            </button>
            <button
              onClick={() => setDialogTriggerIndex(i => Math.min(dialogTriggers.length - 1, i + 1))}
              disabled={!canNext}
              className={cx("p-1 transition-colors", canNext ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20")}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })()}
    </div>
  )

  const scrollArea = (
    <div className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory">
      {activePages.map((page, pIdx) => {
        const pPanelCount = Math.min(page.panelCount, maxPanelsPerPage)
        return (
          <section
            key={page.id}
            id={page.id}
            className="snap-start h-full"
          >
            <SlidingPanels
              activeIndex={Math.min(panelIndices[pIdx] ?? 0, pPanelCount - 1)}
              onIndexChange={(idx) => {
                setPanelIndices(prev => {
                  const next = [...prev]
                  next[pIdx] = idx
                  return next
                })
              }}
            >
              {Array.from({ length: pPanelCount }).map((_, panIdx) => (
                <SlidingPanel key={panIdx}>
                  <SlidingPanelContent className="!p-0">
                    {pageSlots?.[page.id]?.[panIdx] ?? (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/20">
                          {page.label} · {panIdx + 1}
                        </span>
                      </div>
                    )}
                  </SlidingPanelContent>
                </SlidingPanel>
              ))}
            </SlidingPanels>
          </section>
        )
      })}
    </div>
  )

  const wClass = WEIGHT_CLASS
  const tClass = TRACKING_CLASS

  const leftColumn = (
    <div className="flex flex-col h-full bg-column relative overflow-hidden">
      {theme?.styling.columnHolo && (
        <div className="absolute inset-0 pointer-events-none bg-holo" />
      )}
      <div className="shrink-0 h-11 border-b border-column-line flex items-center px-3">
        <span className={cx("text-xs font-sans uppercase truncate text-column-foreground", wClass, tClass)}>
          {projectName ?? "My App"}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto py-1">
        {activePages.map((page, idx) => (
          <button
            key={page.id}
            onClick={() => scrollToPage(idx)}
            className={cx(
              "w-full text-left px-3 py-2 text-xs font-sans uppercase transition-colors",
              wClass,
              tClass,
              pageIndex === idx
                ? "text-column-foreground"
                : "text-column-foreground/50 hover:text-column-foreground"
            )}
          >
            {page.label}
          </button>
        ))}
      </div>
      <div className="shrink-0 border-t border-column-line">
        {leftColumnFooter ?? (
          <div className="h-11 overflow-hidden">
            <div className={cx("transition-transform duration-200 ease-out", themeDrawerOpen ? "-translate-y-11" : "translate-y-0")}>
              <button
                onClick={() => setThemeDrawerOpen(true)}
                className="h-11 w-full flex items-center justify-center text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-column-foreground/30 hover:text-column-foreground transition-colors"
              >
                Theme
              </button>
              <div className="h-11 flex items-stretch">
                <button
                  onClick={() => { handleSetMode("A"); setThemeDrawerOpen(false) }}
                  className={cx(
                    "flex-1 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) transition-colors",
                    mode === "A" ? "text-column-foreground" : "text-column-foreground/30 hover:text-column-foreground/60"
                  )}
                >
                  {theme?.styling.labelA ?? "A"}
                </button>
                <button
                  onClick={() => { handleSetMode("B"); setThemeDrawerOpen(false) }}
                  className={cx(
                    "flex-1 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) transition-colors",
                    mode === "B" ? "text-column-foreground" : "text-column-foreground/30 hover:text-column-foreground/60"
                  )}
                >
                  {theme?.styling.labelB ?? "B"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const rightColumn = (
    <div className="flex flex-col h-full bg-column relative overflow-hidden">
      {theme?.styling.columnHolo && (
        <div className="absolute inset-0 pointer-events-none bg-holo" />
      )}
      <div className="shrink-0 h-11 border-b border-column-line flex items-center px-3">
        {rightColumnHeader ?? <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-column-foreground/20">—</span>}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {rightColumnContent}
      </div>
      <div className="shrink-0 h-11 border-t border-column-line flex items-stretch">
        {rightColumnFooter}
      </div>
    </div>
  )

  const mobileShell = (
    <div className="h-full w-full bg-background text-foreground overflow-hidden relative">
      {/* Center — above mobile bar */}
      <div className="absolute inset-0 bottom-12 flex flex-col">
        {topBar}
        {scrollArea}
        {panelBar}
      </div>

      {/* Mobile bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-background border-t border-line flex items-stretch z-30">
        <button
          onClick={() => setLeftOpen(true)}
          className="w-12 flex items-center justify-center text-mute-fg hover:text-foreground transition-colors border-r border-line"
        >
          {navOnLeft ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </button>

        <div className="flex-1 flex items-stretch">
          {activePages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => scrollToPage(idx)}
              className={cx(
                "flex-1 flex items-center justify-center transition-colors text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)",
                pageIndex === idx ? "text-foreground" : "text-mute-fg hover:text-foreground"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setRightOpen(true)}
          className="w-12 flex items-center justify-center text-mute-fg hover:text-foreground transition-colors border-l border-line"
        >
          {navOnLeft ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </button>
      </div>

      <ColumnOverlay open={leftOpen} onOpenChange={setLeftOpen} presentation={navOnLeft ? leftPresentation : rightPresentation}>
        {theme
          ? <ThemeScope theme={theme} mode={mode} className="h-full">{navOnLeft ? leftColumn : rightColumn}</ThemeScope>
          : (navOnLeft ? leftColumn : rightColumn)}
      </ColumnOverlay>

      <ColumnOverlay open={rightOpen} onOpenChange={setRightOpen} presentation={navOnLeft ? rightPresentation : leftPresentation}>
        {theme
          ? <ThemeScope theme={theme} mode={mode} className="h-full">{navOnLeft ? rightColumn : leftColumn}</ThemeScope>
          : (navOnLeft ? rightColumn : leftColumn)}
      </ColumnOverlay>

      {dialogOverlay}
    </div>
  )

  // Desktop — 3-column shell
  const desktopShell = (
    <div className="h-full w-full bg-background text-foreground overflow-hidden relative">
      {/* Left position */}
      <div
        className="absolute left-0 top-0 bottom-0 border-r border-column-line flex flex-col"
        style={{ width: colWidth }}
      >
        {navOnLeft ? leftColumn : rightColumn}
      </div>

      {/* Center */}
      <div
        className="absolute top-0 bottom-0 flex flex-col"
        style={{ left: colWidth, right: colWidth }}
      >
        {topBar}
        {scrollArea}
        {panelBar}
      </div>

      {/* Right position */}
      <div
        className="absolute right-0 top-0 bottom-0 border-l border-column-line flex flex-col"
        style={{ width: colWidth }}
      >
        {navOnLeft ? rightColumn : leftColumn}
      </div>

      {dialogOverlay}
    </div>
  )

  const shell = isMobile ? mobileShell : desktopShell

  if (!theme) return shell

  return (
    <ThemeScope theme={theme} mode={mode} className="h-full w-full">
      {shell}
    </ThemeScope>
  )
}
