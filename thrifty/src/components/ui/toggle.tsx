import type { ComponentProps } from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cx } from "../../lib/utils"

const TOGGLE_BASE =
  "inline-flex items-center justify-center rounded-sm border border-line bg-transparent px-3 py-1.5 text-sm text-mute-fg outline-none transition-colors hover:bg-mute hover:text-foreground focus-visible:ring-1 focus-visible:ring-focus data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground disabled:pointer-events-none disabled:opacity-50"

function Toggle({
  className,
  ...props
}: ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      className={cx(TOGGLE_BASE, className)}
      {...props}
    />
  )
}

export { Toggle }
