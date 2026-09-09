
import { cx } from "../../lib/utils"
import { ToggleOption } from "../panel-primitives"
import type { Theme } from "../../types/theme"
import type { ThemeMode } from "../ThemeScope"

interface EffectsPanelProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  mode: ThemeMode
  className?: string
}

export function EffectsPanel({ theme, onThemeChange, mode, className }: EffectsPanelProps) {
  const update = (patch: Partial<typeof theme.styling>) =>
    onThemeChange({ ...theme, styling: { ...theme.styling, ...patch } })

  // Holo on/off is per variant — editing follows the active A/B selection.
  const columnHolo = mode === "B" ? theme.styling.columnHoloB : theme.styling.columnHoloA
  const backgroundHolo = mode === "B" ? theme.styling.backgroundHoloB : theme.styling.backgroundHoloA
  const setColumnHolo = (v: boolean) => update(mode === "B" ? { columnHoloB: v } : { columnHoloA: v })
  const setBackgroundHolo = (v: boolean) => update(mode === "B" ? { backgroundHoloB: v } : { backgroundHoloA: v })
  const variantLabel = mode === "B" ? (theme.styling.labelB ?? "B") : (theme.styling.labelA ?? "A")

  return (
    <div className={cx("h-full flex flex-col", className)}>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            HOLO · {variantLabel}
          </span>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="flex-1 text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">Column</span>
              <ToggleOption
                className="w-14"
                active={!columnHolo}
                onClick={() => setColumnHolo(false)}
              >
                OFF
              </ToggleOption>
              <ToggleOption
                className="w-14"
                active={!!columnHolo}
                onClick={() => setColumnHolo(true)}
              >
                ON
              </ToggleOption>
            </div>
            <div className="flex items-center gap-1">
              <span className="flex-1 text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">Background</span>
              <ToggleOption
                className="w-14"
                active={!backgroundHolo}
                onClick={() => setBackgroundHolo(false)}
              >
                OFF
              </ToggleOption>
              <ToggleOption
                className="w-14"
                active={!!backgroundHolo}
                onClick={() => setBackgroundHolo(true)}
              >
                ON
              </ToggleOption>
            </div>
            <div className="flex items-center gap-1">
              <span className="flex-1 text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">Track Mouse</span>
              <ToggleOption
                className="w-14"
                active={!theme.styling.holoTrackMouse}
                onClick={() => update({ holoTrackMouse: false })}
              >
                OFF
              </ToggleOption>
              <ToggleOption
                className="w-14"
                active={!!theme.styling.holoTrackMouse}
                onClick={() => update({ holoTrackMouse: true })}
              >
                ON
              </ToggleOption>
            </div>
            <div className="flex items-center gap-1">
              <span className="flex-1 text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">Speed</span>
              <ToggleOption
                className="flex-1"
                active={(theme.styling.holoSpeed ?? "normal") === "slow"}
                onClick={() => update({ holoSpeed: "slow" })}
              >
                SLOW
              </ToggleOption>
              <ToggleOption
                className="flex-1"
                active={(theme.styling.holoSpeed ?? "normal") === "normal"}
                onClick={() => update({ holoSpeed: "normal" })}
              >
                NORMAL
              </ToggleOption>
              <ToggleOption
                className="flex-1"
                active={(theme.styling.holoSpeed ?? "normal") === "fast"}
                onClick={() => update({ holoSpeed: "fast" })}
              >
                FAST
              </ToggleOption>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
