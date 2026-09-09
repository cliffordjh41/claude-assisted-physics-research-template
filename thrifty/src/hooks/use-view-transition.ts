import { useCallback } from "react"

// Wraps a DOM update in document.startViewTransition() when supported,
// falling back to a direct call elsewhere. Use it around state updates
// that cause a visible change you want browser-animated (route swaps,
// panel index changes). Browser support: Chromium-based stable; Safari
// 18.2+; Firefox behind a flag at time of writing — the fallback path
// keeps the update working everywhere.
export function useViewTransition() {
  return useCallback((cb: () => void | Promise<void>) => {
    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(() => cb())
    } else {
      void cb()
    }
  }, [])
}
