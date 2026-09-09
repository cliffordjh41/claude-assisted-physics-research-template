/**
 * Color conversion utilities for hex to OKLCH
 * OKLCH format: oklch(lightness chroma hue)
 * - Lightness: 0-1 (0 = black, 1 = white)
 * - Chroma: 0-0.4 (saturation)
 * - Hue: 0-360 (color wheel position)
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return { r: 0, g: 0, b: 0 }
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

/**
 * Convert RGB to linear RGB (remove gamma)
 */
function srgbToLinear(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

/**
 * Convert linear RGB to OKLCH via OKLab
 * Based on https://bottosson.github.io/posts/oklab/
 */
function linearRgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  // Linear RGB to LMS
  const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  // LMS to OKLab
  const l = Math.cbrt(l_)
  const m = Math.cbrt(m_)
  const s = Math.cbrt(s_)

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const bLab = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s

  // OKLab to OKLCH
  const C = Math.sqrt(a * a + bLab * bLab)
  let H = Math.atan2(bLab, a) * (180 / Math.PI)
  if (H < 0) H += 360

  return { l: L, c: C, h: H }
}

/**
 * Convert hex color to OKLCH string
 * @param hex - Hex color (e.g., "#ff0000" or "ff0000")
 * @returns OKLCH string (e.g., "oklch(0.628 0.258 29.234)")
 */
export function hexToOklch(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)
  const { l, c, h } = linearRgbToOklch(lr, lg, lb)

  // Format with 3 decimal places
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(2)})`
}

/**
 * Parse OKLCH string to components
 */
export function parseOklch(oklch: string): { l: number; c: number; h: number } | null {
  const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/)
  if (!match) return null
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
  }
}

/**
 * Convert OKLCH to OKLab
 */
function oklchToOklab(l: number, c: number, h: number): { L: number; a: number; b: number } {
  const hRad = (h * Math.PI) / 180
  return {
    L: l,
    a: c * Math.cos(hRad),
    b: c * Math.sin(hRad),
  }
}

/**
 * Convert OKLab to linear RGB
 */
function oklabToLinearRgb(L: number, a: number, b: number): { r: number; g: number; b: number } {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  }
}

/**
 * Convert linear RGB to sRGB (apply gamma)
 */
function linearToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c))
  return clamped <= 0.0031308
    ? 12.92 * clamped
    : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n * 255))).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Convert OKLCH string to hex color
 * @param oklch - OKLCH string (e.g., "oklch(0.628 0.258 29.234)")
 * @returns Hex color (e.g., "#ff0000")
 */
export function oklchToHex(oklch: string): string {
  const parsed = parseOklch(oklch)
  if (!parsed) return "#000000"

  const { L, a, b } = oklchToOklab(parsed.l, parsed.c, parsed.h)
  const linear = oklabToLinearRgb(L, a, b)
  const r = linearToSrgb(linear.r)
  const g = linearToSrgb(linear.g)
  const bVal = linearToSrgb(linear.b)

  return rgbToHex(r, g, bVal)
}

/**
 * Adjust OKLCH lightness for light/dark mode
 * @param oklch - OKLCH string
 * @param mode - "light" or "dark"
 * @returns Adjusted OKLCH string
 */
export function adjustOklchForMode(oklch: string, mode: "light" | "dark"): string {
  const parsed = parseOklch(oklch)
  if (!parsed) return oklch

  let { l, c, h } = parsed

  if (mode === "light") {
    // For light mode, invert lightness (dark becomes light, light becomes dark)
    l = 1 - l
    // Slightly reduce chroma for lighter colors
    c = c * 0.9
  }

  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(2)})`
}
