
import { useState, useEffect } from "react"
import { Sortable, SortableItem, SortableHandle } from "../ui/sortable"
import { CheckboxItem } from "../panel-primitives"
import { cx } from "../../lib/utils"
import { GripVertical, Plus, Upload, X } from "lucide-react"
import type { PanelProps } from "../../types/panel"

export const meta = { id: "data-table", label: "Data Table", tier: "utility" as const, placement: "any" as const }

interface Column {
  key: string
  label: string
}

interface Row {
  id: string
  [key: string]: string
}

export interface DataTableConfig {
  columns: Column[]
  rows: Row[]
  editable: boolean
  sortable: boolean
  allowAddRemove: boolean
  apiUrl?: string
  apiKey?: string
}

export const defaultConfig: DataTableConfig = {
  columns: [
    { key: "name",   label: "Name"   },
    { key: "role",   label: "Role"   },
    { key: "status", label: "Status" },
  ],
  rows: [
    { id: "1", name: "Alice Chen",  role: "Design",       status: "Active"   },
    { id: "2", name: "Bob Torres",  role: "Engineering",  status: "Active"   },
    { id: "3", name: "Carol King",  role: "Product",      status: "Away"     },
  ],
  editable: true,
  sortable: true,
  allowAddRemove: true,
}

function parseCSV(text: string): Record<string, string>[] {
  const [headerLine, ...rows] = text.trim().split('\n')
  const headers = headerLine.split(',').map(h => h.trim())
  return rows.filter(r => r.trim()).map(row => {
    const vals = row.split(',')
    return Object.fromEntries(headers.map((h, i) => [h, vals[i]?.trim() ?? '']))
  })
}

function parseFileJSON(text: string): Record<string, unknown>[] {
  try {
    const data = JSON.parse(text)
    return Array.isArray(data) ? data : [data]
  } catch { return [] }
}

