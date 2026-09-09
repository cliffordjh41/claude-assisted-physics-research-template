export type ThemeColors = {
  // Core
  background: string
  foreground: string
  action: string
  "action-fg": string
  subdued: string
  "subdued-fg": string
  highlight: string
  "highlight-fg": string
  mute: string
  "mute-fg": string
  line: string
  alert: string
  "alert-fg": string
  // Surface
  surface: string
  // Overlay
  overlay: string
  "overlay-fg": string
  // Inputs
  field: string
  focus: string
  // Visualizer
  "visualizer-1": string
  "visualizer-2": string
  "visualizer-3": string
  "visualizer-4": string
  "visualizer-5": string
  "visualizer-6": string
  "visualizer-7": string
  "visualizer-8": string
  "visualizer-9": string
  "visualizer-10": string
  "visualizer-11": string
  "visualizer-12": string
  // Column
  column: string
  "column-foreground": string
  "column-highlight": string
  "column-line": string
}

export type ThemeStyling = {
  radius: number
  fontFamily?: string
  baseFontSize?: number
  fontWeight?: string
  letterSpacing?: string
  // Line height keyword ("tight" | "normal" | "loose") mapped by
  // useThemeRoot to a CSS line-height value; cascades from :root.
  lineHeight?: string
  // Shadow elevation strength keyword (none | soft | medium | strong),
  // mapped by ThemeScope to --theme-shadow-strength, which scales every
  // shadow-* utility. Unset reads as medium (stock Tailwind shadows).
  shadow?: string
  // Holo effect toggles per surface, per color variant (A / B) — so one
  // variant can glow while the other stays clean. The .bg-holo class supplies
  // the conic-gradient overlay; each surface that opts in renders a
  // pointer-events-none absolute-inset overlay div with that class.
  columnHoloA?: boolean
  columnHoloB?: boolean
  backgroundHoloA?: boolean
  backgroundHoloB?: boolean
  // When true, the --holo-angle custom property tracks the mouse
  // pointer's bearing from screen center; the holo conic gradient
  // rotates with cursor motion.
  holoTrackMouse?: boolean
  // Holo conic-gradient rotation period (slow / normal / fast →
  // 16s / 8s / 4s respectively). Drives --holo-speed which the
  // .animate-holo-spin keyframe references.
  holoSpeed?: string
  // Optional user-named labels for the two color variants. When unset,
  // UI defaults to "A" / "B". Exported CSS files can carry the user's
  // chosen names for downstream apps to reference.
  labelA?: string
  labelB?: string
}

export type Theme = {
  id: string
  name: string
  colorsA: ThemeColors
  colorsB: ThemeColors
  styling: ThemeStyling
}
