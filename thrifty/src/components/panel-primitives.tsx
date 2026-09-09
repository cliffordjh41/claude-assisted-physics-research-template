
import { Check, type LucideIcon } from "lucide-react"
import { cx } from "../lib/utils"
import { Checkbox } from "./ui/checkbox"

/**
 * Tab Navigation Footer
 * Bottom tab bar for panels (e.g., | COLOR | STYLE | TYPE |)
 */
interface TabNavigationFooterProps {
  tabs: { id: string; label: string; disabled?: boolean }[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function TabNavigationFooter({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationFooterProps) {
  return (
    <div className="flex border-t">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
          className={cx(
            "flex-1 py-3 text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) transition-colors",
            activeTab === tab.id
              ? "bg-mute text-foreground"
              : "text-mute-fg hover:text-foreground hover:bg-mute/50",
            tab.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

/**
 * Navigation Footer
 * BACK/NEXT navigation buttons
 * Single button: full width, primary
 * Two buttons: split evenly, BACK muted, NEXT primary
 */
interface NavigationFooterProps {
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
  nextDisabled?: boolean
}

export function NavigationFooter({
  onBack,
  onNext,
  backLabel = "BACK",
  nextLabel = "NEXT",
  nextDisabled,
}: NavigationFooterProps) {
  const hasBack = !!onBack
  const hasNext = !!onNext

  return (
    <div className="flex border-t">
      {hasBack && (
        <button
          onClick={onBack}
          className="flex-1 py-3 text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) transition-colors bg-mute text-foreground hover:bg-mute/80"
        >
          {backLabel}
        </button>
      )}
      {hasNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={cx(
            "flex-1 py-3 text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) transition-colors bg-action text-action-fg hover:bg-action/90",
            nextDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}

/**
 * Toggle Row
 * Button-style toggle with checkmark indicator
 */
interface ToggleRowProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function ToggleRow({
  label,
  checked,
  onCheckedChange,
  disabled,
}: ToggleRowProps) {
  return (
    <button
      onClick={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      className={cx(
        "flex-1 flex items-center justify-center relative px-4 py-3 rounded-lg border-2 transition-all",
        checked
          ? "border-action bg-action/5 text-foreground"
          : "border-line text-mute-fg hover:border-action/50 hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">
        {label}
      </span>
      {checked && <Check className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2" />}
    </button>
  )
}

/**
 * Selectable Row
 * List item with checkmark indicator
 */
interface SelectableRowProps {
  label: string
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

export function SelectableRow({
  label,
  selected,
  onSelect,
  disabled,
}: SelectableRowProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cx(
        "flex items-center justify-between w-full px-4 py-3 text-left transition-colors",
        selected
          ? "bg-mute text-foreground"
          : "text-mute-fg hover:text-foreground hover:bg-mute/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">
        {label}
      </span>
      {selected && <Check className="h-4 w-4" />}
    </button>
  )
}

/**
 * Checkbox Item
 * Toggle with label, ALL CAPS
 */
interface CheckboxItemProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function CheckboxItem({
  label,
  checked,
  onCheckedChange,
  disabled,
}: CheckboxItemProps) {
  return (
    <label
      className={cx(
        "flex items-center gap-3 py-2 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <span className="text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">
        {label}
      </span>
    </label>
  )
}

/**
 * Swatch Grid
 * Theme color swatch selector with 3-bar preview
 */
interface SwatchGridProps {
  swatches: {
    id: string
    name: string
    background: string
    primary: string
    muted: string
  }[]
  selectedId: string
  onSelect: (id: string) => void
}

/**
 * Toggle Option
 * Compact toggle button for segmented controls and option grids.
 * Active: inverted (foreground on background). Inactive: muted.
 */
interface ToggleOptionProps extends React.ComponentProps<"button"> {
  active: boolean
  size?: "sm" | "default"
}

export function ToggleOption({
  active,
  size = "default",
  className,
  disabled,
  ...props
}: ToggleOptionProps) {
  return (
    <button
      className={cx(
        "font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) rounded-lg transition-colors",
        size === "sm"
          ? "h-6 text-[9px]"
          : "h-7 text-[10px] border border-line",
        active
          ? "bg-foreground text-background"
          : "bg-mute text-mute-fg hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    />
  )
}

/**
 * Icon Grid
 * Icon selection grid — follows SwatchGrid selection mechanics.
 * Square cells, border ring on selected, name label below icon.
 */
interface IconGridProps {
  icons: { id: string; name: string; Icon: LucideIcon }[]
  selectedId: string | null
  onSelect: (id: string) => void
  columns?: number
}

export function IconGrid({ icons, selectedId, onSelect, columns = 4 }: IconGridProps) {
  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {icons.map(({ id, name, Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          title={name}
          className={cx(
            "aspect-square flex flex-col items-center justify-center gap-1 rounded-lg border transition-all",
            selectedId === id
              ? "border-action bg-action/5 text-foreground"
              : "border-line text-mute-fg hover:border-mute-fg/50 hover:text-foreground"
          )}
        >
          <Icon className="size-4" />
          <span className="text-[8px] uppercase tracking-(--theme-letter-spacing) leading-none">{name}</span>
        </button>
      ))}
    </div>
  )
}

export function SwatchGrid({ swatches, selectedId, onSelect }: SwatchGridProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {swatches.map((swatch) => (
        <button
          key={swatch.id}
          onClick={() => onSelect(swatch.id)}
          className={cx(
            "relative h-16 rounded-lg border-2 transition-all overflow-hidden",
            selectedId === swatch.id
              ? "border-action"
              : "border-line hover:border-mute-fg/50"
          )}
        >
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1" style={{ backgroundColor: swatch.background }} />
            <div className="h-3" style={{ backgroundColor: swatch.primary }} />
            <div className="h-2" style={{ backgroundColor: swatch.muted }} />
          </div>
          {selectedId === swatch.id && (
            <div className="absolute top-1 right-1 rounded-full bg-action p-0.5">
              <Check className="h-2.5 w-2.5 text-action-fg" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
