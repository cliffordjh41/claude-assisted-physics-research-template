import type { ComponentProps } from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cx } from "../../lib/utils"

const ITEM_BASE = "border-b border-line last:border-b-0"

const TRIGGER_BASE =
  "flex flex-1 items-center justify-between gap-4 py-4 text-sm font-(--theme-font-weight) text-left outline-none transition-colors hover:text-foreground text-mute-fg focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180"

const CHEVRON_BASE =
  "size-4 shrink-0 text-mute-fg transition-transform duration-200"

const CONTENT_BASE =
  "overflow-hidden text-sm data-[state=closed]:animate-overlay-hide data-[state=open]:animate-overlay-show"

const CONTENT_INNER_BASE = "pb-4 pt-0 text-foreground"

function Accordion({ ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root {...props} />
}

function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cx(ITEM_BASE, className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cx(TRIGGER_BASE, className)}
        {...props}
      >
        {children}
        <ChevronDown className={CHEVRON_BASE} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={CONTENT_BASE}
      {...props}
    >
      <div className={cx(CONTENT_INNER_BASE, className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
