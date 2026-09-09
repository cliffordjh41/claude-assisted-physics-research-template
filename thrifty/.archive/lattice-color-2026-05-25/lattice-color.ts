/**
 * Lattice Color System
 *
 * TypeScript port of:
 *   ephemeratory/prototypes/lattice-lab/crates/color-hsv/
 *
 * Four encoding modes — each maps a lattice position (index, iteration) to
 * an oklch color string consumable by any CSS context.
 *
 * Modes:
 *   positional — hue by angular position, L/C by iteration (IterationModulator)
 *   ternary    — 3-fold sectors R/G/B at 0°/120°/240°, recursive subdivision (TernaryColorWheel)
 *   sixfold    — 6 projection arms R/Y/G/C/B/M at 60° intervals, complementary pairs
 *   photonic   — EM spectrum wavelengths mapped to perceptual oklch hue
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type ColorMode = 'positional' | 'ternary' | 'sixfold' | 'photonic'
export type Direction = 'future' | 'past'

export interface LatticePosition {
  index: number
  iteration: number
  direction?: Direction
}

// ── Core lattice math ─────────────────────────────────────────────────────────

/** count(n) = 3 × 4^n positions at iteration n */
export function positionCount(iteration: number): number {
  return 3 * Math.pow(4, iteration)
}

/** Angular step between positions at iteration n (degrees) */
export function angleStep(iteration: number): number {
  return 360 / positionCount(iteration)
}

/** Angular position of index at iteration (degrees, 0° = top) */
export function positionAngle(index: number, iteration: number): number {
  return (index / positionCount(iteration)) * 360
}

// ── Positional (IterationModulator) ──────────────────────────────────────────
// Port of: crates/color-hsv/src/iteration.rs
//
// Hue = angular position. L/C modulate per iteration to guarantee
// zero cross-iteration collisions even when positions share the same hue.

function positionalLightness(iteration: number, active: boolean, hovered: boolean): number {
  if (active)  return 0.80
  if (hovered) return 0.72
  // Modulate down slightly per iteration cycle (clamped)
  const phase = iteration % 10
  return Math.max(0.50, 0.65 - phase * 0.025)
}

function positionalChroma(iteration: number, active: boolean): number {
  if (active) return 0.22
  const phase = iteration % 10
  return Math.max(0.10, 0.20 - phase * 0.008)
}

// ── Ternary (TernaryColorWheel) ───────────────────────────────────────────────
// Port of: crates/color-hsv/src/ternary.rs
//
// Encode position in base-3. First digit selects primary sector (0°/120°/240°).
// Subsequent digits subdivide within sector by /3.
// Mirrors Koch triangle 3-fold symmetry.

function encodeTernary(value: number, digits: number): number[] {
  const result: number[] = []
  let v = Math.max(0, Math.min(0.9999, value))
  for (let i = 0; i < digits; i++) {
    v *= 3
    result.push(Math.floor(v))
    v -= Math.floor(v)
  }
  return result
}

function ternaryHue(index: number, iteration: number): number {
  const count = positionCount(iteration)
  const value = index / count
  const encoded = encodeTernary(value, iteration + 1)
  const primarySector = encoded.length > 0 ? encoded[0] * 120 : 0
  let hue = primarySector
  let sectorSize = 120
  for (let i = 1; i < encoded.length; i++) {
    sectorSize /= 3
    hue += encoded[i] * sectorSize
  }
  return hue
}

// ── Sixfold (ProjectionArm) ───────────────────────────────────────────────────
// Port of: crates/color-hsv/src/sixfold.rs
//
// 6 projection arms at 60° intervals: R(0°) Y(60°) G(120°) C(180°) B(240°) M(300°)
// RGB = primaries (Plus trit). CMY = secondaries (Minus trit).
// Each arm has a zero-sum complement: R↔C, G↔M, B↔Y.

export const SIXFOLD_ARMS = [
  { name: 'R', hue: 0,   wavelength: 650, isPrimary: true  },
  { name: 'Y', hue: 60,  wavelength: 580, isPrimary: false },
  { name: 'G', hue: 120, wavelength: 530, isPrimary: true  },
  { name: 'C', hue: 180, wavelength: 490, isPrimary: false },
  { name: 'B', hue: 240, wavelength: 470, isPrimary: true  },
  { name: 'M', hue: 300, wavelength: 560, isPrimary: false },
] as const

export function positionToArmIndex(index: number, iteration: number): number {
  const count = positionCount(iteration)
  const fraction = index / count
  const angle = fraction * 360
  return Math.round(angle / 60) % 6
}

export function armComplement(armIndex: number): number {
  return (armIndex + 3) % 6
}

/** Color address string for a path: "R-G-B-Y-M" */
export function pathToColorAddress(positions: LatticePosition[]): string {
  return positions
    .map(p => SIXFOLD_ARMS[positionToArmIndex(p.index, p.iteration)].name)
    .join('-')
}

// ── Photonic (WavelengthMapper) ───────────────────────────────────────────────
// Port of: crates/color-hsv/src/photonic.rs
//
// Maps lattice position to visible EM spectrum wavelength, then to oklch hue.
// Violet (380nm) → Red (700nm). Edges attenuate naturally.
// Uses CIE approximation for perceptual accuracy.

const WL_MIN = 380  // nm — violet
const WL_MAX = 700  // nm — red

function positionToWavelength(index: number, iteration: number): number {
  const count = positionCount(iteration)
  const fraction = index / count
  // index=0 → red (long λ), ascending index → violet (short λ)
  return WL_MAX - fraction * (WL_MAX - WL_MIN)
}

