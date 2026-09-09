export const meta = { id: "card-game", label: "Card Game", tier: "utility" as const, placement: "any" as const }

import { useState, useEffect } from "react"
import { RotateCcw, Plus, X } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"
import { FlipContainer } from "../ui/flip-container"
import { CheckboxItem } from "../panel-primitives"
import { Label } from "../ui/label"

// ── Types ─────────────────────────────────────────────────────

interface CardDef {
  id: string
  front: string
  back: string
  hue: number   // 0-360 — back face tint
}

interface CardGameConfig {
  cards: CardDef[]
  columns: 2 | 3 | 4
  interactive: boolean
  startFaceDown: boolean
}

const SUITS: { sym: string; hue: number }[] = [
  { sym: "♠", hue: 220 },
  { sym: "♥", hue: 0   },
  { sym: "♦", hue: 30  },
  { sym: "♣", hue: 150 },
]
const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]

function buildDeck(): CardDef[] {
  const cards: CardDef[] = []
  let n = 1
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ id: String(n++), front: `${rank}${suit.sym}`, back: "✦", hue: suit.hue })
    }
  }
  cards.push({ id: String(n++), front: "JOKER", back: "✦", hue: 180 })
  cards.push({ id: String(n++), front: "JOKER", back: "✦", hue: 200 })
  return cards
}

export const defaultConfig: CardGameConfig = {
  columns: 4,
  interactive: true,
  startFaceDown: true,
  cards: buildDeck(),
}

// ── Config surface ────────────────────────────────────────────

