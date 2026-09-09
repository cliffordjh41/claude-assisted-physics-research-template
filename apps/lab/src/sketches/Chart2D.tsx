import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { loadOrbitPath, loopPhase } from "../lib/orbit"

// The integrated orbit in the x-y plane (computed by the gravity crate via
// wasm): the trajectory, the central body at the focus, and a marker animated
// along the path -- synced to the 3D view through the shared loop phase. Equal
// aspect, so the ellipse is undistorted.
export function Chart2D() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    let alive = true
    let raf = 0
    loadOrbitPath().then((path) => {
      if (!alive || !ref.current) return

      const pts: [number, number][] = []
      for (let i = 0; i < path.length; i += 2) pts.push([path[i], path[i + 1]])

      const size = 480
      const pad = 28
      const xExtent = d3.extent(pts, (p) => p[0]) as [number, number]
      const yExtent = d3.extent(pts, (p) => p[1]) as [number, number]
      // One domain shared by both axes keeps the aspect square; include the
      // origin so the central body is in frame.
      const lo = Math.min(xExtent[0], yExtent[0], 0)
      const hi = Math.max(xExtent[1], yExtent[1], 0)
      const sx = d3.scaleLinear().domain([lo, hi]).range([pad, size - pad])
      const sy = d3.scaleLinear().domain([lo, hi]).range([size - pad, pad])

      const svg = d3.select(ref.current)
      svg.selectAll("*").remove()
      svg
        .attr("viewBox", `0 0 ${size} ${size}`)
        .attr("width", "100%")
        .attr("height", "100%")

      const line = d3
        .line<[number, number]>()
        .x((p) => sx(p[0]))
        .y((p) => sy(p[1]))
      svg
        .append("path")
        .datum(pts)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#3a5a8a")
        .attr("stroke-width", 1.5)
      svg
        .append("circle")
        .attr("cx", sx(0))
        .attr("cy", sy(0))
        .attr("r", 6)
        .attr("fill", "#ffd27a")

      const marker = svg.append("circle").attr("r", 4).attr("fill", "#7ab8ff")
      const tick = () => {
        const { i, j, f } = loopPhase(pts.length, performance.now())
        const x = pts[i][0] + (pts[j][0] - pts[i][0]) * f
        const y = pts[i][1] + (pts[j][1] - pts[i][1]) * f
        marker.attr("cx", sx(x)).attr("cy", sy(y))
        raf = requestAnimationFrame(tick)
      }
      tick()
    })
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg ref={ref} className="w-full max-w-md aspect-square" />
    </div>
  )
}
