import { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { Billboard, Line, OrbitControls, Text } from "@react-three/drei"
import * as THREE from "three"

// 3D version of the hexagon, shown together with its flat 2D self so the
// 2D -> 3D mapping is visible.
//
// The flat hexagon lies in the ground plane (y = 0). The three + corners
// (0:+1 red, 120:+2 green, 240:+3 blue) lift straight up; the three − corners
// (60:−3 yellow, 180:−1 cyan, 300:−2 magenta) drop down. Each set + the shared
// center forms a regular tetrahedron (RGB up, CMY down — the bicone in volume).
//
// Regular-tetra lift height: H = R·√2, with R = center-to-corner. Then every
// tetra edge is R·√3.

const R = 2
const H = R * Math.SQRT2

// Degree (clockwise from top) -> flat ground position (plane = XZ, up = Y).
function flat(deg: number): THREE.Vector3 {
  const t = (deg * Math.PI) / 180
  // −sin on X mirrors the layout to match the 2D sketch's handedness, so RGB
  // (and CMY) read clockwise from above.
  return new THREE.Vector3(-R * Math.sin(t), 0, R * Math.cos(t))
}

// Ground hexagon: scaled by √3 (so a tile equals a tetra face in size) and
// rotated +30° (so each tile's color sits under the matching-color face).
const GROUND_R = R * Math.sqrt(3)
const GROUND_ROT = 30
function ground(deg: number): THREE.Vector3 {
  const t = ((deg + GROUND_ROT) * Math.PI) / 180
  return new THREE.Vector3(-GROUND_R * Math.sin(t), 0, GROUND_R * Math.cos(t))
}

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

function Dot({ p, color, r = 0.09 }: { p: THREE.Vector3; color: string; r?: number }) {
  return (
    <mesh position={p}>
      <sphereGeometry args={[r, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// A flat-shaded triangle face from three points.
function Tri({ a, b, c, color, opacity = 0.3 }: { a: THREE.Vector3; b: THREE.Vector3; c: THREE.Vector3; color: string; opacity?: number }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]), 3),
    )
    g.computeVertexNormals()
    return g
  }, [a, b, c])
  return (
    <mesh geometry={geom}>
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  )
}

export function Hexagon3D() {
  const center = new THREE.Vector3(0, 0, 0)
  const flats = CORNERS.map((c) => flat(c.deg))
  const grounds = CORNERS.map((c) => ground(c.deg))
  const lifted = CORNERS.map((c, i) => {
    const p = flats[i].clone()
    p.y = c.v > 0 ? H : -H
    return p
  })

  const plus = CORNERS.filter((c) => c.v > 0)
  const minus = CORNERS.filter((c) => c.v < 0)
  const liftPos = (c: { deg: number; v: number }) => {
    const p = flat(c.deg)
    p.y = c.v > 0 ? H : -H
    return p
  }
  const plusLift = plus.map(liftPos)
  const minusLift = minus.map(liftPos)

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-11 flex items-center px-4 border-b border-line text-[11px] uppercase tracking-[0.15em] text-mute-fg">
        hexagon 3D — ground tiles √3-scaled +30°, matched to the 6 side faces
      </div>
      <div className="flex-1 min-h-0">
        <Canvas camera={{ position: [5, 4, 6], fov: 50 }}>
          <color attach="background" args={["#0a0a0a"]} />

          {/* ground tiles (√3-scaled, +30°): same size + color as the 6 side faces */}
          {CORNERS.map((c, i) => (
            <Tri key={`tile${i}`} a={center} b={grounds[i]} c={grounds[(i + 1) % 6]} color={COLOR[c.v]} />
          ))}

          {/* ground hexagon outline */}
          <Line points={[...grounds, grounds[0]]} color="#3a3a3a" lineWidth={1} />

          {/* flip-axes (diameters) in the ground plane */}
          {[0, 1, 2].map((k) => (
            <Line
              key={`ax${k}`}
              points={[ground(k * 60), ground(k * 60 + 180)]}
              color="#ffffff"
              transparent
              opacity={0.2}
              lineWidth={1}
            />
          ))}

          {/* connectors: each corner's ground position -> its tetra vertex */}
          {CORNERS.map((c, i) => (
            <Line key={`conn${i}`} points={[grounds[i], lifted[i]]} color={COLOR[c.v]} transparent opacity={0.5} lineWidth={1} />
          ))}

          {/* up tetra: center -> each + vertex, plus the top triangle */}
          {plusLift.map((p, i) => (
            <Line key={`up${i}`} points={[center, p]} color="#cccccc" transparent opacity={0.5} lineWidth={1} />
          ))}
          <Line points={[...plusLift, plusLift[0]]} color="#cccccc" lineWidth={1.5} />

          {/* down tetra: center -> each − vertex, plus the bottom triangle */}
          {minusLift.map((p, i) => (
            <Line key={`dn${i}`} points={[center, p]} color="#888888" transparent opacity={0.5} lineWidth={1} />
          ))}
          <Line points={[...minusLift, minusLift[0]]} color="#888888" lineWidth={1.5} />

          {/* tetra side faces — top (RGB) and bottom (CMY) faces left open */}
          {plus.map((c, i) => (
            <Tri key={`upf${i}`} a={center} b={plusLift[i]} c={plusLift[(i + 1) % 3]} color={COLOR[c.v]} opacity={0.4} />
          ))}
          {minus.map((c, i) => (
            <Tri key={`dnf${i}`} a={center} b={minusLift[i]} c={minusLift[(i + 1) % 3]} color={COLOR[c.v]} opacity={0.4} />
          ))}

          {/* dots: flat ring (dim) + lifted vertices (bright) + shared center */}
          {CORNERS.map((c, i) => (
            <Dot key={`flat${i}`} p={grounds[i]} color={COLOR[c.v]} r={0.05} />
          ))}
          {CORNERS.map((c, i) => (
            <Dot key={`v${i}`} p={lifted[i]} color={COLOR[c.v]} />
          ))}
          {/* signed value labels at the tetra vertices */}
          {CORNERS.map((c, i) => {
            const dir = lifted[i].clone().normalize()
            const p = lifted[i].clone().addScaledVector(dir, 0.4)
            return (
              <Billboard key={`lab${i}`} position={[p.x, p.y, p.z]}>
                <Text fontSize={0.32} color={COLOR[c.v]} anchorX="center" anchorY="middle">
                  {c.v > 0 ? `+${c.v}` : `${c.v}`}
                </Text>
              </Billboard>
            )
          })}
          {/* signed value labels on the ground corners (the 2D values) */}
          {CORNERS.map((c, i) => {
            const dir = grounds[i].clone().normalize()
            const p = grounds[i].clone().addScaledVector(dir, 0.45)
            return (
              <Billboard key={`glab${i}`} position={[p.x, p.y, p.z]}>
                <Text fontSize={0.28} color={COLOR[c.v]} anchorX="center" anchorY="middle">
                  {c.v > 0 ? `+${c.v}` : `${c.v}`}
                </Text>
              </Billboard>
            )
          })}
          <Dot p={center} color="#aaaaaa" r={0.07} />

          <OrbitControls enableDamping />
        </Canvas>
      </div>
    </div>
  )
}
