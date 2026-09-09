import type { ReactNode } from "react"
import { cx } from "../../lib/utils"
import { useSwipeDismiss, type SwipeDirection } from "../../hooks/use-swipe-dismiss"

/**
 * Per the body's locked vocab a Drawer is a Panel with persistent
 * show/hide state inside a Column body. Slides in from one of the
 * four sides; the parent renders a button (typically in the Column
 * footer) that toggles `open`. Wheel events are isolated so scrolling
 * inside the drawer does not bubble to the parent column body.
 *
 * Parent must be `position: relative` (typically a SlidableColumnContent
 * with `relative !overflow-hidden`). The Drawer fills the parent box
 * when open; sits offscreen when closed.
 *
 * Optional `swipeToDismiss` enables pointer-driven drag-to-close. A
 * visible grab handle is rendered at the leading edge for bottom/top
 * drawers, or as a side-edge bar for left/right drawers. The whole
 * drawer is also a pointer target so the user can grab anywhere.
 */

export type DrawerSide = "top" | "right" | "bottom" | "left"

const OFFSCREEN_TRANSFORM: Record<DrawerSide, string> = {
  top: "-translate-y-full",
  right: "translate-x-full",
  bottom: "translate-y-full",
  left: "-translate-x-full",
}

const ONSCREEN_TRANSFORM: Record<DrawerSide, string> = {
  top: "translate-y-0",
  right: "translate-x-0",
  bottom: "translate-y-0",
  left: "translate-x-0",
}

const SIDE_TO_DIRECTION: Record<DrawerSide, SwipeDirection> = {
  top: "up",
  right: "right",
  bottom: "down",
  left: "left",
}

interface DrawerProps {
  open: boolean
  side?: DrawerSide
  children: ReactNode
  className?: string
  /** Accessible name for the drawer region. */
  label?: string
  /** Enable pointer-driven swipe-to-close. Default false (preserves
   * existing button-toggled behaviour for callers that don't opt in). */
  swipeToDismiss?: boolean
  /** Fired when the swipe gesture passes the dismiss threshold. Parent
   * is expected to flip `open` to false. */
  onDismiss?: () => void
  /** Show the grab handle bar (only when swipeToDismiss is on). */
  showHandle?: boolean
}

export function Drawer({
  open,
  side = "bottom",
  children,
  className,
  label,
  swipeToDismiss = false,
  onDismiss,
  showHandle = true,
}: DrawerProps) {
  const { isDragging, offset, swipeHandlers } = useSwipeDismiss({
    direction: SIDE_TO_DIRECTION[side],
    enabled: swipeToDismiss && open && !!onDismiss,
    onDismiss: onDismiss ?? (() => {}),
  })

  const axis: "x" | "y" = side === "left" || side === "right" ? "x" : "y"
  const sign = side === "right" || side === "bottom" ? 1 : -1
  const dragTransform =
    isDragging && offset > 0
      ? axis === "y"
        ? `translateY(${offset * sign}px)`
        : `translateX(${offset * sign}px)`
      : undefined

  // When closed the drawer is only translated offscreen — still in the DOM.
  // `inert` + `aria-hidden` keep its content out of the tab order and the
  // accessibility tree until it's open, so keyboard/SR users can't land in a
  // hidden panel.
  return (
    <div
      role="region"
      aria-label={label}
      aria-hidden={open ? undefined : true}
      inert={open ? undefined : true}
      className={cx(
        "absolute inset-0 bg-background border-line flex flex-col",
        isDragging ? "" : "transition-transform duration-200 ease-out",
        side === "bottom" && "border-t",
        side === "top" && "border-b",
        side === "left" && "border-r",
        side === "right" && "border-l",
        open ? ONSCREEN_TRANSFORM[side] : OFFSCREEN_TRANSFORM[side],
        className
      )}
      style={dragTransform ? { transform: dragTransform } : undefined}
      onWheel={(e) => e.stopPropagation()}
      {...(swipeToDismiss && open && onDismiss ? swipeHandlers : {})}
    >
      {swipeToDismiss && showHandle && side === "bottom" && (
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-full bg-mute-fg/30" aria-hidden />
        </div>
      )}
      {swipeToDismiss && showHandle && side === "top" && (
        <div className="flex justify-center pb-2 pt-1 shrink-0 order-last">
          <div className="h-1 w-10 rounded-full bg-mute-fg/30" aria-hidden />
        </div>
      )}
      {children}
    </div>
  )
}
