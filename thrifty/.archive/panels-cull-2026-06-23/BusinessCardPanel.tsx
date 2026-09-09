
import { useMemo, useState } from "react"
import { ExternalLink, Copy, Check } from "lucide-react"
import { cx } from "../../lib/utils"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import type { PanelProps } from "../../types/panel"

export interface BusinessCardConfig {
  title: string
  subtitle: string
  tags: string[]
  // Intent / availability line, pinned to the bottom of the body just above
  // the footer. Optional.
  intent?: string
  // Contact email — rendered in the footer as a mailto with a copy button.
  // When set it fills the footer; otherwise `url` (if any) renders a "View"
  // link there instead.
  email?: string
  url?: string
}

const defaultConfig: BusinessCardConfig = {
  title: "Your Name",
  subtitle: "Your Title",
  tags: ["Layouts", "Themes", "Exports"],
  intent: "Open for inquiries",
  email: "you@example.com",
}

export function BusinessCardPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as unknown as BusinessCardConfig | undefined) ?? defaultConfig
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!config.email) return
    try {
      await navigator.clipboard.writeText(config.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable (insecure context, old browser) — the mailto
      // link still works, so fail the copy affordance silently.
    }
  }

  // Footer content — the contact line, centered in the footer slot. Email +
  // copy when an email is set, else a "View" link. Memoized so the hoist only
  // re-pushes on real changes.
  const footer = useMemo(
    () =>
      config.email ? (
        <div className="flex-1 flex items-center justify-center gap-2">
          <a
            href={`mailto:${config.email}`}
            className="text-sm text-foreground hover:text-foreground-hover transition-colors"
          >
            {config.email}
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy email address"}
            className="size-7 inline-flex items-center justify-center rounded text-mute-fg hover:text-foreground hover:bg-mute/50 transition-colors shrink-0"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </button>
        </div>
      ) : config.url ? (
        <a
          href={config.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(
            "flex-1 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-(--theme-letter-spacing)",
            "text-mute-fg hover:text-foreground transition-colors"
          )}
        >
          View
          <ExternalLink className="size-2.5" />
        </a>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.email, config.url, copied]
  )

  // Dual-mode chrome: hoist the footer to the host when it offers a slot,
  // otherwise render it inline so the panel is self-contained in a bare body.
  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  const body = (
    <div className="flex flex-col h-full">
      {/* Brand mark — the card's title line; the divider sits high. */}
      <div className="shrink-0 flex items-center justify-center pt-6 pb-4 border-b border-line">
        <span className="text-sm font-(--theme-font-weight) uppercase tracking-[0.3em]">{config.title}</span>
      </div>

      {/* Subtitle + tags up top, intent pinned to the bottom just above the footer. */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 gap-4">
        {config.subtitle && (
          <p className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg text-center">
            {config.subtitle}
          </p>
        )}

        {config.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {config.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase tracking-(--theme-letter-spacing) px-2 py-0.5 rounded-lg border border-line text-mute-fg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Intent line — bottom of the body, directly above the footer, no divider. */}
        {config.intent && (
          <p className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg text-center">
            {config.intent}
          </p>
        )}
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
