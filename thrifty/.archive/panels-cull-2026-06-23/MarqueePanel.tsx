import { useState, useEffect, useMemo, useRef } from "react"
import { cx } from "../../lib/utils"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import type { PanelProps } from "../../types/panel"

// ── Types ─────────────────────────────────────────────────────

type ScrollDirection = "up" | "down" | "left" | "right"

interface MarqueeColumn {
  id: string
  label: string
  items: string[]
  direction: ScrollDirection
  duration: number
}

export interface MarqueeConfig {
  columns: MarqueeColumn[]
  holo: boolean
  holoText: boolean
  maskEdges: boolean
  pauseOnHover: boolean
}

// ── Default ───────────────────────────────────────────────────

const defaultConfig: MarqueeConfig = {
  holo: true,
  holoText: false,
  maskEdges: true,
  pauseOnHover: true,
  columns: [
    {
      id: "1", label: "Audio", direction: "up", duration: 30,
      items: ["Ableton", "Arturia", "iZotope", "Samples From Mars", "Sound Toys", "Universal Audio", "XLN", "Beyerdynamic", "Fender", "G&L", "Gretsch", "Hofner"],
    },
    {
      id: "2", label: "Dev", direction: "down", duration: 20,
      items: ["React", "TypeScript", "Vite", "Tailwind CSS", "Radix UI", "Zustand", "Supabase", "Stripe", "React Router", "CVA", "Rust", "Claude Code"],
    },
  ],
}

// ── FitText ───────────────────────────────────────────────────
// Scales text horizontally to fill its column width.

const HOLO_BG = "conic-gradient(from var(--holo-angle), oklch(0.72 0.22 180) 0%, oklch(0.72 0.22 240) 20%, oklch(0.72 0.22 300) 40%, oklch(0.72 0.22 0) 60%, oklch(0.72 0.22 60) 80%, oklch(0.72 0.22 120) 100%)"

function FitText({ children, className, spanStyle }: { children: string; className?: string; spanStyle?: React.CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return
    text.style.transform = "scaleX(1)"
    const containerW = container.clientWidth
    const textW = text.scrollWidth
    if (textW > 0) setScale(containerW / textW)
  }, [children])

  return (
    <div ref={containerRef} className={cx("w-full flex justify-center", className)}>
      <span
        ref={textRef}
        className="inline-block origin-center whitespace-nowrap"
        style={{ transform: `scaleX(${scale})`, ...spanStyle }}
      >
        {children}
      </span>
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────

const ANIM: Record<ScrollDirection, string> = {
  up:    "animate-scroll-up",
  down:  "animate-scroll-down",
  left:  "animate-scroll-left",
  right: "animate-scroll-right",
}

export function MarqueePanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as MarqueeConfig | undefined) ?? defaultConfig
  const { columns, holo, holoText, maskEdges, pauseOnHover } = config

  const holoTextStyle: React.CSSProperties = {
    background: HOLO_BG,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  }

  const footer = useMemo(
    () => (
      <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
        {columns.length} {columns.length === 1 ? "column" : "columns"}
      </span>
    ),
    [columns.length]
  )

  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  const body = (
    <div className="flex flex-col h-full overflow-hidden relative">

      {/* Holo overlay — only when holoText is off; text IS the holo when holoText is on */}
      {holo && !holoText && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "conic-gradient(from var(--holo-angle), oklch(0.72 0.22 180) 0%, oklch(0.72 0.22 240) 20%, oklch(0.72 0.22 300) 40%, oklch(0.72 0.22 0) 60%, oklch(0.72 0.22 60) 80%, oklch(0.72 0.22 120) 100%)",
            animation: "holo-spin 8s linear infinite",
            opacity: 0.07,
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Columns */}
      <div
        className="flex-1 min-h-0 grid overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
      >
        {columns.map((col, i) => {
          const isVertical = col.direction === "up" || col.direction === "down"
          const triple = [...col.items, ...col.items, ...col.items]

          const maskStyle = maskEdges
            ? isVertical
              ? { maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)" }
              : { maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }
            : {}

          return (
            <div
              key={col.id}
              className={cx(
                "flex flex-col overflow-hidden",
                i < columns.length - 1 && "border-r border-line/20"
              )}
            >
              {/* Column label */}
              <div className="shrink-0 py-2 flex items-center justify-center border-b border-line/20">
                <span className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
                  {col.label}
                </span>
              </div>

              {/* Scrolling track */}
              <div
                className={cx("flex-1 overflow-hidden relative", pauseOnHover && "group")}
                style={maskStyle}
              >
                {isVertical ? (
                  <div
                    className={cx(
                      "flex flex-col",
                      ANIM[col.direction],
                      pauseOnHover && "group-hover:[animation-play-state:paused]"
                    )}
                    style={{ "--scroll-duration": `${col.duration}s` } as React.CSSProperties}
                  >
                    {triple.map((item, idx) => (
                      <FitText
                        key={idx}
                        className="py-1.5 border-b border-line/15 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground"
                        spanStyle={holoText ? holoTextStyle : undefined}
                      >
                        {item}
                      </FitText>
                    ))}
                  </div>
                ) : (
                  <div
                    className={cx(
                      "flex flex-row h-full items-center",
                      ANIM[col.direction],
                      pauseOnHover && "group-hover:[animation-play-state:paused]"
                    )}
                    style={{ "--scroll-duration": `${col.duration}s` } as React.CSSProperties}
                  >
                    {triple.map((item, idx) => (
                      <span
                        key={idx}
                        className="shrink-0 px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) whitespace-nowrap border-r border-line/20"
                        style={holoText ? holoTextStyle : undefined}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">{body}</div>
      {footerEl}
    </div>
  )
}
