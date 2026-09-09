import { useEffect } from "react"
import { cx } from "../../lib/utils"
import { useMouseParallax } from "../../hooks/use-mouse-parallax"
import type { PanelProps } from "../../types/panel"

// ── Types ─────────────────────────────────────────────────────

export interface DepthLayer {
  id: string
  heading: string
  body: string
  depth: number   // 0 = background (no movement), 1 = foreground (full movement)
  align?: "top" | "center" | "bottom" // vertical band within the stage. Default center.
}

export interface DepthConfig {
  layers: DepthLayer[]
  intensity: number   // 1–40 — pixel range of movement at depth=1
  perspective: number // 400–1200 — lower = more dramatic depth
  textScale?: number  // optional multiplier on per-layer heading + body fontSize. Default 1.
}

// ── Default ───────────────────────────────────────────────────

const defaultConfig: DepthConfig = {
  intensity: 20,
  perspective: 700,
  layers: [
    { id: "layer-bg",  heading: "",         body: "",                   depth: 0.1 },
    { id: "layer-mid", heading: "Depth", body: "Midground", depth: 0.5 },
    { id: "layer-fg",  heading: "",         body: "Foreground",         depth: 1.0 },
  ],
}

// ── Panel ─────────────────────────────────────────────────────

export function DepthPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as unknown as DepthConfig | undefined) ?? defaultConfig
  const layers = config.layers ?? defaultConfig.layers
  const intensity = config.intensity ?? 20
  const perspective = config.perspective ?? 700
  const textScale = config.textScale ?? 1

  const { containerRef, offsets } = useMouseParallax()

  useEffect(() => {
    onFooter?.(null)
    return () => onFooter?.(null)
  }, [onFooter])

  const body = (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Stage — perspective container */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-crosshair"
        style={{ perspective: `${perspective}px` }}
      >
        {/* Sort layers: lowest depth rendered first (furthest back) */}
        {[...layers].sort((a, b) => a.depth - b.depth).map(layer => {
          const tx = offsets.x * intensity * layer.depth
          const ty = offsets.y * intensity * layer.depth
          const tz = layer.depth * 60  // z-lift proportional to depth

          return (
            <div
              key={layer.id}
              className={cx(
                "absolute inset-0 flex justify-center",
                layer.align === "top" && "items-start pt-[18%]",
                layer.align === "bottom" && "items-end pb-[18%]",
                (!layer.align || layer.align === "center") && "items-center",
              )}
              style={{
                transform: `translateZ(${tz}px) translateX(${tx}px) translateY(${ty}px)`,
                transition: "transform 0.12s ease-out",
                transformStyle: "preserve-3d",
              }}
            >
              {(layer.heading || layer.body) && (
                <div className="text-center px-6 select-none pointer-events-none">
                  {layer.heading && (
                    <p
                      className="font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground"
                      style={{ fontSize: `${(10 + layer.depth * 8) * textScale}px`, opacity: 0.4 + layer.depth * 0.6 }}
                    >
                      {layer.heading}
                    </p>
                  )}
                  {layer.body && (
                    <p
                      className="text-mute-fg mt-1"
                      style={{ fontSize: `${(9 + layer.depth * 4) * textScale}px`, opacity: 0.3 + layer.depth * 0.5 }}
                    >
                      {layer.body}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}

      </div>
    </div>
  )

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
