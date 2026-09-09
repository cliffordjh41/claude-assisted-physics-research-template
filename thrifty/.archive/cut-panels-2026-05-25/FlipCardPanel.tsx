
export const meta = { id: "flip-surface", label: "Flip Card", tier: "utility" as const, placement: "any" as const }

import { useState, useEffect } from "react"
import { FlipContainer } from "../ui/flip-container"
import { Copy, Check, X, Plus } from "lucide-react"
import type { PanelProps } from "../../types/panel"
import { CheckboxItem } from "../panel-primitives"

interface FlipCard {
  id: string
  front: string
  back: string
}

export interface FlipCardConfig {
  cards: FlipCard[]
  allowAdd: boolean
}

export const defaultConfig: FlipCardConfig = {
  cards: [
    { id: "1", front: "EX WISEY", back: "Application Design" },
    { id: "2", front: "STUDIO", back: "Layouts · Themes · Exports" },
    { id: "3", front: "STAGE", back: "Verified Project Specs" },
  ],
  allowAdd: false,
}

export function FlipCardConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as FlipCardConfig
  const cards = typed.cards ?? defaultConfig.cards

  function update(next: FlipCardConfig) {
    onChange(next as unknown as Record<string, unknown>)
  }

  function updateCard(id: string, field: "front" | "back", value: string) {
    update({ ...typed, cards: cards.map(c => c.id === id ? { ...c, [field]: value } : c) })
  }

  function addCard() {
    update({ ...typed, cards: [...cards, { id: `fc-${Date.now()}`, front: "", back: "" }] })
  }

  function removeCard(id: string) {
    if (cards.length <= 1) return
    update({ ...typed, cards: cards.filter(c => c.id !== id) })
  }

  return (
    <div className="space-y-3">
      <CheckboxItem
        label="Allow Add"
        checked={typed.allowAdd ?? defaultConfig.allowAdd}
        onCheckedChange={v => update({ ...typed, allowAdd: v as boolean })}
      />
      <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Cards</p>
      {cards.map(card => (
        <div key={card.id} className="space-y-1 group">
          <div className="flex items-center gap-1.5">
            <input
              value={card.front}
              onChange={e => updateCard(card.id, "front", e.target.value)}
              placeholder="Front"
              className="flex-1 bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
            />
            <button
              onClick={() => removeCard(card.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground shrink-0"
            >
              <X className="size-2.5" />
            </button>
          </div>
          <input
            value={card.back}
            onChange={e => updateCard(card.id, "back", e.target.value)}
            placeholder="Back"
            className="w-full bg-transparent text-[10px] text-mute-fg border-b border-line/50 focus:border-foreground outline-none py-0.5"
          />
        </div>
      ))}
      <button
        onClick={addCard}
        className="flex items-center gap-1 pt-0.5 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors"
      >
        <Plus className="size-2.5" />Add Card
      </button>
    </div>
  )
}

function FlipCardItem({ card }: { card: FlipCard }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(card.back)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  return (
    <FlipContainer
      className="aspect-[3/2]"
      front={
        <div className="w-full h-full flex items-center justify-center border border-line rounded-md bg-background">
          <span className="text-[11px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">{card.front}</span>
        </div>
      }
      back={
        <div className="w-full h-full flex flex-col items-center justify-center border border-line rounded-md bg-background px-3 gap-2">
          <p className="text-[10px] text-center text-mute-fg uppercase tracking-(--theme-letter-spacing) leading-relaxed">
            {card.back}
          </p>
          <button
            onClick={handleCopy}
            className="p-1 rounded-lg text-mute-fg hover:text-foreground transition-colors"
          >
            {copied ? <Check className="size-2.5" /> : <Copy className="size-2.5" />}
          </button>
        </div>
      }
    />
  )
}

export function FlipCardPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as unknown as FlipCardConfig | undefined) ?? defaultConfig
  const cards = config.cards

  useEffect(() => {
    onFooter?.(
      <div className="flex-1 py-3 px-3 flex items-center justify-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {cards.length} Cards
        </span>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, cards.length])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 @container">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
          {cards.map((card) => (
            <FlipCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}
