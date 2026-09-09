export const meta = { id: "page", label: "Page", tier: "content" as const, placement: "any" as const }

import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"

// ── Types ─────────────────────────────────────────────────────

interface PageConfig {
  heading: string
  subheading: string
  body: string
  imageUrl: string
  imagePosition: "top" | "side"
}

export const defaultConfig: PageConfig = {
  heading: "Welcome",
  subheading: "A place to share what matters",
  body: "Write anything here — an introduction, a service offering, a job listing, or an event description. This is the content your visitors see first.",
  imageUrl: "",
  imagePosition: "top",
}

// ── Config surface ────────────────────────────────────────────

export function PageConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as PageConfig
  const update = (patch: Partial<PageConfig>) => onChange({ ...typed, ...patch })

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Heading</p>
        <input
          value={typed.heading}
          onChange={e => update({ heading: e.target.value })}
          className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
        />
      </div>

      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Subheading</p>
        <input
          value={typed.subheading}
          onChange={e => update({ subheading: e.target.value })}
          className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
        />
      </div>

      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Body</p>
        <textarea
          value={typed.body}
          onChange={e => update({ body: e.target.value })}
          rows={5}
          className="w-full bg-transparent text-[10px] text-foreground border border-line focus:border-foreground outline-none p-1.5 resize-none"
        />
      </div>

      <div>
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Image URL</p>
        <input
          value={typed.imageUrl}
          onChange={e => update({ imageUrl: e.target.value })}
          placeholder="https://..."
          className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5 placeholder:text-mute-fg/30"
        />
      </div>

      {typed.imageUrl && (
        <div>
          <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 pb-1.5">Image Position</p>
          <div className="flex gap-1">
            {(["top", "side"] as const).map(pos => (
              <button
                key={pos}
                onClick={() => update({ imagePosition: pos })}
                className={cx(
                  "flex-1 py-1 text-[10px] font-(--theme-font-weight) border border-line transition-colors",
                  typed.imagePosition === pos
                    ? "bg-foreground text-background border-foreground"
                    : "text-mute-fg hover:text-foreground"
                )}
              >
                {pos === "top" ? "TOP" : "SIDE"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────

export function PagePanel({ panelData }: PanelProps) {
  const config = (panelData as PageConfig | undefined) ?? defaultConfig
  const { heading, subheading, body, imageUrl, imagePosition } = config

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {imageUrl && imagePosition === "top" && (
          <div className="w-full aspect-video overflow-hidden shrink-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className={cx(
          "p-4",
          imageUrl && imagePosition === "side" && "flex gap-4 items-start"
        )}>
          {imageUrl && imagePosition === "side" && (
            <div className="w-1/3 shrink-0 aspect-square overflow-hidden">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-col gap-2 min-w-0">
            {heading && (
              <h2 className="text-base font-(--theme-font-weight) leading-tight text-foreground">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-[11px] font-(--theme-font-weight) text-mute-fg leading-snug">
                {subheading}
              </p>
            )}
            {body && (
              <p className="text-[11px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {body}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
