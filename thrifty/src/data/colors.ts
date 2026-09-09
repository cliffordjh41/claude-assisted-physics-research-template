// Tailwind default color palette (20 families)
// Not used: rose, teal

export const tailwindColors: Record<string, Record<number, string>> = {
  // Neutrals (5)
  slate: {
    50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1",
    400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155",
    800: "#1e293b", 900: "#0f172a", 950: "#020617"
  },
  gray: {
    50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db",
    400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151",
    800: "#1f2937", 900: "#111827", 950: "#030712"
  },
  zinc: {
    50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8",
    400: "#a1a1aa", 500: "#71717a", 600: "#52525b", 700: "#3f3f46",
    800: "#27272a", 900: "#18181b", 950: "#09090b"
  },
  neutral: {
    50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4",
    400: "#a3a3a3", 500: "#737373", 600: "#525252", 700: "#404040",
    800: "#262626", 900: "#171717", 950: "#0a0a0a"
  },
  stone: {
    50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4", 300: "#d6d3d1",
    400: "#a8a29e", 500: "#78716c", 600: "#57534e", 700: "#44403c",
    800: "#292524", 900: "#1c1917", 950: "#0c0a09"
  },
  // Chromatics (15)
  red: {
    50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5",
    400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c",
    800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a"
  },
  orange: {
    50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74",
    400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c",
    800: "#9a3412", 900: "#7c2d12", 950: "#431407"
  },
  amber: {
    50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d",
    400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309",
    800: "#92400e", 900: "#78350f", 950: "#451a03"
  },
  yellow: {
    50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047",
    400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207",
    800: "#854d0e", 900: "#713f12", 950: "#422006"
  },
  lime: {
    50: "#f7fee7", 100: "#ecfccb", 200: "#d9f99d", 300: "#bef264",
    400: "#a3e635", 500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f",
    800: "#3f6212", 900: "#365314", 950: "#1a2e05"
  },
  green: {
    50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac",
    400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d",
    800: "#166534", 900: "#14532d", 950: "#052e16"
  },
  emerald: {
    50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7",
    400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857",
    800: "#065f46", 900: "#064e3b", 950: "#022c22"
  },
  cyan: {
    50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9",
    400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490",
    800: "#155e75", 900: "#164e63", 950: "#083344"
  },
  sky: {
    50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc",
    400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1",
    800: "#075985", 900: "#0c4a6e", 950: "#082f49"
  },
  blue: {
    50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
    400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
    800: "#1e40af", 900: "#1e3a8a", 950: "#172554"
  },
  indigo: {
    50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc",
    400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca",
    800: "#3730a3", 900: "#312e81", 950: "#1e1b4b"
  },
  violet: {
    50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd",
    400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9",
    800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065"
  },
  purple: {
    50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe",
    400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce",
    800: "#6b21a8", 900: "#581c87", 950: "#3b0764"
  },
  fuchsia: {
    50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc",
    400: "#e879f9", 500: "#d946ef", 600: "#c026d3", 700: "#a21caf",
    800: "#86198f", 900: "#701a75", 950: "#4a044e"
  },
  pink: {
    50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4",
    400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d",
    800: "#9f1239", 900: "#831843", 950: "#500724"
  },
}

// All 20 color family names in display order
export const COLOR_FAMILIES = [
  // Neutrals
  "slate", "gray", "zinc", "neutral", "stone",
  // Chromatics
  "red", "orange", "amber", "yellow", "lime",
  "green", "emerald", "cyan", "sky", "blue",
  "indigo", "violet", "purple", "fuchsia", "pink",
] as const

export type ColorFamily = typeof COLOR_FAMILIES[number]

// Shades available for each color
export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type Shade = typeof SHADES[number]

// Get a specific color
export function getColor(family: ColorFamily, shade: Shade): string {
  return tailwindColors[family]?.[shade] || "#808080"
}

// Map hue position (0-360) to color family name
export function getColorFamilyFromHue(hue: number): ColorFamily {
  if (hue >= 0 && hue < 15) return "red"
  if (hue >= 15 && hue < 28) return "orange"
  if (hue >= 28 && hue < 45) return "amber"
  if (hue >= 45 && hue < 60) return "yellow"
  if (hue >= 60 && hue < 90) return "lime"
  if (hue >= 90 && hue < 120) return "green"
  if (hue >= 120 && hue < 150) return "emerald"
  if (hue >= 150 && hue < 175) return "cyan"
  if (hue >= 175 && hue < 195) return "cyan"
  if (hue >= 195 && hue < 215) return "sky"
  if (hue >= 215 && hue < 245) return "blue"
  if (hue >= 245 && hue < 265) return "indigo"
  if (hue >= 265 && hue < 285) return "violet"
  if (hue >= 285 && hue < 305) return "purple"
  if (hue >= 305 && hue < 325) return "fuchsia"
  if (hue >= 325 && hue < 340) return "pink"
  return "red"
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null
}

// Calculate color distance (simple Euclidean in RGB space)
function colorDistance(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1)
  const c2 = hexToRgb(hex2)
  if (!c1 || !c2) return Infinity
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  )
}

// Approximate hue from color family (for slider position)
const FAMILY_HUE_MAP: Record<ColorFamily, number> = {
  slate: 215, gray: 220, zinc: 240, neutral: 0, stone: 25,
  red: 0, orange: 25, amber: 38, yellow: 50, lime: 75,
  green: 105, emerald: 140, cyan: 175, sky: 200, blue: 230,
  indigo: 255, violet: 275, purple: 295, fuchsia: 315, pink: 335,
}

export interface ColorMatch {
  family: ColorFamily
  shade: Shade
  hex: string
  hue: number
  isNeutral: boolean
}

// Find best matching color family and shade for a hex value
export function findBestMatch(hex: string): ColorMatch {
  let bestFamily: ColorFamily = "slate"
  let bestShade: Shade = 500
  let bestDistance = Infinity
  let bestHex = getColor("slate", 500)

  for (const family of COLOR_FAMILIES) {
    for (const shade of SHADES) {
      const paletteHex = getColor(family, shade)
      const dist = colorDistance(hex, paletteHex)
      if (dist < bestDistance) {
        bestDistance = dist
        bestFamily = family
        bestShade = shade
        bestHex = paletteHex
      }
    }
  }

  const isNeutral = ["slate", "gray", "zinc", "neutral", "stone"].includes(bestFamily)
  const hue = FAMILY_HUE_MAP[bestFamily]

  return {
    family: bestFamily,
    shade: bestShade,
    hex: bestHex,
    hue,
    isNeutral,
  }
}
