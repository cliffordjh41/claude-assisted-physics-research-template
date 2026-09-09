import * as React from "react"
import { createContext, useContext, useState } from "react"
import { cx } from "../../lib/utils"
import {
  useSortable,
  type SortableItemData,
  type UseSortableConfig,
  type UseSortableReturn,
} from "../../hooks/use-sortable"

// Reorderable list. Pointer drag-and-drop plus a keyboard path so it isn't
// mouse-only: focus an item, Space/Enter to grab, arrow keys to move, Space/Enter
// to drop, Esc to cancel. A polite-but-assertive live region announces grab /
// move / drop. Semantics: role="list" + role="listitem" with an
// aria-roledescription; the item's own content is its accessible name.

interface SortableContextValue<T extends SortableItemData = SortableItemData>
  extends UseSortableReturn<T> {
  direction: "vertical" | "horizontal"
  grabbed: string | null
  setGrabbed: (id: string | null) => void
  announce: (message: string) => void
}

const SortableContext = createContext<SortableContextValue | null>(null)

function useSortableContext() {
  const context = useContext(SortableContext)
  if (!context) {
    throw new Error("Sortable components must be used within a Sortable")
  }
  return context
}

export interface SortableProps<T extends SortableItemData = SortableItemData>
  extends UseSortableConfig<T> {
  children: React.ReactNode
  className?: string
  containerId?: string
  /** Accessible name for the list. */
  label?: string
}

function Sortable<T extends SortableItemData = SortableItemData>({
  children,
  className,
  containerId,
  label,
  direction = "vertical",
  ...config
}: SortableProps<T>) {
  const sortable = useSortable({ ...config, direction })
  const [grabbed, setGrabbed] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const dropProps = sortable.getDropProps(containerId)

  return (
    <SortableContext.Provider
      value={
        {
          ...sortable,
          direction,
          grabbed,
          setGrabbed,
          announce: setAnnouncement,
        } as SortableContextValue
      }
    >
      <div
        role="list"
        aria-label={label}
        aria-roledescription="Sortable list"
        className={cx(
          "relative",
          direction === "vertical" ? "flex flex-col" : "flex flex-row",
          className
        )}
        {...dropProps}
      >
        {children}
      </div>
      <div aria-live="assertive" className="sr-only">
        {announcement}
      </div>
    </SortableContext.Provider>
  )
}

export interface SortableItemProps {
  id: string
  children: React.ReactNode
  className?: string
  handle?: boolean
  disabled?: boolean
  dragClassName?: string
  dropClassName?: string
}

function SortableItem({
  id,
  children,
  className,
  handle = false,
  disabled = false,
  dragClassName = "opacity-50",
  dropClassName = "ring-2 ring-action ring-offset-2",
}: SortableItemProps) {
  const { getDragProps, isDragging, isDropTarget, direction, items, moveItem, grabbed, setGrabbed, announce } =
    useSortableContext()
  const dragProps = handle || disabled ? {} : getDragProps(id)
  const dragging = isDragging(id)
  const dropTarget = isDropTarget(id)
  const index = items.findIndex((i) => i.id === id)
  const count = items.length
  const isGrabbed = grabbed === id

  const move = (delta: number) => {
    const to = index + delta
    if (to < 0 || to >= count) return
    moveItem(index, to)
    announce(`Moved to position ${to + 1} of ${count}`)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    const forward = direction === "vertical" ? "ArrowDown" : "ArrowRight"
    const back = direction === "vertical" ? "ArrowUp" : "ArrowLeft"
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      if (isGrabbed) {
        setGrabbed(null)
        announce(`Dropped at position ${index + 1} of ${count}`)
      } else {
        setGrabbed(id)
        announce(
          `Grabbed, position ${index + 1} of ${count}. Use arrow keys to move, space to drop, escape to cancel.`
        )
      }
    } else if (isGrabbed && e.key === forward) {
      e.preventDefault()
      move(1)
    } else if (isGrabbed && e.key === back) {
      e.preventDefault()
      move(-1)
    } else if (isGrabbed && e.key === "Escape") {
      e.preventDefault()
      setGrabbed(null)
      announce("Reorder cancelled")
    }
  }

  return (
    <div
      role="listitem"
      aria-roledescription="Sortable item"
      tabIndex={disabled ? undefined : 0}
      onKeyDown={onKeyDown}
      className={cx(
        "relative transition-all duration-150 outline-none focus-visible:ring-1 focus-visible:ring-focus",
        !handle && !disabled && "cursor-grab active:cursor-grabbing",
        dragging && dragClassName,
        dropTarget && dropClassName,
        isGrabbed && "ring-2 ring-action",
        className
      )}
      data-sortable-id={id}
      data-dragging={dragging}
      data-drop-target={dropTarget}
      data-direction={direction}
      data-grabbed={isGrabbed}
      {...dragProps}
    >
      {children}
    </div>
  )
}

export interface SortableHandleProps {
  id: string
  children: React.ReactNode
  className?: string
}

function SortableHandle({ id, children, className }: SortableHandleProps) {
  const { getDragProps } = useSortableContext()
  const dragProps = getDragProps(id)

  return (
    <div
      className={cx("cursor-grab active:cursor-grabbing", className)}
      {...dragProps}
    >
      {children}
    </div>
  )
}

export {
  Sortable,
  SortableItem,
  SortableHandle,
  useSortableContext,
}
