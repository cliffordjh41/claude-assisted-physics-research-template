
import { useState, useCallback, useRef, useEffect } from "react"

export type ResizeHandle = "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se"

interface UseResizableOptions {
  width: number
  height: number
  x: number
  y: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  gridSnap?: number
  disabled?: boolean
  onResize?: (width: number, height: number, x: number, y: number) => void
}

interface UseResizableReturn {
  isResizing: boolean
  activeHandle: ResizeHandle | null
  resizeHandlers: (handle: ResizeHandle) => {
    onMouseDown: (e: React.MouseEvent) => void
  }
}

export function useResizable(options: UseResizableOptions): UseResizableReturn {
  const [isResizing, setIsResizing] = useState(false)
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null)

  const optionsRef = useRef(options)
  optionsRef.current = options

  const listenersRef = useRef<{
    onMouseMove: (e: MouseEvent) => void
    onMouseUp: () => void
  } | null>(null)

  useEffect(() => {
    return () => {
      if (listenersRef.current) {
        document.removeEventListener("mousemove", listenersRef.current.onMouseMove)
        document.removeEventListener("mouseup", listenersRef.current.onMouseUp)
      }
    }
  }, [])

  const getHandlerForHandle = useCallback((handle: ResizeHandle) => {
    return {
      onMouseDown: (e: React.MouseEvent) => {
        if (optionsRef.current.disabled || e.button !== 0) return
        e.stopPropagation()
        e.preventDefault()

        const startMouseX = e.clientX
        const startMouseY = e.clientY
        const startW = optionsRef.current.width
        const startH = optionsRef.current.height
        const startX = optionsRef.current.x
        const startY = optionsRef.current.y
        const minW = optionsRef.current.minWidth ?? 40
        const minH = optionsRef.current.minHeight ?? 24
        const maxW = optionsRef.current.maxWidth ?? 9999
        const maxH = optionsRef.current.maxHeight ?? 9999
        const snap = optionsRef.current.gridSnap ?? 0

        setIsResizing(true)
        setActiveHandle(handle)

        const applySnap = (v: number) => snap > 0 ? Math.round(v / snap) * snap : v

        const hasN = handle.includes("n")
        const hasS = handle.includes("s")
        const hasE = handle.includes("e")
        const hasW = handle.includes("w")

        const onMouseMove = (ev: MouseEvent) => {
          const dx = ev.clientX - startMouseX
          const dy = ev.clientY - startMouseY

          let newW = startW
          let newH = startH
          let newX = startX
          let newY = startY

          if (hasE) {
            newW = applySnap(Math.max(minW, Math.min(maxW, startW + dx)))
          }
          if (hasW) {
            const delta = applySnap(dx)
            const proposedW = startW - delta
            if (proposedW >= minW && proposedW <= maxW) {
              newW = proposedW
              newX = startX + delta
            }
          }
          if (hasS) {
            newH = applySnap(Math.max(minH, Math.min(maxH, startH + dy)))
          }
          if (hasN) {
            const delta = applySnap(dy)
            const proposedH = startH - delta
            if (proposedH >= minH && proposedH <= maxH) {
              newH = proposedH
              newY = startY + delta
            }
          }

          // Clamp position to non-negative
          if (newX < 0) { newW += newX; newX = 0 }
          if (newY < 0) { newH += newY; newY = 0 }

          optionsRef.current.onResize?.(newW, newH, newX, newY)
        }

        const onMouseUp = () => {
          setIsResizing(false)
          setActiveHandle(null)
          document.removeEventListener("mousemove", onMouseMove)
          document.removeEventListener("mouseup", onMouseUp)
          listenersRef.current = null
        }

        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
        listenersRef.current = { onMouseMove, onMouseUp }
      },
    }
  }, [])

  return { isResizing, activeHandle, resizeHandlers: getHandlerForHandle }
}

// Handle position styles
export function getHandleStyle(handle: ResizeHandle): React.CSSProperties {
  const base: React.CSSProperties = { position: "absolute" }
  const OFFSET = -4

  switch (handle) {
    case "nw": return { ...base, top: OFFSET, left: OFFSET, cursor: "nwse-resize" }
    case "ne": return { ...base, top: OFFSET, right: OFFSET, cursor: "nesw-resize" }
    case "sw": return { ...base, bottom: OFFSET, left: OFFSET, cursor: "nesw-resize" }
    case "se": return { ...base, bottom: OFFSET, right: OFFSET, cursor: "nwse-resize" }
    case "n": return { ...base, top: OFFSET, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" }
    case "s": return { ...base, bottom: OFFSET, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" }
    case "e": return { ...base, right: OFFSET, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" }
    case "w": return { ...base, left: OFFSET, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" }
  }
}
