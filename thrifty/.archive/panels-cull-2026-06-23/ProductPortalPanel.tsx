import { useMemo } from "react"
import { Check } from "lucide-react"
import { cx } from "../../lib/utils"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import type { PanelProps } from "../../types/panel"

// ── Types ─────────────────────────────────────────────────────

export interface TierCard {
  id: string
  name: string
  description: string
  price: string
  priceType: "one-time" | "recurring"
  billingPeriod: "monthly" | "annual"
  features: string[]
  ctaLabel: string
  ctaUrl: string
  highlighted: boolean
}

export interface ProductPortalConfig {
  heading: string
  tagline: string
  tiers: TierCard[]
}

// ── Default ───────────────────────────────────────────────────

const defaultConfig: ProductPortalConfig = {
  heading: "Choose your plan",
  tagline: "Everything you need, nothing you don't.",
  tiers: [
    {
      id: "tier-free",
      name: "Free",
      description: "Get started at no cost.",
      price: "Free",
      priceType: "one-time",
      billingPeriod: "monthly",
      features: ["Core access", "Community support"],
      ctaLabel: "Get Started",
      ctaUrl: "",
      highlighted: false,
    },
    {
      id: "tier-pro",
      name: "Pro",
      description: "For builders who need more.",
      price: "$16",
      priceType: "one-time",
      billingPeriod: "monthly",
      features: ["Everything in Free", "Full export", "Priority support"],
      ctaLabel: "Purchase",
      ctaUrl: "",
      highlighted: true,
    },
    {
      id: "tier-studio",
      name: "Studio",
      description: "Full access, full identity.",
      price: "$40",
      priceType: "one-time",
      billingPeriod: "monthly",
      features: ["Everything in Pro", "Brand kit", "Marketplace listing"],
      ctaLabel: "Purchase",
      ctaUrl: "",
      highlighted: false,
    },
  ],
}

// ── Panel ─────────────────────────────────────────────────────

export function ProductPortalPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as unknown as ProductPortalConfig | undefined) ?? defaultConfig
  const tiers = config.tiers ?? defaultConfig.tiers

  const footer = useMemo(
    () => (
      <div className="flex items-center flex-1 px-3">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {tiers.length} tier{tiers.length !== 1 ? "s" : ""}
        </span>
      </div>
    ),
    [tiers.length]
  )

  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  const body = (
    <div className="flex flex-col h-full overflow-hidden">

      <div tabIndex={0} className="flex-1 min-h-0 overflow-y-auto">
        {/* Heading block */}
        <div className="px-6 pt-8 pb-6 text-center">
          <h2 className="text-base font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground">
            {config.heading}
          </h2>
          {config.tagline && (
            <p className="text-[11px] text-mute-fg mt-1.5 leading-relaxed">
              {config.tagline}
            </p>
          )}
        </div>

        {/* Tier cards */}
        <div className={cx(
          "px-4 pb-6 gap-3",
          tiers.length === 1
            ? "flex justify-center"
            : "grid grid-cols-[repeat(auto-fill,minmax(min(180px,100%),1fr))]"
        )}>
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={cx(
                "flex flex-col border rounded-sm p-4 gap-3",
                tier.highlighted
                  ? "border-foreground/40 bg-foreground/5"
                  : "border-line"
              )}
            >
              {/* Tier header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground">
                    {tier.name || "—"}
                  </span>
                  {tier.highlighted && (
                    <span className="text-[8px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg border border-line rounded-sm px-1.5 py-0.5">
                      Popular
                    </span>
                  )}
                </div>
                {tier.description && (
                  <p className="text-[9px] text-mute-fg mt-1 leading-relaxed">
                    {tier.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <span className="text-lg font-(--theme-font-weight) text-foreground">
                  {tier.price || "—"}
                </span>
                {tier.priceType === "recurring" && (
                  <span className="text-[9px] text-mute-fg ml-1">
                    /{tier.billingPeriod === "monthly" ? "mo" : "yr"}
                  </span>
                )}
              </div>

              {/* Features */}
              {tier.features.length > 0 && (
                <ul className="space-y-1.5 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="size-2.5 shrink-0 text-mute-fg/60 mt-0.5" />
                      <span className="text-[10px] text-mute-fg leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA */}
              {tier.ctaUrl ? (
                <a
                  href={tier.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    "w-full py-1.5 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-center transition-colors",
                    tier.highlighted
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "border border-line text-mute-fg hover:text-foreground hover:bg-mute/30"
                  )}
                >
                  {tier.ctaLabel || "Get Started"}
                </a>
              ) : (
                <button
                  disabled
                  className={cx(
                    "w-full py-1.5 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) opacity-30 cursor-not-allowed",
                    tier.highlighted
                      ? "bg-foreground text-background"
                      : "border border-line text-mute-fg"
                  )}
                >
                  {tier.ctaLabel || "Get Started"}
                </button>
              )}
            </div>
          ))}
        </div>
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
