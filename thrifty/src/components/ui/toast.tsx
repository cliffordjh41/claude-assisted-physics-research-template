import type { ComponentProps } from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { XIcon } from "lucide-react"

const VIEWPORT_BASE =
  "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px] outline-none"

const ROOT_BASE =
  "bg-overlay text-overlay-fg border-line group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg transition-all data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right data-[swipe=end]:animate-slide-out-right"

const TITLE_BASE = "text-sm font-(--theme-font-weight)"
const DESCRIPTION_BASE = "text-mute-fg text-xs opacity-90"

const ACTION_BASE =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-line bg-transparent px-3 text-xs font-(--theme-font-weight) transition-colors hover:bg-mute focus-visible:border-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"

const CLOSE_BASE =
  "text-mute-fg/50 hover:text-foreground absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none group-hover:opacity-100"

function ToastProvider({
  ...props
}: ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastViewport({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      className={className ? `${VIEWPORT_BASE} ${className}` : VIEWPORT_BASE}
      {...props}
    />
  )
}

function Toast({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Root>) {
  return (
    <ToastPrimitive.Root
      className={className ? `${ROOT_BASE} ${className}` : ROOT_BASE}
      {...props}
    />
  )
}

function ToastTitle({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      className={className ? `${TITLE_BASE} ${className}` : TITLE_BASE}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      className={className ? `${DESCRIPTION_BASE} ${className}` : DESCRIPTION_BASE}
      {...props}
    />
  )
}

function ToastAction({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      className={className ? `${ACTION_BASE} ${className}` : ACTION_BASE}
      {...props}
    />
  )
}

function ToastClose({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      className={className ? `${CLOSE_BASE} ${className}` : CLOSE_BASE}
      toast-close=""
      {...props}
    >
      <XIcon className="size-3.5" />
    </ToastPrimitive.Close>
  )
}

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
}
