// Hexagram: two equilateral triangles sharing a center, one apex-up (+) and
// one apex-down (−). The down triangle is the point-inversion of the up one.
// This is the 2D shadow of the two opposed cones — the + / − (Future / Past)
// pair. No subdivision yet.

type Pt = [number, number]
type Tri = [Pt, Pt, Pt]

// Equilateral triangle, circumradius R, centered at (cx, cy).
function equilateral(cx: number, cy: number, R: number, apexUp: boolean): Tri {
  const s = Math.sqrt(3) / 2
  return apexUp
    ? [
        [cx, cy - R],
        [cx + R * s, cy + R / 2],
        [cx - R * s, cy + R / 2],
      ]
    : [
        [cx, cy + R],
        [cx - R * s, cy - R / 2],
        [cx + R * s, cy - R / 2],
      ]
}

const pts = (t: Tri) => t.map((p) => p.join(",")).join(" ")

export function Hexagram() {
  const cx = 160
  const cy = 160
  const R = 130
  const up = equilateral(cx, cy, R, true)
  const down = equilateral(cx, cy, R, false)

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-11 flex items-center gap-3 px-4 border-b border-line text-[11px] uppercase tracking-[0.15em] text-mute-fg">
        <span>hexagram</span>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-8">
        <svg viewBox="0 0 320 320" className="w-full max-w-2xl h-full">
          {/* + (up) */}
          <polygon points={pts(up)} fill="none" stroke="#86c98a" strokeWidth={1} />
          {/* − (down) */}
          <polygon points={pts(down)} fill="none" stroke="#e6932e" strokeWidth={1} />
        </svg>
      </div>
    </div>
  )
}
