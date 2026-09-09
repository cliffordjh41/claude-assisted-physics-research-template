import { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { Line, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

// Conical spiral of Pappus (Ferréol / mathcurve), continuous dual form.
// Cartesian parameterization, cone axis = Oz:
//   x = a·sinα·t·cos t,  y = a·sinα·t·sin t,  z = a·cosα·t
// A point climbing a cone's generator (half-angle α) while it rotates.
//
// Mapped into three.js with the cone axis as +y, apex at the origin. The
// lower cone is the point-inversion of the upper through the apex (negate
// x, y, z = vertical mirror + 180° rotation about the axis). That inversion
// aligns the tangents at the apex, so the two cones read as ONE continuous
// spiral threading through the apex rather than two strands meeting in a cusp.
function pappusUpper(): THREE.Vector3[] {
  const a = 0.05 // scale
  const alpha = Math.PI / 6 // cone half-angle from the axis
  const turns = 14
  const steps = 2600

  const tMax = turns * 2 * Math.PI
  const sinA = Math.sin(alpha)
  const cosA = Math.cos(alpha)

  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax
    const rho = a * sinA * t // horizontal radius — Archimedean in projection
    pts.push(new THREE.Vector3(rho * Math.cos(t), a * cosA * t, rho * Math.sin(t)))
  }
  return pts
}

export function PappusSpiral() {
  const points = useMemo(() => {
    const upper = pappusUpper()
    // Lower cone: point-inversion through the apex, reversed so the polyline
    // runs bottom → apex → top as one continuous curve. Drop lower's last
    // point (the apex copy) so the shared apex appears exactly once — no
    // duplicate vertex. Verified: exact antipodal symmetry, C¹ at the apex.
    const lower = upper.map((p) => p.clone().negate()).reverse()
    return [...lower.slice(0, -1), ...upper]
  }, [])

  return (
    <Canvas camera={{ position: [7, 0, 12], fov: 50 }}>
      <color attach="background" args={["#0a0a0a"]} />
      <Line points={points} color="#7ab8ff" lineWidth={1.5} />
      <OrbitControls enableDamping />
    </Canvas>
  )
}