export function DataTableConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as DataTableConfig
  const columns = typed.columns ?? defaultConfig.columns
  const rows = typed.rows ?? defaultConfig.rows

  function update(next: DataTableConfig) {
    onChange(next as unknown as Record<string, unknown>)
  }

  function addColumn() {
    const key = `col${Date.now()}`
    const newCol: Column = { key, label: "" }
    const newRows = rows.map(r => ({ ...r, [key]: "" }))
    update({ ...typed, columns: [...columns, newCol], rows: newRows })
  }

  function removeColumn(key: string) {
    const newCols = columns.filter(c => c.key !== key)
    const newRows = rows.map(r => {
      const { [key]: _removed, ...rest } = r
      return rest as Row
    })
    update({ ...typed, columns: newCols, rows: newRows })
  }

  function updateColumn(key: string, label: string) {
    update({ ...typed, columns: columns.map(c => c.key === key ? { ...c, label } : c) })
  }

  function addRow() {
    const newRow: Row = { id: `row-${Date.now()}` }
    columns.forEach(col => { newRow[col.key] = "" })
    update({ ...typed, rows: [...rows, newRow] })
  }

  function removeRow(id: string) {
    update({ ...typed, rows: rows.filter(r => r.id !== id) })
  }

  function updateCell(rowId: string, colKey: string, value: string) {
    update({ ...typed, rows: rows.map(r => r.id === rowId ? { ...r, [colKey]: value } : r) })
  }

  function setToggle(field: "editable" | "sortable" | "allowAddRemove", value: boolean) {
    update({ ...typed, [field]: value })
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const raw = file.name.endsWith('.csv') ? parseCSV(text) : parseFileJSON(text)
      if (!raw.length) return
      const keys = Object.keys(raw[0]).filter(k => k !== 'id')
      const newCols: Column[] = keys.map(k => ({ key: k, label: k }))
      const newRows: Row[] = raw.map((r, i) => ({
        id: String((r as Record<string, unknown>).id ?? i),
        ...Object.fromEntries(keys.map(k => [k, String((r as Record<string, string>)[k] ?? '')])),
      }))
      update({ ...typed, columns: newCols, rows: newRows })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const inputCls = "flex-1 bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Data Source</p>
        <input
          value={typed.apiUrl ?? ""}
          onChange={e => update({ ...typed, apiUrl: e.target.value })}
          placeholder="https://...supabase.co/rest/v1/table"
          className="w-full bg-transparent text-[10px] text-mute-fg/60 border-b border-line/50 focus:border-foreground outline-none py-0.5"
        />
        <input
          value={typed.apiKey ?? ""}
          onChange={e => update({ ...typed, apiKey: e.target.value })}
          placeholder="anon key"
          type="password"
          className="w-full bg-transparent text-[10px] text-mute-fg/60 border-b border-line/30 focus:border-foreground outline-none py-0.5"
        />
        <label className="flex items-center gap-1 pt-1 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors cursor-pointer">
          <Upload className="size-2.5" />
          Import CSV / JSON
          <input type="file" accept=".csv,.json" className="sr-only" onChange={handleImport} />
        </label>
      </div>
      <div className="border-t border-line/50" />
      <div className="space-y-1.5">
        <CheckboxItem label="Editable" checked={typed.editable ?? true} onCheckedChange={v => setToggle("editable", v as boolean)} />
        <CheckboxItem label="Sortable" checked={typed.sortable ?? true} onCheckedChange={v => setToggle("sortable", v as boolean)} />
        <CheckboxItem label="Allow Add / Remove" checked={typed.allowAddRemove ?? true} onCheckedChange={v => setToggle("allowAddRemove", v as boolean)} />
      </div>
      <div className="border-t border-line/50" />
      <div className="space-y-2">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Columns</p>
        {columns.map(col => (
          <div key={col.key} className="flex items-center gap-1.5 group">
            <input
              value={col.label}
              onChange={e => updateColumn(col.key, e.target.value)}
              placeholder="Column label"
              className={inputCls}
            />
            <button
              onClick={() => removeColumn(col.key)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground shrink-0"
            >
              <X className="size-2.5" />
            </button>
          </div>
        ))}
        <button onClick={addColumn} className="flex items-center gap-1 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors">
          <Plus className="size-2.5" />Column
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Rows</p>
        {rows.map(row => (
          <div key={row.id} className="space-y-1 group">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-mute-fg/40 uppercase tracking-(--theme-letter-spacing)">Row</span>
              <button
                onClick={() => removeRow(row.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground"
              >
                <X className="size-2.5" />
              </button>
            </div>
            {columns.map(col => (
              <input
                key={col.key}
                value={row[col.key] ?? ""}
                onChange={e => updateCell(row.id, col.key, e.target.value)}
                placeholder={col.label || col.key}
                className="w-full bg-transparent text-[10px] text-foreground border-b border-line/50 focus:border-foreground outline-none py-0.5"
              />
            ))}
          </div>
        ))}
        <button onClick={addRow} className="flex items-center gap-1 pt-0.5 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors">
          <Plus className="size-2.5" />Row
        </button>
      </div>
    </div>
  )
}

// ── Fallback config (used when panelData is absent) ───────────
const COLUMNS: Column[] = defaultConfig.columns
const DEFAULT_ROWS: Row[] = defaultConfig.rows
// ─────────────────────────────────────────────────────────────

export function DataTablePanel({ onFooter, panelData, role = "consumer", liveData }: PanelProps) {
  const config = (panelData as unknown as DataTableConfig | undefined) ?? null
  const configColumns = config?.columns ?? COLUMNS
  const editable = config?.editable ?? true
  const sortable = config?.sortable ?? true
  const allowAddRemove = config?.allowAddRemove ?? true

  // Provider + liveData: show incoming rows from linked panel, columns derived from first row
  const isLiveMode = role === "provider" && liveData && liveData.length > 0
  const liveColumns: Column[] = isLiveMode
    ? Object.keys(liveData![0]).filter(k => k !== "id").map(k => ({ key: k, label: k }))
    : configColumns
  const liveRows: Row[] = isLiveMode
    ? liveData!.map((d, i) => ({ id: String(i), ...Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v ?? "")])) }))
    : []

  const [rows, setRows] = useState<Row[]>(() => config?.rows ?? DEFAULT_ROWS)

  // API axis — fetch from external source when apiUrl is set
  useEffect(() => {
    if (!config?.apiUrl) return
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (config.apiKey) {
      headers["apikey"] = config.apiKey
      headers["Authorization"] = `Bearer ${config.apiKey}`
    }
    fetch(config.apiUrl, { headers })
      .then(r => r.json())
      .then((data: Record<string, unknown>[]) => {
        if (!Array.isArray(data) || data.length === 0) return
        const apiRows: Row[] = data.map((d, i) => ({
          id: String((d.id as string | number | undefined) ?? i),
          ...Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v ?? "")])),
        }))
        setRows(apiRows)
      })
      .catch(() => {})
  }, [config?.apiUrl, config?.apiKey])

  const displayColumns = isLiveMode ? liveColumns : configColumns
  const displayRows = isLiveMode ? liveRows : rows
  const [editingCell, setEditingCell] = useState<{ rowId: string; colKey: string } | null>(null)

  function updateCell(rowId: string, colKey: string, value: string) {
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, [colKey]: value } : r))
  }

  function addRow() {
    const newRow: Row = { id: Date.now().toString() }
    COLUMNS.forEach(col => { newRow[col.key] = "" })
    setRows(prev => [...prev, newRow])
  }

  function removeRow(id: string) {
    if (rows.length <= 1) return
    setRows(prev => prev.filter(r => r.id !== id))
    setEditingCell(null)
  }

  useEffect(() => {
    onFooter?.(
      <div className="flex-1 py-3 px-3 flex items-center gap-2">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {displayRows.length} rows
        </span>
        {isLiveMode && (
          <span className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg/40">live</span>
        )}
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, displayRows.length, isLiveMode])

  const body = (
    <div className="flex flex-col h-full">
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center justify-between">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {isLiveMode ? "Live Feed" : "Data Table"}
        </span>
        {allowAddRemove && !isLiveMode && (
          <button onClick={addRow} className="p-1 text-mute-fg hover:text-foreground transition-colors">
            <Plus className="size-3" />
          </button>
        )}
      </div>

      {/* @container switches layout based on actual panel width */}
      <div className="flex-1 min-h-0 overflow-y-auto @container">
        <div className="p-3">

          {/* Cards — narrow (hidden at 480px+) */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 @[480px]:hidden">
            {displayRows.map(row => (
              <div key={row.id} className="border border-line rounded-sm p-3 space-y-1.5">
                {displayColumns.map(col => (
                  <div key={col.key} className="flex items-baseline gap-2">
                    <span className="text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg shrink-0">
                      {col.label}
                    </span>
                    <span className="text-[10px] text-foreground truncate flex-1 text-right">
                      {row[col.key] || "—"}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Table — wide (visible at 480px+) */}
          <div className="hidden @[480px]:block">
            {/* Header */}
            <div className="flex items-center border-b border-line pb-2 mb-0.5">
              {sortable && <div className="w-5 shrink-0" />}
              {displayColumns.map(col => (
                <div key={col.key} className="flex-1 pr-4 text-[9px] uppercase tracking-(--theme-letter-spacing) text-mute-fg font-(--theme-font-weight)">
                  {col.label}
                </div>
              ))}
              {allowAddRemove && <div className="w-5 shrink-0" />}
            </div>

            {/* Rows — sortable when enabled */}
            {sortable && !isLiveMode ? (
              <Sortable items={displayRows} onReorder={setRows} direction="vertical">
                {displayRows.map(row => (
                  <SortableItem key={row.id} id={row.id} handle className="group">
                    <div className="flex items-center border-b border-line/40 last:border-0">
                      <SortableHandle id={row.id} className="w-5 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="size-3 text-mute-fg/50" />
                      </SortableHandle>
                      {displayColumns.map(col => (
                        <div key={col.key} className="flex-1 pr-4 py-2.5">
                          {editable && editingCell?.rowId === row.id && editingCell?.colKey === col.key ? (
                            <input
                              autoFocus
                              value={row[col.key] ?? ""}
                              onChange={e => updateCell(row.id, col.key, e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditingCell(null) }}
                              className="w-full bg-transparent text-[11px] text-foreground outline-none border-b border-line"
                            />
                          ) : (
                            <span
                              onClick={() => editable && setEditingCell({ rowId: row.id, colKey: col.key })}
                              className={cx(
                                "block text-[11px]",
                                editable && "cursor-text",
                                row[col.key] ? "text-foreground" : "text-mute-fg/30"
                              )}
                            >
                              {row[col.key] || "—"}
                            </span>
                          )}
                        </div>
                      ))}
                      {allowAddRemove && (
                        <button
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length <= 1}
                          className="w-5 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:pointer-events-none text-mute-fg/50 hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </Sortable>
            ) : (
              <div>
                {displayRows.map(row => (
                  <div key={row.id} className="flex items-center border-b border-line/40 last:border-0">
                    {displayColumns.map(col => (
                      <div key={col.key} className="flex-1 pr-4 py-2.5">
                        {editable && editingCell?.rowId === row.id && editingCell?.colKey === col.key ? (
                          <input
                            autoFocus
                            value={row[col.key] ?? ""}
                            onChange={e => updateCell(row.id, col.key, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditingCell(null) }}
                            className="w-full bg-transparent text-[11px] text-foreground outline-none border-b border-line"
                          />
                        ) : (
                          <span
                            onClick={() => editable && setEditingCell({ rowId: row.id, colKey: col.key })}
                            className={cx(
                              "block text-[11px]",
                              editable && "cursor-text",
                              row[col.key] ? "text-foreground" : "text-mute-fg/30"
                            )}
                          >
                            {row[col.key] || "—"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )

  return <div className="w-full h-full flex flex-col overflow-hidden">{body}</div>
}
