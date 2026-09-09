import { Fragment, type ComponentType } from "react"
import { cx } from "../../lib/utils"
import { VisuallyHidden } from "./visually-hidden"
import { useRovingTabindex } from "../../hooks/use-roving-tabindex"

// Generic mobile bottom bar: an evenly-divided row of icon controls, pinned to
// the bottom edge. Items-driven — the host supplies its own controls, so the
// kit stays free of any one app's panel names. Use it as the mobile counterpart
// to ColumnToolBar: the host picks `isMobile ? <BottomBar …> : <ColumnToolBar …>`.
//
// A grouped set of controls, so it's an APG Toolbar
// (https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/): role="toolbar" + an
// accessible label, one tab stop, arrow / Home / End roving via
// useRovingTabindex. Buttons that toggle a surface set `active` (rendered as
// aria-pressed). A required `label` names the bar for assistive tech.

export interface BottomBarItem {
  label: string
  icon: ComponentType<{ className?: string }>
  active?: boolean
  onClick?: () => void
}

interface BottomBarProps {
  items: BottomBarItem[]
  /** Accessible name for the bar (e.g. "Panels"). */
  label: string
  className?: string
}

export function BottomBar({ items, label, className }: BottomBarProps) {
  const roving = useRovingTabindex({
    itemCount: items.length,
    orientation: "horizontal",
    loop: true,
  })

  return (
    <div
      data-mobile-bar
      role="toolbar"
      aria-label={label}
      className={cx(
        "absolute bottom-0 left-0 right-0 h-12 bg-background border-t border-line flex items-stretch z-[60]",
        className,
      )}
    >
      {items.map((item, i) => {
        const { Icon, isToggle } = { Icon: item.icon, isToggle: item.active !== undefined }
        return (
          <Fragment key={item.label}>
            {i > 0 && (
              <div
                role="separator"
                aria-orientation="vertical"
                className="w-px self-center h-5 bg-line flex-shrink-0"
              />
            )}
            <button
              {...roving.getItemProps(i)}
              type="button"
              onClick={item.onClick}
              title={item.label}
              aria-label={item.label}
              aria-pressed={isToggle ? item.active : undefined}
              className={cx(
                "flex-1 flex items-center justify-center transition-colors",
                item.active
                  ? "bg-mute text-foreground"
                  : "text-mute-fg hover:text-foreground hover:bg-mute/50",
              )}
            >
              <Icon className="h-4 w-4" />
              <VisuallyHidden>{item.label}</VisuallyHidden>
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}
