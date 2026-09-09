import type { ComponentProps } from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cx } from "../../lib/utils"

const CONTENT_BASE =
  "bg-overlay text-overlay-fg z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-lg border border-line p-4 shadow-md outline-none data-[state=open]:animate-content-show data-[state=closed]:animate-content-hide"

function HoverCard({
  ...props
}: ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root {...props} />
}

function HoverCardTrigger({
  ...props
}: ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger {...props} />
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cx(CONTENT_BASE, className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
