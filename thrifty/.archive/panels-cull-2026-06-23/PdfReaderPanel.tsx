
import { useEffect, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"
import { ArrowLeft, FileText, ZoomIn, ZoomOut } from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"

// Bundled worker (Vite resolves the `?url` to an emitted asset) so the
// reader is self-contained — no CDN dependency at runtime.
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

export interface PdfReaderConfig {
  url: string
  title?: string
}

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const ZOOM_STEP = 0.25
const ICON_BTN =
  "size-7 inline-flex items-center justify-center rounded text-mute-fg hover:text-foreground hover:bg-mute/50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
const EMPTY_CLS =
  "m-auto text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg"

export function PdfReaderPanel({
  panelData,
  onBack,
}: PanelProps & { onBack?: () => void }) {
  const config = panelData as unknown as PdfReaderConfig | undefined
  const url = config?.url
  const scrollRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setContainerWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    setNumPages(0)
    setFailed(false)
  }, [url])

  // Fit the page to the container width (minus padding), then scale by zoom.
  const basePageWidth = Math.max(0, containerWidth - 32)
  const pageWidth = basePageWidth > 0 ? basePageWidth * zoom : undefined

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="shrink-0 h-11 border-b border-line flex items-center gap-2 px-2">
        {onBack && (
          <button type="button" onClick={onBack} className={ICON_BTN} title="Back">
            <ArrowLeft className="size-3.5" />
          </button>
        )}
        <FileText className="size-3.5 text-mute-fg shrink-0" />
        <span className="flex-1 min-w-0 truncate text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {config?.title ?? "paper"}
        </span>
        {numPages > 0 && (
          <span className="shrink-0 text-[10px] text-mute-fg tabular-nums">
            {numPages} pp
          </span>
        )}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
            disabled={zoom <= ZOOM_MIN}
            className={ICON_BTN}
            title="Zoom out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
            disabled={zoom >= ZOOM_MAX}
            className={ICON_BTN}
            title="Zoom in"
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-auto flex flex-col items-center gap-4 py-4 bg-mute/20"
      >
        {!url ? (
          <div className={EMPTY_CLS}>No paper selected</div>
        ) : failed ? (
          <div className={EMPTY_CLS}>Could not load paper</div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setFailed(true)}
            loading={<div className={EMPTY_CLS}>Loading…</div>}
            error={<div className={EMPTY_CLS}>Could not load paper</div>}
            className={cx("flex flex-col items-center gap-4")}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={pageWidth}
                className="shadow-sm"
                renderTextLayer
                renderAnnotationLayer
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  )
}
