import type { ComponentProps } from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cx } from "../../lib/utils"

const ROOT_BASE = "grid gap-2"

const ITEM_BASE =
  "aspect-square size-4 rounded-full border border-line text-foreground outline-none focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-focus/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-foreground"

const INDICATOR_BASE =
  "flex items-center justify-center"

function RadioGroup({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cx(ROOT_BASE, className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cx(ITEM_BASE, className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className={INDICATOR_BASE}>
        <Circle className="size-2 fill-foreground text-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
