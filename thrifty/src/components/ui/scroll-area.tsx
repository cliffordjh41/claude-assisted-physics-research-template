import type { ComponentProps } from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cx } from "../../lib/utils"

// Styled scrollbar wrapper. The global scrollbar treatment in
// index.css covers native `*::-webkit-scrollbar`; this primitive
// provides Radix's controlled scrollbar for cases that need
// cross-browser consistency (Firefox, custom positioning) or
// scrollbar interaction events.

const ROOT_BASE = "relative overflow-hidden"
const VIEWPORT_BASE =
  "size-full rounded-[inherit] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus/50"
const SCROLLBAR_BASE =
  "flex touch-none select-none transition-colors"
const SCROLLBAR_VERTICAL = "h-full w-1.5 border-l border-l-transparent p-px"
const SCROLLBAR_HORIZONTAL =
  "h-1.5 flex-col border-t border-t-transparent p-px"
const THUMB_BASE = "relative flex-1 rounded-full bg-mute-fg/30"

function ScrollArea({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      className={cx(ROOT_BASE, className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className={VIEWPORT_BASE}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cx(
        SCROLLBAR_BASE,
        orientation === "vertical" && SCROLLBAR_VERTICAL,
        orientation === "horizontal" && SCROLLBAR_HORIZONTAL,
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={THUMB_BASE} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
