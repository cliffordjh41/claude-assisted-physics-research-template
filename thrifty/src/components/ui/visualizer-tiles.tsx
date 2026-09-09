import { useEffect, useRef } from "react"
import { cx } from "../../lib/utils"
import { subscribeFrequency } from "../../hooks/use-audio-player"

interface VisualizerTilesProps {
  isPlaying: boolean
  /** Controlled-data path. When omitted (default), the component
   * self-subscribes to the audio module via `subscribeFrequency` and
   * mutates tile opacity by ref — no React re-renders per frame. */
  frequencyData?: number[]
  className?: string
}

const SHADE_COUNT = 12
const BAND_COUNT = 12
const BAND_TOKENS = Array.from({ length: BAND_COUNT }, (_, i) => `var(--visualizer-${i + 1})`)

function VisualizerTiles({ isPlaying, frequencyData, className }: VisualizerTilesProps) {
  const tilesRef = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: BAND_COUNT }, () => new Array(SHADE_COUNT).fill(null))
  )
  // When a controlled frequencyData prop is passed we DON'T self-subscribe
  // (the parent is driving). Otherwise subscribe to the audio module and
  // mutate the tile opacities directly — zero React work per frame.
  const isControlled = !!frequencyData

  // Apply opacities — used by both the subscription callback and the
  // controlled-prop effect below. Pulled out so both code paths share it.
  function applyBands(bands: number[]) {
    for (let b = 0; b < BAND_COUNT; b++) {
      const active = Math.round((bands[b] ?? 0) * SHADE_COUNT)
      const col = tilesRef.current[b]
      for (let s = 0; s < SHADE_COUNT; s++) {
        const tile = col[s]
        if (tile) tile.style.opacity = s < active ? "1" : "0"
      }
    }
  }

  useEffect(() => {
    if (isControlled) return
    const unsubscribe = subscribeFrequency(applyBands)
    return unsubscribe
  }, [isControlled])

  // Controlled path: re-apply whenever the prop changes.
  useEffect(() => {
    if (!isControlled || !frequencyData) return
    applyBands(frequencyData)
  }, [isControlled, frequencyData])

  // When playback stops, zero everything out so the FFT path matches
  // the playback state without waiting for the next frame.
  useEffect(() => {
    if (isPlaying) return
    for (let b = 0; b < BAND_COUNT; b++) {
      const col = tilesRef.current[b]
      for (let s = 0; s < SHADE_COUNT; s++) {
        const tile = col[s]
        if (tile) tile.style.opacity = "0"
      }
    }
  }, [isPlaying])

  return (
    <div className={cx("flex gap-1 px-2 py-2 rounded-md bg-black", className)}>
      {BAND_TOKENS.map((color, bandIndex) => (
        <div key={bandIndex} className="flex-1 flex flex-col-reverse gap-0.5">
          {Array.from({ length: SHADE_COUNT }, (__, shadeLevel) => (
            <div
              key={shadeLevel}
              ref={(el) => {
                tilesRef.current[bandIndex][shadeLevel] = el
              }}
              className="h-3 rounded-sm"
              style={{
                backgroundColor: color,
                mixBlendMode: "screen",
                opacity: 0,
                filter: `brightness(${0.4 + (shadeLevel / (SHADE_COUNT - 1)) * 0.6})`,
                transition: "opacity 0.05s linear",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export { VisualizerTiles }
