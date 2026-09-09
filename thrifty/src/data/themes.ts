import type { Theme, ThemeColors } from "../types/theme"
import { COLOR_FAMILIES, getColor, type ColorFamily } from "./colors"

function generateColorsA(family: ColorFamily): ThemeColors {
  return {
    // Core
    background: getColor(family, 50),
    foreground: getColor(family, 950),
    action: getColor(family, 900),
    "action-fg": getColor(family, 50),
    subdued: getColor(family, 100),
    "subdued-fg": getColor(family, 900),
    highlight: getColor(family, 100),
    "highlight-fg": getColor(family, 900),
    mute: getColor(family, 100),
    // 600 (not 500) so muted secondary text clears WCAG AA 4.5:1 on both the
    // 50 background and the 100 mute surface; 500 lands ~4.1:1.
    "mute-fg": getColor(family, 600),
    line: getColor(family, 200),
    alert: getColor("red", 500),
    "alert-fg": getColor(family, 50),
    // Surface
    surface: getColor(family, 50),
    // Overlay
    overlay: getColor(family, 50),
    "overlay-fg": getColor(family, 950),
    // Inputs
    field: getColor(family, 200),
    focus: getColor(family, 950),
    // Visualizer (Newton's spectrum)
    "visualizer-1": getColor("red", 500),
    "visualizer-2": getColor("orange", 500),
    "visualizer-3": getColor("amber", 500),
    "visualizer-4": getColor("yellow", 500),
    "visualizer-5": getColor("lime", 500),
    "visualizer-6": getColor("green", 500),
    "visualizer-7": getColor("emerald", 500),
    "visualizer-8": getColor("cyan", 500),
    "visualizer-9": getColor("blue", 500),
    "visualizer-10": getColor("indigo", 500),
    "visualizer-11": getColor("violet", 500),
    "visualizer-12": getColor("purple", 500),
    // Column
    column: getColor(family, 100),
    "column-foreground": getColor(family, 950),
    "column-highlight": getColor(family, 100),
    "column-line": getColor(family, 200),
  }
}

function generateColorsB(family: ColorFamily): ThemeColors {
  return {
    // Core
    background: getColor(family, 950),
    foreground: getColor(family, 50),
    action: getColor(family, 50),
    "action-fg": getColor(family, 900),
    subdued: getColor(family, 800),
    "subdued-fg": getColor(family, 50),
    highlight: getColor(family, 800),
    "highlight-fg": getColor(family, 50),
    mute: getColor(family, 800),
    "mute-fg": getColor(family, 400),
    line: getColor(family, 800),
    alert: getColor("red", 600),
    "alert-fg": getColor(family, 50),
    // Surface
    surface: getColor(family, 950),
    // Overlay
    overlay: getColor(family, 950),
    "overlay-fg": getColor(family, 50),
    // Inputs
    field: getColor(family, 800),
    focus: getColor(family, 300),
    // Visualizer (Newton's spectrum)
    "visualizer-1": getColor("red", 400),
    "visualizer-2": getColor("orange", 400),
    "visualizer-3": getColor("amber", 400),
    "visualizer-4": getColor("yellow", 400),
    "visualizer-5": getColor("lime", 400),
    "visualizer-6": getColor("green", 400),
    "visualizer-7": getColor("emerald", 400),
    "visualizer-8": getColor("cyan", 400),
    "visualizer-9": getColor("blue", 400),
    "visualizer-10": getColor("indigo", 400),
    "visualizer-11": getColor("violet", 400),
    "visualizer-12": getColor("purple", 400),
    // Column
    column: getColor(family, 900),
    "column-foreground": getColor(family, 50),
    "column-highlight": getColor(family, 800),
    "column-line": getColor(family, 800),
  }
}

export function generateTheme(family: ColorFamily): Theme {
  return {
    id: family,
    name: family.charAt(0).toUpperCase() + family.slice(1),
    colorsA: generateColorsA(family),
    colorsB: generateColorsB(family),
    styling: {
      radius: 0,
      fontFamily: "Inter, system-ui, sans-serif",
      baseFontSize: 16,
    },
  }
}

export const THEME_PRESETS: Theme[] = COLOR_FAMILIES.map(generateTheme)

export const DEFAULT_THEME: Theme = THEME_PRESETS.find(t => t.id === "stone")!

export function findTheme(id: string): Theme | undefined {
  return THEME_PRESETS.find(t => t.id === id)
}

/**
 * Migrate a theme that may carry legacy field names (`colors` / `darkColors`)
 * or legacy shadcn color keys (primary, secondary, accent, muted, destructive,
 * card, popover, input, ring + their -foreground pairs) into the body's
 * current shape: `colorsA` / `colorsB` with action / subdued / highlight /
 * mute / alert / surface / overlay / field / focus tokens (and their -fg pairs).
 */
