import type { ComponentProps } from "react"
import * as OTPPrimitive from "@radix-ui/react-one-time-password-field"
import { cx } from "../../lib/utils"

const ROOT_BASE = "flex items-center gap-2"

const INPUT_BASE =
  "h-10 w-10 rounded-lg border border-line bg-transparent text-center text-base outline-none focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50"

function OneTimePasswordField({
  className,
  ...props
}: ComponentProps<typeof OTPPrimitive.Root>) {
  return <OTPPrimitive.Root className={cx(ROOT_BASE, className)} {...props} />
}

function OneTimePasswordFieldInput({
  className,
  ...props
}: ComponentProps<typeof OTPPrimitive.Input>) {
  return (
    <OTPPrimitive.Input className={cx(INPUT_BASE, className)} {...props} />
  )
}

function OneTimePasswordFieldHiddenInput({
  ...props
}: ComponentProps<typeof OTPPrimitive.HiddenInput>) {
  return <OTPPrimitive.HiddenInput {...props} />
}

export {
  OneTimePasswordField,
  OneTimePasswordFieldInput,
  OneTimePasswordFieldHiddenInput,
}
