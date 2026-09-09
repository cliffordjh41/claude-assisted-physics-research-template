import type { ReactNode } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cx } from "../../lib/utils"
import { SlidingPanels, SlidingPanel, SlidingPanelContent } from "./sliding-panels"
import { TabNavigationFooter } from "../panel-primitives"
import { VisuallyHidden } from "./visually-hidden"

/**
 * A Dialog is a transient overlay with built-in navigation across
 * multiple Panels. Composes the Radix Dialog primitive with
 * SlidingPanels, a tabs-or-arrows footer, and size presets
 * (modal / showCloseButton / size / navigation / panelCount).
 */

export type PanelDialogSize = "sm" | "md" | "lg" | "xl" | "full"
export type PanelDialogNavigation = "tabs" | "arrows"

const SIZE_CLASSES: Record<PanelDialogSize, string> = {
  sm: "w-[360px] h-[480px]",
  md: "w-[420px] h-[560px]",
  lg: "w-[560px] h-[640px]",
  xl: "w-[720px] h-[720px]",
  full: "w-[calc(100%-2rem)] h-[calc(100%-2rem)]",
}

const OVERLAY_BASE =
  "data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide fixed inset-0 z-50 bg-scrim/50 backdrop-blur-sm"

const CONTENT_BASE =
  "data-[state=open]:animate-content-show data-[state=closed]:animate-content-hide fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] bg-background border border-line rounded-lg shadow-lg overflow-hidden flex flex-col"

interface PanelDialogProps {
  /** Dialog open / closed. Controlled by parent. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Accessibility title — defaults to VisuallyHidden if no header used. */
  name: string
  description?: string
  /** Size preset. Default md. */
  size?: PanelDialogSize
  /** Modal-style backdrop + outside-click close. Default true. */
  modal?: boolean
  /** Top-right X button. Default true. */
  showCloseButton?: boolean
  /** "tabs" footer or "arrows" prev/next footer when multiple panels. */
  navigation?: PanelDialogNavigation
  /** Optional labels for tab buttons (defaults to "1" / "2" / ...). */
  panelLabels?: string[]
  /** Controlled panel index. */
  panelIndex?: number
  defaultPanelIndex?: number
  onPanelIndexChange?: (idx: number) => void
  /** One ReactNode per panel. Length determines panelCount. */
  panels: ReactNode[]
  /** Optional header content above the panels. */
  header?: ReactNode
  /** Optional footer slot under the navigation footer (or replacing it). */
  footer?: ReactNode
  /** Forwarded to DialogPrimitive.Trigger when used as a controlled wrapper. */
  trigger?: ReactNode
  /** Class string appended to the content box. */
  className?: string
}

export function PanelDialog({
  open,
  defaultOpen,
  onOpenChange,
  name,
  description,
  size = "md",
  modal = true,
  showCloseButton = true,
  navigation = "tabs",
  panelLabels,
  panelIndex,
  defaultPanelIndex = 0,
  onPanelIndexChange,
  panels,
  header,
  footer,
  trigger,
  className,
}: PanelDialogProps) {
  const [activeIndex = 0, setActiveIndex] = useControllableState({
    prop: panelIndex,
    defaultProp: defaultPanelIndex,
    onChange: onPanelIndexChange,
  })

  const panelCount = panels.length

  return (
    <DialogPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={OVERLAY_BASE} />
        <DialogPrimitive.Content
          className={cx(CONTENT_BASE, SIZE_CLASSES[size], className)}
          onInteractOutside={(e) => {
            if (!modal) e.preventDefault()
          }}
        >
          <VisuallyHidden asChild>
            <DialogPrimitive.Title>{name}</DialogPrimitive.Title>
          </VisuallyHidden>
          {description ? (
            <VisuallyHidden asChild>
              <DialogPrimitive.Description>{description}</DialogPrimitive.Description>
            </VisuallyHidden>
          ) : null}

          {showCloseButton ? (
            <DialogPrimitive.Close className="absolute top-3 right-3 z-10 text-mute-fg hover:text-foreground transition-colors">
              <X className="size-3.5" />
              <VisuallyHidden>Close</VisuallyHidden>
            </DialogPrimitive.Close>
          ) : null}

          {header ? (
            <div className="shrink-0 border-b border-line">{header}</div>
          ) : null}

          <div className="flex-1 min-h-0">
            <SlidingPanels activeIndex={activeIndex} onIndexChange={setActiveIndex}>
              {panels.map((node, i) => (
                <SlidingPanel key={i}>
                  <SlidingPanelContent className="!p-0">{node}</SlidingPanelContent>
                </SlidingPanel>
              ))}
            </SlidingPanels>
          </div>

          {panelCount > 1 && navigation === "tabs" ? (
            <TabNavigationFooter
              tabs={panels.map((_, i) => ({
                id: String(i),
                label: panelLabels?.[i] ?? String(i + 1),
              }))}
              activeTab={String(activeIndex)}
              onTabChange={(id) => setActiveIndex(Number(id))}
            />
          ) : null}

          {panelCount > 1 && navigation === "arrows" ? (
            <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-line">
              <button
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className={cx(
                  "size-7 flex items-center justify-center transition-colors",
                  activeIndex > 0
                    ? "text-foreground hover:text-mute-fg"
                    : "text-mute-fg/20"
                )}
              >
                <ChevronLeft className="size-3.5" />
                <VisuallyHidden>Previous panel</VisuallyHidden>
              </button>
              <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
                {activeIndex + 1} / {panelCount}
              </span>
              <button
                onClick={() => setActiveIndex(Math.min(panelCount - 1, activeIndex + 1))}
                disabled={activeIndex >= panelCount - 1}
                className={cx(
                  "size-7 flex items-center justify-center transition-colors",
                  activeIndex < panelCount - 1
                    ? "text-foreground hover:text-mute-fg"
                    : "text-mute-fg/20"
                )}
              >
                <ChevronRight className="size-3.5" />
                <VisuallyHidden>Next panel</VisuallyHidden>
              </button>
            </div>
          ) : null}

          {footer ? (
            <div className="shrink-0 border-t border-line">{footer}</div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/**
 * Re-export the Radix primitives for callers that want trigger/close
 * wired explicitly (e.g. an external button that opens the dialog
 * via a TriggerProps spread).
 */
export const PanelDialogTrigger = DialogPrimitive.Trigger
export const PanelDialogClose = DialogPrimitive.Close
