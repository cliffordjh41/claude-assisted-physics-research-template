import { useCallback, useEffect, useSyncExternalStore } from "react"

// Single, module-scoped audio engine. Outlives any React mount so
// playback survives sheet/drawer close + remount cycles. Multiple
// useAudioPlayer subscribers across the tree see the same state and
// drive the same `<audio>` element.

const BAND_COUNT = 12
const BAND_EDGES = [1, 2, 4, 8, 15, 30, 55, 100, 180, 320, 560, 1024]

export interface UseAudioPlayerReturn {
  isPlaying: boolean
  currentTime: number
  duration: number
  frequencyData: number[]
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
}

interface AudioState {
  src: string
  isPlaying: boolean
  currentTime: number
  duration: number
  frequencyData: number[]
}

let audioEl: HTMLAudioElement | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let mediaSource: MediaElementAudioSourceNode | null = null
let dataArray: Uint8Array<ArrayBuffer> | null = null
let rafId: number | null = null
let lastFrameTime = 0
// Handle ref doubles as the install flag — non-null means installed.
// Kept here so HMR dispose can `removeEventListener` against the exact
// listener identity (otherwise saves accumulate one ghost listener per).
let visibilityHandler: (() => void) | null = null
// Throttle the frequency-data publication to ~30fps. At 60fps the
// `setState({ frequencyData })` call notifies every subscriber (visualizer
// + music player UI + …) which triggers React reconciliation per frame —
// expensive on low-end mobile. Halving the rate is invisible to the eye
// for a band-bar visualizer and slashes work for every subscriber.
const FRAME_INTERVAL_MS = 1000 / 30
// All currently-mounted consumers' onEnded callbacks. The audio element
// is a singleton but multiple panels can mount against it (e.g. a host
// mounting MusicPlayerPanel in both a desktop drawer and a mobile sheet);
// each needs its own track-advance side-effect to fire, not just the last
// one to register.
const endedCallbacks = new Set<() => void>()

let state: AudioState = {
  src: "",
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  frequencyData: new Array(BAND_COUNT).fill(0),
}

const listeners = new Set<() => void>()
// Ref-mutation subscribers — bypass React state to avoid the
// re-reconciliation cost of publishing 12 numbers via setState 30× per
// second. Consumers (typically a visualizer) get the latest bands as a
// callback and mutate DOM directly. The snapshot's `frequencyData` is
// retained for non-perf-critical consumers but is no longer updated on
// every frame; only on play / pause / ended boundaries.
const frequencyListeners = new Set<(bands: number[]) => void>()

export function subscribeFrequency(cb: (bands: number[]) => void): () => void {
  frequencyListeners.add(cb)
  return () => {
    frequencyListeners.delete(cb)
  }
}

function notify() {
  for (const fn of listeners) fn()
}

function setState(patch: Partial<AudioState>) {
  state = { ...state, ...patch }
  notify()
}

function readFrequencyData(now?: number) {
  if (!analyser || !dataArray) return
  const t = now ?? performance.now()
  if (t - lastFrameTime < FRAME_INTERVAL_MS) {
    rafId = requestAnimationFrame(readFrequencyData)
    return
  }
  lastFrameTime = t
  analyser.getByteFrequencyData(dataArray)
  const bands: number[] = []
  let start = 0
  for (const end of BAND_EDGES) {
    let sum = 0
    const count = end - start
    for (let i = start; i < end && i < dataArray.length; i++) {
      sum += dataArray[i]
    }
    bands.push(count > 0 ? sum / count / 255 : 0)
    start = end
  }
  // Direct callback to ref-mutating subscribers; bypasses React.
  for (const fn of frequencyListeners) fn(bands)
  rafId = requestAnimationFrame(readFrequencyData)
}

function ensureAudio(src: string) {
  if (!audioEl) {
    const el = new Audio(src)
    el.preload = "metadata"
    el.addEventListener("loadedmetadata", () => setState({ duration: el.duration }))
    el.addEventListener("timeupdate", () => setState({ currentTime: el.currentTime }))
    el.addEventListener("ended", () => {
      setState({ isPlaying: false, frequencyData: new Array(BAND_COUNT).fill(0) })
      for (const cb of endedCallbacks) cb()
    })
    audioEl = el
    state = { ...state, src }
    installVisibilityListener()
    return
  }
  if (state.src !== src) {
    audioEl.pause()
    audioEl.src = src
    setState({ src, isPlaying: false, currentTime: 0, duration: 0 })
  }
}

