import { useState, useEffect, useMemo, useCallback } from "react"
import { ChevronLeft, List, LayoutGrid } from "lucide-react"
import { cx } from "../../lib/utils"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import type { PanelProps } from "../../types/panel"
import { SlidingPanels, SlidingPanel, SlidingPanelContent } from "../ui/sliding-panels"

// ── Types ─────────────────────────────────────────────────────

interface LibraryItem {
  id: string
  title: string
  author: string
  category: string
  year: string
  description: string
}

export interface LibraryConfig {
  name: string
  view: "grid" | "list"
  items: LibraryItem[]
  apiUrl?: string
  apiKey?: string
}

const defaultConfig: LibraryConfig = {
  name: "Library",
  view: "grid",
  items: [
    { id: "1", title: "Introduction to Systems",     author: "J. Holland",   category: "Science",   year: "1995", description: "A foundational text on complex adaptive systems and emergence." },
    { id: "2", title: "Structure and Interpretation", author: "Abelson",      category: "Computing", year: "1996", description: "The classic MIT programming text. Still unmatched." },
    { id: "3", title: "The Nature of Order",          author: "C. Alexander", category: "Design",    year: "2002", description: "Four volumes on life, beauty, and the structure of the universe." },
    { id: "4", title: "Gödel, Escher, Bach",          author: "D. Hofstadter",category: "Philosophy",year: "1979", description: "Strange loops, consciousness, and self-reference." },
  ],
}

// ── Panel ─────────────────────────────────────────────────────

export function LibraryPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as LibraryConfig | undefined) ?? defaultConfig
  const { name } = config
  const [items, setItems] = useState<LibraryItem[]>(() => config.items ?? defaultConfig.items)

  // API axis — fetch from external source when apiUrl is set
  useEffect(() => {
    if (!config.apiUrl) return
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (config.apiKey) {
      headers["apikey"] = config.apiKey
      headers["Authorization"] = `Bearer ${config.apiKey}`
    }
    fetch(config.apiUrl, { headers })
      .then(r => r.json())
      .then((data: { id?: string; title?: string; author?: string; category?: string; year?: string; description?: string }[]) => {
        if (!Array.isArray(data)) return
        setItems(data.map((d, i) => ({
          id: d.id ?? String(i),
          title: d.title ?? "",
          author: d.author ?? "",
          category: d.category ?? "",
          year: d.year ?? "",
          description: d.description ?? "",
        })))
      })
      .catch(() => {})
  }, [config.apiUrl, config.apiKey])

  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<"grid" | "list">(config.view ?? "grid")

  const selected = items.find(item => item.id === selectedId) ?? null

  function openItem(id: string) {
    setSelectedId(id)
    setActiveIndex(1)
  }

  const goBack = useCallback(() => {
    setActiveIndex(0)
    setSelectedId(null)
  }, [])

  const footer = useMemo(
    () =>
      activeIndex === 1 ? (
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-3" />
          Back
        </button>
      ) : (
        <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      ),
    [activeIndex, items.length, goBack]
  )

  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  // ── Index view ───────────────────────────────────────────────

  const indexView = (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 h-11 flex items-center px-3 border-b border-line">
        <span className="flex-1 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {name}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={cx("p-1 transition-colors", view === "list" ? "text-foreground" : "text-mute-fg/40 hover:text-mute-fg")}
          >
            <List className="size-3" />
          </button>
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={cx("p-1 transition-colors", view === "grid" ? "text-foreground" : "text-mute-fg/40 hover:text-mute-fg")}
          >
            <LayoutGrid className="size-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-2">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => openItem(item.id)}
                className="text-left border border-line p-2.5 hover:border-foreground/30 transition-colors flex flex-col gap-1"
              >
                <span className="text-[8px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg truncate">
                  {item.category}
                </span>
                <span className="text-[11px] font-(--theme-font-weight) text-foreground leading-snug line-clamp-2">
                  {item.title}
                </span>
                <span className="text-[9px] text-mute-fg truncate">
                  {item.author}{item.year ? ` · ${item.year}` : ""}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-px">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => openItem(item.id)}
                className="w-full text-left flex items-baseline gap-3 px-0 py-2 border-b border-line hover:bg-mute/30 transition-colors"
              >
                <span className="text-[11px] font-(--theme-font-weight) text-foreground truncate flex-1 min-w-0">
                  {item.title}
                </span>
                <span className="text-[9px] text-mute-fg shrink-0">
                  {item.author}
                </span>
                {item.year && (
                  <span className="text-[9px] text-mute-fg shrink-0">
                    {item.year}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // ── Detail view ──────────────────────────────────────────────

  const detailView = (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 h-11 border-b border-line flex items-center px-3">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-3" />
          {name}
        </button>
      </div>
      {selected && (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
          {selected.category && (
            <span className="text-[8px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
              {selected.category}
            </span>
          )}
          <h2 className="text-sm font-(--theme-font-weight) leading-tight text-foreground">
            {selected.title}
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-mute-fg">
            {selected.author && <span>{selected.author}</span>}
            {selected.author && selected.year && <span className="text-mute-fg/30">·</span>}
            {selected.year && <span>{selected.year}</span>}
          </div>
          {selected.description && (
            <p className="text-[11px] text-foreground/80 leading-relaxed">
              {selected.description}
            </p>
          )}
        </div>
      )}
    </div>
  )

  // ── Shell ────────────────────────────────────────────────────

  const panelBody = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="h-full min-h-0">
        <SlidingPanels activeIndex={activeIndex} onIndexChange={setActiveIndex}>
          <SlidingPanel>
            <SlidingPanelContent className="!p-0">
              {indexView}
            </SlidingPanelContent>
          </SlidingPanel>
          <SlidingPanel>
            <SlidingPanelContent className="!p-0">
              {detailView}
            </SlidingPanelContent>
          </SlidingPanel>
        </SlidingPanels>
      </div>

    </div>
  )

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">{panelBody}</div>
      {footerEl}
    </div>
  )
}
