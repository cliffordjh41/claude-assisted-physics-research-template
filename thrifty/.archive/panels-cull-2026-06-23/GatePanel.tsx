
import type { PanelProps } from "../../types/panel"

export interface GateConfig {
  eyebrow: string
  heading: string
  body: string
  buttonLabel: string
  ctaUrl: string
}

const defaultConfig: GateConfig = {
  eyebrow: "Access",
  heading: "Get Full Access",
  body: "Unlock the complete experience. Everything in one place.",
  buttonLabel: "Enter",
  ctaUrl: "",
}

export function GatePanel({ panelData }: PanelProps) {
  const config = (panelData as unknown as GateConfig | undefined) ?? defaultConfig
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
      {config.ctaUrl ? (
        <a
          href={config.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-foreground text-background text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) hover:opacity-80 transition-opacity"
        >
          {config.buttonLabel}
        </a>
      ) : (
        <button disabled className="px-6 py-2 bg-foreground text-background text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) opacity-30 cursor-not-allowed">
          {config.buttonLabel}
        </button>
      )}
    </div>
  )

  return <div className="w-full h-full overflow-hidden">{body}</div>
}
