
import { cx } from "../../lib/utils"
import { ToggleOption } from "../panel-primitives"
import type { Theme } from "../../types/theme"

const FONT_FAMILIES = [
  { value: "Inter, system-ui, sans-serif", label: "INTER" },
  { value: "ui-sans-serif, system-ui, sans-serif", label: "SYSTEM" },
  { value: "'Geist', sans-serif", label: "GEIST" },
  { value: "ui-monospace, monospace", label: "MONO" },
]

const FONT_WEIGHTS = [
  { value: "light", label: "LIGHT" },
  { value: "normal", label: "REGULAR" },
  { value: "semibold", label: "SEMIBOLD" },
  { value: "bold", label: "BOLD" },
]

const LETTER_SPACINGS = [
  { value: "tight", label: "TIGHT" },
  { value: "normal", label: "NORMAL" },
  { value: "wide", label: "WIDE" },
  { value: "widest", label: "WIDEST" },
]

const BASE_SIZES = [
  { value: 12, label: "12" },
  { value: 14, label: "14" },
  { value: 16, label: "16" },
  { value: 18, label: "18" },
]

const LINE_HEIGHTS = [
  { value: "tight", label: "TIGHT" },
  { value: "normal", label: "NORMAL" },
  { value: "loose", label: "LOOSE" },
]

interface TypographyPanelProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  className?: string
}

export function TypographyPanel({ theme, onThemeChange, className }: TypographyPanelProps) {
  const fontFamily = theme.styling.fontFamily || "Inter, system-ui, sans-serif"
  const fontWeight = theme.styling.fontWeight || "normal"
  const letterSpacing = theme.styling.letterSpacing || "normal"
  const baseFontSize = theme.styling.baseFontSize ?? 16
  const lineHeight = theme.styling.lineHeight || "normal"

  const update = (patch: Partial<typeof theme.styling>) =>
    onThemeChange({ ...theme, styling: { ...theme.styling, ...patch } })

  return (
    <div className={cx("h-full flex flex-col", className)}>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            FONT
          </span>
          <div className="grid grid-cols-2 gap-1">
            {FONT_FAMILIES.map((f) => (
              <ToggleOption
                key={f.value}
                active={fontFamily === f.value}
                onClick={() => update({ fontFamily: f.value })}
              >
                {f.label}
              </ToggleOption>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            WEIGHT
          </span>
          <div className="grid grid-cols-2 gap-1">
            {FONT_WEIGHTS.map((w) => (
              <ToggleOption
                key={w.value}
                active={fontWeight === w.value}
                onClick={() => update({ fontWeight: w.value })}
              >
                {w.label}
              </ToggleOption>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            SPACING
          </span>
          <div className="grid grid-cols-2 gap-1">
            {LETTER_SPACINGS.map((s) => (
              <ToggleOption
                key={s.value}
                active={letterSpacing === s.value}
                onClick={() => update({ letterSpacing: s.value })}
              >
                {s.label}
              </ToggleOption>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            BASE SIZE
          </span>
          <div className="grid grid-cols-4 gap-1">
            {BASE_SIZES.map((b) => (
              <ToggleOption
                key={b.value}
                active={baseFontSize === b.value}
                onClick={() => update({ baseFontSize: b.value })}
              >
                {b.label}
              </ToggleOption>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            LINE HEIGHT
          </span>
          <div className="grid grid-cols-3 gap-1">
            {LINE_HEIGHTS.map((l) => (
              <ToggleOption
                key={l.value}
                active={lineHeight === l.value}
                onClick={() => update({ lineHeight: l.value })}
              >
                {l.label}
              </ToggleOption>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
