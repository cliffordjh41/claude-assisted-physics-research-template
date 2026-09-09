import { useEffect, type ReactNode } from "react"

// Slot chrome the panel draws around its own body when the host doesn't claim
// the slot. Mirrors the host slot dimensions so a panel looks identical whether
// its chrome is hoisted or self-rendered.
const HEADER_SLOT = "shrink-0 h-11 border-b border-line flex items-stretch"
const FOOTER_SLOT = "shrink-0 h-11 border-t border-line flex items-stretch"

export interface PanelChromeArgs {
  onHeader?: (node: ReactNode) => void
  onFooter?: (node: ReactNode) => void
  // Chrome CONTENT only — no slot border/height. The host slot (when hoisting)
  // or this hook (when self-rendering) supplies the surrounding slot.
  header?: ReactNode
  footer?: ReactNode
}

export interface PanelChrome {
  header: ReactNode
  footer: ReactNode
}

// The single mechanism every panel uses for its header/footer chrome.
//
// When the host provides `onHeader`/`onFooter`, the panel hoists that chrome
// into the host's own layout (sheet, dialog, drawer, column). When the host
// provides no callback, the panel renders the chrome inline so it stays
// self-contained dropped into a bare body. A panel with no header/footer passes
// nothing and renders neither, in either mode. This makes every host shape work
// from the same panel: body, header+body, body+footer, header+body+footer.
//
// Pass MEMOIZED nodes (useMemo with the chrome's real dependencies) so the
// hoist effect only re-pushes when the chrome actually changes. Hosts pass
// stable setters, so re-pushing can't loop, but memoizing avoids pushing on
// every unrelated re-render (e.g. a 30fps visualizer tick).
export function usePanelChrome({
  onHeader,
  onFooter,
  header,
  footer,
}: PanelChromeArgs): PanelChrome {
  useEffect(() => {
    if (!onHeader) return
    onHeader(header ?? null)
    return () => onHeader(null)
  }, [onHeader, header])

  useEffect(() => {
    if (!onFooter) return
    onFooter(footer ?? null)
    return () => onFooter(null)
  }, [onFooter, footer])

  return {
    header: !onHeader && header ? <div className={HEADER_SLOT}>{header}</div> : null,
    footer: !onFooter && footer ? <div className={FOOTER_SLOT}>{footer}</div> : null,
  }
}
