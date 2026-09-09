
import { useState, useEffect, useMemo, useId } from "react"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import { SlidingPanels, SlidingPanel, SlidingPanelContent } from "../ui/sliding-panels"
import { ChevronLeft, ChevronRight, Plus, ArrowLeft, Trash2 } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"

// Journal shares Calendar's three-view drill-in (month grid → day list →
// entry editor) but the entry is dated free-text, not a scheduled item.
// Date + time are stamped at creation and shown read-only — a journal
// records *when* it was written, the user just doesn't reschedule it (no
// time picker, no reordering). Composing happens in the editor view.

interface JournalEntry {
  id: string
  date: string  // "YYYY-MM-DD"
  time: string  // "HH:MM" — creation stamp, not user-editable in-panel
  heading: string
  body: string
}

export interface JournalConfig {
  entries: JournalEntry[]
  apiUrl?: string
  apiKey?: string
}

const defaultConfig: JournalConfig = {
  entries: [],
}

// Normalize an imported / fetched record into a JournalEntry. `heading`
// falls back to `title` / `text` keys; `body` to `text` so a plain
// "date,text" CSV imports as prose.
function toEntry(r: Record<string, unknown>, i: number): JournalEntry {
  const rec = r as Record<string, string>
  return {
    id: String(rec.id ?? `imported-${i}`),
    date: String(rec.date ?? ""),
    time: String(rec.time ?? ""),
    heading: String(rec.heading ?? rec.title ?? ""),
    body: String(rec.body ?? rec.text ?? ""),
  }
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

interface DayEntry {
  id: string
  time: string
  heading: string
  body: string
}

function getCalendarCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(42 - firstDay - daysInMonth).fill(null),
  ]
}

