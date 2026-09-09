import { useMemo, useState } from "react"

// Greater hexagon: grow the unit hexagon outward by tiling it with unit
// triangles. A side-n hexagon = 6 wedges, each subdivided into n² unit
// triangles = 6n² tiles. The original (side-1) hexagon stays nested at the
// core, colored; the outer tiles are neutral for now (their values come from
// the lattice's recursive rule, not yet defined).
//
//   side 1 -> 6     side 2 -> 24 (×4)     side 3 -> 54 (×9)
//
// Same fractal as subdivision, grown outward: tiles = (linear scale)².

type Pt = [number, number]

const CX = 160
const CY = 160
const UNIT = 34 // unit edge / center-to-corner of the side-1 hexagon

const COLOR: Record<number, string> = {
  1: "#ff5d5d",
  2: "#5ccb78",
  3: "#5d82ff",
  [-1]: "#42cccc",
  [-2]: "#cc63cc",
  [-3]: "#ccb441",
}

const CORNERS: { deg: number; v: number }[] = [
  { deg: 0, v: 1 },
  { deg: 60, v: -3 },
  { deg: 120, v: 2 },
  { deg: 180, v: -1 },
  { deg: 240, v: 3 },
  { deg: 300, v: -2 },
]

function corner(deg: number, radius: number): Pt {
  const t = (deg * Math.PI) / 180
  return [CX + radius * Math.sin(t), CY - radius * Math.cos(t)]
}

// Subdivide triangle A,B,C into n² unit triangles. `inner` flags the single
// sub-triangle touching A (the center) — that's the side-1 core cell.
function subdivideTriangle(A: Pt, B: Pt, C: Pt, n: number): { pts: Pt[]; inner: boolean }[] {
  const P = (i: number, j: number): Pt => [
    A[0] + (i / n) * (B[0] - A[0]) + (j / n) * (C[0] - A[0]),
    A[1] + (i / n) * (B[1] - A[1]) + (j / n) * (C[1] - A[1]),
  ]
  const tris: { pts: Pt[]; inner: boolean }[] = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= n - 1 - i; j++) {
      tris.push({ pts: [P(i, j), P(i + 1, j), P(i, j + 1)], inner: i === 0 && j === 0 })
      if (i + j <= n - 2) tris.push({ pts: [P(i + 1, j), P(i, j + 1), P(i + 1, j + 1)], inner: false })
    }
  }
  return tris
}

export function GreaterHexagon() {
  const [n, setN] = useState(2)

  const wedges = useMemo(() => {
    const center: Pt = [CX, CY]
    return CORNERS.map((c, k) => {
      const a = corner(c.deg, n * UNIT)
      const b = corner(CORNERS[(k + 1) % 6].deg, n * UNIT)
      return { v: c.v, tris: subdivideTriangle(center, a, b, n) }
    })
  }, [n])

  const total = 6 * n * n

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-11 flex items-center gap-3 px-4 border-b border-line text-[11px] uppercase tracking-[0.15em] text-mute-fg">
        <span>greater hexagon</span>
        <button
          type="button"
          onClick={() => setN((d) => Math.max(1, d - 1))}
          className="px-2 leading-none py-1 rounded bg-mute hover:bg-mute/70 text-foreground"
        >
          −
        </button>
        <span className="text-foreground">side {n}</span>
        <button
          type="button"
          onClick={() => setN((d) => Math.min(4, d + 1))}
          className="px-2 leading-none py-1 rounded bg-mute hover:bg-mute/70 text-foreground"
        >
          +
        </button>
        <span>
          6·{n}² = {total} tiles
        </span>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-8">
        <svg viewBox="0 0 320 320" className="w-full max-w-2xl h-full">
          {wedges.map((w, k) =>
            w.tris.map((t, i) => (
              <polygon
                key={`${k}-${i}`}
                points={t.pts.map((p) => p.join(",")).join(" ")}
                fill={t.inner ? COLOR[w.v] + "55" : "none"}
                stroke={t.inner ? COLOR[w.v] : "#333"}
                strokeWidth={t.inner ? 1 : 0.4}
              />
            )),
          )}
          <circle cx={CX} cy={CY} r={2} fill="#888" />
        </svg>
      </div>
    </div>
  )
}
