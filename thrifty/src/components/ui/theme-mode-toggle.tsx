import { ToggleOption } from "../panel-primitives"
import type { ThemeMode } from "../ThemeScope"
import { cx } from "../../lib/utils"

// Segmented A/B switch for a theme's two color variants (Theme.colorsA /
// colorsB). `labelA`/`labelB` name the variants (default "A"/"B"); pair with
// useThemeRoot(theme, mode) to repaint on change. Omit `onModeChange` for a
// read-only indicator.

export interface ThemeModeToggleProps {
  mode: ThemeMode
  onModeChange?: (mode: ThemeMode) => void
  labelA?: string
  labelB?: string
  className?: string
}

export function ThemeModeToggle({
  mode,
  onModeChange,
  labelA = "A",
  labelB = "B",
  className,
}: ThemeModeToggleProps) {
  return (
    <div className={cx("flex items-center gap-1", className)}>
      <ToggleOption
        className="flex-1"
        active={mode === "A"}
        onClick={onModeChange ? () => onModeChange("A") : undefined}
      >
        {labelA}
      </ToggleOption>
      <ToggleOption
        className="flex-1"
        active={mode === "B"}
        onClick={onModeChange ? () => onModeChange("B") : undefined}
      >
        {labelB}
      </ToggleOption>
    </div>
  )
}
