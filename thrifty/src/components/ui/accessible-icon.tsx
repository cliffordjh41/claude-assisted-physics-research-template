import type { ComponentProps } from "react"
import * as AccessibleIconPrimitive from "@radix-ui/react-accessible-icon"

function AccessibleIcon({
  ...props
}: ComponentProps<typeof AccessibleIconPrimitive.Root>) {
  return <AccessibleIconPrimitive.Root {...props} />
}

export { AccessibleIcon }
