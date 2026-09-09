import { useCallback, useEffect, useRef, useState } from "react"

export type SwipeDirection = "up" | "down" | "left" | "right"

interface UseSwipeDismissOptions {
  direction?: SwipeDirection
  threshold?: number
  velocity?: number
  enabled?: boolean
  onDismiss: () => void
}

interface UseSwipeDismissReturn {
  isDragging: boolean
  offset: number
  swipeHandlers: {
    onPointerDown: (e: React.PointerEvent) => void
  }
}

// Pointer-event swipe-to-dismiss. Drives a translation offset during drag,
// snaps back on release if threshold + velocity weren't met, calls onDismiss
// when they were. Direction-aware (down for bottom sheets, right for a side
// drawer, etc.).
export function useSwipeDismiss(
  options: UseSwipeDismissOptions
): UseSwipeDismissReturn {
  const {
    direction = "down",
    threshold = 80,
    velocity = 0.5,
    enabled = true,
    onDismiss,
  } = options

  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null)
  const lastRef = useRef<{ x: number; y: number; t: number } | null>(null)

  const axis: "x" | "y" = direction === "left" || direction === "right" ? "x" : "y"
  const sign = direction === "right" || direction === "down" ? 1 : -1

  const reset = useCallback(() => {
    setIsDragging(false)
    setOffset(0)
    startRef.current = null
    lastRef.current = null
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      const now = performance.now()
      startRef.current = { x: e.clientX, y: e.clientY, t: now }
      lastRef.current = { x: e.clientX, y: e.clientY, t: now }
      setIsDragging(true)

      const onMove = (ev: PointerEvent) => {
        if (!startRef.current) return
        const dx = ev.clientX - startRef.current.x
        const dy = ev.clientY - startRef.current.y
        const delta = (axis === "x" ? dx : dy) * sign
        // Only translate in the dismissal direction; clamp the
        // opposite axis at 0 with a soft rubber-band feel.
        const clamped = delta < 0 ? delta * 0.25 : delta
        setOffset(clamped)
        lastRef.current = { x: ev.clientX, y: ev.clientY, t: performance.now() }
      }

      const onUp = (ev: PointerEvent) => {
        const start = startRef.current
        const last = lastRef.current
        document.removeEventListener("pointermove", onMove)
        document.removeEventListener("pointerup", onUp)
        document.removeEventListener("pointercancel", onUp)
        ;(e.target as Element).releasePointerCapture?.(ev.pointerId)
        if (!start || !last) {
          reset()
          return
        }
        const dx = last.x - start.x
        const dy = last.y - start.y
        const totalDelta = (axis === "x" ? dx : dy) * sign
        const dt = Math.max(1, last.t - start.t)
        const v = totalDelta / dt
        if (totalDelta > threshold || v > velocity) {
          onDismiss()
        }
        reset()
      }

      document.addEventListener("pointermove", onMove)
      document.addEventListener("pointerup", onUp)
      document.addEventListener("pointercancel", onUp)
    },
    [enabled, axis, sign, threshold, velocity, onDismiss, reset]
  )

  useEffect(() => {
    if (!enabled) reset()
  }, [enabled, reset])

  return {
    isDragging,
    offset,
    swipeHandlers: { onPointerDown },
  }
}
