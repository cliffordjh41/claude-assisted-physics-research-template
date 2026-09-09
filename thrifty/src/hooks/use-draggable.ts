
import { useState, useCallback, useRef, useEffect } from "react"

interface UseDraggableOptions {
  x: number
  y: number
  width: number
  height: number
  bounds?: { width: number; height: number }
  gridSnap?: number
  disabled?: boolean
  onDrop?: (x: number, y: number) => void
}

interface UseDraggableReturn {
  isDragging: boolean
  ghostPosition: { x: number; y: number } | null
  dragHandlers: {
    onMouseDown: (e: React.MouseEvent) => void
  }
}

const DRAG_THRESHOLD = 4

export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const [isDragging, setIsDragging] = useState(false)
  const [ghostPosition, setGhostPosition] = useState<{ x: number; y: number } | null>(null)

  const optionsRef = useRef(options)
  optionsRef.current = options

  const dragRef = useRef<{
    active: boolean
    thresholdMet: boolean
    startMouseX: number
    startMouseY: number
    startItemX: number
    startItemY: number
  } | null>(null)

  const listenersRef = useRef<{
    onMouseMove: (e: MouseEvent) => void
    onMouseUp: () => void
  } | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (listenersRef.current) {
        document.removeEventListener("mousemove", listenersRef.current.onMouseMove)
        document.removeEventListener("mouseup", listenersRef.current.onMouseUp)
      }
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (optionsRef.current.disabled || e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()

    dragRef.current = {
      active: true,
      thresholdMet: false,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startItemX: optionsRef.current.x,
      startItemY: optionsRef.current.y,
    }

    const onMouseMove = (ev: MouseEvent) => {
      const drag = dragRef.current
      if (!drag?.active) return

      const dx = ev.clientX - drag.startMouseX
      const dy = ev.clientY - drag.startMouseY

      if (!drag.thresholdMet) {
        if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return
        drag.thresholdMet = true
        setIsDragging(true)
      }

      let newX = drag.startItemX + dx
      let newY = drag.startItemY + dy

      const snap = optionsRef.current.gridSnap
      if (snap && snap > 0) {
        newX = Math.round(newX / snap) * snap
        newY = Math.round(newY / snap) * snap
      }

      const bounds = optionsRef.current.bounds
      if (bounds) {
        const w = optionsRef.current.width
        const h = optionsRef.current.height
        newX = Math.max(0, Math.min(newX, bounds.width - w))
        newY = Math.max(0, Math.min(newY, bounds.height - h))
      }

      setGhostPosition({ x: newX, y: newY })
    }

    const onMouseUp = () => {
      const drag = dragRef.current
      if (drag?.thresholdMet) {
        // Read final ghost position and commit
        setGhostPosition((pos) => {
          if (pos) optionsRef.current.onDrop?.(pos.x, pos.y)
          return null
        })
      }
      setIsDragging(false)
      dragRef.current = null
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      listenersRef.current = null
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    listenersRef.current = { onMouseMove, onMouseUp }
  }, [])

  return { isDragging, ghostPosition, dragHandlers: { onMouseDown: handleMouseDown } }
}
