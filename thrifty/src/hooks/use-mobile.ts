import * as React from "react"

// Mobile-chrome detection: viewport ≤ 1024px. Width-only (no pointer
// check) so desktop testing-by-narrowing still triggers mobile chrome.
// Threshold raised from the original 768px so phones in landscape
// (iPhone Pro Max ≈ 932px) stay on mobile chrome instead of flipping
// to desktop layout. iPad portrait (820px) gets mobile too — column
// layout is cramped at that width anyway; iPad landscape (≥1180) gets
// desktop. matchMedia fires on the breakpoint transition itself,
// covering resize AND orientationchange with one listener.
const MOBILE_MEDIA_QUERY = "(max-width: 1024px)"

export function useIsMobile() {
  // Read the query synchronously for the initial render so the first paint
  // already reflects the real viewport. Deferring this to the effect made
  // the first frame render desktop (isMobile === false), then correct to
  // mobile once the effect ran — visible as the columns sliding out of view
  // on load. SSR-guarded since thrifty ships to consumers that may render
  // on the server (window absent → assume desktop, corrected on mount).
  const [isMobile, setIsMobile] = React.useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_MEDIA_QUERY).matches,
  )

  React.useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener("change", onChange)
    setIsMobile(mq.matches)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
