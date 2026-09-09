import type { ComponentProps } from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

const CONTENT_BASE =
  "z-50 overflow-hidden rounded-lg border border-line bg-overlay text-overlay-fg px-2 py-1 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) shadow-md data-[state=delayed-open]:animate-overlay-show data-[state=closed]:animate-overlay-hide"

const ARROW_BASE = "fill-overlay"

function TooltipProvider({
  delayDuration = 250,
  skipDelayDuration = 100,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  )
}

function Tooltip({ ...props }: ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger({
  ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={className ? `${CONTENT_BASE} ${className}` : CONTENT_BASE}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className={ARROW_BASE} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent }
