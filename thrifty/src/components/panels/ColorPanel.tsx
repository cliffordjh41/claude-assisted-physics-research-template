import { useEffect, useRef, useState } from "react"
import { cx } from "../../lib/utils"
import type { Theme, ThemeColors } from "../../types/theme"
import type { ThemeMode } from "../ThemeScope"
import { DEFAULT_THEME } from "../../data/themes"
import { themeToCss } from "../../lib/theme-to-css"

type ThemeColorKey = keyof ThemeColors

type ThemeVariableEntry =
  | { type: "variable"; key: ThemeColorKey; label: string }
  | { type: "header"; label: string }

const THEME_VARIABLES: ThemeVariableEntry[] = [
  { type: "header", label: "CORE" },
  { type: "variable", key: "background", label: "Background" },
  { type: "variable", key: "foreground", label: "Foreground" },
  { type: "variable", key: "action", label: "Action" },
  { type: "variable", key: "action-fg", label: "Action FG" },
  { type: "variable", key: "subdued", label: "Subdued" },
  { type: "variable", key: "subdued-fg", label: "Subdued FG" },
  { type: "variable", key: "highlight", label: "Highlight" },
  { type: "variable", key: "highlight-fg", label: "Highlight FG" },
  { type: "variable", key: "mute", label: "Mute" },
  { type: "variable", key: "mute-fg", label: "Mute FG" },
  { type: "variable", key: "line", label: "Line" },
  { type: "variable", key: "alert", label: "Alert" },
  { type: "variable", key: "alert-fg", label: "Alert FG" },
  { type: "header", label: "SURFACE" },
  { type: "variable", key: "surface", label: "Surface" },
  { type: "header", label: "OVERLAY" },
  { type: "variable", key: "overlay", label: "Overlay" },
  { type: "variable", key: "overlay-fg", label: "Overlay FG" },
  { type: "header", label: "INPUTS" },
  { type: "variable", key: "field", label: "Field" },
  { type: "variable", key: "focus", label: "Focus" },
  { type: "header", label: "VISUALIZER" },
  { type: "variable", key: "visualizer-1", label: "Band 1" },
  { type: "variable", key: "visualizer-2", label: "Band 2" },
  { type: "variable", key: "visualizer-3", label: "Band 3" },
  { type: "variable", key: "visualizer-4", label: "Band 4" },
  { type: "variable", key: "visualizer-5", label: "Band 5" },
  { type: "variable", key: "visualizer-6", label: "Band 6" },
  { type: "variable", key: "visualizer-7", label: "Band 7" },
  { type: "variable", key: "visualizer-8", label: "Band 8" },
  { type: "variable", key: "visualizer-9", label: "Band 9" },
  { type: "variable", key: "visualizer-10", label: "Band 10" },
  { type: "variable", key: "visualizer-11", label: "Band 11" },
  { type: "variable", key: "visualizer-12", label: "Band 12" },
  { type: "header", label: "COLUMN" },
  { type: "variable", key: "column", label: "Column" },
  { type: "variable", key: "column-foreground", label: "Column FG" },
  { type: "variable", key: "column-highlight", label: "Column Highlight" },
  { type: "variable", key: "column-line", label: "Column Line" },
]

// 12 hand-chosen oklch hue angles. RYB-wheel labels — not strict 30° steps.
// Angles align with familiar Tailwind anchors (red 25, green 150, blue 240,
// violet 300) so the palette reads as expected.
const HUES: { label: string; h: number }[] = [
  { label: "red", h: 25 },
  { label: "red-orange", h: 40 },
  { label: "orange", h: 55 },
  { label: "orange-yellow", h: 75 },
  { label: "yellow", h: 95 },
  { label: "yellow-green", h: 130 },
  { label: "green", h: 150 },
  { label: "blue-green", h: 200 },
  { label: "blue", h: 240 },
  { label: "blue-violet", h: 275 },
  { label: "violet", h: 300 },
  { label: "red-violet", h: 335 },
]

// 12 evenly-spaced lightnesses from 0.97 to 0.20. Endpoints stop short of pure
// white/black so the lightest and darkest tiles still read as colors.
const LIGHTNESSES: number[] = Array.from({ length: 12 }, (_, i) =>
  0.97 - (i * (0.97 - 0.20)) / 11
)

// Target peak chroma at mid-lightness. Each tile takes min(this, in-gamut max),
// so tiles never clip; the precomputed table replaces runtime taper math.
const TARGET_CHROMA = 0.20

// Hue-row preview lightness — picked above mid so blue/violet/red-violet read
// as colors rather than near-black after the in-gamut chroma clamp.
const HUE_ROW_L = 0.72

// Default panel state — picker is stand-alone; selecting a token doesn't move
// these. Blue at mid-shade is a neutral starting point.
const DEFAULT_HUE_INDEX = 8
const DEFAULT_SHADE_INDEX = 5

// OKLab → linear RGB constants from bottosson.github.io/posts/oklab.
function oklchInGamut(l: number, c: number, h: number): boolean {
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const bLab = c * Math.sin(hRad)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * bLab
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bLab
  const s_ = l - 0.0894841775 * a - 1.2914855480 * bLab
  const L = l_ * l_ * l_
  const M = m_ * m_ * m_
  const S = s_ * s_ * s_
  const r = +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S
  const g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S
  const b = -0.0041960863 * L - 0.7034186147 * M + 1.7076147010 * S
  return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1
}

function maxChromaInGamut(l: number, h: number): number {
  let lo = 0
  let hi = 0.4
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2
    if (oklchInGamut(l, mid, h)) lo = mid
    else hi = mid
  }
  return lo
}

function srgbChannelToHex(c: number): string {
  const clamped = Math.max(0, Math.min(1, c))
  const gamma =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
  const byte = Math.round(Math.max(0, Math.min(1, gamma)) * 255)
  const s = byte.toString(16)
  return s.length === 1 ? "0" + s : s
}

function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const bLab = c * Math.sin(hRad)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * bLab
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bLab
  const s_ = l - 0.0894841775 * a - 1.2914855480 * bLab
  const L = l_ * l_ * l_
  const M = m_ * m_ * m_
  const S = s_ * s_ * s_
  const r = +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S
  const g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S
  const b = -0.0041960863 * L - 0.7034186147 * M + 1.7076147010 * S
  return `#${srgbChannelToHex(r)}${srgbChannelToHex(g)}${srgbChannelToHex(b)}`
}

// Precomputed at module load — no runtime gamut math, no taper math.
const NEUTRAL_HEX: string[] = LIGHTNESSES.map((l) => oklchToHex(l, 0, 0))
const SHADE_HEX: string[][] = HUES.map(({ h }) =>
  LIGHTNESSES.map((l) => {
    const c = Math.min(TARGET_CHROMA, maxChromaInGamut(l, h))
    return oklchToHex(l, c, h)
  })
)
const HUE_ROW_HEX: string[] = HUES.map(({ h }) => {
  const c = Math.min(TARGET_CHROMA, maxChromaInGamut(HUE_ROW_L, h))
  return oklchToHex(HUE_ROW_L, c, h)
})

interface ColorPanelProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  mode: ThemeMode
  className?: string
  /** Render the built-in Copy-CSS footer. Default true; a host that
   * surfaces its own copy control (e.g. in a column header) sets false. */
  showCopyCss?: boolean
}

