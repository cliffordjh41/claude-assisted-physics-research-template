import type { ReactNode } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cx } from "../../lib/utils"
import { VisuallyHidden } from "./visually-hidden"

/**
 * Per the body's locked vocab a Popup is a Panel deployed as its own
 * standalone surface — single-Panel, no built-in multi-Panel nav (that
 * is Dialog). Useful as a carousel-launcher target, a standalone Panel
 * window, or any "open one Panel as an overlay" composition. Built on
 * Radix Dialog primitive for focus trap / escape / scroll lock /
 * portal; sizing presets match the Dialog vocab.
 */

export type PopupSize = "sm" | "md" | "lg" | "xl" | "full"

const SIZE_CLASSES: Record<PopupSize, string> = {
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

interface PopupProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Accessibility title — rendered VisuallyHidden if no header is used. */
  name: string
  description?: string
  size?: PopupSize
  /** Backdrop + outside-click close. Default true. */
  modal?: boolean
  /** Top-right X button. Default true. */
  showCloseButton?: boolean
  /** Optional header content above the Panel. */
  header?: ReactNode
  /** Optional footer content below the Panel — typically the Panel's
   * own onFooter chrome routed here by the host. */
  footer?: ReactNode
  /** The single Panel rendered inside. */
  children: ReactNode
  /** Optional trigger to render alongside the Popup (asChild). */
  trigger?: ReactNode
  className?: string
}

export function Popup({
  open,
  defaultOpen,
  onOpenChange,
  name,
  description,
  size = "md",
  modal = true,
  showCloseButton = true,
  header,
  footer,
  children,
  trigger,
  className,
}: PopupProps) {
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

          <div className="flex-1 min-h-0">{children}</div>

          {footer ? (
            <div className="shrink-0 border-t border-line">{footer}</div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export const PopupTrigger = DialogPrimitive.Trigger
export const PopupClose = DialogPrimitive.Close
