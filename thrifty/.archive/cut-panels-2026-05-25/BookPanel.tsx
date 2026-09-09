export const meta = { id: "book", label: "Book", tier: "content" as const, placement: "any" as const }

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"
import { SlidingPanels, SlidingPanel, SlidingPanelContent } from "../ui/sliding-panels"

// ── Types ─────────────────────────────────────────────────────

interface BookPage {
  id: string
  heading: string
  body: string
}

interface BookConfig {
  title: string
  author: string
  pages: BookPage[]
}

export const defaultConfig: BookConfig = {
  title: "Untitled",
  author: "",
  pages: [
    {
      id: "1",
      heading: "Introduction",
      body: "Begin here. Write the opening of your book, article, or document. Each page becomes a chapter, section, or entry — the structure is yours to define.",
    },
    {
      id: "2",
      heading: "Chapter One",
      body: "The first chapter. This is where the work begins in earnest.",
    },
  ],
}

// ── Config surface ────────────────────────────────────────────

export function BookConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as BookConfig
  const pages = typed.pages ?? defaultConfig.pages
  const update = (patch: Partial<BookConfig>) => onChange({ ...typed, ...patch })

  function updatePage(id: string, field: keyof BookPage, value: string) {
    update({ pages: pages.map(p => p.id === id ? { ...p, [field]: value } : p) })
  }

  function addPage() {
    update({ pages: [...pages, { id: String(Date.now()), heading: "", body: "" }] })
  }

  function removePage(id: string) {
    if (pages.length <= 1) return
    update({ pages: pages.filter(p => p.id !== id) })
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Title</p>
        <input
          value={typed.title}
          onChange={e => update({ title: e.target.value })}
          className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
        />
      </div>

      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Author</p>
        <input
          value={typed.author}
          onChange={e => update({ author: e.target.value })}
          placeholder="Optional"
          className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5 placeholder:text-mute-fg/30"
        />
      </div>

      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Pages</p>
        <div className="space-y-2">
          {pages.map((page, i) => (
            <div key={page.id} className="group border border-line p-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-(--theme-letter-spacing) text-mute-fg/40">{i + 1}</span>
                <button
                  onClick={() => removePage(page.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground"
                >
                  <X className="size-2.5" />
                </button>
              </div>
              <input
                value={page.heading}
                onChange={e => updatePage(page.id, "heading", e.target.value)}
                placeholder="Heading"
                className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
              />
              <textarea
                value={page.body}
                onChange={e => updatePage(page.id, "body", e.target.value)}
                placeholder="Body"
                rows={3}
                className="w-full bg-transparent text-[10px] text-mute-fg border border-line focus:border-foreground outline-none p-1 resize-none"
              />
            </div>
          ))}
          <button
            onClick={addPage}
            className="flex items-center gap-1 pt-0.5 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors"
          >
            <Plus className="size-2.5" />
            Add page
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────

export function BookPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as BookConfig | undefined) ?? defaultConfig
  const { pages } = config

  const [pageIndex, setPageIndex] = useState(0)
  const currentIndex = Math.min(pageIndex, pages.length - 1)

  const goBack = useCallback(() => setPageIndex(i => Math.max(0, i - 1)), [])
  const goForward = useCallback(() => setPageIndex(i => Math.min(pages.length - 1, i + 1)), [pages.length])

  useEffect(() => {
    onFooter?.(
      <div className="flex items-stretch flex-1">
        <button
          onClick={goBack}
          disabled={currentIndex === 0}
          className={cx(
            "px-3 border-r border-line transition-colors",
            currentIndex > 0 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20"
          )}
        >
          <ChevronLeft className="size-3" />
        </button>
        <span className="flex-1 flex items-center justify-center text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {currentIndex + 1} / {pages.length}
        </span>
        <button
          onClick={goForward}
          disabled={currentIndex === pages.length - 1}
          className={cx(
            "px-3 border-l border-line transition-colors",
            currentIndex < pages.length - 1 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20"
          )}
        >
          <ChevronRight className="size-3" />
        </button>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, currentIndex, pages.length, goBack, goForward])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Pages */}
      <div className="flex-1 min-h-0">
        <SlidingPanels activeIndex={currentIndex} onIndexChange={setPageIndex}>
          {pages.map((page) => (
            <SlidingPanel key={page.id}>
              <SlidingPanelContent className="!p-0">
                <div className="h-full overflow-y-auto p-4 flex flex-col gap-3">
                  {page.heading && (
                    <h2 className="text-sm font-(--theme-font-weight) leading-tight text-foreground">
                      {page.heading}
                    </h2>
                  )}
                  {page.body && (
                    <p className="text-[11px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {page.body}
                    </p>
                  )}
                </div>
              </SlidingPanelContent>
            </SlidingPanel>
          ))}
        </SlidingPanels>
      </div>
    </div>
  )
}
