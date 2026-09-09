import { useCallback, useRef, useState } from "react"

export type RovingOrientation = "horizontal" | "vertical" | "both"

interface UseRovingTabindexOptions {
  itemCount: number
  orientation?: RovingOrientation
  loop?: boolean
  defaultIndex?: number
  onIndexChange?: (index: number) => void
}

interface RovingItemProps {
  tabIndex: number
  ref: (el: HTMLElement | null) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onFocus: () => void
}

interface UseRovingTabindexReturn {
  activeIndex: number
  setActiveIndex: (index: number) => void
  getItemProps: (index: number) => RovingItemProps
}

// Roving-tabindex helper. One item in the group is tab-stoppable (tabIndex=0);
// arrow keys move focus across the group without leaving it. Matches the
// APG roving-tabindex pattern for Toolbar / Menu / Tablist / etc.
export function useRovingTabindex(
  options: UseRovingTabindexOptions
): UseRovingTabindexReturn {
  const {
    itemCount,
    orientation = "horizontal",
    loop = true,
    defaultIndex = 0,
    onIndexChange,
  } = options

  const [activeIndex, setActiveIndexState] = useState(defaultIndex)
  const itemsRef = useRef<(HTMLElement | null)[]>([])

  const setActiveIndex = useCallback(
    (index: number) => {
      setActiveIndexState(index)
      onIndexChange?.(index)
    },
    [onIndexChange]
  )

  const focusItem = useCallback(
    (index: number) => {
      const el = itemsRef.current[index]
      if (el) {
        el.focus()
        setActiveIndex(index)
      }
    },
    [setActiveIndex]
  )

  const move = useCallback(
    (delta: number) => {
      if (itemCount === 0) return
      const next = activeIndex + delta
      if (next < 0) {
        focusItem(loop ? itemCount - 1 : 0)
      } else if (next >= itemCount) {
        focusItem(loop ? 0 : itemCount - 1)
      } else {
        focusItem(next)
      }
    },
    [activeIndex, itemCount, loop, focusItem]
  )

  const getItemProps = useCallback(
    (index: number): RovingItemProps => ({
      tabIndex: index === activeIndex ? 0 : -1,
      ref: (el: HTMLElement | null) => {
        itemsRef.current[index] = el
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        const horizontal = orientation === "horizontal" || orientation === "both"
        const vertical = orientation === "vertical" || orientation === "both"
        switch (e.key) {
          case "ArrowRight":
            if (horizontal) {
              e.preventDefault()
              move(1)
            }
            break
          case "ArrowLeft":
            if (horizontal) {
              e.preventDefault()
              move(-1)
            }
            break
          case "ArrowDown":
            if (vertical) {
              e.preventDefault()
              move(1)
            }
            break
          case "ArrowUp":
            if (vertical) {
              e.preventDefault()
              move(-1)
            }
            break
          case "Home":
            e.preventDefault()
            focusItem(0)
            break
          case "End":
            e.preventDefault()
            focusItem(itemCount - 1)
            break
        }
      },
      onFocus: () => setActiveIndex(index),
    }),
    [activeIndex, orientation, move, focusItem, itemCount, setActiveIndex]
  )

  return { activeIndex, setActiveIndex, getItemProps }
}
