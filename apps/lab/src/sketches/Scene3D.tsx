import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Line, OrbitControls } from "@react-three/drei"
import type { Mesh } from "three"
import { loadOrbitPath, loopPhase } from "../lib/orbit"

type Pt = [number, number, number]

// The orbiting body, interpolated along the precomputed trajectory by the
// shared loop phase: smooth, frame-rate independent, seamless at the wrap, and
// in sync with the 2D marker. Advancing uniformly in physics time reproduces
// Kepler's second law -- it speeds up near the central body and slows at the
// far point.
function Planet({ points }: { points: Pt[] }) {
  const ref = useRef<Mesh>(null)
  useFrame(() => {
    if (!ref.current || points.length < 2) return
    const { i, j, f } = loopPhase(points.length, performance.now())
    const a = points[i]
    const b = points[j]
    ref.current.position.set(
      a[0] + (b[0] - a[0]) * f,
      a[1] + (b[1] - a[1]) * f,
      a[2] + (b[2] - a[2]) * f,
    )
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 24, 24]} />
      <meshBasicMaterial color="#7ab8ff" />
    </mesh>
  )
}

// The same orbit as the 2D view, in 3D: the central body at the focus, the
// orbit traced as a line, and the test mass moving along it. Flat (unlit)
// markers so it reads as a schematic; the orbit plane is laid flat and viewed
// from a tilted camera, and drag rotates the view.
export function Scene3D() {
  const [points, setPoints] = useState<Pt[]>([])

  useEffect(() => {
    let alive = true
    loadOrbitPath().then((path) => {
      if (!alive) return
      const pts: Pt[] = []
      // Map the planar (x, y) orbit onto the x-z plane so the tilted camera
      // sees it as a 3D orbital plane rather than a flat front-on ellipse.
      for (let k = 0; k < path.length; k += 2) pts.push([path[k], 0, path[k + 1]])
      setPoints(pts)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 1.7, 2.4], fov: 50 }}
      resize={{ offsetSize: true }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <mesh>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshBasicMaterial color="#ffd27a" />
      </mesh>
      {points.length > 1 && <Line points={points} color="#3a5a8a" lineWidth={1} />}
      {points.length > 0 && <Planet points={points} />}
      <OrbitControls enableDamping target={[0, 0, 0]} />
    </Canvas>
  )
}
