// Hexagon with signed values on its CORNERS (not faces).
//
// Six corners at 60° steps, 0° at top, clockwise. Each corner labels its
// degree, signed value, and color name. Opposite corners are a flip-pair
// (+k / −k), so the three diameters are the three sign-axes:
//   0°/180°  = ±1   (0:+1 Red / 180:−1 Cyan)
//   60°/240° = ±3   (60:−3 Yellow / 240:+3 Blue)
//   120°/300°= ±2   (120:+2 Green / 300:−2 Magenta)

type Pt = [number, number]

const CX = 160
const CY = 160
const R = 104

function corner(deg: number): Pt {
  const t = (deg * Math.PI) / 180
  return [CX + R * Math.sin(t), CY - R * Math.cos(t)]
}

const COLOR: Record<number, string> = {
  1: "#ff5d5d",
  2: "#5ccb78",
  3: "#5d82ff",
  [-1]: "#42cccc",
  [-2]: "#cc63cc",
  [-3]: "#ccb441",
}

const NAME: Record<number, string> = {
  1: "Red",
  2: "Green",
  3: "Blue",
  [-1]: "Cyan",
  [-2]: "Magenta",
  [-3]: "Yellow",
}

// Corner assignment: degree -> signed value.
const CORNERS: { deg: number; v: number }[] = [
  { deg: 0, v: 1 },
  { deg: 60, v: -3 },
  { deg: 120, v: 2 },
  { deg: 180, v: -1 },
  { deg: 240, v: 3 },
  { deg: 300, v: -2 },
]

export function Hexagon() {
  const verts = CORNERS.map((c) => corner(c.deg))

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-11 flex items-center gap-3 px-4 border-b border-line text-[11px] uppercase tracking-[0.15em] text-mute-fg">
        <span>hexagon — corner = degree, value, color</span>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-8">
        <svg viewBox="0 0 320 320" className="w-full max-w-2xl h-full">
          {/* colored wedges — each takes the color of its leading (cw) corner */}
          {CORNERS.map((c, i) => {
            const [ax, ay] = corner(c.deg)
            const [bx, by] = corner(CORNERS[(i + 1) % 6].deg)
            return (
              <polygon
                key={`w${c.deg}`}
                points={`${CX},${CY} ${ax},${ay} ${bx},${by}`}
                fill={COLOR[c.v] + "33"}
                stroke="none"
              />
            )
          })}
          {/* hexagon outline */}
          <polygon
            points={verts.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="#3a3a3a"
            strokeWidth={1}
          />
          {/* three flip-axes (diameters): 0/180, 60/240, 120/300 */}
          {[0, 60, 120].map((deg) => {
            const [x1, y1] = corner(deg)
            const [x2, y2] = corner(deg + 180)
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff44" strokeWidth={0.75} />
          })}
          {/* corner label: "deg, value, ColorName" — just text, colored by value */}
          {CORNERS.map((c) => {
            const t = (c.deg * Math.PI) / 180
            const rl = R + 18
            return (
              <text
                key={c.deg}
                x={CX + rl * Math.sin(t)}
                y={CY - rl * Math.cos(t)}
                fill={COLOR[c.v]}
                fontSize={9}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {c.deg}, {c.v}, {NAME[c.v]}
              </text>
            )
          })}
          <circle cx={CX} cy={CY} r={2.5} fill="#aaa" />
        </svg>
      </div>
    </div>
  )
}
