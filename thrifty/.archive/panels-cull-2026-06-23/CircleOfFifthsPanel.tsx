import { useState, useMemo } from "react"
import { ChevronLeft } from "lucide-react"
import type { PanelProps } from "../../types/panel"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import {
  SlidingPanels,
  SlidingPanel,
  SlidingPanelContent,
} from "../ui/sliding-panels"

interface KeyData {
  position: number
  major: string
  minor: string
  sharps: number
  flats: number
}

const KEYS: KeyData[] = [
  { position: 0,  major: "C",  minor: "Am",   sharps: 0, flats: 0 },
  { position: 1,  major: "G",  minor: "Em",   sharps: 1, flats: 0 },
  { position: 2,  major: "D",  minor: "Bm",   sharps: 2, flats: 0 },
  { position: 3,  major: "A",  minor: "F♯m",  sharps: 3, flats: 0 },
  { position: 4,  major: "E",  minor: "C♯m",  sharps: 4, flats: 0 },
  { position: 5,  major: "B",  minor: "G♯m",  sharps: 5, flats: 0 },
  { position: 6,  major: "F♯", minor: "D♯m",  sharps: 6, flats: 0 },
  { position: 7,  major: "D♭", minor: "B♭m",  sharps: 0, flats: 5 },
  { position: 8,  major: "A♭", minor: "Fm",   sharps: 0, flats: 4 },
  { position: 9,  major: "E♭", minor: "Cm",   sharps: 0, flats: 3 },
  { position: 10, major: "B♭", minor: "Gm",   sharps: 0, flats: 2 },
  { position: 11, major: "F",  minor: "Dm",   sharps: 0, flats: 1 },
]

const CX = 150
const CY = 150
const R_OUTER = 118
const R_INNER = 56
const GAP = 1.5

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function wedgePath(cx: number, cy: number, r1: number, r2: number, startAngle: number, endAngle: number) {
  const s1 = polarToCartesian(cx, cy, r1, startAngle)
  const e1 = polarToCartesian(cx, cy, r1, endAngle)
  const s2 = polarToCartesian(cx, cy, r2, endAngle)
  const e2 = polarToCartesian(cx, cy, r2, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${s1.x} ${s1.y} A ${r1} ${r1} 0 ${largeArc} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${r2} ${r2} 0 ${largeArc} 0 ${e2.x} ${e2.y} Z`
}

function labelPos(i: number) {
  const mid = i * 30 + 15
  return polarToCartesian(CX, CY, (R_OUTER + R_INNER) / 2, mid)
}

function keyColor(index: number, active: boolean, hovered: boolean) {
  const l = active ? 0.78 : hovered ? 0.70 : 0.60
  const c = active ? 0.20 : hovered ? 0.17 : 0.14
  return `oklch(${l} ${c} ${index * 30})`
}

export function CircleOfFifthsPanel({ onFooter }: PanelProps) {
  const [panelIndex, setPanelIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState<KeyData | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  function selectKey(key: KeyData) {
    setSelectedKey(key)
    setPanelIndex(1)
  }

  const footer = useMemo(
    () =>
      panelIndex === 1 && selectedKey ? (
        <>
          <button
            onClick={() => { setSelectedKey(null); setPanelIndex(0) }}
            className="px-3 flex items-center gap-1.5 text-mute-fg hover:text-foreground transition-colors border-r border-line"
          >
            <ChevronLeft className="size-3" />
            <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">Circle</span>
          </button>
          <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            {selectedKey.major} / {selectedKey.minor}
          </span>
        </>
      ) : null,
    [panelIndex, selectedKey]
  )

  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  // Focus = hovered if any, else currently selected. Drives the center
  // label and the dim-other-wedges treatment.
  const focusedIndex = hoveredIndex ?? selectedKey?.position ?? null
  const focusedKey = focusedIndex !== null ? KEYS[focusedIndex] : null

  const circleView = (
    <div className="h-full w-full grid place-items-center p-3 text-foreground">
      <svg
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
        className="block"
        style={{ width: "100%", height: "100%", maxWidth: 280, maxHeight: 280 }}
      >
        {KEYS.map((key, i) => {
          const start = i * 30 + GAP / 2
          const end = (i + 1) * 30 - GAP / 2
          const pos = labelPos(i)
          const isHovered = hoveredIndex === i
          const isSelected = selectedKey?.position === i
          const isFocused = isHovered || isSelected
          const dim = focusedIndex !== null && !isFocused

          return (
            <g key={key.position}>
              <path
                d={wedgePath(CX, CY, R_OUTER, R_INNER, start, end)}
                fill={keyColor(i, isSelected, isHovered)}
                stroke="currentColor"
                strokeWidth={isSelected ? 1.5 : isHovered ? 0.75 : 0}
                style={{
                  transition:
                    "fill 250ms ease-out, stroke-width 200ms ease-out, opacity 200ms ease-out",
                  opacity: dim ? 0.5 : 1,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => selectKey(key)}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={key.major.length > 2 ? 10 : 12}
                fill="currentColor"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  transition: "opacity 200ms ease-out",
                  opacity: dim ? 0.5 : 1,
                }}
              >
                {key.major}
              </text>
            </g>
          )
        })}
        {/* Center label — major name large, relative minor below.
            Animates opacity in/out as focus enters / leaves. */}
        <g
          style={{
            transition: "opacity 200ms ease-out",
            opacity: focusedKey ? 1 : 0,
            pointerEvents: "none",
          }}
        >
          <text
            x={CX}
            y={CY - 4}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="36"
            fill="currentColor"
            style={{ userSelect: "none" }}
          >
            {focusedKey?.major ?? ""}
          </text>
          <text
            x={CX}
            y={CY + 22}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fill="currentColor"
            opacity="0.55"
            style={{ userSelect: "none" }}
          >
            {focusedKey?.minor ?? ""}
          </text>
        </g>
      </svg>
    </div>
  )

  const detailView = selectedKey ? (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="min-h-full w-full flex flex-col items-center justify-center p-8 gap-6">
        <div
          className="w-20 h-20 shrink-0 rounded-full"
          style={{ background: keyColor(selectedKey.position, true, false) }}
        />
        <div className="text-center space-y-1">
          <p className="text-3xl uppercase tracking-(--theme-letter-spacing) text-foreground">
            {selectedKey.major}
          </p>
          <p className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            {selectedKey.minor} relative minor
          </p>
        </div>
        <div className="flex justify-center gap-10">
          {selectedKey.sharps > 0 && (
            <div className="text-center">
              <p className="text-2xl text-foreground">{selectedKey.sharps}♯</p>
              <p className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg mt-1">sharps</p>
            </div>
          )}
          {selectedKey.flats > 0 && (
            <div className="text-center">
              <p className="text-2xl text-foreground">{selectedKey.flats}♭</p>
              <p className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg mt-1">flats</p>
            </div>
          )}
          {selectedKey.sharps === 0 && selectedKey.flats === 0 && (
            <div className="text-center">
              <p className="text-2xl text-foreground">♮</p>
              <p className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg mt-1">natural</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">
        <SlidingPanels activeIndex={panelIndex} onIndexChange={setPanelIndex} className="h-full">
          <SlidingPanel>
            <SlidingPanelContent className="!p-0 !overflow-hidden h-full">
              {circleView}
            </SlidingPanelContent>
          </SlidingPanel>
          <SlidingPanel>
            <SlidingPanelContent className="!p-0 h-full flex flex-col">
              {detailView}
            </SlidingPanelContent>
          </SlidingPanel>
        </SlidingPanels>
      </div>
      {footerEl}
    </div>
  )
}