function currentTime(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export function JournalPanel({ onFooter, panelData, onData }: PanelProps) {
  const config = (panelData as unknown as JournalConfig | undefined) ?? defaultConfig
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [panelIndex, setPanelIndex] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const fieldId = useId()
  const [entries, setEntries] = useState<Record<string, DayEntry[]>>(() => {
    const result: Record<string, DayEntry[]> = {}
    for (const entry of config.entries) {
      const [y, mo, d] = entry.date.split("-").map(Number)
      const key = `${y}-${mo - 1}-${d}`
      ;(result[key] ??= []).push({ id: entry.id, time: entry.time, heading: entry.heading, body: entry.body })
    }
    return result
  })

  // API axis — fetch from an external source when apiUrl is set.
  useEffect(() => {
    if (!config.apiUrl) return
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (config.apiKey) {
      headers["apikey"] = config.apiKey
      headers["Authorization"] = `Bearer ${config.apiKey}`
    }
    fetch(config.apiUrl, { headers })
      .then(r => r.json())
      .then((data: Record<string, unknown>[]) => {
        if (!Array.isArray(data)) return
        const result: Record<string, DayEntry[]> = {}
        for (const raw of data) {
          const entry = toEntry(raw, 0)
          if (!entry.date) continue
          const [y, mo, d] = entry.date.split("-").map(Number)
          const key = `${y}-${mo - 1}-${d}`
          ;(result[key] ??= []).push({ id: entry.id, time: entry.time, heading: entry.heading, body: entry.body })
        }
        setEntries(result)
      })
      .catch(() => {})
  }, [config.apiUrl, config.apiKey])

  function dayKey(d: number) {
    return `${year}-${month}-${d}`
  }

  function dayEntriesFor(d: number): DayEntry[] {
    return entries[dayKey(d)] ?? []
  }

  function sortedDayEntries(d: number): DayEntry[] {
    return dayEntriesFor(d).slice().sort((a, b) => a.time.localeCompare(b.time))
  }

  function setDayEntries(d: number, next: DayEntry[]) {
    setEntries(prev => ({ ...prev, [dayKey(d)]: next }))
  }

  function emit(entry: DayEntry, action: string, d: number) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    onData?.({ date, time: entry.time, heading: entry.heading, body: entry.body, action })
  }

  function updateEntry(d: number, id: string, patch: Partial<DayEntry>) {
    setDayEntries(d, dayEntriesFor(d).map(e => e.id === id ? { ...e, ...patch } : e))
  }

  function openDay(d: number) {
    setSelectedDay(d)
    setPanelIndex(1)
  }

  function openEntry(id: string) {
    setEditingId(id)
    setPanelIndex(2)
  }

  function newEntry() {
    if (selectedDay === null) return
    const id = `jnl-${Date.now()}`
    setDayEntries(selectedDay, [...dayEntriesFor(selectedDay), { id, time: currentTime(), heading: "", body: "" }])
    setEditingId(id)
    setPanelIndex(2)
  }

  // Leaving the editor: prune an entry left entirely blank, otherwise persist
  // it via onData (provider sync). Reached by the editor's back arrow.
  function closeEditor() {
    if (selectedDay !== null && editingId) {
      const entry = dayEntriesFor(selectedDay).find(e => e.id === editingId)
      if (entry) {
        if (!entry.heading.trim() && !entry.body.trim()) {
          setDayEntries(selectedDay, dayEntriesFor(selectedDay).filter(e => e.id !== editingId))
        } else {
          emit(entry, "save", selectedDay)
        }
      }
    }
    setEditingId(null)
    setPanelIndex(1)
  }

  function deleteEntry() {
    if (selectedDay !== null && editingId) {
      const entry = dayEntriesFor(selectedDay).find(e => e.id === editingId)
      setDayEntries(selectedDay, dayEntriesFor(selectedDay).filter(e => e.id !== editingId))
      if (entry) emit(entry, "delete", selectedDay)
    }
    setEditingId(null)
    setPanelIndex(1)
  }

  function goMonth() {
    setSelectedDay(null)
    setEditingId(null)
    setPanelIndex(0)
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    goMonth()
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    goMonth()
  }

  function goToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
    goMonth()
  }

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const cells = getCalendarCells(year, month)
  const editingEntry = selectedDay !== null && editingId
    ? dayEntriesFor(selectedDay).find(e => e.id === editingId) ?? null
    : null

  const footer = useMemo(() => {
    if (panelIndex === 0) {
      return (
        <button
          onClick={goToday}
          className="flex-1 flex items-center justify-center text-mute-fg hover:text-foreground transition-colors text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)"
        >
          Return to today
        </button>
      )
    }
    if (panelIndex === 1) {
      return (
        <button
          onClick={newEntry}
          className="flex-1 flex items-center justify-center gap-1.5 text-mute-fg hover:text-foreground transition-colors text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)"
        >
          <Plus className="size-3" /> New entry
        </button>
      )
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelIndex, selectedDay, year, month])

  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  // View 0 — month grid
  const gridPanel = (
    <div className="flex flex-col h-full">
      <div className="shrink-0 h-11 border-b border-line flex items-center justify-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground">
          Journal
        </span>
      </div>
      <div className="shrink-0 h-11 border-b border-line flex items-center">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="h-9 w-9 flex items-center justify-center text-mute-fg hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="flex-1 text-center text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground">
          {MONTH_LABELS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="h-9 w-9 flex items-center justify-center text-mute-fg hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="shrink-0 grid grid-cols-7 border-b border-line">
        {DAY_LABELS.map(d => (
          <div key={d} className="py-1.5 text-center text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg font-(--theme-font-weight)">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const hasEntries = day !== null && dayEntriesFor(day).length > 0
          return (
            <button
              key={i}
              disabled={day === null}
              aria-hidden={day === null}
              onClick={() => day !== null && openDay(day)}
              className={cx(
                "relative flex items-center justify-center aspect-square border-b border-r border-line/30 transition-colors",
                "[&:nth-child(7n)]:border-r-0",
                day === null && "pointer-events-none",
                day !== null && isToday(day) && "font-(--theme-font-weight) text-foreground",
                day !== null && !isToday(day) && "text-mute-fg hover:bg-mute/50 hover:text-foreground",
              )}
            >
              {day !== null && (
                <>
                  {hasEntries && (
                    <span className="absolute inset-1 rounded-sm border border-foreground/40 pointer-events-none" />
                  )}
                  <span className="text-[11px] leading-none">{day}</span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  // View 1 — day list (chronological by stamp, no manual reordering)
  const dayPanel = selectedDay !== null ? (() => {
    const dayEntries = sortedDayEntries(selectedDay)
    return (
      <div className="flex flex-col h-full">
        <div className="shrink-0 h-11 border-b border-line flex items-center px-1">
          <button
            onClick={goMonth}
            className="h-9 w-9 flex items-center justify-center text-mute-fg hover:text-foreground transition-colors"
            title="Back to month"
          >
            <ArrowLeft className="size-3.5" />
          </button>
          <span className="flex-1 text-center text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground">
            {MONTH_LABELS[month]} {selectedDay}, {year}
          </span>
          <div className="w-9" />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {dayEntries.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-[10px] text-mute-fg uppercase tracking-(--theme-letter-spacing)">No entries</span>
            </div>
          ) : (
            dayEntries.map(entry => (
              <button
                key={entry.id}
                onClick={() => openEntry(entry.id)}
                className="w-full flex items-start gap-3 text-left border-b border-line/40 last:border-0 px-3 py-2.5 hover:bg-mute/40 transition-colors"
              >
                <span className="text-[10px] text-mute-fg shrink-0 w-12 pt-px">{entry.time || "—"}</span>
                <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className={cx(
                    "text-[11px] truncate",
                    entry.heading ? "text-foreground" : "text-mute-fg"
                  )}>
                    {entry.heading || "Untitled"}
                  </span>
                  {entry.body && (
                    <span className="text-[10px] text-mute-fg truncate">{entry.body}</span>
                  )}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    )
  })() : <div />

  // View 2 — entry editor (date · time shown read-only; only heading + body edit)
  const editorPanel = editingEntry && selectedDay !== null ? (
    <div className="flex flex-col h-full">
      <div className="shrink-0 h-11 border-b border-line flex items-center px-1">
        <button
          onClick={closeEditor}
          className="h-9 w-9 flex items-center justify-center text-mute-fg hover:text-foreground transition-colors"
          title="Back to day"
        >
          <ArrowLeft className="size-3.5" />
        </button>
        <span className="flex-1 text-center text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground">
          {MONTH_LABELS[month]} {selectedDay}, {year}
        </span>
        <button
          onClick={deleteEntry}
          className="h-9 w-9 flex items-center justify-center text-mute-fg hover:text-foreground transition-colors"
          title="Delete entry"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3">
        <div className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {MONTH_LABELS[month]} {selectedDay}, {year} · {editingEntry.time || "—"}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${fieldId}-heading`} className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">Heading</label>
          <input
            id={`${fieldId}-heading`}
            autoFocus
            value={editingEntry.heading}
            onChange={e => updateEntry(selectedDay, editingEntry.id, { heading: e.target.value })}
            placeholder="Title your entry"
            className="bg-transparent text-[12px] text-foreground border-b border-line focus:border-foreground outline-none py-1"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-h-0">
          <label htmlFor={`${fieldId}-entry`} className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">Entry</label>
          <textarea
            id={`${fieldId}-entry`}
            value={editingEntry.body}
            onChange={e => updateEntry(selectedDay, editingEntry.id, { body: e.target.value })}
            placeholder="Write..."
            className="flex-1 min-h-32 bg-transparent text-[11px] text-foreground border border-line focus:border-foreground outline-none p-2 resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  ) : <div />

  const body = (
    <SlidingPanels activeIndex={panelIndex} onIndexChange={setPanelIndex} className="h-full">
      <SlidingPanel>
        <SlidingPanelContent className="!p-0 h-full">{gridPanel}</SlidingPanelContent>
      </SlidingPanel>
      <SlidingPanel>
        <SlidingPanelContent className="!p-0 h-full">{dayPanel}</SlidingPanelContent>
      </SlidingPanel>
      <SlidingPanel>
        <SlidingPanelContent className="!p-0 h-full">{editorPanel}</SlidingPanelContent>
      </SlidingPanel>
    </SlidingPanels>
  )

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">{body}</div>
      {footerEl}
    </div>
  )
}
