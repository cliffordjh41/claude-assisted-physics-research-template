import type { ComponentProps } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cx } from "../../lib/utils"

const NAV_BASE = "mx-auto flex w-full justify-center"
const CONTENT_BASE = "flex flex-row items-center gap-1"
const LINK_BASE =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm outline-none transition-colors hover:bg-mute hover:text-foreground focus-visible:ring-1 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50"
const LINK_ACTIVE = "border border-line bg-mute text-foreground"
const ELLIPSIS_BASE = "flex h-9 w-9 items-center justify-center text-mute-fg"

function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cx(NAV_BASE, className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cx(CONTENT_BASE, className)} {...props} />
}

function PaginationItem({ ...props }: ComponentProps<"li">) {
  return <li {...props} />
}

interface PaginationLinkProps extends ComponentProps<"a"> {
  isActive?: boolean
}

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cx(LINK_BASE, isActive && LINK_ACTIVE, className)}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: ComponentProps<"a">) {
  return (
    <a
      aria-label="Go to previous page"
      className={cx(LINK_BASE, "gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span>Previous</span>
    </a>
  )
}

function PaginationNext({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      aria-label="Go to next page"
      className={cx(LINK_BASE, "gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="size-4" />
    </a>
  )
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cx(ELLIPSIS_BASE, className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
