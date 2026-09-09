import type { ComponentProps } from "react"
import * as ToolbarPrimitive from "@radix-ui/react-toolbar"
import { cx } from "../../lib/utils"

const ROOT_BASE =
  "flex items-center gap-1 rounded-lg border border-line bg-background p-1"

const BUTTON_BASE =
  "inline-flex items-center justify-center rounded-sm px-2 py-1 text-sm outline-none focus-visible:ring-1 focus-visible:ring-focus hover:bg-mute disabled:pointer-events-none disabled:opacity-50"

const LINK_BASE =
  "inline-flex items-center justify-center rounded-sm px-2 py-1 text-sm outline-none hover:bg-mute hover:text-foreground"

const SEPARATOR_BASE = "mx-1 h-5 w-px bg-line"

const TOGGLE_GROUP_BASE = "flex items-center gap-1"

const TOGGLE_ITEM_BASE =
  "inline-flex items-center justify-center rounded-sm px-2 py-1 text-sm outline-none focus-visible:ring-1 focus-visible:ring-focus hover:bg-mute data-[state=on]:bg-foreground data-[state=on]:text-background disabled:pointer-events-none disabled:opacity-50"

function Toolbar({
  className,
  ...props
}: ComponentProps<typeof ToolbarPrimitive.Root>) {
  return (
    <ToolbarPrimitive.Root
      className={cx(ROOT_BASE, className)}
      {...props}
    />
  )
}

function ToolbarButton({
  className,
  ...props
}: ComponentProps<typeof ToolbarPrimitive.Button>) {
  return (
    <ToolbarPrimitive.Button
      className={cx(BUTTON_BASE, className)}
      {...props}
    />
  )
}

function ToolbarLink({
  className,
  ...props
}: ComponentProps<typeof ToolbarPrimitive.Link>) {
  return (
    <ToolbarPrimitive.Link
      className={cx(LINK_BASE, className)}
      {...props}
    />
  )
}

function ToolbarSeparator({
  className,
  ...props
}: ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      className={cx(SEPARATOR_BASE, className)}
      {...props}
    />
  )
}

function ToolbarToggleGroup({
  className,
  ...props
}: ComponentProps<typeof ToolbarPrimitive.ToggleGroup>) {
  return (
    <ToolbarPrimitive.ToggleGroup
      className={cx(TOGGLE_GROUP_BASE, className)}
      {...props}
    />
  )
}

function ToolbarToggleItem({
  className,
  ...props
}: ComponentProps<typeof ToolbarPrimitive.ToggleItem>) {
  return (
    <ToolbarPrimitive.ToggleItem
      className={cx(TOGGLE_ITEM_BASE, className)}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
}
