
import type { PanelProps } from "../../types/panel"

export interface FeedEntry {
  id: string
  date: string // "YYYY-MM-DD"
  time?: string // optional "HH:MM" — rendered only when set
  title: string
  body: string
  tag?: string
}

export interface FeedConfig {
  entries: FeedEntry[]
}

const defaultConfig: FeedConfig = {
  entries: [
    {
      id: "sample-10",
      date: "2026-05-24",
      time: "16:20",
      title: "Feed panel",
      body: "Reverse-chronological updates. Newest first.",
      tag: "site",
    },
    {
      id: "sample-9",
      date: "2026-05-22",
      time: "09:05",
      title: "Theme exports",
      body: "Picker output now ships a Tailwind @theme block alongside :root so pasted themes resolve utility classes.",
      tag: "release",
    },
    {
      id: "sample-8",
      date: "2026-05-20",
      title: "Accessibility pass",
      body: "Swept every panel for contrast, labels, and button names. Muted text now clears AA across the kit.",
      tag: "update",
    },
    {
      id: "sample-7",
      date: "2026-05-18",
      time: "13:40",
      title: "Calendar & Journal",
      body: "Square day cells, a contained entry marker, and the panel title moved up into the header.",
      tag: "update",
    },
    {
      id: "sample-6",
      date: "2026-05-15",
      title: "Shadow strength",
      body: "New style dimension: None / Soft / Medium / Strong scales every shadow utility from one token.",
      tag: "release",
    },
    {
      id: "sample-5",
      date: "2026-05-12",
      time: "11:00",
      title: "Continuous color picker",
      body: "Dropped the Tailwind-grid snapping for continuous oklch hue and lightness, gamut-tapered so light and dark hues stay true.",
      tag: "release",
    },
    {
      id: "sample-4",
      date: "2026-05-09",
      title: "Standalone panels",
      body: "MusicPlayer, Calendar, Journal and friends now work without a dashboard host — pass panelData and go.",
      tag: "note",
    },
    {
      id: "sample-3",
      date: "2026-05-06",
      time: "08:30",
      title: "PDF reader",
      body: "Full-bleed reader panel with pinch-free zoom, page count, and a bundled worker.",
      tag: "release",
    },
    {
      id: "sample-2",
      date: "2026-05-03",
      title: "Single-package kit",
      body: "Per-panel packaging is gone. The library ships as one package; import the panels you need.",
      tag: "note",
    },
    {
      id: "sample-1",
      date: "2026-04-30",
      time: "17:15",
      title: "First light",
      body: "Feed panel online. Newest entries sort to the top automatically.",
      tag: "site",
    },
  ],
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function formatStamp(date: string, time?: string): string {
  const [y, m, d] = date.split("-").map(Number)
  if (!y || !m || !d) return date
  const base = `${MONTHS[m - 1]} ${d}, ${y}`
  return time ? `${base} · ${time}` : base
}

// Reverse chronological. Date then time; entries without a time sort as
// if at 00:00 of their day.
function sortEntries(entries: FeedEntry[]): FeedEntry[] {
  return entries
    .slice()
    .sort((a, b) => `${b.date} ${b.time ?? ""}`.localeCompare(`${a.date} ${a.time ?? ""}`))
}

export function FeedPanel({ panelData }: PanelProps) {
  const config = (panelData as unknown as FeedConfig | undefined) ?? defaultConfig
  const entries = sortEntries(config.entries ?? defaultConfig.entries)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div tabIndex={0} className="flex-1 min-h-0 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-[10px] text-mute-fg uppercase tracking-(--theme-letter-spacing)">
              No updates yet
            </span>
          </div>
        ) : (
          entries.map((e) => (
            <article
              key={e.id}
              className="border-b border-line/40 last:border-0 px-4 py-3 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
                  {formatStamp(e.date, e.time)}
                </span>
                {e.tag && (
                  <span className="text-[9px] uppercase tracking-(--theme-letter-spacing) px-1.5 py-0.5 rounded border border-line text-mute-fg">
                    {e.tag}
                  </span>
                )}
              </div>
              <h3 className="text-xs font-(--theme-font-weight) text-foreground leading-snug">
                {e.title}
              </h3>
              <p className="text-[11px] text-mute-fg leading-relaxed whitespace-pre-line">
                {e.body}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
