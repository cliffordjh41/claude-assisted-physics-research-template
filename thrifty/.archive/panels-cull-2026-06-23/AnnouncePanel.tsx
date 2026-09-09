
import type { PanelProps } from "../../types/panel"

export interface AnnounceConfig {
  eyebrow: string
  heading: string
  body: string
  primaryLabel: string
  primaryUrl: string
  showDismiss: boolean
}

const defaultConfig: AnnounceConfig = {
  eyebrow: "Announcement",
  heading: "What's New in 2.0",
  body: "A completely redesigned experience — faster, cleaner, and built for what comes next.",
  primaryLabel: "Read More",
  primaryUrl: "",
  showDismiss: true,
}

export function AnnouncePanel({ panelData }: PanelProps) {
  const config = (panelData as unknown as AnnounceConfig | undefined) ?? defaultConfig
  const body = (
    <div className="h-full flex flex-col items-center justify-center gap-8 px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {config.eyebrow}
        </p>
        <h2 className="text-xl font-(--theme-font-weight) tracking-(--theme-letter-spacing) text-foreground">
          {config.heading}
        </h2>
        <p className="text-xs text-mute-fg max-w-xs leading-relaxed">
          {config.body}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 w-full max-w-[180px]">
        <button className="w-full px-6 py-2 bg-foreground text-background text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) hover:opacity-80 transition-opacity">
          {config.primaryLabel}
        </button>
        {config.showDismiss && (
          <button className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors">
            Dismiss
          </button>
        )}
      </div>
    </div>
  )

  return <div className="w-full h-full overflow-hidden">{body}</div>
}
