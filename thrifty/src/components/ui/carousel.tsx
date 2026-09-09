import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cx } from "../../lib/utils"

type Orientation = "horizontal" | "vertical"

interface CarouselContextValue {
  orientation: Orientation
  scrollerRef: React.RefObject<HTMLDivElement | null>
  itemCount: number
  setItemCount: (n: number) => void
  activeIndex: number
  scrollTo: (index: number) => void
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const ctx = useContext(CarouselContext)
  if (!ctx) throw new Error("Carousel components must be used inside <Carousel>")
  return ctx
}

interface CarouselProps extends ComponentProps<"div"> {
  orientation?: Orientation
  loop?: boolean
  /** Auto-advance interval in ms. 0 disables. */
  autoplay?: number
}

const ROOT_BASE = "relative"
const CONTENT_BASE_H =
  "flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
const CONTENT_BASE_V =
  "flex flex-col snap-y snap-mandatory overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
const ITEM_BASE_H = "min-w-0 shrink-0 grow-0 basis-full snap-start"
const ITEM_BASE_V = "min-h-0 shrink-0 grow-0 basis-full snap-start"
const BUTTON_BASE =
  "inline-flex size-9 items-center justify-center rounded-full border border-line bg-background outline-none transition-colors hover:bg-mute focus-visible:ring-1 focus-visible:ring-focus disabled:opacity-50"

function Carousel({
  className,
  orientation = "horizontal",
  loop = false,
  autoplay = 0,
  children,
  ...props
}: CarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [itemCount, setItemCount] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    if (orientation === "horizontal") {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setActiveIndex(idx)
      setCanScrollPrev(el.scrollLeft > 0)
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    } else {
      const idx = Math.round(el.scrollTop / el.clientHeight)
      setActiveIndex(idx)
      setCanScrollPrev(el.scrollTop > 0)
      setCanScrollNext(el.scrollTop + el.clientHeight < el.scrollHeight - 1)
    }
  }, [orientation])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    return () => el.removeEventListener("scroll", updateScrollState)
  }, [updateScrollState, itemCount])

  const scrollTo = useCallback(
    (index: number) => {
      const el = scrollerRef.current
      if (!el) return
      if (orientation === "horizontal") {
        el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" })
      } else {
        el.scrollTo({ top: index * el.clientHeight, behavior: "smooth" })
      }
    },
    [orientation]
  )

  const scrollPrev = useCallback(() => {
    const target = activeIndex - 1
    if (target < 0) {
      if (loop) scrollTo(itemCount - 1)
      return
    }
    scrollTo(target)
  }, [activeIndex, itemCount, loop, scrollTo])

  const scrollNext = useCallback(() => {
    const target = activeIndex + 1
    if (target >= itemCount) {
      if (loop) scrollTo(0)
      return
    }
    scrollTo(target)
  }, [activeIndex, itemCount, loop, scrollTo])

  useEffect(() => {
    if (!autoplay || itemCount < 2) return
    const id = window.setInterval(scrollNext, autoplay)
    return () => window.clearInterval(id)
  }, [autoplay, itemCount, scrollNext])

  const value: CarouselContextValue = {
    orientation,
    scrollerRef,
    itemCount,
    setItemCount,
    activeIndex,
    scrollTo,
    scrollPrev,
    scrollNext,
    canScrollPrev: loop ? itemCount > 1 : canScrollPrev,
    canScrollNext: loop ? itemCount > 1 : canScrollNext,
  }

  return (
    <CarouselContext.Provider value={value}>
      <div
        role="region"
        aria-roledescription="carousel"
        className={cx(ROOT_BASE, className)}
        onKeyDown={(e) => {
          if (orientation === "horizontal") {
            if (e.key === "ArrowLeft") {
              e.preventDefault()
              scrollPrev()
            } else if (e.key === "ArrowRight") {
              e.preventDefault()
              scrollNext()
            }
          } else {
            if (e.key === "ArrowUp") {
              e.preventDefault()
              scrollPrev()
            } else if (e.key === "ArrowDown") {
              e.preventDefault()
              scrollNext()
            }
          }
        }}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, children, ...props }: ComponentProps<"div"> & { children?: ReactNode }) {
  const { orientation, scrollerRef, setItemCount } = useCarousel()
  const base = orientation === "horizontal" ? CONTENT_BASE_H : CONTENT_BASE_V

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    setItemCount(el.children.length)
  }, [children, scrollerRef, setItemCount])

  return (
    <div
      ref={scrollerRef}
      className={cx(base, className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CarouselItem({ className, ...props }: ComponentProps<"div">) {
  const { orientation } = useCarousel()
  const base = orientation === "horizontal" ? ITEM_BASE_H : ITEM_BASE_V
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cx(base, className)}
      {...props}
    />
  )
}

function CarouselPrevious({ className, ...props }: ComponentProps<"button">) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  return (
    <button
      type="button"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      aria-label="Previous slide"
      className={cx(
        BUTTON_BASE,
        "absolute",
        orientation === "horizontal"
          ? "left-2 top-1/2 -translate-y-1/2"
          : "left-1/2 top-2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      <ChevronLeft className="size-4" />
    </button>
  )
}

function CarouselNext({ className, ...props }: ComponentProps<"button">) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Next slide"
      className={cx(
        BUTTON_BASE,
        "absolute",
        orientation === "horizontal"
          ? "right-2 top-1/2 -translate-y-1/2"
          : "left-1/2 bottom-2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      <ChevronRight className="size-4" />
    </button>
  )
}

function CarouselIndicators({ className, ...props }: ComponentProps<"div">) {
  const { itemCount, activeIndex, scrollTo } = useCarousel()
  return (
    <div
      className={cx(
        "absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5",
        className
      )}
      {...props}
    >
      {Array.from({ length: itemCount }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === activeIndex || undefined}
          onClick={() => scrollTo(i)}
          className={cx(
            "size-1.5 rounded-full transition-colors",
            i === activeIndex ? "bg-foreground" : "bg-mute hover:bg-mute-fg/40"
          )}
        />
      ))}
    </div>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
}
