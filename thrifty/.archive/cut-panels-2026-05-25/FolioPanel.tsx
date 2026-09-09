
export const meta = { id: "folio", label: "Folio", tier: "utility" as const, placement: "any" as const }

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"
import {
  SlidingPanels,
  SlidingPanel,
  SlidingPanelContent,
} from "../ui/sliding-panels"

interface FolioEntry {
  id: string
  title: string
  medium: string
}

export interface FolioConfig {
  entries: FolioEntry[]
}

export const defaultConfig: FolioConfig = {
  entries: [
    { id: "1", title: "—", medium: "Audio" },
    { id: "2", title: "—", medium: "Film" },
    { id: "3", title: "—", medium: "Interface" },
    { id: "4", title: "—", medium: "Writing" },
  ],
}

export function FolioConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as FolioConfig
  const entries = typed.entries ?? defaultConfig.entries

  function updateEntry(id: string, field: keyof FolioEntry, value: string) {
    onChange({
      ...typed,
      entries: entries.map(e => e.id === id ? { ...e, [field]: value } : e),
    })
  }

  function addEntry() {
    onChange({
      ...typed,
      entries: [...entries, { id: String(Date.now()), title: "", medium: "New" }],
    })
  }

  function removeEntry(id: string) {
    if (entries.length <= 1) return
    onChange({ ...typed, entries: entries.filter(e => e.id !== id) })
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between pb-1">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Entries</p>
        <button
          onClick={addEntry}
          className="flex items-center gap-1 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors"
        >
          <Plus className="size-2.5" />Add
        </button>
      </div>
      {entries.map(entry => (
        <div key={entry.id} className="flex items-center gap-1.5 group">
          <input
            value={entry.medium}
            onChange={e => updateEntry(entry.id, "medium", e.target.value)}
            placeholder="Medium"
            className="w-20 shrink-0 bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
          />
          <input
            value={entry.title}
            onChange={e => updateEntry(entry.id, "title", e.target.value)}
            placeholder="Title"
            className="flex-1 bg-transparent text-[10px] text-mute-fg border-b border-line focus:border-foreground outline-none py-0.5"
          />
          <button
            onClick={() => removeEntry(entry.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground"
          >
            <X className="size-2.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function FolioPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as FolioConfig | undefined) ?? defaultConfig
  const entries = config.entries
  const [activeIndex, setActiveIndex] = useState(0)
  const total = entries.length

  const prev = () => setActiveIndex(Math.max(0, activeIndex - 1))
  const next = () => setActiveIndex(Math.min(total - 1, activeIndex + 1))

  useEffect(() => {
    onFooter?.(
      <div className="flex-1 py-3 px-3 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={activeIndex === 0}
          className={cx(
            "p-1 transition-colors",
            activeIndex > 0 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20"
          )}
        >
          <ChevronLeft className="size-3" />
        </button>
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {entries[activeIndex]?.medium ?? ""}
        </span>
        <button
          onClick={next}
          disabled={activeIndex === total - 1}
          className={cx(
            "p-1 transition-colors",
            activeIndex < total - 1 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20"
          )}
        >
          <ChevronRight className="size-3" />
        </button>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, activeIndex])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">
        <SlidingPanels activeIndex={activeIndex} onIndexChange={setActiveIndex}>
          {entries.map((entry) => (
            <SlidingPanel key={entry.id}>
              <SlidingPanelContent className="!p-0">
                <div className="h-full flex flex-col items-center justify-center px-6">
                  <p className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg mb-4">
                    {entry.medium}
                  </p>
                  <p className="text-xs uppercase tracking-(--theme-letter-spacing) text-foreground/30">
                    {entry.title}
                  </p>
                </div>
              </SlidingPanelContent>
            </SlidingPanel>
          ))}
        </SlidingPanels>
      </div>
    </div>
  )
}
