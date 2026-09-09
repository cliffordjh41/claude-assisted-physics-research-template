
import { useMemo } from "react"
import { ExternalLink } from "lucide-react"
import { cx } from "../../lib/utils"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import type { PanelProps } from "../../types/panel"

interface Attribution {
  id: string
  name: string
  description: string
  url: string
}

export interface AttributionsConfig {
  attributions: Attribution[]
}

const defaultConfig: AttributionsConfig = {
  attributions: [
    { id: "react",         name: "React",          description: "UI library",                url: "https://react.dev" },
    { id: "typescript",    name: "TypeScript",      description: "Type system",               url: "https://typescriptlang.org" },
    { id: "vite",          name: "Vite",            description: "Build tool",                url: "https://vite.dev" },
    { id: "tailwind",      name: "Tailwind CSS",    description: "Utility-first CSS",         url: "https://tailwindcss.com" },
    { id: "radix",         name: "Radix UI",        description: "Accessible primitives",     url: "https://radix-ui.com" },
    { id: "zustand",       name: "Zustand",         description: "State management",          url: "https://zustand.docs.pmnd.rs" },
    { id: "supabase",      name: "Supabase",        description: "Auth + database",           url: "https://supabase.com" },
    { id: "stripe",        name: "Stripe",          description: "Payments",                  url: "https://stripe.com" },
    { id: "react-router",  name: "React Router",    description: "Routing",                   url: "https://reactrouter.com" },
    { id: "claude",        name: "Claude",          description: "AI partner",                url: "https://claude.ai" },
    { id: "rust",          name: "Rust",            description: "Systems language",          url: "https://rust-lang.org" },
  ],
}

export function AttributionsPanel({ onHeader, onFooter, panelData }: PanelProps) {
  const config = (panelData as unknown as AttributionsConfig | undefined) ?? defaultConfig
  const attributions = config.attributions

  const header = useMemo(
    () => (
      <div className="flex-1 px-3 flex items-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Attributions
        </span>
      </div>
    ),
    []
  )

  const footer = useMemo(
    () => (
      <div className="flex-1 px-3 flex items-center justify-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Attributions
        </span>
      </div>
    ),
    []
  )

  const { header: headerEl, footer: footerEl } = usePanelChrome({
    onHeader,
    onFooter,
    header,
    footer,
  })

  const body = (
    <div className="flex-1 min-h-0 overflow-y-auto p-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-1">
        {attributions.map((attr) => (
          <a
            key={attr.id}
            href={attr.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(
              "px-3 py-3 flex items-center gap-3 rounded-lg transition-colors text-left",
              "hover:bg-mute/50 group"
            )}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground">
                {attr.name}
              </p>
              <p className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg mt-0.5">
                {attr.description}
              </p>
            </div>
            <ExternalLink className="size-2.5 shrink-0 text-mute-fg/0 group-hover:text-mute-fg transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {headerEl}
      {body}
      {footerEl}
    </div>
  )
}
