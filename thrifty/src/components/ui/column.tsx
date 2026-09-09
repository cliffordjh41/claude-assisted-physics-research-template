import * as React from "react"
import { cx } from "../../lib/utils"

// A static, in-flow column: a vertical Header / Content / Footer layout on
// the column theme surface. Unlike a positioned app shell, Column has no
// side, offset, drag, or show/hide behavior — it sizes to its container and
// is composed wherever the surrounding layout needs a column. Set width and
// height via className/style.

interface ColumnProps extends React.ComponentProps<"div"> {}

function Column({ className, children, ...props }: ColumnProps) {
  return (
    <div
      className={cx(
        "flex flex-col bg-column text-column-foreground border-column-line",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ColumnHeaderProps extends React.ComponentProps<"div"> {}

function ColumnHeader({ className, children, ...props }: ColumnHeaderProps) {
  return (
    <div
      className={cx("flex-shrink-0 border-b border-column-line p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface ColumnContentProps extends React.ComponentProps<"div"> {}

function ColumnContent({ className, children, ...props }: ColumnContentProps) {
  return (
    <div
      className={cx("flex-1 overflow-y-auto p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface ColumnFooterProps extends React.ComponentProps<"div"> {}

function ColumnFooter({ className, children, ...props }: ColumnFooterProps) {
  return (
    <div
      className={cx("flex-shrink-0 border-t border-column-line p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Column, ColumnHeader, ColumnContent, ColumnFooter }
export type { ColumnProps }
