import type { CSSProperties, ReactNode } from "react"
import { useResizable, type ResizeHandle } from "../../hooks/use-resizable"
import { cx } from "../../lib/utils"

interface ResizableProps {
  width: number
  height: number
  x?: number
  y?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  gridSnap?: number
  disabled?: boolean
  handles?: ResizeHandle[]
  onResize?: (width: number, height: number, x: number, y: number) => void
  className?: string
  children?: ReactNode
}

const DEFAULT_HANDLES: ResizeHandle[] = ["n", "s", "e", "w", "nw", "ne", "sw", "se"]

const HANDLE_STYLES: Record<ResizeHandle, CSSProperties> = {
  n: { position: "absolute", top: -4, left: 0, right: 0, height: 8, cursor: "ns-resize" },
  s: { position: "absolute", bottom: -4, left: 0, right: 0, height: 8, cursor: "ns-resize" },
  e: { position: "absolute", top: 0, bottom: 0, right: -4, width: 8, cursor: "ew-resize" },
  w: { position: "absolute", top: 0, bottom: 0, left: -4, width: 8, cursor: "ew-resize" },
  nw: { position: "absolute", top: -4, left: -4, width: 12, height: 12, cursor: "nwse-resize" },
  ne: { position: "absolute", top: -4, right: -4, width: 12, height: 12, cursor: "nesw-resize" },
  sw: { position: "absolute", bottom: -4, left: -4, width: 12, height: 12, cursor: "nesw-resize" },
  se: { position: "absolute", bottom: -4, right: -4, width: 12, height: 12, cursor: "nwse-resize" },
}

function Resizable({
  width,
  height,
  x = 0,
  y = 0,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  gridSnap,
  disabled,
  handles = DEFAULT_HANDLES,
  onResize,
  className,
  children,
}: ResizableProps) {
  const { resizeHandlers, isResizing, activeHandle } = useResizable({
    width,
    height,
    x,
    y,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    gridSnap,
    disabled,
    onResize,
  })

  return (
    <div
      className={cx("relative", className)}
      style={{ width, height }}
      data-resizing={isResizing || undefined}
      data-active-handle={activeHandle ?? undefined}
    >
      {children}
      {!disabled &&
        handles.map((h) => (
          <div
            key={h}
            data-handle={h}
            style={HANDLE_STYLES[h]}
            {...resizeHandlers(h)}
          />
        ))}
    </div>
  )
}

export { Resizable }
export type { ResizableProps }
