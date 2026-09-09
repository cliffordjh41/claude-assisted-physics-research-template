import type { ComponentProps, ReactNode } from "react"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { cx } from "../../lib/utils"

const NAV_BASE = "flex"
const LIST_BASE =
  "flex flex-wrap items-center gap-1.5 text-sm text-mute-fg sm:gap-2.5"
const ITEM_BASE = "inline-flex items-center gap-1.5"
const LINK_BASE = "transition-colors hover:text-foreground"
const PAGE_BASE = "font-(--theme-font-weight) text-foreground"
const SEPARATOR_BASE = "[&>svg]:size-3.5"
const ELLIPSIS_BASE = "flex size-9 items-center justify-center"

function Breadcrumb({ ...props }: ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" className={NAV_BASE} {...props} />
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cx(LIST_BASE, className)} {...props} />
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cx(ITEM_BASE, className)} {...props} />
}

function BreadcrumbLink({
  className,
  asChild,
  children,
  ...props
}: ComponentProps<"a"> & { asChild?: boolean }) {
  if (asChild) return <>{children}</>
  return (
    <a className={cx(LINK_BASE, className)} {...props}>
      {children}
    </a>
  )
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cx(PAGE_BASE, className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentProps<"li"> & { children?: ReactNode }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cx(SEPARATOR_BASE, className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cx(ELLIPSIS_BASE, className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
