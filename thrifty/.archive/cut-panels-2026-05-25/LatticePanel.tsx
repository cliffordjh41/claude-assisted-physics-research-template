export const meta = { id: "lattice", label: "Lattice", tier: "content" as const, placement: "any" as const }

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, Plus, Minus } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"
import {
  SlidingPanels,
  SlidingPanel,
  SlidingPanelContent,
} from "../ui/sliding-panels"
import { positionToOklch, type ColorMode } from "../../lib/lattice-color"

// ── Lattice geometry ──────────────────────────────────────────
// Ported from ephemeratory/prototypes/orbital-clock — Lattice2DBase.tsx
// count(n) = 3 × 4^n positions at iteration n

interface LatVertex {
  id: string
  iteration: number
  index: number
  x: number
  y: number
}

interface LatEdge {
  from: string
  to: string
}

function generateRing(iteration: number, cx: number, cy: number, r: number): LatVertex[] {
  const count = 3 * Math.pow(4, iteration)
  const step = (2 * Math.PI) / count
  const vertices: LatVertex[] = []
  for (let i = 0; i < count; i++) {
    const angle = i * step - Math.PI / 2 // start from top
    vertices.push({
      id: `i${iteration}:v${i}`,
      iteration,
      index: i,
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    })
  }
  return vertices
}

function generateEdges(inner: LatVertex[], outer: LatVertex[]): LatEdge[] {
  const edges: LatEdge[] = []
  const ratio = outer.length / inner.length // always 4
  for (let i = 0; i < inner.length; i++) {
    for (let j = 0; j < ratio; j++) {
      const outerIdx = (i * ratio + j) % outer.length
      edges.push({ from: inner[i].id, to: outer[outerIdx].id })
    }
  }
  return edges
}

const COLOR_MODES: ColorMode[] = ['positional', 'ternary', 'sixfold', 'photonic']
const MODE_ABBR: Record<ColorMode, string> = { positional: 'pos', ternary: 'ter', sixfold: 'six', photonic: 'pho' }

function vertexColor(iteration: number, index: number, active: boolean, hovered: boolean, colorMode: ColorMode): string {
  return positionToOklch(index, iteration, colorMode, 'future', active, hovered)
}

// ── Panel ──────────────────────────────────────────────────────

const CX = 150
const CY = 150
const RING_SPACING = 44
const EPOCH_R = 5
const VERTEX_R = [5, 3.5, 2.5] // radius per iteration 0,1,2

interface SelectedVertex {
  iteration: number
  index: number
  count: number
  color: string
}

