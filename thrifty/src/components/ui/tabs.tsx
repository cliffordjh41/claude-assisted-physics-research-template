import type { ComponentProps } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

const ROOT_BASE = "flex flex-col gap-2"
const LIST_BASE =
  "bg-mute text-mute-fg inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"
const TRIGGER_BASE =
  "data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-foreground focus-visible:ring-focus/50 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-(--theme-font-weight) whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-ring focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
const CONTENT_BASE = "flex-1 outline-none"

function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={className ? `${ROOT_BASE} ${className}` : ROOT_BASE}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={className ? `${LIST_BASE} ${className}` : LIST_BASE}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={className ? `${TRIGGER_BASE} ${className}` : TRIGGER_BASE}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={className ? `${CONTENT_BASE} ${className}` : CONTENT_BASE}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
