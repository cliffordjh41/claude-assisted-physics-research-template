import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cx } from "../../lib/utils"

interface ComboboxContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  value: string | null
  setValue: (value: string | null) => void
  search: string
  setSearch: (search: string) => void
  registerItem: (value: string, label: string) => () => void
  itemMap: Map<string, string>
  activeValue: string | null
  setActiveValue: (value: string | null) => void
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null)

function useCombobox() {
  const ctx = useContext(ComboboxContext)
  if (!ctx) throw new Error("Combobox components must be used inside <Combobox>")
  return ctx
}

interface ComboboxProps {
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

function Combobox({
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [search, setSearch] = useState("")
  const [itemMap, setItemMap] = useState<Map<string, string>>(new Map())
  const [activeValue, setActiveValue] = useState<string | null>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const setValue = useCallback(
    (next: string | null) => {
      if (controlledValue === undefined) setInternalValue(next)
      onValueChange?.(next)
    },
    [controlledValue, onValueChange]
  )

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
      if (!next) setSearch("")
    },
    [controlledOpen, onOpenChange]
  )

  const registerItem = useCallback((itemValue: string, label: string) => {
    setItemMap((prev) => {
      const next = new Map(prev)
      next.set(itemValue, label)
      return next
    })
    return () => {
      setItemMap((prev) => {
        const next = new Map(prev)
        next.delete(itemValue)
        return next
      })
    }
  }, [])

  const ctx: ComboboxContextValue = {
    open,
    setOpen,
    value,
    setValue,
    search,
    setSearch,
    registerItem,
    itemMap,
    activeValue,
    setActiveValue,
  }

  return (
    <ComboboxContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  )
}

const TRIGGER_BASE =
  "flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-foreground disabled:pointer-events-none disabled:opacity-50"

function ComboboxTrigger({
  className,
  children,
  placeholder = "Select…",
  ...props
}: ComponentProps<"button"> & { placeholder?: string }) {
  const { value, itemMap } = useCombobox()
  const display = value !== null ? itemMap.get(value) ?? value : placeholder
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        className={cx(TRIGGER_BASE, className)}
        {...props}
      >
        <span className={value === null ? "text-mute-fg" : undefined}>
          {children ?? display}
        </span>
        <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
      </button>
    </PopoverTrigger>
  )
}

const CONTENT_BASE = "w-(--radix-popover-trigger-width) p-0"

function ComboboxContent({
  className,
  children,
  ...props
}: ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      align="start"
      sideOffset={4}
      className={cx(CONTENT_BASE, className)}
      {...props}
    >
      <div className="flex flex-col" role="listbox">
        {children}
      </div>
    </PopoverContent>
  )
}

const INPUT_WRAP_BASE = "flex items-center gap-2 border-b border-line px-3 py-2"
const INPUT_BASE =
  "flex-1 bg-transparent text-sm outline-none placeholder:text-mute-fg disabled:cursor-not-allowed disabled:opacity-50"

function ComboboxInput({
  className,
  placeholder = "Search…",
  ...props
}: ComponentProps<"input">) {
  const { search, setSearch, itemMap, setActiveValue, setValue, setOpen, activeValue } =
    useCombobox()
  const filtered = useMemo(() => {
    if (!search) return Array.from(itemMap.keys())
    const lower = search.toLowerCase()
    return Array.from(itemMap.entries())
      .filter(([, label]) => label.toLowerCase().includes(lower))
      .map(([v]) => v)
  }, [search, itemMap])

  useEffect(() => {
    if (filtered.length === 0) {
      setActiveValue(null)
    } else if (!activeValue || !filtered.includes(activeValue)) {
      setActiveValue(filtered[0])
    }
  }, [filtered, activeValue, setActiveValue])

  return (
    <div className={cx(INPUT_WRAP_BASE, className)}>
      <Search className="size-4 text-mute-fg shrink-0" />
      <input
        type="text"
        autoFocus
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            if (filtered.length === 0) return
            const idx = activeValue ? filtered.indexOf(activeValue) : -1
            const next = (idx + 1) % filtered.length
            setActiveValue(filtered[next])
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            if (filtered.length === 0) return
            const idx = activeValue ? filtered.indexOf(activeValue) : 0
            const next = (idx - 1 + filtered.length) % filtered.length
            setActiveValue(filtered[next])
          } else if (e.key === "Enter") {
            if (activeValue) {
              e.preventDefault()
              setValue(activeValue)
              setOpen(false)
            }
          } else if (e.key === "Escape") {
            e.preventDefault()
            setOpen(false)
          }
        }}
        className={INPUT_BASE}
        {...props}
      />
    </div>
  )
}

function ComboboxList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cx("max-h-64 overflow-y-auto p-1", className)}
      {...props}
    />
  )
}

const ITEM_BASE =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[active=true]:bg-mute data-[active=true]:text-foreground data-[selected=true]:font-(--theme-font-weight) data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"

interface ComboboxItemProps extends Omit<ComponentProps<"div">, "onSelect"> {
  value: string
  label?: string
  disabled?: boolean
  onSelect?: (value: string) => void
}

function ComboboxItem({
  className,
  value,
  label,
  disabled,
  children,
  onSelect,
  ...props
}: ComboboxItemProps) {
  const {
    registerItem,
    search,
    value: selectedValue,
    setValue,
    setOpen,
    activeValue,
    setActiveValue,
  } = useCombobox()
  const ref = useRef<HTMLDivElement>(null)
  const displayLabel = label ?? (typeof children === "string" ? children : value)
  const isActive = activeValue === value
  const isSelected = selectedValue === value

  useEffect(() => registerItem(value, displayLabel), [value, displayLabel, registerItem])

  // Hide non-matching items.
  const visible = useMemo(() => {
    if (!search) return true
    return displayLabel.toLowerCase().includes(search.toLowerCase())
  }, [search, displayLabel])

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ block: "nearest" })
    }
  }, [isActive])

  if (!visible) return null

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      data-active={isActive}
      data-selected={isSelected}
      data-disabled={disabled}
      onMouseEnter={() => setActiveValue(value)}
      onClick={() => {
        if (disabled) return
        setValue(value)
        onSelect?.(value)
        setOpen(false)
      }}
      className={cx(ITEM_BASE, className)}
      {...props}
    >
      <span className="flex-1">{children ?? displayLabel}</span>
      {isSelected && <Check className="size-4" />}
    </div>
  )
}

function ComboboxEmpty({
  className,
  children = "No results.",
  ...props
}: ComponentProps<"div">) {
  const { search, itemMap } = useCombobox()
  if (!search) return null
  const any = Array.from(itemMap.values()).some((label) =>
    label.toLowerCase().includes(search.toLowerCase())
  )
  if (any) return null
  return (
    <div
      className={cx("py-6 text-center text-sm text-mute-fg", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
}
