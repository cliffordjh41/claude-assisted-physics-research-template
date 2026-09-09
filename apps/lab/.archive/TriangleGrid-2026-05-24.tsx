import { useMemo, useState } from "react"

// 2D substrate for the lattice: ternary subdivision of a triangle.
//
// One triangle -> 3 children: connect the three edge midpoints, keep the three
// corner triangles, DROP the inverted center. Repeat per level.
//   count(n) = 3^n
//
// Powers of three, matching the project's base-3 structure:
//   level 1 = 3     (the 3-fold base — intrinsic, no separate step)
//   level 2 = 9
//   level 3 = 27    (the trit-word)
//   level 4 = 81 ...
//
// Dropping the center leaves a hole at every scale — the Sierpinski gasket.
// (If we ever want a fully-tiled grid instead, keep the 4th child -> 4^n.)

type Pt = [number, number]
type Tri = [Pt, Pt, Pt]

const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

// One triangle -> its 3 corner children. Center is dropped (the hole).
function subdivide([a, b, c]: Tri): Tri[] {
  const ab = mid(a, b)
  const bc = mid(b, c)
  const ca = mid(c, a)
  return [
    [a, ab, ca],
    [ab, b, bc],
    [ca, bc, c],
  ]
}

function subdivideTo(base: Tri, depth: number): Tri[] {
  let tris: Tri[] = [base]
  for (let i = 0; i < depth; i++) tris = tris.flatMap(subdivide)
  return tris
}

// Apex-up equilateral triangle, circumradius R, centered at (cx, cy).
function equilateral(cx: number, cy: number, R: number): Tri {
  const s = Math.sqrt(3) / 2
  return [
    [cx, cy - R],
    [cx + R * s, cy + R / 2],
    [cx - R * s, cy + R / 2],
  ]
}

export function TriangleGrid() {
  const [depth, setDepth] = useState(2) // 3^2 = 9 to start
  const tris = useMemo(() => subdivideTo(equilateral(160, 175, 150), depth), [depth])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-11 flex items-center gap-3 px-4 border-b border-line text-[11px] uppercase tracking-[0.15em] text-mute-fg">
        <span>triangle grid</span>
        <button
          type="button"
          onClick={() => setDepth((d) => Math.max(0, d - 1))}
          className="px-2 leading-none py-1 rounded bg-mute hover:bg-mute/70 text-foreground"
        >
          −
        </button>
        <span className="text-foreground">depth {depth}</span>
        <button
          type="button"
          onClick={() => setDepth((d) => Math.min(8, d + 1))}
          className="px-2 leading-none py-1 rounded bg-mute hover:bg-mute/70 text-foreground"
        >
          +
        </button>
        <span>
          3^{depth} = {tris.length} tiles
        </span>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-8">
        <svg viewBox="0 0 320 320" className="w-full max-w-2xl h-full">
          {tris.map((t, i) => (
            <polygon
              key={i}
              points={t.map((p) => p.join(",")).join(" ")}
              fill="#7ab8ff22"
              stroke="#7ab8ff"
              strokeWidth={0.4}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
