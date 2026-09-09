import type { ComponentProps } from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cx } from "../../lib/utils"

const ROOT_BASE =
  "relative flex size-10 shrink-0 overflow-hidden rounded-full bg-mute"

const IMAGE_BASE = "aspect-square size-full"

const FALLBACK_BASE =
  "flex size-full items-center justify-center rounded-full bg-mute text-mute-fg text-sm font-(--theme-font-weight)"

function Avatar({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root className={cx(ROOT_BASE, className)} {...props} />
  )
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image className={cx(IMAGE_BASE, className)} {...props} />
  )
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cx(FALLBACK_BASE, className)}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
