
import { useEffect, useLayoutEffect, useMemo } from "react"
import { hexToOklch } from "../lib/color-utils"
import type { Theme } from "../types/theme"

// Apply the :root theme vars synchronously *before* the browser paints, so a
// theme change lands in the same frame as the interaction. Plain useEffect
// runs after paint, leaving every theme switch one frame stale (the click
// registers but the colors/radius/font follow a beat later). Fall back to
// useEffect on the server, where there is no DOM and useLayoutEffect warns.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export type ThemeMode = "A" | "B"

const WEIGHT_KEYWORD_TO_VALUE: Record<string, string> = {
  light: "300",
  normal: "400",
  semibold: "600",
  bold: "700",
}

const TRACKING_KEYWORD_TO_VALUE: Record<string, string> = {
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  widest: "0.1em",
}

const LINE_HEIGHT_KEYWORD_TO_VALUE: Record<string, string> = {
  tight: "1.25",
  normal: "1.5",
  loose: "1.75",
}

const HOLO_SPEED_KEYWORD_TO_VALUE: Record<string, string> = {
  slow: "16s",
  normal: "8s",
  fast: "4s",
}

const SHADOW_STRENGTH_TO_VALUE: Record<string, string> = {
  none: "0",
  soft: "0.5",
  medium: "1",
  strong: "1.6",
}

interface ThemeVars {
  cssVars: Record<string, string>
  fontSize?: string
}

/**
 * Build the CSS variable map for a Theme. Colors → --{key}. Radius →
 * --radius. Font family → --font-sans. Font weight + letter spacing
 * → --theme-font-weight and --theme-letter-spacing; chrome opts in via
 * Tailwind v4's arbitrary-property syntax `font-(--theme-font-weight)`
 * and `tracking-(--theme-letter-spacing)`. Base font size is set as
 * an inline fontSize on the root for inheritance.
 */
function themeVars(theme: Theme, mode: ThemeMode): ThemeVars {
  const colors = mode === "B" ? theme.colorsB : theme.colorsA
  const cssVars: Record<string, string> = {}

  for (const [key, hex] of Object.entries(colors)) {
    cssVars[`--${key}`] = hexToOklch(hex)
  }

  cssVars["--radius"] = `${theme.styling.radius}rem`

  if (theme.styling.fontFamily) {
    cssVars["--font-sans"] = theme.styling.fontFamily
  }
  if (theme.styling.fontWeight) {
    cssVars["--theme-font-weight"] =
      WEIGHT_KEYWORD_TO_VALUE[theme.styling.fontWeight] ?? theme.styling.fontWeight
  }
  if (theme.styling.letterSpacing) {
    cssVars["--theme-letter-spacing"] =
      TRACKING_KEYWORD_TO_VALUE[theme.styling.letterSpacing] ?? theme.styling.letterSpacing
  }
  if (theme.styling.lineHeight) {
    cssVars["--theme-line-height"] =
      LINE_HEIGHT_KEYWORD_TO_VALUE[theme.styling.lineHeight] ?? theme.styling.lineHeight
  }
  if (theme.styling.holoSpeed) {
    cssVars["--holo-speed"] =
      HOLO_SPEED_KEYWORD_TO_VALUE[theme.styling.holoSpeed] ?? theme.styling.holoSpeed
  }

  // Always emit; unset reads as medium (= 1 = stock Tailwind shadows).
  cssVars["--theme-shadow-strength"] =
    SHADOW_STRENGTH_TO_VALUE[theme.styling.shadow ?? "medium"] ?? "1"

  const fontSize = theme.styling.baseFontSize
    ? `${theme.styling.baseFontSize}px`
    : undefined

  return { cssVars, fontSize }
}

/**
 * Apply a Theme to document.documentElement (the :root). Use at the
 * top level of an app where the theme is global; portaled content
 * (Radix Portal under Sheets / Dialogs / Popovers) inherits from
 * :root and so follows live picker updates here.
 */
export function useThemeRoot(theme: Theme, mode: ThemeMode = "A") {
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement
    const { cssVars, fontSize } = themeVars(theme, mode)
    const written: string[] = []
    for (const [key, value] of Object.entries(cssVars)) {
      root.style.setProperty(key, value)
      written.push(key)
    }
    if (fontSize) root.style.fontSize = fontSize
    // Tailwind v4 preflight reads --default-font-family for the html
    // font-family rule, not --font-sans. Set inline fontFamily on the
    // root so body and all un-classed descendants inherit the picker's
    // value (elements with an explicit .font-sans class also work via
    // the --font-sans var written above).
    if (theme.styling.fontFamily) {
      root.style.fontFamily = theme.styling.fontFamily
    }
    if (theme.styling.lineHeight) {
      root.style.lineHeight =
        LINE_HEIGHT_KEYWORD_TO_VALUE[theme.styling.lineHeight] ?? theme.styling.lineHeight
    }
    return () => {
      for (const key of written) root.style.removeProperty(key)
      root.style.fontSize = ""
      root.style.fontFamily = ""
      root.style.lineHeight = ""
    }
  }, [theme, mode])
}

interface ThemeScopeProps {
  theme: Theme
  mode?: ThemeMode
  className?: string
  children: React.ReactNode
}

/**
 * Scoped theme container — wraps children in a div whose inline style
 * sets the theme's CSS variables. Use to apply a *different* theme to
 * a subtree (e.g. a preview region inside a top-level themed app). For
 * top-level theming use useThemeRoot instead; it reaches portaled
 * content that ThemeScope's div cannot.
 */
export function ThemeScope({ theme, mode = "B", className, children }: ThemeScopeProps) {
  const style = useMemo(() => {
    const { cssVars, fontSize } = themeVars(theme, mode)
    const result: Record<string, string> = { ...cssVars }
    if (fontSize) result["fontSize"] = fontSize
    return result as React.CSSProperties
  }, [theme, mode])

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
