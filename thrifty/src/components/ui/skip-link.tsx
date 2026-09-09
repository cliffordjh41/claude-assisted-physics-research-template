import type { ComponentProps } from "react"
import { cx } from "../../lib/utils"

const BASE =
  "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-(--theme-font-weight) focus:text-foreground focus:outline-none focus:ring-2 focus:ring-focus"

function SkipLink({ className, ...props }: ComponentProps<"a">) {
  return <a className={cx(BASE, className)} {...props} />
}

export { SkipLink }
