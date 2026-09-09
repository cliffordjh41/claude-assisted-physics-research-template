export const meta = { id: "icons", label: "Icons", tier: "utility" as const, placement: "any" as const }

import { useState, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { IconGrid } from "../panel-primitives"
import { SIGILS } from "../icons/sigils"
import { LUCIDE_ICON_SET } from "../icons/lucide-set"
import { CheckboxItem } from "../panel-primitives"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"

export interface IconsConfig {
  sections: {
    lucide: boolean
    sigils: boolean
    custom: boolean
  }
  customIcons: {
    id: string
    name: string
    svg: string
  }[]
}

export const defaultConfig: IconsConfig = {
  sections: { lucide: true, sigils: true, custom: false },
  customIcons: [],
}

export function IconsConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as IconsConfig
  const sections = typed.sections ?? defaultConfig.sections
  const customIcons = typed.customIcons ?? []

  function setSection(key: keyof IconsConfig["sections"], value: boolean) {
    onChange({ ...typed, sections: { ...sections, [key]: value } })
  }

  function addCustom() {
    onChange({
      ...typed,
      customIcons: [...customIcons, { id: `custom-${Date.now()}`, name: "Icon", svg: "" }],
    })
  }

  function updateCustom(i: number, field: "name" | "svg", value: string) {
    const updated = [...customIcons]
    updated[i] = { ...updated[i], [field]: value }
    onChange({ ...typed, customIcons: updated })
  }

  function removeCustom(i: number) {
    onChange({ ...typed, customIcons: customIcons.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">
          Sections
        </p>
        <CheckboxItem
          label="Lucide"
          checked={sections.lucide}
          onCheckedChange={(v) => setSection("lucide", v as boolean)}
        />
        <CheckboxItem
          label="Sigils"
          checked={sections.sigils}
          onCheckedChange={(v) => setSection("sigils", v as boolean)}
        />
        <CheckboxItem
          label="Custom"
          checked={sections.custom}
          onCheckedChange={(v) => setSection("custom", v as boolean)}
        />
      </div>

      {sections.custom && (
        <div className="space-y-2">
          <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">
            Custom Icons
          </p>
          {customIcons.map((icon, i) => (
            <div key={icon.id} className="space-y-1 group">
              <div className="flex items-center gap-1.5">
                <input
                  value={icon.name}
                  onChange={(e) => updateCustom(i, "name", e.target.value)}
                  placeholder="Name"
                  className="flex-1 bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
                />
                <button
                  onClick={() => removeCustom(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground"
                >
                  <X className="size-2.5" />
                </button>
              </div>
              <textarea
                value={icon.svg}
                onChange={(e) => updateCustom(i, "svg", e.target.value)}
                placeholder="Paste SVG string..."
                rows={2}
                className="w-full bg-transparent text-[9px] text-mute-fg border border-line rounded-lg p-1 focus:border-foreground outline-none resize-none font-mono"
              />
            </div>
          ))}
          <button
            onClick={addCustom}
            className="flex items-center gap-1 pt-0.5 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors"
          >
            <Plus className="size-2.5" />Add
          </button>
        </div>
      )}
    </div>
  )
}

export function IconsPanel({ onFooter, panelData, onData }: PanelProps) {
  const config = (panelData as unknown as IconsConfig | undefined) ?? defaultConfig
  const sections = config.sections ?? defaultConfig.sections

  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const lucideIcons = sections.lucide ? LUCIDE_ICON_SET : []
  const sigilIcons = sections.sigils ? SIGILS : []

  const allIcons = [...lucideIcons, ...sigilIcons].filter((icon) =>
    search ? icon.name.toLowerCase().includes(search.toLowerCase()) : true
  )

  const customIcons = sections.custom ? (config.customIcons ?? []) : []
  const filteredCustom = customIcons.filter((c) =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) : true
  )

  function handleSelect(id: string) {
    setSelectedId(id)
    const lucide = LUCIDE_ICON_SET.find((i) => i.id === id)
    const sigil = SIGILS.find((s) => s.id === id)
    const custom = config.customIcons?.find((c) => c.id === id)

    if (lucide) {
      onData?.({ iconName: lucide.name, importPath: "lucide-react" })
    } else if (sigil) {
      onData?.({ iconName: sigil.name, importPath: "../icons/sigils" })
    } else if (custom) {
      onData?.({ iconName: custom.name, svgString: custom.svg })
    }
  }

  useEffect(() => {
    const selected = [...LUCIDE_ICON_SET, ...SIGILS].find((i) => i.id === selectedId)
    onFooter?.(
      <div className="flex-1 py-3 px-3 flex items-center justify-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {selected ? selected.name : "Icons"}
        </span>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, selectedId])

  const body = (
    <div className="flex flex-col h-full">
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent text-[10px] text-foreground placeholder:text-mute-fg/50 outline-none"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4">
        {allIcons.length > 0 && (
          <div className="space-y-1.5">
            {(sections.lucide && sections.sigils) && (
              <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/30">
                Icons
              </p>
            )}
            <IconGrid
              icons={allIcons}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        )}

        {filteredCustom.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/30">
              Custom
            </p>
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
            >
              {filteredCustom.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  title={c.name}
                  className={cx(
                    "aspect-square flex flex-col items-center justify-center gap-1 rounded-lg border transition-all overflow-hidden p-1",
                    selectedId === c.id
                      ? "border-action bg-action/5"
                      : "border-line text-mute-fg hover:border-mute-fg/50"
                  )}
                >
                  {c.svg ? (
                    <img
                      src={`data:image/svg+xml;base64,${btoa(c.svg)}`}
                      alt={c.name}
                      className="size-4 object-contain"
                    />
                  ) : (
                    <span className="text-[9px] text-mute-fg/30">SVG</span>
                  )}
                  <span className="text-[8px] uppercase tracking-(--theme-letter-spacing) leading-none truncate w-full text-center">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {allIcons.length === 0 && filteredCustom.length === 0 && (
          <p className="text-[10px] text-mute-fg/40 text-center py-8">
            {search ? "No results" : "No sections enabled"}
          </p>
        )}
      </div>
    </div>
  )

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
