export const meta = { id: "holo-text", label: "Holo Text", tier: "content" as const, placement: "any" as const }

import { useEffect } from "react"
import { Plus, X } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"
import { CheckboxItem } from "../panel-primitives"

// ── Types ─────────────────────────────────────────────────────

type HoloSize   = "xs" | "sm" | "md" | "lg" | "xl"
type HoloWeight = "normal" | "semibold" | "bold"

interface HoloTextConfig {
  lines: { id: string; text: string }[]
  size: HoloSize
  weight: HoloWeight
  autoSpin: boolean
  speed: number   // seconds per full rotation
}

// ── Default ───────────────────────────────────────────────────

export const defaultConfig: HoloTextConfig = {
  lines: [
    { id: "1", text: "EX WISEY" },
  ],
  size: "lg",
  weight: "bold",
  autoSpin: false,
  speed: 8,
}

// ── Sizes / weights ───────────────────────────────────────────

const SIZE_CLASS: Record<HoloSize, string> = {
  xs: "text-sm",
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl",
}

const WEIGHT_CLASS: Record<HoloWeight, string> = {
  normal:   "font-(--theme-font-weight)",
  semibold: "font-(--theme-font-weight)",
  bold:     "font-(--theme-font-weight)",
}

const HOLO_BG = "conic-gradient(from var(--holo-angle), oklch(0.72 0.22 180) 0%, oklch(0.72 0.22 240) 20%, oklch(0.72 0.22 300) 40%, oklch(0.72 0.22 0) 60%, oklch(0.72 0.22 60) 80%, oklch(0.72 0.22 120) 100%)"

// ── Config surface ────────────────────────────────────────────

export function HoloTextConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as HoloTextConfig
  const lines  = typed.lines ?? defaultConfig.lines

  function updateLine(id: string, text: string) {
    onChange({ ...typed, lines: lines.map(l => l.id === id ? { ...l, text } : l) })
  }

  function addLine() {
    onChange({ ...typed, lines: [...lines, { id: String(Date.now()), text: "" }] })
  }

  function removeLine(id: string) {
    if (lines.length <= 1) return
    onChange({ ...typed, lines: lines.filter(l => l.id !== id) })
  }

  const SIZES:   HoloSize[]   = ["xs", "sm", "md", "lg", "xl"]
  const WEIGHTS: HoloWeight[] = ["normal", "semibold", "bold"]

  return (
    <div className="space-y-3">

      {/* Size */}
      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Size</p>
        <div className="flex gap-0.5">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => onChange({ ...typed, size: s })}
              className={cx(
                "flex-1 py-1 text-[9px] font-(--theme-font-weight) border border-line transition-colors",
                typed.size === s ? "bg-foreground text-background border-foreground" : "text-mute-fg hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Weight</p>
        <div className="flex gap-0.5">
          {WEIGHTS.map(w => (
            <button
              key={w}
              onClick={() => onChange({ ...typed, weight: w })}
              className={cx(
                "flex-1 py-1 text-[9px] font-(--theme-font-weight) border border-line transition-colors",
                typed.weight === w ? "bg-foreground text-background border-foreground" : "text-mute-fg hover:text-foreground"
              )}
            >
              {w === "semibold" ? "semi" : w}
            </button>
          ))}
        </div>
      </div>

      {/* Auto spin + speed */}
      <div className="space-y-2">
        <CheckboxItem
          label="Auto spin (vs mouse-driven)"
          checked={typed.autoSpin ?? false}
          onCheckedChange={v => onChange({ ...typed, autoSpin: v })}
        />
        {typed.autoSpin && (
          <div className="flex items-center gap-2 pl-5">
            <span className="text-[9px] text-mute-fg/40 shrink-0">speed</span>
            <input
              type="range"
              min={2}
              max={30}
              value={typed.speed ?? 8}
              onChange={e => onChange({ ...typed, speed: Number(e.target.value) })}
              className="flex-1 h-1 accent-foreground"
            />
          </div>
        )}
      </div>

      <div className="border-t border-line/50" />

      {/* Lines */}
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Lines</p>
        <button
          onClick={addLine}
          className="flex items-center gap-1 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors"
        >
          <Plus className="size-2.5" />Add
        </button>
      </div>

      {lines.map(line => (
        <div key={line.id} className="flex items-center gap-1.5 group">
          <input
            value={line.text}
            onChange={e => updateLine(line.id, e.target.value)}
            placeholder="Text"
            className="flex-1 bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
          />
          <button
            onClick={() => removeLine(line.id)}
            disabled={lines.length <= 1}
            className={cx(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              lines.length > 1 ? "text-mute-fg/50 hover:text-foreground" : "text-mute-fg/20"
            )}
          >
            <X className="size-2.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────

export function HoloTextPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as HoloTextConfig | undefined) ?? defaultConfig
  const { lines, size, weight, autoSpin, speed } = config

  useEffect(() => {
    onFooter?.(null)
  }, [onFooter])

  const textStyle: React.CSSProperties = {
    background: HOLO_BG,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    ...(autoSpin ? { animation: `holo-spin ${speed}s linear infinite` } : {}),
  }

  const body = (
    <div className="flex flex-col h-full overflow-hidden">

      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="flex flex-col items-center justify-center min-h-full gap-2 px-6 py-4">
        {lines.map(line => (
          <p
            key={line.id}
            className={cx(
              "uppercase tracking-(--theme-letter-spacing) leading-none select-none text-center",
              SIZE_CLASS[size],
              WEIGHT_CLASS[weight],
            )}
            style={textStyle}
          >
            {line.text || "\u00a0"}
          </p>
        ))}
      </div>
      </div>
    </div>
  )

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
