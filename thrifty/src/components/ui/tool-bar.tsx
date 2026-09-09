import type { ComponentType } from "react"
import {
  RotateCw,
  ArrowRightLeft,
  ArrowLeftRight,
  PanelLeftClose,
  Columns2,
  PanelRightClose,
  ArrowLeftFromLine,
  EyeOff,
  ArrowRightFromLine,
} from "lucide-react"
import { cx } from "../../lib/utils"
import { COLUMN_WIDTH as SIDEBAR_WIDTH } from "./slidable-column"
import { useRovingTabindex } from "../../hooks/use-roving-tabindex"

// Desktop column-position controls for a pair of SlidableColumns: reset / swap /
// flip, align left / center / right, hide left / both / right.
//
// This is a real APG Toolbar (https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/):
// role="toolbar" + an accessible label, one tab stop into the group, and arrow /
// Home / End roving among the controls (via useRovingTabindex). It does ONE
// thing — it does not know about mobile. A mobile bottom bar is a different
// surface; compose a `BottomBar` in the host and choose per breakpoint there.

interface ColumnToolBarProps {
  leftOffset: number
  rightOffset: number
  setLeftOffset: (offset: number) => void
  setRightOffset: (offset: number) => void
  swapped: boolean
  setSwapped: (swapped: boolean) => void
  leftHidden: boolean
  setLeftHidden: (hidden: boolean) => void
  rightHidden: boolean
  setRightHidden: (hidden: boolean) => void
  /** Accessible name for the toolbar. Defaults to "Column controls". */
  label?: string
}

const btnBase = "flex items-center justify-center p-1.5 transition-colors"

function btnClass(active = false) {
  return cx(btnBase, active ? "bg-mute text-foreground" : "text-mute-fg hover:text-foreground hover:bg-mute/50")
}

interface ToolbarItem {
  title: string
  Icon: ComponentType<{ className?: string }>
  onClick: () => void
  active?: boolean
  toggle?: boolean
}

export function ColumnToolBar({
  leftOffset,
  rightOffset,
  setLeftOffset,
  setRightOffset,
  swapped,
  setSwapped,
  leftHidden,
  setLeftHidden,
  rightHidden,
  setRightHidden,
  label = "Column controls",
}: ColumnToolBarProps) {
  const reset = () => {
    setLeftOffset(0)
    setRightOffset(0)
    setSwapped(false)
    setLeftHidden(false)
    setRightHidden(false)
  }

  const swap = () => {
    const vw = window.innerWidth
    if (swapped) {
      setLeftOffset(0)
      setRightOffset(0)
      setSwapped(false)
    } else {
      setLeftOffset(vw - SIDEBAR_WIDTH)
      setRightOffset(-(vw - SIDEBAR_WIDTH))
      setSwapped(true)
    }
  }

  const flip = () => {
    const vw = window.innerWidth
    const rightAbsX = vw - SIDEBAR_WIDTH + rightOffset
    setLeftOffset(rightAbsX)
    setRightOffset(leftOffset - (vw - SIDEBAR_WIDTH))
    setSwapped(!swapped)
  }

  // Alignment always uses natural-side math (left column on viewport left, right
  // on viewport right). If columns were dragged into a crossed-over position,
  // alignment restores them to natural sides at the requested alignment.
  const alignLeft = () => {
    const vw = window.innerWidth
    setLeftOffset(0)
    setRightOffset(-(vw - SIDEBAR_WIDTH * 2))
  }

  const alignCenter = () => {
    const vw = window.innerWidth
    setLeftOffset(vw / 2 - SIDEBAR_WIDTH)
    setRightOffset(-(vw / 2) + SIDEBAR_WIDTH)
  }

  const alignRight = () => {
    const vw = window.innerWidth
    setLeftOffset(vw - SIDEBAR_WIDTH * 2)
    setRightOffset(0)
  }

  // Flat control order = arrow-key roving order. Grouped visually below.
  const items: ToolbarItem[] = [
    { title: "Reset positions", Icon: RotateCw, onClick: reset },
    { title: "Swap sidebars", Icon: ArrowRightLeft, onClick: swap },
    { title: "Flip sidebars", Icon: ArrowLeftRight, onClick: flip },
    { title: "Align left", Icon: PanelLeftClose, onClick: alignLeft },
    { title: "Center", Icon: Columns2, onClick: alignCenter },
    { title: "Align right", Icon: PanelRightClose, onClick: alignRight },
    {
      title: leftHidden ? "Show left" : "Hide left",
      Icon: ArrowLeftFromLine,
      onClick: () => setLeftHidden(!leftHidden),
      active: leftHidden,
      toggle: true,
    },
    {
      title: leftHidden && rightHidden ? "Show both" : "Hide both",
      Icon: EyeOff,
      onClick: () => {
        const bothHidden = leftHidden && rightHidden
        setLeftHidden(!bothHidden)
        setRightHidden(!bothHidden)
      },
      active: leftHidden && rightHidden,
      toggle: true,
    },
    {
      title: rightHidden ? "Show right" : "Hide right",
      Icon: ArrowRightFromLine,
      onClick: () => setRightHidden(!rightHidden),
      active: rightHidden,
      toggle: true,
    },
  ]

  const roving = useRovingTabindex({
    itemCount: items.length,
    orientation: "horizontal",
    loop: true,
  })

  const renderBtn = (i: number) => {
    const item = items[i]
    const { Icon } = item
    return (
      <button
        {...roving.getItemProps(i)}
        type="button"
        onClick={item.onClick}
        title={item.title}
        aria-label={item.title}
        aria-pressed={item.toggle ? item.active : undefined}
        className={btnClass(item.active)}
      >
        <Icon className="h-3.5 w-3.5" />
      </button>
    )
  }

  const Sep = () => <div role="separator" aria-orientation="vertical" className="w-px bg-line" />

  return (
    <div
      role="toolbar"
      aria-label={label}
      className="absolute bottom-0 left-0 right-0 h-8 bg-background border-t border-line flex items-center justify-center z-30"
    >
      <div className="flex h-7 gap-3">
        <div className="flex">
          {renderBtn(0)}
          <Sep />
          {renderBtn(1)}
          <Sep />
          {renderBtn(2)}
        </div>
        <div className="flex">
          {renderBtn(3)}
          <Sep />
          {renderBtn(4)}
          <Sep />
          {renderBtn(5)}
        </div>
        <div className="flex">
          {renderBtn(6)}
          <Sep />
          {renderBtn(7)}
          <Sep />
          {renderBtn(8)}
        </div>
      </div>
    </div>
  )
}
