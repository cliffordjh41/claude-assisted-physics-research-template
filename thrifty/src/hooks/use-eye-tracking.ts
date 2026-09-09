import { useEffect, useState, type RefObject } from "react"

/**
 * Cursor-tracking offsets for a pair of "eye centers" inside an SVG.
 * Returns a normalized (x, y) offset per eye, capped at `maxTravel`,
 * for any animated SVG character whose eyes should follow the pointer.
 *
 *     const { left, right } = useEyeTracking(svgRef, {w:70,h:60},
 *       { left:{x:19,y:27}, right:{x:51,y:27} }, 2.5, enabled)
 */
export function useEyeTracking(
  svgRef: RefObject<SVGSVGElement | null>,
  viewBox: { w: number; h: number },
  centers: { left: { x: number; y: number }; right: { x: number; y: number } },
  maxTravel: number,
  enabled: boolean
) {
  const [left, setLeft] = useState({ x: 0, y: 0 })
  const [right, setRight] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return

    function onMove(e: MouseEvent) {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const sx = rect.width / viewBox.w
      const sy = rect.height / viewBox.h

      function offset(cx: number, cy: number) {
        const scx = rect.left + cx * sx
        const scy = rect.top + cy * sy
        const dx = e.clientX - scx
        const dy = e.clientY - scy
        const dist = Math.hypot(dx, dy)
        if (dist === 0) return { x: 0, y: 0 }
        const t = Math.min(dist / 80, 1) * maxTravel
        return { x: (dx / dist) * t, y: (dy / dist) * t }
      }

      setLeft(offset(centers.left.x, centers.left.y))
      setRight(offset(centers.right.x, centers.right.y))
    }

    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return { left, right }
}
