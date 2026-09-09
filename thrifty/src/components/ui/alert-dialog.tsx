import type { ComponentProps } from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { buttonVariants } from "./button"

const OVERLAY_BASE =
  "data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide fixed inset-0 z-50 bg-scrim/50 backdrop-blur-sm"

const CONTENT_BASE =
  "bg-background data-[state=open]:animate-content-show data-[state=closed]:animate-content-hide fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-auto translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-line p-6 shadow-lg duration-200 sm:max-w-lg"

const HEADER_BASE = "flex flex-col gap-2 text-center sm:text-left"
const FOOTER_BASE = "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
const TITLE_BASE = "text-lg text-balance font-(--theme-font-weight)"
const DESCRIPTION_BASE = "text-mute-fg text-sm"

function AlertDialog({
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root {...props} />
}

function AlertDialogTrigger({
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger {...props} />
}

function AlertDialogPortal({
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal {...props} />
}

function AlertDialogOverlay({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={className ? `${OVERLAY_BASE} ${className}` : OVERLAY_BASE}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={className ? `${CONTENT_BASE} ${className}` : CONTENT_BASE}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={className ? `${HEADER_BASE} ${className}` : HEADER_BASE} {...props} />
  )
}

function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={className ? `${FOOTER_BASE} ${className}` : FOOTER_BASE} {...props} />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={className ? `${TITLE_BASE} ${className}` : TITLE_BASE}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={className ? `${DESCRIPTION_BASE} ${className}` : DESCRIPTION_BASE}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Action>) {
  const base = buttonVariants()
  return (
    <AlertDialogPrimitive.Action
      className={className ? `${base} ${className}` : base}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  const base = buttonVariants({ variant: "outline" })
  return (
    <AlertDialogPrimitive.Cancel
      className={className ? `${base} ${className}` : base}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
