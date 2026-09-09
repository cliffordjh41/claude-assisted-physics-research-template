import type { ComponentProps } from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

const ROOT_BASE =
  "bg-mute relative h-2 w-full overflow-hidden rounded-full"

const INDICATOR_BASE =
  "bg-action h-full w-full flex-1 transition-all"

function Progress({
  className,
  value,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={className ? `${ROOT_BASE} ${className}` : ROOT_BASE}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={INDICATOR_BASE}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
