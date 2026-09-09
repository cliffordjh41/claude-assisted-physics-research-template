import { useEffect, useRef } from "react"

// Focus the target element whenever `key` changes. Standard a11y pattern
// for route changes: each navigation should move focus to the new
// content's container so screen-reader users land in the right place and
// keyboard users don't have to tab from the top of the page. Attach the
// returned ref to a focus target (typically the main route container
// with `tabIndex={-1}`).
export function useFocusOnChange<T extends HTMLElement = HTMLElement>(
  key: unknown
) {
  const ref = useRef<T>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [key])
  return ref
}
