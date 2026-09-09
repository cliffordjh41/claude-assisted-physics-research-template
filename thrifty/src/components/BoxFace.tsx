import { useRef } from "react"
import { cx } from "../lib/utils"
import { useEyeTracking } from "../hooks/use-eye-tracking"

const HOLO_COLOR = "oklch(0.72 0.22 180)"

// ── Shared props ───────────────────────────────────────────────

interface BaseProps {
  holo?: boolean
  className?: string
  style?: React.CSSProperties
}

// ── BoxEyes ─────────────────────────────────────────────────

interface BoxEyesProps extends BaseProps {
  size?: number
  active?: boolean
  trackMouse?: boolean
  strokeWidth?: number
}

export function BoxEyes({
  size = 48,
  active = false,
  holo = false,
  trackMouse = false,
  strokeWidth = 1.5,
  className,
  style,
}: BoxEyesProps) {
  const color = holo ? HOLO_COLOR : "currentColor"
  const svgRef = useRef<SVGSVGElement>(null)

  // viewBox 0 0 46 14 — left eye center (9,7), right eye center (37,7)
  const { left, right } = useEyeTracking(
    svgRef,
    { w: 46, h: 14 },
    { left: { x: 9, y: 7 }, right: { x: 37, y: 7 } },
    2,
    trackMouse
  )

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 46 14"
      width={size}
      height={Math.round(size * 14 / 46)}
      fill="none"
      strokeLinecap="square"
      className={cx(holo && "animate-hue-rotate", className)}
      style={{ stroke: color, strokeWidth, ...style }}
    >
      {/* Left eye */}
      <g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        className={active ? "animate-blink-fast" : "animate-blink"}
      >
        <rect x="0" y="0" width="18" height="14" />
        <rect
          x={4 + left.x} y={4 + left.y}
          width="10" height="6"
          fill={color} stroke="none"
        />
      </g>

      {/* Right eye */}
      <g
        style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: "80ms" }}
        className={active ? "animate-blink-fast" : "animate-blink"}
      >
        <rect x="28" y="0" width="18" height="14" />
        <rect
          x={32 + right.x} y={4 + right.y}
          width="10" height="6"
          fill={color} stroke="none"
        />
      </g>
    </svg>
  )
}

// ── BoxMouth ────────────────────────────────────────────────

interface BoxMouthProps extends BaseProps {
  width?: number
  open?: number      // 0 = closed line, 1 = fully open
  talking?: boolean  // CSS-driven talking rhythm
  strokeWidth?: number
}

export function BoxMouth({
  width = 50,
  open = 0,
  talking = false,
  holo = false,
  strokeWidth = 1.5,
  className,
  style,
}: BoxMouthProps) {
  const color = holo ? HOLO_COLOR : "currentColor"
  const h = 2 + open * 10
  const y = (14 - h) / 2

  return (
    <svg
      viewBox={`0 0 ${width} 14`}
      width={width}
      height={14}
      fill="none"
      strokeLinecap="square"
      className={cx(holo && "animate-hue-rotate", className)}
      style={{ stroke: color, strokeWidth, ...style }}
    >
      {talking ? (
        <rect
          x="0" y="0" width={width} height="14"
          className="animate-mouth-talk"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ) : (
        <rect x="0" y={y} width={width} height={h} />
      )}
    </svg>
  )
}

// ── BoxFace ─────────────────────────────────────────────────

interface BoxFaceProps extends BaseProps {
  size?: number
  active?: boolean
  float?: boolean
  trackMouse?: boolean
  mouthOpen?: number   // 0–1 for audio-driven mouth
  talking?: boolean    // CSS-driven talking rhythm
  strokeWidth?: number
}

export function BoxFace({
  size = 60,
  active = false,
  holo = false,
  float: floatProp = false,
  trackMouse = false,
  mouthOpen = 0,
  talking = false,
  strokeWidth = 1.5,
  className,
  style,
}: BoxFaceProps) {
  const color = holo ? HOLO_COLOR : "currentColor"
  const svgRef = useRef<SVGSVGElement>(null)

  // viewBox 0 0 70 60 — left eye center (19,27), right eye center (51,27)
  const { left, right } = useEyeTracking(
    svgRef,
    { w: 70, h: 60 },
    { left: { x: 19, y: 27 }, right: { x: 51, y: 27 } },
    2.5,
    trackMouse
  )

  // Mouth drifts in the same direction as eyes, at 35% magnitude
  const mouthShift = ((left.x + right.x) / 2) * 0.35

  const mH = 2 + mouthOpen * 10
  const mY = 38 + (10 - mH) / 2

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 70 60"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={cx(
        holo && "animate-hue-rotate",
        floatProp && "animate-float",
        className
      )}
      style={{ stroke: color, strokeWidth, ...style }}
    >
      {/* Head */}
      <path d="M 10,2 L 60,2 L 68,12 L 68,56 L 2,56 L 2,12 Z" />

      {/* Left eye */}
      <g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        className={active ? "animate-blink-fast" : "animate-blink"}
      >
        <rect x="10" y="20" width="18" height="14" />
        <rect
          x={14 + left.x} y={24 + left.y}
          width="10" height="6"
          fill={color} stroke="none"
        />
      </g>

      {/* Right eye */}
      <g
        style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: "80ms" }}
        className={active ? "animate-blink-fast" : "animate-blink"}
      >
        <rect x="42" y="20" width="18" height="14" />
        <rect
          x={46 + right.x} y={24 + right.y}
          width="10" height="6"
          fill={color} stroke="none"
        />
      </g>

      {/* Mouth */}
      {talking ? (
        <rect
          x={10 + mouthShift} y="38" width="50" height="10"
          className="animate-mouth-talk"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ) : (
        <rect x={10 + mouthShift} y={mY} width="50" height={mH} />
      )}

      {/* Chin marks */}
      <rect x="12" y="51" width="6" height="4" fill={color} stroke="none" />
      <rect x="52" y="51" width="6" height="4" fill={color} stroke="none" />
    </svg>
  )
}
