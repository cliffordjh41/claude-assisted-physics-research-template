import { useEffect, useRef, useState } from "react"

interface UseMouseParallaxOptions {
  enabled?: boolean
  /** Re-center on pointer leave. Default true. */
  recenterOnLeave?: boolean
}

interface UseMouseParallaxReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  offsets: { x: number; y: number }
}

// Tracks pointer position relative to the container center, returning
// normalized offsets in [-1, 1] for x and y. Throttled to rAF. Consumers
// apply the offset values to any transform.
export function useMouseParallax(
  options?: UseMouseParallaxOptions
): UseMouseParallaxReturn {
  const { enabled = true, recenterOnLeave = true } = options ?? {}
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [offsets, setOffsets] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !enabled) return

    function onMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = (e.clientX - cx) / (rect.width / 2)
      const ny = (e.clientY - cy) / (rect.height / 2)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => setOffsets({ x: nx, y: ny }))
    }

    function onMouseLeave() {
      if (!recenterOnLeave) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => setOffsets({ x: 0, y: 0 }))
    }

    el.addEventListener("mousemove", onMouseMove)
    el.addEventListener("mouseleave", onMouseLeave)
    return () => {
      el.removeEventListener("mousemove", onMouseMove)
      el.removeEventListener("mouseleave", onMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, recenterOnLeave])

  return { containerRef, offsets }
}