export function ColorPanel({
  theme,
  onThemeChange,
  mode,
  className,
  showCopyCss = true,
}: ColorPanelProps) {
  const [activeVariable, setActiveVariable] =
    useState<ThemeColorKey>("background")
  const [hueIndex, setHueIndex] = useState(DEFAULT_HUE_INDEX)
  const [shadeIndex, setShadeIndex] = useState(DEFAULT_SHADE_INDEX)

  // Local edit history for Undo. Each committed change pushes the pre-change
  // theme; Undo pops and re-emits via onThemeChange. External theme swaps
  // (host load, or a reset elsewhere) register through the effect so Undo
  // stays coherent. Fully self-contained — no host wiring, no store.
  const [undoStack, setUndoStack] = useState<Theme[]>([])
  const lastThemeRef = useRef(theme)
  useEffect(() => {
    if (theme !== lastThemeRef.current) {
      setUndoStack((s) => [...s, lastThemeRef.current])
      lastThemeRef.current = theme
    }
  }, [theme])

  const [copied, setCopied] = useState(false)

  // Commit a theme change through the history. lastThemeRef is set
  // synchronously so the effect above doesn't double-record our own edit.
  const commit = (next: Theme) => {
    setUndoStack((s) => [...s, theme])
    lastThemeRef.current = next
    onThemeChange(next)
  }

  const undo = () => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    lastThemeRef.current = prev
    setUndoStack((s) => s.slice(0, -1))
    onThemeChange(prev)
  }

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(themeToCss(theme))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — no-op.
    }
  }

  const colors = mode === "B" ? theme.colorsB : theme.colorsA
  const activeColor = colors[activeVariable]
  const activeLabel =
    THEME_VARIABLES.find(
      (e) => e.type === "variable" && e.key === activeVariable
    )?.label ?? activeVariable

  // Selection is exclusive — neutral track XOR chromatic track. When the
  // active color matches a neutral tile, ring only row 1; otherwise ring the
  // current shade+hue indices. Avoids both tracks lighting up at once.
  const neutralMatch = NEUTRAL_HEX.findIndex(
    (h) => h.toLowerCase() === activeColor.toLowerCase()
  )
  const usingNeutral = neutralMatch !== -1

  const setColorFor = (key: ThemeColorKey, color: string) => {
    if (mode === "B") {
      commit({ ...theme, colorsB: { ...theme.colorsB, [key]: color } })
    } else {
      commit({ ...theme, colorsA: { ...theme.colorsA, [key]: color } })
    }
  }

  const applyColor = (color: string) => setColorFor(activeVariable, color)

  const resetActive = () => {
    const defaults =
      mode === "B" ? DEFAULT_THEME.colorsB : DEFAULT_THEME.colorsA
    setColorFor(activeVariable, defaults[activeVariable])
  }

  return (
    <div className={cx("h-full flex flex-col", className)}>
      <div className="w-full p-2 border-b border-line shrink-0">
        {/* Active-token controls: label / undo placeholder / reset. No hex
        input — the picker is grid-only; arbitrary values are a code edit. */}
        <div className="grid grid-cols-3 items-center gap-1 py-3">
          <div className="flex items-center justify-center">
            <span
              className="text-[11px] font-mono uppercase text-foreground"
              title={activeVariable}
            >
              {activeLabel}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              title="Undo last change"
              className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors disabled:text-mute-fg/40 disabled:cursor-not-allowed disabled:hover:text-mute-fg/40"
            >
              Undo
            </button>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={resetActive}
              title="Reset to default"
              className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Row 1: neutrals (white → black, chroma 0). */}
        <div className="flex gap-1" role="group" aria-label="Neutral palette">
          {NEUTRAL_HEX.map((hex, i) => {
            const isSelected = i === neutralMatch
            return (
              <button
                key={i}
                onClick={() => applyColor(hex)}
                aria-label={`Neutral step ${i + 1}`}
                title={hex}
                className={cx(
                  "flex-1 h-6 rounded-sm",
                  isSelected && "ring-2 ring-inset ring-foreground"
                )}
                style={{ backgroundColor: hex }}
              />
            )
          })}
        </div>

        {/* Row 2: shade ramp of the currently selected hue. */}
        <div
          className="flex gap-1 mt-1"
          role="group"
          aria-label={`${HUES[hueIndex].label} shade palette`}
        >
          {SHADE_HEX[hueIndex].map((hex, i) => {
            const isSelected = !usingNeutral && i === shadeIndex
            return (
              <button
                key={i}
                onClick={() => {
                  setShadeIndex(i)
                  applyColor(hex)
                }}
                aria-label={`${HUES[hueIndex].label} shade ${i + 1}`}
                title={hex}
                className={cx(
                  "flex-1 h-6 rounded-sm",
                  isSelected && "ring-2 ring-inset ring-foreground"
                )}
                style={{ backgroundColor: hex }}
              />
            )
          })}
        </div>

        {/* Row 3: 12 hues at a lifted lightness so cool hues read as colors.
        Click composes with the current shade index. */}
        <div
          className="flex gap-1 mt-1"
          role="group"
          aria-label="Hue palette"
        >
          {HUE_ROW_HEX.map((hex, i) => {
            const isSelected = !usingNeutral && i === hueIndex
            return (
              <button
                key={i}
                onClick={() => {
                  setHueIndex(i)
                  applyColor(SHADE_HEX[i][shadeIndex])
                }}
                aria-label={HUES[i].label}
                title={HUES[i].label}
                className={cx(
                  "flex-1 h-6 rounded-sm",
                  isSelected && "ring-2 ring-inset ring-foreground"
                )}
                style={{ backgroundColor: hex }}
              />
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {THEME_VARIABLES.map((entry, index) => {
          if (entry.type === "header") {
            return (
              <div
                key={`header-${index}`}
                className="px-2 pt-3 pb-1 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg"
              >
                {entry.label}
              </div>
            )
          }
          const { key, label } = entry
          const isActive = activeVariable === key
          return (
            <button
              key={key}
              onClick={() => setActiveVariable(key)}
              title={`Edit ${label}`}
              className={cx(
                "w-full h-7 flex items-center gap-2 px-2 transition-colors text-left",
                isActive
                  ? "bg-mute text-foreground"
                  : "text-mute-fg hover:bg-mute/50 hover:text-foreground"
              )}
            >
              <div
                className="w-3 h-3 rounded-sm border border-line shrink-0"
                style={{ backgroundColor: colors[key] }}
              />
              <span className="text-[10px] truncate flex-1">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Copy the whole theme as paste-ready CSS to the clipboard. A host
          can suppress this and surface its own copy control instead. */}
      {showCopyCss && (
        <div className="shrink-0 border-t border-line p-2">
          <button
            onClick={copyCss}
            title="Copy the theme as CSS to the clipboard"
            className="w-full h-7 rounded text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground hover:bg-mute/50 transition-colors"
          >
            {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
      )}
    </div>
  )
}
