
export const meta = { id: "contact", label: "Contact", tier: "utility" as const, placement: "any" as const }

import { useState, useEffect } from "react"
import {
  Mail,
  Github,
  Linkedin,
  Globe,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"

interface ContactLink {
  id: string
  label: string
  icon: "mail" | "github" | "linkedin" | "globe" | "x"
  url: string
}

export interface ContactConfig {
  links: ContactLink[]
}

export const defaultConfig: ContactConfig = {
  links: [
    { id: "email",   label: "Email",    icon: "mail",     url: "" },
    { id: "github",  label: "GitHub",   icon: "github",   url: "" },
    { id: "linkedin",label: "LinkedIn", icon: "linkedin", url: "" },
    { id: "x",       label: "X",        icon: "x",        url: "" },
    { id: "site",    label: "Website",  icon: "globe",    url: "" },
  ],
}

const ICON_TYPES = ["mail", "github", "linkedin", "globe", "x"] as const

export function ContactConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as ContactConfig
  const links = typed.links ?? defaultConfig.links

  function update(next: ContactConfig) {
    onChange(next as unknown as Record<string, unknown>)
  }

  function updateLink(id: string, field: keyof ContactLink, value: string) {
    update({ ...typed, links: links.map(l => l.id === id ? { ...l, [field]: value } : l) })
  }

  function addLink() {
    update({ ...typed, links: [...links, { id: `lnk-${Date.now()}`, label: "", icon: "globe" as const, url: "" }] })
  }

  function removeLink(id: string) {
    update({ ...typed, links: links.filter(l => l.id !== id) })
  }

  return (
    <div className="space-y-3">
      <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Links</p>
      {links.map(link => (
        <div key={link.id} className="space-y-1 group">
          <div className="flex items-center gap-1.5">
            <input
              value={link.label}
              onChange={e => updateLink(link.id, "label", e.target.value)}
              placeholder="Label"
              className="flex-1 bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
            />
            <button
              onClick={() => removeLink(link.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground shrink-0"
            >
              <X className="size-2.5" />
            </button>
          </div>
          <input
            value={link.url}
            onChange={e => updateLink(link.id, "url", e.target.value)}
            placeholder="URL"
            className="w-full bg-transparent text-[10px] text-mute-fg border-b border-line/50 focus:border-foreground outline-none py-0.5"
          />
          <div className="flex items-center gap-1 pt-0.5">
            {ICON_TYPES.map(type => (
              <button
                key={type}
                onClick={() => updateLink(link.id, "icon", type)}
                className={cx(
                  "text-[9px] font-(--theme-font-weight) uppercase px-1.5 py-0.5 rounded-lg transition-colors",
                  link.icon === type
                    ? "bg-foreground text-background"
                    : "text-mute-fg/50 hover:text-foreground"
                )}
              >
                {type === "linkedin" ? "in" : type === "github" ? "gh" : type}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={addLink}
        className="flex items-center gap-1 pt-0.5 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors"
      >
        <Plus className="size-2.5" />Add Link
      </button>
    </div>
  )
}

const ICON_MAP = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
  x: null,
} as const

function ContactIcon({ type, className }: { type: ContactLink["icon"]; className?: string }) {
  if (type === "x") {
    return <span className={cx("text-[11px] font-(--theme-font-weight)", className)}>X</span>
  }
  const Icon = ICON_MAP[type]
  if (!Icon) return null
  return <Icon className={className} />
}

export function ContactPanel({ onFooter, panelData }: PanelProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const config = (panelData as unknown as ContactConfig | undefined) ?? defaultConfig
  const links = config.links

  const prev = () => setActiveIndex(Math.max(0, activeIndex - 1))
  const next = () => setActiveIndex(Math.min(links.length - 1, activeIndex + 1))

  const handleClick = (link: ContactLink) => {
    if (link.url) window.open(link.url, "_blank", "noopener,noreferrer")
  }

  useEffect(() => {
    onFooter?.(
      <div className="flex-1 py-3 px-3 flex items-center justify-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Contact
        </span>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter])

  const body = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Contact
        </span>
      </div>

      {/* Links list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleClick(link)}
            disabled={!link.url}
            className={cx(
              "w-full px-4 py-3 flex items-center gap-3 transition-colors text-left",
              link.url
                ? "hover:bg-mute/50 cursor-pointer"
                : "opacity-40 cursor-default"
            )}
          >
            <ContactIcon type={link.icon} className="size-3.5 shrink-0" />
            <span className="text-[11px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">{link.label}</span>
          </button>
        ))}
      </div>

      {/* Carousel mode — compact row with nav */}
      <div className="shrink-0 border-t border-line px-3 py-2">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className={cx(
              "p-1 transition-colors",
              activeIndex > 0 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20"
            )}
          >
            <ChevronLeft className="size-3" />
          </button>
          <div className="flex items-center gap-2 px-2">
            {links.map((link, i) => (
              <button
                key={link.id}
                onClick={() => handleClick(link)}
                disabled={!link.url}
                className={cx(
                  "size-7 flex items-center justify-center rounded-lg transition-colors",
                  i === activeIndex ? "bg-mute text-foreground" : "text-mute-fg hover:text-foreground",
                  !link.url && "opacity-30"
                )}
              >
                <ContactIcon type={link.icon} className="size-3" />
              </button>
            ))}
          </div>
          <button
            onClick={next}
            disabled={activeIndex === links.length - 1}
            className={cx(
              "p-1 transition-colors",
              activeIndex < links.length - 1 ? "text-mute-fg hover:text-foreground" : "text-mute-fg/20"
            )}
          >
            <ChevronRight className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
