export const meta = { id: "tattoo", label: "Tattoo", tier: "content" as const, placement: "any" as const }

import { useEffect } from "react"
import type { ComponentType } from "react"
import { IconGrid, ToggleOption } from "../panel-primitives"
import { SIGILS } from "../icons/sigils"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"
import type { LucideProps } from "lucide-react"
import {
  positionToOklch,
  ringToPath,
  positionCount,
  type ColorMode,
} from "../../lib/lattice-color"

// ── Config ────────────────────────────────────────────────────────────────────

export interface TattooConfig {
  sigilId: string                       // named sigil id, or "lattice" for generated form
  inset: number                         // padding 0-48px
  strokeWidth: number                   // default 2
  colorMode: ColorMode                  // how color is derived from lattice position
  latticeCoord?: {
    iteration: number                   // 0=3pts, 1=12pts, 2=48pts
    index: number                       // 0 to count-1
    step: number                        // 1=polygon, 2=skip-1 star, 3=sparser
  }
  trigger?: {
    type: "drawer" | "dialog" | "link"
    target: string
  }
}

export const defaultConfig: TattooConfig = {
  sigilId: "arc",
  inset: 16,
  strokeWidth: 2,
  colorMode: "positional",
}

const SIGIL_MAP = Object.fromEntries(
  SIGILS.map((s) => [s.id, s.Icon])
) as Record<string, ComponentType<LucideProps>>

const COLOR_MODES: ColorMode[] = ["positional", "ternary", "sixfold", "photonic"]

// ── Config Surface ─────────────────────────────────────────────────────────────

export function TattooConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as TattooConfig

  function set<K extends keyof TattooConfig>(field: K, value: TattooConfig[K]) {
    onChange({ ...typed, [field]: value })
  }

  const isLattice = typed.sigilId === "lattice"
  const lc = typed.latticeCoord ?? { iteration: 0, index: 0, step: 1 }
  const maxIndex = positionCount(lc.iteration) - 1

  return (
    <div className="space-y-4">

      {/* Sigil selector */}
      <div className="space-y-1.5">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Sigil</p>
        <IconGrid
          icons={SIGILS}
          selectedId={isLattice ? null : (typed.sigilId ?? null)}
          onSelect={(id) => set("sigilId", id)}
        />
        <button
          onClick={() => set("sigilId", "lattice")}
          className={cx(
            "w-full py-1.5 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) rounded-lg border transition-all mt-1",
            isLattice
              ? "border-action bg-action/5 text-foreground"
              : "border-line text-mute-fg hover:text-foreground"
          )}
        >
          Lattice — generated
        </button>
      </div>

      {/* Lattice coord controls — only when lattice form selected */}
      {isLattice && (
        <div className="space-y-2 border-l border-line pl-2">
          <div className="space-y-1">
            <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">
              Iteration — {lc.iteration} ({positionCount(lc.iteration)} pts)
            </p>
            <input
              type="range" min={0} max={2} step={1}
              value={lc.iteration}
              onChange={(e) => set("latticeCoord", {
                ...lc,
                iteration: Number(e.target.value),
                index: Math.min(lc.index, positionCount(Number(e.target.value)) - 1),
              })}
              className="w-full accent-foreground"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">
              Index — {lc.index} / {maxIndex}
            </p>
            <input
              type="range" min={0} max={maxIndex} step={1}
              value={lc.index}
              onChange={(e) => set("latticeCoord", { ...lc, index: Number(e.target.value) })}
              className="w-full accent-foreground"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">
              Step — {lc.step} (1=polygon · 2=star)
            </p>
            <input
              type="range" min={1} max={4} step={1}
              value={lc.step}
              onChange={(e) => set("latticeCoord", { ...lc, step: Number(e.target.value) })}
              className="w-full accent-foreground"
            />
          </div>
        </div>
      )}

      {/* Color mode */}
      <div className="space-y-1.5">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Color</p>
        <div className="grid grid-cols-2 gap-1">
          {COLOR_MODES.map((m) => (
            <ToggleOption
              key={m}
              active={typed.colorMode === m}
              onClick={() => set("colorMode", m)}
              className="px-2 py-1.5"
            >
              {m}
            </ToggleOption>
          ))}
        </div>
        {/* Live color preview */}
        {(isLattice && typed.latticeCoord) && (
          <div className="flex items-center gap-2 pt-1">
            <div
              className="w-5 h-5 rounded-lg border border-line shrink-0"
              style={{
                background: positionToOklch(
                  typed.latticeCoord.index,
                  typed.latticeCoord.iteration,
                  typed.colorMode,
                )
              }}
            />
            <span className="text-[9px] font-mono text-mute-fg/50 truncate">
              {positionToOklch(typed.latticeCoord.index, typed.latticeCoord.iteration, typed.colorMode)}
            </span>
          </div>
        )}
      </div>

      {/* Inset */}
      <div className="space-y-1">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">
          Inset — {typed.inset ?? defaultConfig.inset}px
        </p>
        <input
          type="range" min={0} max={48}
          value={typed.inset ?? defaultConfig.inset}
          onChange={(e) => set("inset", Number(e.target.value))}
          className="w-full accent-foreground"
        />
      </div>

      {/* Stroke */}
      <div className="space-y-1">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">
          Stroke — {typed.strokeWidth ?? defaultConfig.strokeWidth}
        </p>
        <input
          type="range" min={1} max={4} step={0.5}
          value={typed.strokeWidth ?? defaultConfig.strokeWidth}
          onChange={(e) => set("strokeWidth", Number(e.target.value))}
          className="w-full accent-foreground"
        />
      </div>

      {/* Trigger */}
      <div className="space-y-1.5">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Trigger</p>
        <div className="flex gap-1">
          {(["none", "link", "drawer", "dialog"] as const).map((t) => {
            const active = t === "none" ? !typed.trigger : typed.trigger?.type === t
            return (
              <button
                key={t}
                onClick={() =>
                  t === "none"
                    ? set("trigger", undefined)
                    : set("trigger", { type: t, target: typed.trigger?.target ?? "" })
                }
                className={cx(
                  "flex-1 py-1 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) rounded-lg border transition-all",
                  active
                    ? "border-action bg-action/5 text-foreground"
                    : "border-line text-mute-fg hover:text-foreground"
                )}
              >
                {t}
              </button>
            )
          })}
        </div>
        {typed.trigger && (
          <input
            value={typed.trigger.target}
            onChange={(e) => set("trigger", { ...typed.trigger!, target: e.target.value })}
            placeholder={typed.trigger.type === "link" ? "https://..." : "id"}
            className="w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
          />
        )}
      </div>
    </div>
  )
}