function migrateColors(colors: Record<string, string>, fallback: ThemeColors): ThemeColors {
  return {
    background: colors.background ?? fallback.background,
    foreground: colors.foreground ?? fallback.foreground,
    action: colors.action ?? colors.primary ?? fallback.action,
    "action-fg": colors["action-fg"] ?? colors["primary-foreground"] ?? fallback["action-fg"],
    subdued: colors.subdued ?? colors.secondary ?? fallback.subdued,
    "subdued-fg": colors["subdued-fg"] ?? colors["secondary-foreground"] ?? fallback["subdued-fg"],
    highlight: colors.highlight ?? colors.accent ?? fallback.highlight,
    "highlight-fg": colors["highlight-fg"] ?? colors["accent-foreground"] ?? fallback["highlight-fg"],
    mute: colors.mute ?? colors.muted ?? fallback.mute,
    "mute-fg": colors["mute-fg"] ?? colors["muted-foreground"] ?? fallback["mute-fg"],
    line: colors.line ?? colors.border ?? fallback.line,
    alert: colors.alert ?? colors.destructive ?? fallback.alert,
    "alert-fg": colors["alert-fg"] ?? colors["destructive-foreground"] ?? fallback["alert-fg"],
    surface: colors.surface ?? colors.card ?? colors.background ?? fallback.surface,
    overlay: colors.overlay ?? colors.popover ?? colors.background ?? fallback.overlay,
    "overlay-fg": colors["overlay-fg"] ?? colors["popover-foreground"] ?? colors.foreground ?? fallback["overlay-fg"],
    field: colors.field ?? colors.input ?? colors.line ?? fallback.field,
    focus: colors.focus ?? colors.ring ?? colors["mute-fg"] ?? colors["muted-foreground"] ?? fallback.focus,
    "visualizer-1": colors["visualizer-1"] ?? fallback["visualizer-1"],
    "visualizer-2": colors["visualizer-2"] ?? fallback["visualizer-2"],
    "visualizer-3": colors["visualizer-3"] ?? fallback["visualizer-3"],
    "visualizer-4": colors["visualizer-4"] ?? fallback["visualizer-4"],
    "visualizer-5": colors["visualizer-5"] ?? fallback["visualizer-5"],
    "visualizer-6": colors["visualizer-6"] ?? fallback["visualizer-6"],
    "visualizer-7": colors["visualizer-7"] ?? fallback["visualizer-7"],
    "visualizer-8": colors["visualizer-8"] ?? fallback["visualizer-8"],
    "visualizer-9": colors["visualizer-9"] ?? fallback["visualizer-9"],
    "visualizer-10": colors["visualizer-10"] ?? fallback["visualizer-10"],
    "visualizer-11": colors["visualizer-11"] ?? fallback["visualizer-11"],
    "visualizer-12": colors["visualizer-12"] ?? fallback["visualizer-12"],
    column: colors.column ?? colors.sidebar ?? colors.background ?? fallback.column,
    "column-foreground": colors["column-foreground"] ?? colors["sidebar-foreground"] ?? colors.foreground ?? fallback["column-foreground"],
    "column-highlight": colors["column-highlight"] ?? colors["sidebar-highlight"] ?? colors.accent ?? colors.highlight ?? fallback["column-highlight"],
    "column-line": colors["column-line"] ?? colors["sidebar-border"] ?? colors.line ?? fallback["column-line"],
  }
}

export function migrateTheme(theme: Partial<Theme> & { id: string; name: string }): Theme {
  const fallback = DEFAULT_THEME
  const raw = theme as Record<string, unknown>
  const aRaw = (raw.colorsA ?? raw.colors) as Record<string, string> | undefined
  const bRaw = (raw.colorsB ?? raw.darkColors) as Record<string, string> | undefined
  // Legacy themes carried a single shared columnHolo/backgroundHolo; map each
  // onto both variants so an upgraded theme keeps its current look.
  const sty = (theme as Theme).styling as
    (Theme["styling"] & { columnHolo?: boolean; backgroundHolo?: boolean }) | undefined
  return {
    id: theme.id,
    name: theme.name,
    colorsA: migrateColors(aRaw ?? {}, fallback.colorsA),
    colorsB: migrateColors(bRaw ?? aRaw ?? {}, fallback.colorsB),
    styling: {
      radius: (theme as Theme).styling?.radius ?? 0.625,
      fontFamily: (theme as Theme).styling?.fontFamily ?? "Inter, system-ui, sans-serif",
      baseFontSize: (theme as Theme).styling?.baseFontSize ?? 16,
      fontWeight: (theme as Theme).styling?.fontWeight,
      letterSpacing: (theme as Theme).styling?.letterSpacing,
      shadow: (theme as Theme).styling?.shadow,
      columnHoloA: sty?.columnHoloA ?? sty?.columnHolo,
      columnHoloB: sty?.columnHoloB ?? sty?.columnHolo,
      backgroundHoloA: sty?.backgroundHoloA ?? sty?.backgroundHolo,
      backgroundHoloB: sty?.backgroundHoloB ?? sty?.backgroundHolo,
      labelA: (theme as Theme).styling?.labelA,
      labelB: (theme as Theme).styling?.labelB,
    },
  }
}

export type ResolvedColors = {
  background: string
  foreground: string
  line: string
}

export function resolveComponentColors(
  props: { colorMode?: "inherit" | "custom"; backgroundColor?: string; textColor?: string; borderColor?: string },
  inheritedColors: ResolvedColors | null,
  projectTheme: Theme
): ResolvedColors {
  if (props.colorMode === "custom") {
    return {
      background: props.backgroundColor || projectTheme.colorsA.background,
      foreground: props.textColor || projectTheme.colorsA.foreground,
      line: props.borderColor || projectTheme.colorsA.line,
    }
  }

  if (inheritedColors) {
    return inheritedColors
  }

  return {
    background: projectTheme.colorsA.background,
    foreground: projectTheme.colorsA.foreground,
    line: projectTheme.colorsA.line,
  }
}
