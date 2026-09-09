import * as React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"
import { cx } from "../../lib/utils"

// Accessible tree view — implements the APG Treeview pattern
// (https://www.w3.org/WAI/ARIA/apg/patterns/treeview/): role="tree" with
// role="treeitem" rows and role="group" subtrees, aria-expanded on parents,
// optional aria-selected, one tab stop into the tree, and arrow / Home / End /
// Enter / Space keyboard navigation via roving tabindex. Collapsed subtrees are
// unmounted, so every rendered treeitem is a visible node — DOM order is the
// navigation order.

const DepthContext = createContext(0)

const TreeRootContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null)

interface TreeProps {
  children: React.ReactNode
  className?: string
  /** Accessible name for the tree. */
  label?: string
}

function Tree({ children, className, label }: TreeProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  // Make the first treeitem the initial tab stop so the tree takes one stop in
  // the tab sequence; arrow keys move focus from there.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!root.querySelector('[role="treeitem"][tabindex="0"]')) {
      const first = root.querySelector<HTMLElement>('[role="treeitem"]')
      if (first) first.tabIndex = 0
    }
  })

  return (
    <TreeRootContext.Provider value={rootRef}>
      <div ref={rootRef} role="tree" aria-label={label} className={cx("py-1", className)}>
        {children}
      </div>
    </TreeRootContext.Provider>
  )
}

interface TreeItemProps {
  // A component that renders an icon (lucide-react icons, or any component
  // taking className). Deliberately NOT React.ElementType: that unions over
  // every intrinsic JSX element, and a consumer whose program augments
  // JSX.IntrinsicElements (e.g. react-three-fiber) collapses the rendered
  // className prop to `never`. A ComponentType slot is immune to that.
  icon: React.ComponentType<{ className?: string }>
  label: string
  children?: React.ReactNode
  defaultOpen?: boolean
  onSelect?: () => void
  selected?: boolean
}

function TreeItem({ icon: Icon, label, children, defaultOpen = true, onSelect, selected }: TreeItemProps) {
  const depth = useContext(DepthContext)
  const rootRef = useContext(TreeRootContext)
  const hasChildren = !!children
  const [open, setOpen] = useState(defaultOpen)
  const rowRef = useRef<HTMLDivElement>(null)

  const visibleItems = () =>
    rootRef?.current
      ? Array.from(rootRef.current.querySelectorAll<HTMLElement>('[role="treeitem"]'))
      : []

  // Move the single tab stop (tabIndex 0) to `el` and focus it.
  const focusItem = (el: HTMLElement) => {
    for (const node of visibleItems()) node.tabIndex = -1
    el.tabIndex = 0
    el.focus()
  }

  const focusByOffset = (delta: number) => {
    const all = visibleItems()
    const i = all.indexOf(rowRef.current as HTMLElement)
    const next = all[i + delta]
    if (next) focusItem(next)
  }

  const activate = () => {
    if (hasChildren) setOpen((o) => !o)
    else onSelect?.()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        focusByOffset(1)
        break
      case "ArrowUp":
        e.preventDefault()
        focusByOffset(-1)
        break
      case "Home": {
        e.preventDefault()
        const all = visibleItems()
        if (all[0]) focusItem(all[0])
        break
      }
      case "End": {
        e.preventDefault()
        const all = visibleItems()
        if (all[all.length - 1]) focusItem(all[all.length - 1])
        break
      }
      case "ArrowRight":
        e.preventDefault()
        if (hasChildren) {
          if (!open) setOpen(true)
          else focusByOffset(1)
        }
        break
      case "ArrowLeft": {
        e.preventDefault()
        if (hasChildren && open) {
          setOpen(false)
          break
        }
        // Otherwise move focus to the parent (nearest preceding shallower row).
        const all = visibleItems()
        const i = all.indexOf(rowRef.current as HTMLElement)
        for (let j = i - 1; j >= 0; j--) {
          if (Number(all[j].dataset.depth) < depth) {
            focusItem(all[j])
            break
          }
        }
        break
      }
      case "Enter":
      case " ":
        e.preventDefault()
        activate()
        break
    }
  }

  return (
    <>
      <div
        ref={rowRef}
        role="treeitem"
        tabIndex={-1}
        data-depth={depth}
        aria-expanded={hasChildren ? open : undefined}
        aria-selected={selected !== undefined ? selected : undefined}
        onClick={activate}
        onKeyDown={onKeyDown}
        className={cx(
          "w-full flex items-center gap-1.5 py-1 outline-none transition-colors cursor-pointer",
          "focus-visible:ring-1 focus-visible:ring-focus",
          selected
            ? "text-foreground bg-mute/30"
            : "text-mute-fg hover:text-foreground hover:bg-mute/50"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          <ChevronRight
            aria-hidden
            className={cx(
              "h-3 w-3 shrink-0 transition-transform text-mute-fg/50",
              open && "rotate-90"
            )}
          />
        ) : (
          <span className="w-3" aria-hidden />
        )}
        <Icon className="h-3 w-3 shrink-0 text-mute-fg/70" />
        <span className="text-[10px] truncate">{label}</span>
      </div>
      {hasChildren && open && (
        <div role="group">
          <DepthContext.Provider value={depth + 1}>{children}</DepthContext.Provider>
        </div>
      )}
    </>
  )
}

export { Tree, TreeItem }