// iOS Safari aggressively suspends AudioContext when the tab backgrounds
// or the device locks. On return-to-foreground, resume the context and
// restart playback if we were playing — otherwise the user has to tap
// play even though the visible state still reads "playing."
function installVisibilityListener() {
  if (visibilityHandler) return
  visibilityHandler = () => {
    if (document.hidden) return
    if (!state.isPlaying || !audioEl) return
    if (audioContext?.state === "suspended") {
      void audioContext.resume().catch(() => {
        // Resume can reject if no user gesture has primed the context
        // yet; flag the visible state to match reality so the next tap
        // re-plays.
        setState({ isPlaying: false })
      })
    }
    void audioEl.play().catch(() => {
      setState({ isPlaying: false })
    })
  }
  document.addEventListener("visibilitychange", visibilityHandler)
}

function initContext() {
  if (audioContext || !audioEl) return
  const ctx = new AudioContext()
  const node = ctx.createAnalyser()
  node.fftSize = 2048
  node.smoothingTimeConstant = 0.8
  const source = ctx.createMediaElementSource(audioEl)
  source.connect(node)
  node.connect(ctx.destination)
  audioContext = ctx
  analyser = node
  mediaSource = source
  dataArray = new Uint8Array(node.frequencyBinCount)
}

function playInternal() {
  // Guard empty src: `new Audio("")` leaves the element with no loadable
  // media, and `play()` then rejects with NotSupportedError. The play
  // promise is also caught below so a rejection (autoplay policy, network)
  // doesn't escape as an uncaught rejection and so the UI flips back to
  // paused instead of getting stuck on "Now Playing."
  if (!audioEl || !state.src) return
  initContext()
  if (audioContext?.state === "suspended") audioContext.resume()
  setState({ isPlaying: true })
  void audioEl.play().catch(() => {
    setState({ isPlaying: false })
  })
  if (rafId === null) rafId = requestAnimationFrame(readFrequencyData)
}

function pauseInternal() {
  if (!audioEl) return
  audioEl.pause()
  setState({ isPlaying: false })
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function seekInternal(time: number) {
  if (!audioEl) return
  audioEl.currentTime = time
  setState({ currentTime: time })
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function getSnapshot(): AudioState {
  return state
}

// mediaSource ref retained so the Web Audio chain stays connected.
void mediaSource

export function useAudioPlayer(src: string, options?: { onEnded?: () => void }): UseAudioPlayerReturn {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useEffect(() => {
    ensureAudio(src)
  }, [src])

  useEffect(() => {
    const cb = options?.onEnded
    if (!cb) return
    endedCallbacks.add(cb)
    return () => {
      endedCallbacks.delete(cb)
    }
  }, [options?.onEnded])

  const play = useCallback(() => playInternal(), [])
  const pause = useCallback(() => pauseInternal(), [])
  const toggle = useCallback(() => {
    if (state.isPlaying) pauseInternal()
    else playInternal()
  }, [])
  const seek = useCallback((time: number) => seekInternal(time), [])

  return {
    isPlaying: snapshot.isPlaying,
    currentTime: snapshot.currentTime,
    duration: snapshot.duration,
    frequencyData: snapshot.frequencyData,
    play,
    pause,
    toggle,
    seek,
  }
}

// Vite HMR teardown. Without this, every save during dev that hot-replaces
// this module leaves the OLD audio element + AudioContext + rAF loop +
// visibilitychange listener alive (they're referenced by their own event
// handlers and by `document`), while the new module instance starts with
// all module-scope state fresh. Symptoms: track keeps playing after edit,
// two streams layered, visibility listeners accumulate per save.
// Narrow shim around `import.meta.hot` so this file type-checks without
// pulling in all of vite/client's ambient types (see assets.d.ts for the
// same self-contained approach).
const hot = (import.meta as ImportMeta & {
  hot?: { dispose: (cb: () => void) => void }
}).hot
hot?.dispose(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (visibilityHandler) {
    document.removeEventListener("visibilitychange", visibilityHandler)
    visibilityHandler = null
  }
  if (audioEl) {
    audioEl.pause()
    audioEl.src = ""
    audioEl.load()
    audioEl = null
  }
  void audioContext?.close()
  audioContext = null
  analyser = null
  mediaSource = null
  dataArray = null
  listeners.clear()
  frequencyListeners.clear()
  endedCallbacks.clear()
})