export function LatticePanel({ onFooter }: PanelProps) {
  const [panelIndex, setPanelIndex] = useState(0)
  const [maxIteration, setMaxIteration] = useState(1)
  const [colorMode, setColorMode] = useState<ColorMode>('positional')
  const [selected, setSelected] = useState<SelectedVertex | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  function cycleColorMode() {
    setColorMode(m => {
      const i = COLOR_MODES.indexOf(m)
      return COLOR_MODES[(i + 1) % COLOR_MODES.length]
    })
  }

  const { rings, allEdges, vertexMap } = useMemo(() => {
    const rings: LatVertex[][] = []
    for (let i = 0; i <= maxIteration; i++) {
      rings.push(generateRing(i, CX, CY, RING_SPACING * (i + 1)))
    }
    const allEdges: LatEdge[] = []
    for (let i = 0; i < rings.length - 1; i++) {
      allEdges.push(...generateEdges(rings[i], rings[i + 1]))
    }
    const vertexMap = new Map<string, LatVertex>()
    rings.forEach(ring => ring.forEach(v => vertexMap.set(v.id, v)))
    return { rings, allEdges, vertexMap }
  }, [maxIteration])

  function selectVertex(v: LatVertex) {
    const count = 3 * Math.pow(4, v.iteration)
    setSelected({
      iteration: v.iteration,
      index: v.index,
      count,
      color: vertexColor(v.iteration, v.index, true, false, colorMode),
    })
    setPanelIndex(1)
  }

  useEffect(() => {
    if (panelIndex === 1 && selected) {
      onFooter?.(
        <div className="flex items-stretch flex-1">
          <button
            onClick={() => setPanelIndex(0)}
            className="px-3 flex items-center gap-1.5 text-mute-fg hover:text-foreground transition-colors border-r border-line"
          >
            <ChevronLeft className="size-3" />
            <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">Lattice</span>
          </button>
          <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            iter {selected.iteration} · {selected.index + 1} / {selected.count}
          </span>
        </div>
      )
    } else {
      onFooter?.(
        <div className="flex items-stretch flex-1">
          <button
            onClick={() => setMaxIteration(i => Math.max(0, i - 1))}
            disabled={maxIteration === 0}
            className={cx(
              "px-3 border-r border-line transition-colors",
              maxIteration > 0 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20"
            )}
          >
            <Minus className="size-3" />
          </button>
          <button
            onClick={cycleColorMode}
            className="flex-1 flex items-center justify-center text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors"
          >
            {MODE_ABBR[colorMode]} · iter {maxIteration} · {3 * Math.pow(4, maxIteration)}
          </button>
          <button
            onClick={() => setMaxIteration(i => Math.min(2, i + 1))}
            disabled={maxIteration === 2}
            className={cx(
              "px-3 border-l border-line transition-colors",
              maxIteration < 2 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20"
            )}
          >
            <Plus className="size-3" />
          </button>
        </div>
      )
    }
    return () => onFooter?.(null)
  }, [onFooter, panelIndex, selected, maxIteration, colorMode])

  const latticeView = (
    <div className="flex-1 min-h-0 flex items-center justify-center p-2">
      <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%", maxWidth: 280, maxHeight: 280 }}>
        {/* Edges */}
        {allEdges.map((edge, i) => {
          const a = vertexMap.get(edge.from)
          const b = vertexMap.get(edge.to)
          if (!a || !b) return null
          return (
            <line
              key={i}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={0.5}
            />
          )
        })}

        {/* Epoch node */}
        <circle
          cx={CX} cy={CY} r={EPOCH_R}
          fill="currentColor"
          fillOpacity={0.25}
        />

        {/* Ring vertices */}
        {rings.map(ring =>
          ring.map(v => {
            const isHovered = hoveredId === v.id
            const isSelected = selected?.iteration === v.iteration && selected?.index === v.index
            const r = VERTEX_R[v.iteration] ?? 2
            return (
              <circle
                key={v.id}
                cx={v.x}
                cy={v.y}
                r={isHovered || isSelected ? r + 1.5 : r}
                fill={vertexColor(v.iteration, v.index, isSelected, isHovered, colorMode)}
                style={{ cursor: "pointer", transition: "r 0.1s, fill 0.1s" }}
                onMouseEnter={() => setHoveredId(v.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => selectVertex(v)}
              />
            )
          })
        )}
      </svg>
    </div>
  )

  const detailView = selected ? (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-6 flex flex-col items-center gap-5">
        <div className="w-10 h-10 rounded-full" style={{ background: selected.color }} />
        <div className="text-center space-y-1">
          <p className="text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground">
            Position {selected.index + 1}
          </p>
          <p className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            Iteration {selected.iteration}
          </p>
        </div>
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-sm font-(--theme-font-weight) text-foreground">{selected.count}</p>
            <p className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg mt-0.5">nodes this ring</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-(--theme-font-weight) text-foreground">
              {(((selected.index) / selected.count) * 360).toFixed(1)}°
            </p>
            <p className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg mt-0.5">angular position</p>
          </div>
        </div>
        <div className="w-full border-t border-line pt-4 space-y-1.5">
          <p className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 text-center">
            3 × 4^{selected.iteration} = {selected.count}
          </p>
        </div>
      </div>
    </div>
  ) : null

  const body = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 h-11 border-b border-line flex items-center justify-between px-3">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Lattice
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <SlidingPanels activeIndex={panelIndex} onIndexChange={setPanelIndex} className="h-full">
          <SlidingPanel>
            <SlidingPanelContent className="!p-0 h-full">
              {latticeView}
            </SlidingPanelContent>
          </SlidingPanel>
          <SlidingPanel>
            <SlidingPanelContent className="!p-0 h-full flex flex-col">
              {detailView}
            </SlidingPanelContent>
          </SlidingPanel>
        </SlidingPanels>
      </div>

    </div>
  )

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
