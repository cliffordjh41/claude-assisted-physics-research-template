
export const meta = { id: "form", label: "Form", tier: "utility" as const, placement: "any" as const }

import { useState, useEffect } from "react"
import { FlipContainer } from "../ui/flip-container"
import { CheckboxItem } from "../panel-primitives"
import { Plus, X } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"

type FieldType = "text" | "email" | "textarea"

interface FormField {
  id: string
  label: string
  type: FieldType
  placeholder: string
  required: boolean
}

export interface FormConfig {
  heading: string
  submitUrl: string
  fields: FormField[]
}

export const defaultConfig: FormConfig = {
  heading: "Contact",
  submitUrl: "",
  fields: [
    { id: "email", label: "Email", type: "email", placeholder: "you@email.com", required: true },
    { id: "message", label: "Message", type: "textarea", placeholder: "Optional", required: false },
  ],
}

export function FormConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as FormConfig
  const fields = typed.fields ?? defaultConfig.fields

  function update(next: FormConfig) {
    onChange(next as unknown as Record<string, unknown>)
  }

  function addField() {
    update({ ...typed, fields: [...fields, { id: `field-${Date.now()}`, label: "", type: "text" as FieldType, placeholder: "", required: false }] })
  }

  function removeField(id: string) {
    update({ ...typed, fields: fields.filter(f => f.id !== id) })
  }

  function updateField(id: string, patch: Partial<FormField>) {
    update({ ...typed, fields: fields.map(f => f.id === id ? { ...f, ...patch } : f) })
  }

  const inputCls = "w-full bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
  const labelCls = "text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50"

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className={labelCls}>Heading</p>
        <input value={typed.heading ?? ""} onChange={e => update({ ...typed, heading: e.target.value })} placeholder="Contact" className={inputCls} />
      </div>
      <div className="space-y-1">
        <p className={labelCls}>Submit URL</p>
        <input value={typed.submitUrl ?? ""} onChange={e => update({ ...typed, submitUrl: e.target.value })} placeholder="https://..." className="w-full bg-transparent text-[10px] text-mute-fg/60 border-b border-line/50 focus:border-foreground outline-none py-0.5" />
      </div>
      <div className="border-t border-line/50" />
      <p className={labelCls}>Fields</p>
      {fields.map(field => (
        <div key={field.id} className="space-y-1.5 group">
          <div className="flex items-center gap-1.5">
            <input value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} placeholder="Label" className={inputCls} />
            <button onClick={() => removeField(field.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground shrink-0">
              <X className="size-2.5" />
            </button>
          </div>
          <div className="flex gap-1">
            {(["text", "email", "textarea"] as FieldType[]).map(t => (
              <button
                key={t}
                onClick={() => updateField(field.id, { type: t })}
                className={cx(
                  "px-1.5 py-0.5 text-[8px] uppercase tracking-(--theme-letter-spacing) border rounded-sm transition-colors",
                  field.type === t ? "border-foreground/40 text-foreground" : "border-line text-mute-fg/40 hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <input value={field.placeholder} onChange={e => updateField(field.id, { placeholder: e.target.value })} placeholder="Placeholder" className="w-full bg-transparent text-[9px] text-mute-fg/60 border-b border-line/30 focus:border-foreground outline-none py-0.5" />
          <CheckboxItem label="Required" checked={field.required} onCheckedChange={v => updateField(field.id, { required: v as boolean })} />
        </div>
      ))}
      <button onClick={addField} className="flex items-center gap-1 pt-0.5 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors">
        <Plus className="size-2.5" />Add Field
      </button>
    </div>
  )
}

type FormState = "idle" | "submitting" | "success" | "error"

export function FormPanel({ onFooter, panelData, role = "consumer", onData }: PanelProps) {
  const config = (panelData as unknown as FormConfig | undefined) ?? defaultConfig
  const activeFields = config.fields
  const [values, setValues] = useState<Record<string, string>>({})
  const [formState, setFormState] = useState<FormState>("idle")

  function setValue(id: string, value: string) {
    setValues(prev => ({ ...prev, [id]: value }))
  }

  useEffect(() => {
    onFooter?.(
      <div className="flex-1 py-3 px-3 flex items-center justify-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {config.heading}
        </span>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, config.heading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("submitting")
    if (config.submitUrl) {
      try {
        await fetch(config.submitUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        onData?.(values)
        setFormState("success")
        setValues({})
        setTimeout(() => setFormState("idle"), 2500)
      } catch {
        setFormState("error")
        setTimeout(() => setFormState("idle"), 2000)
      }
    } else {
      setTimeout(() => {
        onData?.(values)
        setFormState("success")
        setValues({})
        setTimeout(() => setFormState("idle"), 2500)
      }, 800)
    }
  }

  const fieldCls = "w-full h-8 px-3 rounded-lg border border-line bg-mute/30 text-xs text-foreground placeholder:text-mute-fg focus:outline-none focus:ring-1 focus:ring-action"

  const formFields = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {activeFields.map(field => (
        <div key={field.id} className="space-y-1.5">
          <label className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              value={values[field.id] ?? ""}
              onChange={e => setValue(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-line bg-mute/30 text-xs text-foreground placeholder:text-mute-fg focus:outline-none focus:ring-1 focus:ring-action resize-none"
            />
          ) : (
            <input
              type={field.type}
              value={values[field.id] ?? ""}
              onChange={e => setValue(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={fieldCls}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={formState === "submitting"}
        className={cx(
          "w-full py-2 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) rounded-lg transition-colors",
          "bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
        )}
      >
        {formState === "submitting" ? "Sending..." : "Send"}
      </button>
    </form>
  )

  // ── Consumer view — FlipContainer: front=form, back=success ──

  const consumerFront = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {config.heading}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {formState === "error" && (
          <p className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-red-400 mb-3">
            Error — try again
          </p>
        )}
        {formFields}
      </div>
    </div>
  )

  const consumerBack = (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <p className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">Sent</p>
    </div>
  )

  const consumerBody = (
    <div className="flex flex-col h-full overflow-hidden">
      <FlipContainer
        front={consumerFront}
        back={consumerBack}
        flipped={formState === "success"}
        className="flex-1 min-h-0 cursor-default"
      />
    </div>
  )

  // ── Provider view — form as configured, no flip ───────────────

  const providerBody = (
    <div className="flex flex-col h-full">
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {config.heading}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {formFields}
      </div>
    </div>
  )

  const body = role === "consumer" ? consumerBody : providerBody

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
