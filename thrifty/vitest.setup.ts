// jsdom doesn't implement a few browser APIs that Radix primitives touch
// (size measurement, pointer capture, scrolling). Stub them so components
// mount in tests; none affect the a11y structure axe inspects.

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver =
  globalThis.ResizeObserver ?? (ResizeObserverStub as unknown as typeof ResizeObserver)

const elementProto = Element.prototype as unknown as Record<string, unknown>
elementProto.hasPointerCapture = () => false
elementProto.setPointerCapture = () => {}
elementProto.releasePointerCapture = () => {}
elementProto.scrollIntoView = () => {}

window.matchMedia =
  window.matchMedia ||
  (((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia)
