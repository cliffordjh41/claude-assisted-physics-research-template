import type { ComponentProps } from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

const CONTENT_BASE =
  "bg-overlay text-overlay-fg data-[state=open]:animate-content-show data-[state=closed]:animate-content-hide z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-lg border border-line p-4 shadow-md outline-hidden"

function Popover({ ...props }: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />
}

function PopoverTrigger({
  ...props
}: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={className ? `${CONTENT_BASE} ${className}` : CONTENT_BASE}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
