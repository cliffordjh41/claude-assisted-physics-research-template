export const meta = { id: "brand-kit", label: "Brand Kit", tier: "content" as const, placement: "any" as const }

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Wordmark } from "../brand/Wordmark"
import { CheckboxItem } from "../panel-primitives"
import type { PanelProps } from "../../types/panel"

// ── Types ─────────────────────────────────────────────────────

interface BrandKitConfig {
  name: string
  tagline: string
  apiUrl: string
  allowDownload: boolean
}

// ── Default ───────────────────────────────────────────────────

export const defaultConfig: BrandKitConfig = {
  name: "ex wisey",
  tagline: "",
  apiUrl: "",
  allowDownload: true,
}

// ── Variants ──────────────────────────────────────────────────

const VARIANTS: { textCase: "lower" | "upper"; variant: "light" | "dark"; label: string }[] = [
  { textCase: "lower", variant: "light", label: "lowercase · light" },
  { textCase: "lower", variant: "dark",  label: "lowercase · dark"  },
  { textCase: "upper", variant: "light", label: "uppercase · light" },
  { textCase: "upper", variant: "dark",  label: "uppercase · dark"  },
]

// ── SVG builder (for download — no DOM dependency) ─────────────

function buildSvgString(name: string, textCase: "lower" | "upper", variant: "light" | "dark"): string {
  const isUpper = textCase === "upper"
  const text = isUpper ? name.toUpperCase() : name.toLowerCase()
  const fill = variant === "dark" ? "#ffffff" : "#000000"
  const bg   = variant === "dark" ? "#000000" : "#ffffff"
  const weight  = isUpper ? 600 : 400
  const tracking = isUpper ? "0.22em" : "0.06em"
  const vbW = isUpper ? 220 : 160
  const vbH = 36

  return [
    `<svg viewBox="0 0 ${vbW} ${vbH}" width="${vbW}" height="${vbH}" xmlns="http://www.w3.org/2000/svg">`,
    `  <rect width="${vbW}" height="${vbH}" fill="${bg}"/>`,
    `  <text x="${vbW / 2}" y="${vbH / 2}" text-anchor="middle" dominant-baseline="middle"`,
    `    font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="${weight}"`,
    `    letter-spacing="${tracking}" fill="${fill}">${text}</text>`,
    `</svg>`,
  ].join("\n")
}

function downloadSvg(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: "image/svg+xml" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Config surface ─────────────────────────────────────────────

export function BrandKitConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as BrandKitConfig

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Brand</p>
        <input
          value={typed.name}
          onChange={e => onChange({ ...typed, name: e.target.value })}
          placeholder="brand name"
          className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
        />
        <input
          value={typed.tagline}
          onChange={e => onChange({ ...typed, tagline: e.target.value })}
          placeholder="tagline (optional)"
          className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
        />
      </div>

      <div className="border-t border-line/50" />

      <CheckboxItem
        label="Allow download"
        checked={typed.allowDownload ?? true}
        onCheckedChange={v => onChange({ ...typed, allowDownload: v as boolean })}
      />

      <div className="border-t border-line/50" />

      <div className="space-y-1.5">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">API</p>
        <input
          value={typed.apiUrl}
          onChange={e => onChange({ ...typed, apiUrl: e.target.value })}
          placeholder="https://your-brand-api.json"
          type="url"
          className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
        />
        <p className="text-[9px] text-mute-fg/40 leading-relaxed">
          Returns <span className="font-mono">&#123; name, tagline &#125;</span>. Overrides typed config when set.
        </p>
      </div>
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────

export function BrandKitPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as BrandKitConfig | undefined) ?? defaultConfig
  const allowDownload = config.allowDownload ?? true
  const [resolved, setResolved] = useState<BrandKitConfig>(config)

  // API axis — fetch brand config from apiUrl when present
  useEffect(() => {
    if (!config.apiUrl) { setResolved(config); return }
    fetch(config.apiUrl)
      .then(r => r.json())
      .then(data => setResolved({ ...config, ...data }))
      .catch(() => setResolved(config))
  }, [config.apiUrl, config.name, config.tagline])

  useEffect(() => {
    onFooter?.(
      <div className="flex items-stretch flex-1">
        <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {VARIANTS.length} assets
        </span>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter])

  const body = (
    <div className="flex flex-col h-full overflow-hidden">

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-px border-b border-line">
          {VARIANTS.map(({ textCase, variant, label }) => {
            const bg = variant === "dark" ? "bg-black" : "bg-white"
            const slug = `${resolved.name.toLowerCase().replace(/\s+/g, "-")}-${textCase}-${variant}`
            return (
              <div key={label} className="flex flex-col border-r border-line last:border-r-0">
                {/* Preview */}
                <div className={`flex-1 flex items-center justify-center p-4 ${bg}`}>
                  <Wordmark
                    case={textCase}
                    variant={variant}
                    scale={0.85}
                    name={resolved.name}
                  />
                </div>

                {/* Footer row */}
                <div className="shrink-0 border-t border-line flex items-center justify-between px-2.5 py-1.5">
                  <span className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">{label}</span>
                  {allowDownload && (
                    <button
                      onClick={() => downloadSvg(buildSvgString(resolved.name, textCase, variant), `${slug}.svg`)}
                      className="text-mute-fg/40 hover:text-foreground transition-colors"
                      title={`Download ${label}`}
                    >
                      <Download className="size-2.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Banner preview */}
        <div className="h-11 px-3 border-b border-line flex items-center">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Banner</p>
            {allowDownload && (
              <button
                onClick={() => downloadSvg(buildSvgString(resolved.name, "lower", "dark"), `${resolved.name.toLowerCase().replace(/\s+/g, "-")}-banner-dark.svg`)}
                className="text-mute-fg/40 hover:text-foreground transition-colors"
              >
                <Download className="size-2.5" />
              </button>
            )}
          </div>
          <div className="w-full bg-black flex items-center justify-center py-4">
            <Wordmark case="lower" variant="dark" scale={1.2} name={resolved.name} />
          </div>
        </div>
      </div>
    </div>
  )

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
