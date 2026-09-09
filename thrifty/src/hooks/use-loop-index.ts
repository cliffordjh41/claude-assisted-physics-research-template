import { useCallback, useState } from "react"

/**
 * Index state for a horizontal carousel. `prev` / `next` wrap around
 * the count when `loop` is true (default), or clamp at the ends when
 * false. Pairs with any carousel rendering (SlidingPanels, a transform
 * grid, etc.) and chevron buttons placed anywhere.
 *
 *     const { index, prev, next } = useLoopIndex(items.length)
 */
export function useLoopIndex(
  count: number,
  defaultIndex: number = 0,
  loop: boolean = true
) {
  const [index, setIndex] = useState(defaultIndex)

  const prev = useCallback(() => {
    setIndex((i) => (loop ? (i - 1 + count) % count : Math.max(0, i - 1)))
  }, [count, loop])

  const next = useCallback(() => {
    setIndex((i) => (loop ? (i + 1) % count : Math.min(count - 1, i + 1)))
  }, [count, loop])

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return
      const clamped = loop
        ? ((i % count) + count) % count
        : Math.max(0, Math.min(count - 1, i))
      setIndex(clamped)
    },
    [count, loop]
  )

  return { index, setIndex, prev, next, goTo, count }
}
