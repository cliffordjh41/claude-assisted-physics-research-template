import type { ComponentProps, ReactElement } from "react"
import * as PasswordTogglePrimitive from "@radix-ui/react-password-toggle-field"
import { Eye, EyeOff } from "lucide-react"
import { cx } from "../../lib/utils"

const ROOT_BASE = "relative inline-flex items-center"

const INPUT_BASE =
  "h-9 w-full rounded-lg border border-line bg-transparent px-3 pr-10 text-base outline-none focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50"

const TOGGLE_BASE =
  "absolute right-2 inline-flex size-7 items-center justify-center rounded-sm text-mute-fg outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-focus"

interface PasswordToggleFieldRootProps
  extends ComponentProps<typeof PasswordTogglePrimitive.Root> {
  className?: string
}

// Radix Root renders no DOM of its own (state context provider); wrap its
// children in a div so consumers get a stylable layout container without
// having to add it themselves at every call site.
function PasswordToggleField({
  className,
  children,
  ...props
}: PasswordToggleFieldRootProps) {
  return (
    <PasswordTogglePrimitive.Root {...props}>
      <div className={cx(ROOT_BASE, className)}>{children}</div>
    </PasswordTogglePrimitive.Root>
  )
}

function PasswordToggleFieldInput({
  className,
  ...props
}: ComponentProps<typeof PasswordTogglePrimitive.Input>) {
  return (
    <PasswordTogglePrimitive.Input
      className={cx(INPUT_BASE, className)}
      {...props}
    />
  )
}

function PasswordToggleFieldToggle({
  className,
  ...props
}: ComponentProps<typeof PasswordTogglePrimitive.Toggle>) {
  return (
    <PasswordTogglePrimitive.Toggle
      className={cx(TOGGLE_BASE, className)}
      {...props}
    />
  )
}

interface PasswordToggleFieldIconProps
  extends Omit<ComponentProps<typeof PasswordTogglePrimitive.Icon>, "visible" | "hidden"> {
  visible?: ReactElement
  hidden?: ReactElement
}

function PasswordToggleFieldIcon({
  visible = <Eye className="size-4" />,
  hidden = <EyeOff className="size-4" />,
  ...props
}: PasswordToggleFieldIconProps) {
  return (
    <PasswordTogglePrimitive.Icon
      visible={visible}
      hidden={hidden}
      {...props}
    />
  )
}

function PasswordToggleFieldSlot({
  ...props
}: ComponentProps<typeof PasswordTogglePrimitive.Slot>) {
  return <PasswordTogglePrimitive.Slot {...props} />
}

export {
  PasswordToggleField,
  PasswordToggleFieldInput,
  PasswordToggleFieldToggle,
  PasswordToggleFieldIcon,
  PasswordToggleFieldSlot,
}
