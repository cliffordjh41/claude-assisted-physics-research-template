import { useState } from "react"
import type { PanelProps } from "../../types/panel"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { VisuallyHidden } from "../ui/visually-hidden"

export interface GalleryImage {
  src: string
  alt: string
}

export interface GalleryConfig {
  images: GalleryImage[]
}

// Self-contained sample images so the panel demos with zero config (like
// Feed/Library). These are inline SVG data-URIs — no binary assets shipped,
// no network — and a consumer overrides them by passing its own `images`.
function sampleImage(n: number, from: string, to: string): GalleryImage {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/>` +
    `</linearGradient></defs>` +
    `<rect width='600' height='600' fill='url(#g)'/>` +
    `<text x='300' y='300' fill='rgba(255,255,255,0.9)' font-family='system-ui,sans-serif' ` +
    `font-size='160' font-weight='600' text-anchor='middle' dominant-baseline='central'>${n}</text>` +
    `</svg>`
  return { src: `data:image/svg+xml,${encodeURIComponent(svg)}`, alt: `Sample image ${n}` }
}

const defaultConfig: GalleryConfig = {
  images: [
    sampleImage(1, "#6366f1", "#a855f7"),
    sampleImage(2, "#10b981", "#14b8a6"),
    sampleImage(3, "#f59e0b", "#f43f5e"),
    sampleImage(4, "#0ea5e9", "#06b6d4"),
  ],
}

export function GalleryPanel({ panelData }: PanelProps) {
  const config = (panelData as unknown as GalleryConfig | undefined) ?? defaultConfig
  const images = config.images ?? defaultConfig.images
  const [active, setActive] = useState<GalleryImage | null>(null)

  return (
    <div className="@container w-full h-full overflow-y-auto p-4 [scrollbar-gutter:stable_both-edges]">
      {images.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <span className="text-[10px] text-mute-fg uppercase tracking-(--theme-letter-spacing)">
            No images yet
          </span>
        </div>
      ) : (
        /* Thumbnail grid — three sizes by the PANEL's width (container
           queries, not viewport): 4 cols wide, 2 mid, 1 narrow (stacked). */
        <div className="grid grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-4 gap-2">
          {images.map((img) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(img)}
              className="group block aspect-square overflow-hidden rounded-lg border border-line bg-mute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox — the image re-rendered large; click/tap the image or the
          backdrop (anywhere around it) to dismiss. */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        {active && (
          <DialogContent
            showCloseButton={false}
            onClick={() => setActive(null)}
            aria-describedby={undefined}
            className="!bg-transparent !border-0 !p-0 !shadow-none !rounded-none !w-auto !max-w-[92vw] sm:!max-w-[92vw] !gap-0 cursor-zoom-out"
          >
            <VisuallyHidden>
              <DialogTitle>{active.alt}</DialogTitle>
            </VisuallyHidden>
            <img
              src={active.src}
              alt={active.alt}
              className="h-auto max-h-[88dvh] w-auto max-w-[92vw] object-contain rounded-lg shadow-2xl"
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
