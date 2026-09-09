
import * as React from "react"
import { cx } from "../../lib/utils"

// Explicit pixel width — must NOT depend on rem / root font-size, so
// column geometry stays consistent regardless of user / browser font
// scaling. ColumnToolBar.tsx imports this same constant for its alignment
// math; do not duplicate the number elsewhere.
export const COLUMN_WIDTH = 288
const HANDLE_VISIBLE = 12 // Always keep 12px visible when hidden

interface SlidableColumnContextValue {
  offset: number
  isDragging: boolean
  side: "left" | "right"
  startDrag: (e: React.MouseEvent) => void
}

const SlidableColumnContext = React.createContext<SlidableColumnContextValue | null>(null)

function useSlidableColumn() {
  const context = React.useContext(SlidableColumnContext)
  if (!context) {
    throw new Error("useSlidableColumn must be used within SlidableColumn")
  }
  return context
}

interface SlidableColumnProps extends React.ComponentProps<"div"> {
  side: "left" | "right"
  offset: number
  onOffsetChange: (offset: number) => void
  hidden?: boolean
  swapped?: boolean
  zIndex?: number
  bottomOffset?: number
  onMouseDown?: () => void
}

function SlidableColumn({
  side,
  offset,
  onOffsetChange,
  hidden = false,
  swapped = false,
  zIndex = 10,
  bottomOffset = 0,
  className,
  children,
  style,
  onMouseDown,
  ...props
}: SlidableColumnProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const dragStartRef = React.useRef({ x: 0, offset: 0 })

  const startDrag = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      dragStartRef.current = { x: e.clientX, offset }
    },
    [offset]
  )

  // Handle mouse move and up events
  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x
      const newOffset = dragStartRef.current.offset + deltaX

      // Screen-aware clamp bounds
      if (side === "left") {
        // Left column: can hide 244px off left edge, can go to right edge minus 12px
        const clamped = Math.max(-(COLUMN_WIDTH - HANDLE_VISIBLE), Math.min(window.innerWidth - HANDLE_VISIBLE, newOffset))
        onOffsetChange(clamped)
      } else {
        // Right column: can go to left edge minus 12px, can hide 244px off right edge
        const clamped = Math.max(-(window.innerWidth - HANDLE_VISIBLE), Math.min(COLUMN_WIDTH - HANDLE_VISIBLE, newOffset))
        onOffsetChange(clamped)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, onOffsetChange, side])

  // Calculate transform based on hidden/swapped state. Use -100% / 100%
  // for the standard hide so the translation equals 100% of the column's
  // actual rendered width — robust to sub-pixel rounding, borders,
  // shadows, or any other content that extends the box beyond COLUMN_WIDTH.
  const getTransform = () => {
    if (hidden) {
      if (side === "left") {
        return swapped ? `translateX(${window.innerWidth}px)` : `translateX(-100%)`
      } else {
        return swapped ? `translateX(-${window.innerWidth}px)` : `translateX(100%)`
      }
    }
    return `translateX(${offset}px)`
  }

  const contextValue = React.useMemo<SlidableColumnContextValue>(
    () => ({
      offset,
      isDragging,
      side,
      startDrag,
    }),
    [offset, isDragging, side, startDrag]
  )

  return (
    <SlidableColumnContext.Provider value={contextValue}>
      <div
        className={cx(
          "absolute top-0 overflow-hidden flex flex-col bg-column text-column-foreground border-column-line",
          side === "left" ? "left-0" : "right-0",
          className
        )}
        style={{
          width: `${COLUMN_WIDTH}px`,
          bottom: bottomOffset,
          transform: getTransform(),
          transition: isDragging ? "none" : "transform 200ms ease-out",
          zIndex,
          userSelect: isDragging ? "none" : "auto",
          ...style,
        }}
        onMouseDown={onMouseDown}
        {...props}
      >
        {children}
      </div>
    </SlidableColumnContext.Provider>
  )
}

// Drag handle component - renders on both edges
interface SlidableColumnHandlesProps {
  className?: string
}

function SlidableColumnHandles({ className }: SlidableColumnHandlesProps) {
  const { startDrag, isDragging } = useSlidableColumn()

  return (
    <>
      <div
        className={cx(
          "absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize select-none z-50 hover:bg-column-highlight",
          isDragging && "bg-column-highlight",
          className
        )}
        onMouseDown={startDrag}
      />
      <div
        className={cx(
          "absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize select-none z-50 hover:bg-column-highlight",
          isDragging && "bg-column-highlight",
          className
        )}
        onMouseDown={startDrag}
      />
    </>
  )
}

// Header section
interface SlidableColumnHeaderProps extends React.ComponentProps<"div"> {}

function SlidableColumnHeader({
  className,
  children,
  ...props
}: SlidableColumnHeaderProps) {
  return (
    <div
      className={cx("flex-shrink-0 border-b border-column-line p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Content section (scrollable middle)
interface SlidableColumnContentProps extends React.ComponentProps<"div"> {}

function SlidableColumnContent({
  className,
  children,
  ...props
}: SlidableColumnContentProps) {
  return (
    <div
      className={cx("flex-1 overflow-y-auto p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Footer section
interface SlidableColumnFooterProps extends React.ComponentProps<"div"> {}

function SlidableColumnFooter({
  className,
  children,
  ...props
}: SlidableColumnFooterProps) {
  return (
    <div
      className={cx("flex-shrink-0 border-t border-column-line p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  SlidableColumn,
  SlidableColumnHandles,
  SlidableColumnHeader,
  SlidableColumnContent,
  SlidableColumnFooter,
  useSlidableColumn,
}
export type { SlidableColumnProps }