/**
 * Wavelength (nm) → oklch hue (degrees).
 * Approximate mapping anchored to perceptual color positions.
 * Red ~29°, Yellow ~85°, Green ~145°, Cyan ~195°, Blue ~264°, Violet ~308°
 */
function wavelengthToHue(wavelength: number): number {
  const wl = Math.max(WL_MIN, Math.min(WL_MAX, wavelength))
  // Linear map: 700nm→29°, 380nm→308° (violet wraps near red = correct perception)
  const t = (WL_MAX - wl) / (WL_MAX - WL_MIN)
  return (29 + t * 279) % 360
}

/** Edge intensity falloff for wavelengths near spectrum bounds */
function wavelengthIntensity(wavelength: number): number {
  if (wavelength < 420) return 0.3 + 0.7 * (wavelength - 380) / 40
  if (wavelength > 680) return 0.3 + 0.7 * (700 - wavelength) / 20
  return 1.0
}

// ── Main API ──────────────────────────────────────────────────────────────────

/**
 * Map a lattice position to an oklch color string.
 *
 * Output is directly usable as a CSS color value or in inline styles.
 *
 * @param index     Position index within the ring (0 to count-1)
 * @param iteration Lattice iteration depth (0=3pts, 1=12pts, 2=48pts...)
 * @param mode      Color encoding mode
 * @param direction 'future' = standard hue, 'past' = +180° shift (positional only)
 * @param active    Selected state — boosts lightness + chroma
 * @param hovered   Hover state — moderate lightness boost
 */
export function positionToOklch(
  index: number,
  iteration: number,
  mode: ColorMode = 'positional',
  direction: Direction = 'future',
  active = false,
  hovered = false,
): string {
  let hue: number
  let lightness: number
  let chroma: number

  switch (mode) {
    case 'positional': {
      hue = positionAngle(index, iteration)
      if (direction === 'past') hue = (hue + 180) % 360
      lightness = positionalLightness(iteration, active, hovered)
      chroma    = positionalChroma(iteration, active)
      break
    }
    case 'ternary': {
      hue       = ternaryHue(index, iteration)
      lightness = active ? 0.80 : hovered ? 0.72 : 0.65
      chroma    = active ? 0.24 : 0.20
      break
    }
    case 'sixfold': {
      const arm = SIXFOLD_ARMS[positionToArmIndex(index, iteration)]
      hue       = arm.hue
      lightness = active ? 0.82 : hovered ? 0.74 : 0.68
      chroma    = active ? 0.26 : arm.isPrimary ? 0.22 : 0.18
      break
    }
    case 'photonic': {
      const wavelength = positionToWavelength(index, iteration)
      const intensity  = wavelengthIntensity(wavelength)
      hue       = wavelengthToHue(wavelength)
      lightness = (active ? 0.78 : hovered ? 0.70 : 0.62) * intensity + 0.20 * (1 - intensity)
      chroma    = 0.22 * intensity
      break
    }
  }

  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`
}

// ── Ring geometry ─────────────────────────────────────────────────────────────

export interface RingPoint {
  index: number
  x: number
  y: number
  angleDeg: number  // 0-360° clockwise from top
}

/**
 * Generate ring vertex positions at a given iteration.
 * Matches LatticePanel's generateRing() — compatible coordinate space.
 */
export function generateRingPoints(
  iteration: number,
  cx = 0,
  cy = 0,
  r = 1,
): RingPoint[] {
  const count = positionCount(iteration)
  const step  = (2 * Math.PI) / count
  const points: RingPoint[] = []
  for (let i = 0; i < count; i++) {
    const angle = i * step - Math.PI / 2 // start from top
    points.push({
      index: i,
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      angleDeg: ((angle + Math.PI / 2) * 180 / Math.PI + 360) % 360,
    })
  }
  return points
}

/**
 * Generate a closed SVG path connecting ring vertices.
 *
 * @param iteration  Lattice iteration — controls vertex count and density
 * @param cx         SVG center x
 * @param cy         SVG center y
 * @param r          Ring radius in SVG units
 * @param step       Connect every nth vertex (1=polygon, 2=skip-1 star, etc.)
 */
export function ringToPath(
  iteration: number,
  cx = 12,
  cy = 12,
  r = 9,
  step = 1,
): string {
  const points = generateRingPoints(iteration, cx, cy, r)
  if (points.length === 0) return ''
  const selected = points.filter((_, i) => i % step === 0)
  const d = selected
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ')
  return `${d} Z`
}

/**
 * Generate connected spoke lines from center to each ring vertex.
 * Useful for radial/mandala forms.
 */
export function ringToSpokes(
  iteration: number,
  cx = 12,
  cy = 12,
  rInner = 0,
  rOuter = 9,
  step = 1,
): string {
  const count = positionCount(iteration)
  const angleStep_ = (2 * Math.PI) / count
  const parts: string[] = []
  for (let i = 0; i < count; i += step) {
    const angle = i * angleStep_ - Math.PI / 2
    const x1 = cx + Math.cos(angle) * rInner
    const y1 = cy + Math.sin(angle) * rInner
    const x2 = cx + Math.cos(angle) * rOuter
    const y2 = cy + Math.sin(angle) * rOuter
    parts.push(`M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`)
  }
  return parts.join(' ')
}

/**
 * Generate a multi-ring mandala path.
 * Each ring = one iteration level, from innermost (0) to outermost (maxIteration).
 */
export function mandalaPath(
  maxIteration: number,
  cx = 12,
  cy = 12,
  ringSpacing = 3,
  step = 1,
): string {
  const parts: string[] = []
  for (let iter = 0; iter <= maxIteration; iter++) {
    const r = ringSpacing * (iter + 1)
    parts.push(ringToPath(iter, cx, cy, r, step))
  }
  return parts.join(' ')
}