// ── Panel ─────────────────────────────────────────────────────────────────────

export function TattooPanel({ onFooter, panelData, onData }: PanelProps) {
  const config = (panelData as unknown as TattooConfig | undefined) ?? defaultConfig

  // Derive stroke color from lattice position when set
  const strokeColor = config.latticeCoord
    ? positionToOklch(config.latticeCoord.index, config.latticeCoord.iteration, config.colorMode)
    : undefined

  // Render the mark — named sigil or lattice-generated form
  let markContent: React.ReactNode

  if (config.sigilId === "lattice" && config.latticeCoord) {
    const { iteration, step } = config.latticeCoord
    const pathData = ringToPath(iteration, 12, 12, 9, step)
    markContent = (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          stroke: strokeColor ?? "currentColor",
          strokeWidth: config.strokeWidth,
        }}
      >
        <path d={pathData} />
      </svg>
    )
  } else {
    const SigilComponent = SIGIL_MAP[config.sigilId] ?? SIGIL_MAP["arc"]
    markContent = (
      <SigilComponent
        className="w-full h-full"
        strokeWidth={config.strokeWidth}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          ...(strokeColor ? { stroke: strokeColor } : {}),
        }}
      />
    )
  }

  useEffect(() => {
    const name = config.sigilId === "lattice" && config.latticeCoord
      ? `${config.colorMode} · ${config.latticeCoord.iteration}:${config.latticeCoord.index}`
      : (SIGILS.find((s) => s.id === config.sigilId)?.name ?? "Tattoo")
    onFooter?.(
      <div className="flex-1 py-3 px-3 flex items-center justify-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {name}
        </span>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, config.sigilId, config.latticeCoord, config.colorMode])

  const mark = (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ padding: config.inset }}
    >
      {markContent}
    </div>
  )

  let body: React.ReactNode
  if (config.trigger?.type === "link") {
    body = (
      <a href={config.trigger.target} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {mark}
      </a>
    )
  } else if (config.trigger) {
    body = (
      <button onClick={() => onData?.({ trigger: config.trigger })} className="block w-full h-full cursor-pointer">
        {mark}
      </button>
    )
  } else {
    body = mark
  }

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
