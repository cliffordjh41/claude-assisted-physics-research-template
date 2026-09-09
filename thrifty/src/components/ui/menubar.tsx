import type { ComponentProps } from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cx } from "../../lib/utils"

const ROOT_BASE =
  "flex h-10 items-center gap-1 rounded-lg border border-line bg-background p-1"

const TRIGGER_BASE =
  "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm outline-none focus:bg-mute focus:text-foreground data-[state=open]:bg-mute data-[state=open]:text-foreground"

const CONTENT_BASE =
  "bg-overlay text-overlay-fg data-[state=open]:animate-content-show data-[state=closed]:animate-content-hide z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-lg border border-line p-1 shadow-md"

const ITEM_BASE =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-mute focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"

const LABEL_BASE = "px-2 py-1.5 text-xs text-mute-fg"
const SEPARATOR_BASE = "-mx-1 my-1 h-px bg-line"
const SHORTCUT_BASE = "ml-auto text-xs tracking-widest text-mute-fg"
const SUB_TRIGGER_BASE =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-mute focus:text-foreground data-[state=open]:bg-mute data-[disabled]:pointer-events-none data-[disabled]:opacity-50"

function Menubar({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      className={cx(ROOT_BASE, className)}
      {...props}
    />
  )
}

function MenubarMenu({
  ...props
}: ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarTrigger({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      className={cx(TRIGGER_BASE, className)}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cx(CONTENT_BASE, className)}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

function MenubarItem({
  className,
  inset,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.Item
      className={cx(ITEM_BASE, inset && "pl-8", className)}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      className={cx(ITEM_BASE, "pl-8", className)}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Check className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      className={cx(ITEM_BASE, "pl-8", className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.Label
      className={cx(LABEL_BASE, inset && "pl-8", className)}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      className={cx(SEPARATOR_BASE, className)}
      {...props}
    />
  )
}

function MenubarShortcut({ className, ...props }: ComponentProps<"span">) {
  return <span className={cx(SHORTCUT_BASE, className)} {...props} />
}

function MenubarSub({ ...props }: ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cx(SUB_TRIGGER_BASE, inset && "pl-8", className)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      className={cx(CONTENT_BASE, className)}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarRadioGroup,
}
