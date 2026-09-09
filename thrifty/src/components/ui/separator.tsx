import type { ComponentProps } from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

const BASE =
  "shrink-0 bg-line data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      decorative={decorative}
      className={className ? `${BASE} ${className}` : BASE}
      {...props}
    />
  )
}

export { Separator }
