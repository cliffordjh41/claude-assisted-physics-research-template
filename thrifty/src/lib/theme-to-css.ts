import { hexToOklch } from "./color-utils"
import type { Theme, ThemeColors } from "../types/theme"

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

function tokenBlock(colors: ThemeColors): string {
  return Object.entries(colors)
    .map(([k, v]) => `  --${k}: ${hexToOklch(v)};`)
    .join("\n")
}

// Tailwind v4 `@theme` mapping. For each color token name, expose a
// matching `--color-<name>` that resolves to `var(--<name>)`, so
// consumer apps using utilities like `bg-action` or `text-foreground`
// will pick up the values without further wiring. `inline` keeps the
// CSS lean — values reference the :root tokens instead of being
// duplicated.
function themeBlock(colors: ThemeColors): string {
  return Object.keys(colors)
    .map((k) => `  --color-${k}: var(--${k});`)
    .join("\n")
}

/**
 * Serialize a Theme to a paste-ready CSS string. Variant A goes to
 * :root; variant B goes to .theme-b (consumer apps toggle that class
 * on a wrapper to switch). Styling tokens (radius, font, font-weight,
 * letter-spacing, line-height, holo-speed) live alongside variant A
 * in :root since they don't change per variant.
 */
export function themeToCss(theme: Theme): string {
  const stylingLines: string[] = [`  --radius: ${theme.styling.radius}rem;`]
  if (theme.styling.fontFamily) {
    stylingLines.push(`  --font-sans: ${theme.styling.fontFamily};`)
  }
  if (theme.styling.baseFontSize) {
    stylingLines.push(`  font-size: ${theme.styling.baseFontSize}px;`)
  }
  if (theme.styling.fontWeight) {
    const v = WEIGHT_KEYWORD_TO_VALUE[theme.styling.fontWeight] ?? theme.styling.fontWeight
    stylingLines.push(`  --theme-font-weight: ${v};`)
  }
  if (theme.styling.letterSpacing) {
    const v = TRACKING_KEYWORD_TO_VALUE[theme.styling.letterSpacing] ?? theme.styling.letterSpacing
    stylingLines.push(`  --theme-letter-spacing: ${v};`)
  }
  if (theme.styling.lineHeight) {
    const v = LINE_HEIGHT_KEYWORD_TO_VALUE[theme.styling.lineHeight] ?? theme.styling.lineHeight
    stylingLines.push(`  --theme-line-height: ${v};`)
  }
  if (theme.styling.holoSpeed) {
    const v = HOLO_SPEED_KEYWORD_TO_VALUE[theme.styling.holoSpeed] ?? theme.styling.holoSpeed
    stylingLines.push(`  --holo-speed: ${v};`)
  }

  const labelA = theme.styling.labelA ?? "A"
  const labelB = theme.styling.labelB ?? "B"

  return `/* Theme: ${theme.name} — variant ${labelA} at :root, variant ${labelB} at .theme-b */

@theme inline {
${themeBlock(theme.colorsA)}
}

:root {
${tokenBlock(theme.colorsA)}

${stylingLines.join("\n")}
}

.theme-b {
${tokenBlock(theme.colorsB)}
}
`
}
