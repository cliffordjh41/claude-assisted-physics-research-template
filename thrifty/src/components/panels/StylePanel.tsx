
import { cx } from "../../lib/utils"
import { ToggleOption } from "../panel-primitives"
import type { Theme } from "../../types/theme"

const GLOBAL_RADII = [
  { value: 0, label: "NONE" },
  { value: 0.125, label: "XS" },
  { value: 0.25, label: "SM" },
  { value: 0.375, label: "MD" },
  { value: 0.5, label: "LG" },
  { value: 0.75, label: "XL" },
  { value: 1, label: "2XL" },
  { value: 2, label: "FULL" },
]

const GLOBAL_SHADOWS = [
  { value: "none", label: "NONE" },
  { value: "soft", label: "SOFT" },
  { value: "medium", label: "MED" },
  { value: "strong", label: "STRONG" },
]

interface StylePanelProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  className?: string
}

export function StylePanel({ theme, onThemeChange, className }: StylePanelProps) {
  const radius = theme.styling.radius

  const update = (patch: Partial<typeof theme.styling>) =>
    onThemeChange({ ...theme, styling: { ...theme.styling, ...patch } })

  return (
    <div className={cx("h-full flex flex-col", className)}>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            RADIUS
          </span>
          <div className="grid grid-cols-4 gap-1">
            {GLOBAL_RADII.map((r) => (
              <ToggleOption
                key={r.value}
                active={radius === r.value}
                onClick={() => update({ radius: r.value })}
              >
                {r.label}
              </ToggleOption>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            SHADOW
          </span>
          <div className="grid grid-cols-4 gap-1">
            {GLOBAL_SHADOWS.map((s) => (
              <ToggleOption
                key={s.value}
                active={(theme.styling.shadow ?? "medium") === s.value}
                onClick={() => update({ shadow: s.value })}
              >
                {s.label}
              </ToggleOption>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
