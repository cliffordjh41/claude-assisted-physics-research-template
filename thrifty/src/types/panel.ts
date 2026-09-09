import type { ReactNode } from "react"
import type { Theme } from "./theme"
import type { ThemeMode } from "../components/ThemeScope"

export interface PanelProps {
  // Optional: panels render from CSS variables (set by ThemeScope or the
  // exported theme CSS), so consumers don't need to pass a Theme object.
  theme?: Theme
  appName?: string
  mode?: ThemeMode
  onHeader?: (content: ReactNode) => void
  onFooter?: (content: ReactNode) => void
  panelData?: Record<string, unknown>
  onData?: (data: Record<string, unknown>) => void
}