export function CardGameConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as CardGameConfig
  const cards = typed.cards ?? defaultConfig.cards

  function updateCard(id: string, field: keyof CardDef, value: string | number) {
    onChange({ ...typed, cards: cards.map(c => c.id === id ? { ...c, [field]: value } : c) })
  }

  function addCard() {
    const hues = [0, 30, 150, 220]
    onChange({
      ...typed,
      cards: [...cards, { id: String(Date.now()), front: "", back: "✦", hue: hues[cards.length % 4] }],
    })
  }

  function removeCard(id: string) {
    if (cards.length <= 1) return
    onChange({ ...typed, cards: cards.filter(c => c.id !== id) })
  }

  return (
    <div className="space-y-3">
      {/* Columns */}
      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Columns</p>
        <div className="flex gap-1">
          {([2, 3, 4] as const).map(n => (
            <button
              key={n}
              onClick={() => onChange({ ...typed, columns: n })}
              className={cx(
                "flex-1 py-1 text-[10px] font-(--theme-font-weight) border border-line transition-colors",
                typed.columns === n
                  ? "bg-foreground text-background border-foreground"
                  : "text-mute-fg hover:text-foreground"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-1.5">
        <CheckboxItem
          label="Interactive (click to flip)"
          checked={typed.interactive ?? true}
          onCheckedChange={v => onChange({ ...typed, interactive: v })}
        />
        <CheckboxItem
          label="Start face-down"
          checked={typed.startFaceDown ?? true}
          onCheckedChange={v => onChange({ ...typed, startFaceDown: v })}
        />
      </div>

      {/* Cards */}
      <div>
        <div className="flex items-center justify-between pb-1.5">
          <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Cards</p>
          <button
            onClick={addCard}
            className="flex items-center gap-1 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors"
          >
            <Plus className="size-2.5" />Add
          </button>
        </div>
        <div className="space-y-1">
          {cards.map(card => (
            <div key={card.id} className="flex items-center gap-1.5 group">
              <input
                value={card.front}
                onChange={e => updateCard(card.id, "front", e.target.value)}
                placeholder="Front"
                className="w-14 shrink-0 bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
              />
              <input
                value={card.back}
                onChange={e => updateCard(card.id, "back", e.target.value)}
                placeholder="Back"
                className="w-10 shrink-0 bg-transparent text-[10px] text-mute-fg border-b border-line focus:border-foreground outline-none py-0.5"
              />
              <div className="flex items-center gap-1 flex-1">
                <Label className="text-[9px] text-mute-fg/40">hue</Label>
                <input
                  type="range"
                  min={0}
                  max={359}
                  value={card.hue}
                  onChange={e => updateCard(card.id, "hue", Number(e.target.value))}
                  className="flex-1 h-1 accent-foreground"
                />
              </div>
              <button
                onClick={() => removeCard(card.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Joker face ────────────────────────────────────────────────

function JokerFace() {
  return (
    <div className="w-full h-full bg-background border border-line flex items-center justify-center overflow-hidden relative">
      {/* holo shimmer */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          background: "conic-gradient(from var(--holo-angle), oklch(0.72 0.22 180) 0%, oklch(0.72 0.22 240) 20%, oklch(0.72 0.22 300) 40%, oklch(0.72 0.22 0) 60%, oklch(0.72 0.22 60) 80%, oklch(0.72 0.22 120) 100%)",
          animation: "holo-spin 8s linear infinite",
        }}
      />
      {/* Wisey */}
      <div
        className="flex flex-col items-center select-none"
        style={{
          animation: "wisey-float 3s ease-in-out infinite",
          filter: "drop-shadow(0 0 5px oklch(0.72 0.22 200 / 0.45))",
        }}
      >
        <pre className="text-[7px] leading-[1.15] text-foreground/50 font-mono m-0 text-center">{`_____\n▟▗▄▄▄▖▙\n█▐▙█▟▌█\n▗▜███▛▖\n▝▝ ▘▘`}</pre>
        <span className="text-[6px] uppercase tracking-(--theme-letter-spacing) text-mute-fg/30 mt-1.5 font-(--theme-font-weight)">joker</span>
      </div>
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────

export function CardGamePanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as CardGameConfig | undefined) ?? defaultConfig
  const { cards, columns, interactive, startFaceDown } = config

  // flip state per card — keyed by card id
  const [flipped, setFlipped] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(cards.map(c => [c.id, !startFaceDown]))
  )

  // deal animation — cards enter staggered
  const [dealtIds, setDealtIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const timeouts = cards.map((card, i) =>
      setTimeout(() => setDealtIds(prev => new Set([...prev, card.id])), i * 70)
    )
    return () => timeouts.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps — intentional mount-only deal

  function resetDeck() {
    setFlipped(Object.fromEntries(cards.map(c => [c.id, !startFaceDown])))
  }

  const faceUpCount = Object.values(flipped).filter(Boolean).length

  useEffect(() => {
    onFooter?.(
      <div className="flex items-stretch flex-1">
        <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {faceUpCount} / {cards.length} revealed
        </span>
        <button
          onClick={resetDeck}
          className="px-3 border-l border-line text-mute-fg hover:text-foreground transition-colors"
        >
          <RotateCcw className="size-3" />
        </button>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, faceUpCount, cards.length])

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns]

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className={cx("grid gap-2", gridCols)}>
          {cards.map((card) => {
            const isDealt = dealtIds.has(card.id)
            return (
              <div
                key={card.id}
                style={{
                  opacity: isDealt ? 1 : 0,
                  transform: isDealt ? "none" : "translateY(10px) rotate(-3deg)",
                  transition: "opacity 220ms ease-out, transform 220ms ease-out",
                }}
              >
                <FlipContainer
                  flipped={flipped[card.id] ?? false}
                  onFlipChange={interactive ? (v) => setFlipped(prev => ({ ...prev, [card.id]: v })) : undefined}
                  className={cx("aspect-[2.5/3.5] w-full", !interactive && "cursor-default")}
                  front={
                    card.front === "JOKER"
                      ? <JokerFace />
                      : <div className="w-full h-full border border-line bg-background flex flex-col items-center justify-center gap-0.5">
                          <span className="text-[13px] font-(--theme-font-weight) leading-none text-foreground select-none">
                            {card.front}
                          </span>
                        </div>
                  }
                  back={
                    <div
                      className="w-full h-full border border-line flex items-center justify-center"
                      style={{ background: `oklch(0.18 0.06 ${card.hue})` }}
                    >
                      <span className="text-[10px] text-white/20 select-none">{card.back}</span>
                    </div>
                  }
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
