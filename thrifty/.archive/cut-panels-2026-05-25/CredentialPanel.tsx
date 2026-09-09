export const meta = { id: "credential", label: "Credential", tier: "content" as const, placement: "any" as const }

import { useEffect } from "react"
import { ShieldCheck, User, Building2, CalendarDays, Hash } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"

// ── Wave-derived hologram colors ──────────────────────────────
// Approximated from color-hsv crate's PositionWaveMapper.
// 12 positions at iteration 1, hue spaced 30° apart in oklch.
// Full derivation wires in when ephemeratory is live.
function holoStops(seed: number): string {
  const stops = Array.from({ length: 6 }, (_, i) => {
    const hue = ((seed * 37 + i * 60) % 360)
    const pct = i * (100 / 5)
    return `oklch(0.72 0.22 ${hue}) ${pct}%`
  })
  return stops.join(", ")
}

// ── Demo credential data ──────────────────────────────────────

interface Credential {
  id: string
  type: string
  issuer: string
  issued: string
  hash: string
  verified: boolean
}

const DEMO_CREDENTIALS: Credential[] = [
  { id: "1", type: "Identity",     issuer: "Civic",      issued: "2024-01-15", hash: "0x4f2a…c19e", verified: true  },
  { id: "2", type: "Membership",   issuer: "exwisey",    issued: "2024-03-01", hash: "0x7b1d…88fa", verified: true  },
  { id: "3", type: "Attestation",  issuer: "Self",       issued: "2024-06-20", hash: "0xa3e9…21bc", verified: false },
]

interface ClaimType {
  id: string
  label: string
  required: boolean
}

const DEMO_CLAIMS: ClaimType[] = [
  { id: "1", label: "Identity verification", required: true  },
  { id: "2", label: "Age attestation",       required: true  },
  { id: "3", label: "Membership proof",      required: false },
]

// ── Hologram card component ───────────────────────────────────

function HoloCard({ seed, children, className }: { seed: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("relative overflow-hidden border border-line", className)}>
      {/* Hologram shimmer layer */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          background: `conic-gradient(from var(--holo-angle), ${holoStops(seed)})`,
          animation: "holo-spin 6s linear infinite",
        }}
      />
      {children}
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────

export function CredentialPanel({ onFooter, role = "consumer" }: PanelProps) {
  useEffect(() => {
    onFooter?.(
      <div className="flex items-stretch flex-1">
        <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {role === "consumer" ? "Your credentials" : "Requesting credentials"}
        </span>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, role])

  const consumerView = (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-3 space-y-2">
        {DEMO_CREDENTIALS.map((cred, i) => (
          <HoloCard key={cred.id} seed={i * 7 + 3}>
            <div className="p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className={cx("size-3 shrink-0", cred.verified ? "text-foreground" : "text-mute-fg/40")} />
                  <span className="text-[11px] font-(--theme-font-weight) text-foreground">{cred.type}</span>
                </div>
                <span className={cx(
                  "text-[8px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) px-1.5 py-0.5",
                  cred.verified
                    ? "bg-foreground/10 text-foreground"
                    : "bg-mute text-mute-fg/50"
                )}>
                  {cred.verified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-center gap-1">
                  <Building2 className="size-2.5 text-mute-fg/40 shrink-0" />
                  <span className="text-[9px] text-mute-fg truncate">{cred.issuer}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="size-2.5 text-mute-fg/40 shrink-0" />
                  <span className="text-[9px] text-mute-fg">{cred.issued}</span>
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <Hash className="size-2.5 text-mute-fg/40 shrink-0" />
                  <span className="text-[9px] text-mute-fg font-mono">{cred.hash}</span>
                </div>
              </div>
            </div>
          </HoloCard>
        ))}
      </div>
    </div>
  )

  const providerView = (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-3 space-y-3">
        <p className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">
          Required from visitors
        </p>
        {DEMO_CLAIMS.map((claim, i) => (
          <HoloCard key={claim.id} seed={i * 11 + 5}>
            <div className="p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <User className="size-3 text-mute-fg/40 shrink-0" />
                <span className="text-[11px] text-foreground">{claim.label}</span>
              </div>
              <span className={cx(
                "text-[8px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) px-1.5 py-0.5 shrink-0",
                claim.required
                  ? "bg-foreground/10 text-foreground"
                  : "bg-mute text-mute-fg/50"
              )}>
                {claim.required ? "Required" : "Optional"}
              </span>
            </div>
          </HoloCard>
        ))}
        <div className="pt-2">
          <p className="text-[8px] uppercase tracking-(--theme-letter-spacing) text-mute-fg/30 text-center">
            ZK proof presentation via ephemeratory — coming
          </p>
        </div>
      </div>
    </div>
  )

  const body = (
    <div className="flex flex-col h-full overflow-hidden">

      {role === "consumer" ? consumerView : providerView}
    </div>
  )

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
