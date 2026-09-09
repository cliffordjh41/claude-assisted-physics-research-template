import type { ComponentProps } from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { ChevronDown } from "lucide-react"
import { cx } from "../../lib/utils"

const ROOT_BASE =
  "relative z-10 flex max-w-max flex-1 items-center justify-center"
const LIST_BASE =
  "group flex flex-1 list-none items-center justify-center gap-1"
const TRIGGER_BASE =
  "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-sm bg-background px-4 py-2 text-sm font-(--theme-font-weight) outline-none transition-colors hover:bg-mute focus:bg-mute data-[active]:bg-mute/50 data-[state=open]:bg-mute/50"
const CONTENT_BASE =
  "left-0 top-0 w-full data-[motion^=from-]:animate-content-show data-[motion^=to-]:animate-content-hide data-[motion=from-end]:animate-slide-in-right data-[motion=from-start]:animate-slide-in-left data-[motion=to-end]:animate-slide-out-right data-[motion=to-start]:animate-slide-out-left md:absolute md:w-auto"
const VIEWPORT_BASE =
  "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg border border-line bg-overlay text-overlay-fg shadow-md data-[state=open]:animate-content-show data-[state=closed]:animate-content-hide md:w-(--radix-navigation-menu-viewport-width)"
const INDICATOR_BASE =
  "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-overlay-show data-[state=hidden]:animate-overlay-hide"
const LINK_BASE =
  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-mute hover:text-foreground focus:bg-mute focus:text-foreground"

function NavigationMenu({
  className,
  children,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      className={cx(ROOT_BASE, className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cx(LIST_BASE, className)}
      {...props}
    />
  )
}

function NavigationMenuItem({
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return <NavigationMenuPrimitive.Item {...props} />
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cx(TRIGGER_BASE, "group", className)}
      {...props}
    >
      {children}
      <ChevronDown
        className="relative top-[1px] ml-1 size-3 transition duration-200 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cx(CONTENT_BASE, className)}
      {...props}
    />
  )
}

function NavigationMenuLink({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      className={cx(LINK_BASE, className)}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full flex justify-center">
      <NavigationMenuPrimitive.Viewport
        className={cx(VIEWPORT_BASE, className)}
        {...props}
      />
    </div>
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cx(INDICATOR_BASE, className)}
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-line shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
