
import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { ChevronLeft } from "lucide-react"
import { cx } from "../../lib/utils"
import { Button } from "./button"
import { VisuallyHidden } from "./visually-hidden"

// Context for sharing panel state
interface SlidingPanelsContextValue {
  activeIndex: number
  setActiveIndex: (index: number) => void
  totalPanels: number
  direction: "ltr" | "rtl"
}

const SlidingPanelsContext = React.createContext<SlidingPanelsContextValue | null>(null)

function useSlidingPanels() {
  const context = React.useContext(SlidingPanelsContext)
  if (!context) {
    throw new Error("useSlidingPanels must be used within SlidingPanels")
  }
  return context
}

// Container component (context + translateX animation)
interface SlidingPanelsProps extends React.ComponentProps<"div"> {
  activeIndex?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  direction?: "ltr" | "rtl"
}

function SlidingPanels({
  activeIndex: activeIndexProp,
  defaultIndex = 0,
  onIndexChange,
  direction = "ltr",
  className,
  children,
  ...props
}: SlidingPanelsProps) {
  const [activeIndex = 0, setActiveIndex] = useControllableState({
    prop: activeIndexProp,
    defaultProp: defaultIndex,
    onChange: onIndexChange,
  })

  // Count panels
  const totalPanels = React.useMemo(() => {
    let count = 0
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === SlidingPanel) {
        count++
      }
    })
    return count
  }, [children])

  const multiplier = direction === "ltr" ? -1 : 1

  const contextValue = React.useMemo<SlidingPanelsContextValue>(
    () => ({
      activeIndex,
      setActiveIndex,
      totalPanels,
      direction,
    }),
    [activeIndex, setActiveIndex, totalPanels, direction]
  )

  return (
    <SlidingPanelsContext.Provider value={contextValue}>
      <div className={cx("overflow-hidden w-full h-full", className)} {...props}>
        <div
          className="flex w-full h-full transition-transform duration-[400ms] ease-out"
          style={{
            transform: `translateX(${multiplier * activeIndex * 100}%)`,
          }}
        >
          {children}
        </div>
      </div>
    </SlidingPanelsContext.Provider>
  )
}

// Individual panel
interface SlidingPanelProps extends React.ComponentProps<"div"> {}

function SlidingPanel({ className, children, ...props }: SlidingPanelProps) {
  // `@container/panel` opts each panel into Tailwind v4 container queries
  // so panel-internal layouts (header / footer padding, button spacing)
  // respond to the panel's own width — important inside narrow columns
  // where the viewport `sm:` breakpoint would lie about available space.
  return (
    <div className={cx("@container/panel w-full min-w-full h-full flex-shrink-0 overflow-hidden flex flex-col", className)} {...props}>
      {children}
    </div>
  )
}

// Panel Header (optional back button)
function SlidingPanelHeader({
  className,
  showBackButton = false,
  onBack,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showBackButton?: boolean
  onBack?: () => void
}) {
  return (
    <div
      className={cx("flex items-center gap-2 p-4 pb-3 @sm/panel:p-6 @sm/panel:pb-4", className)}
      {...props}
    >
      {showBackButton && onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <VisuallyHidden>Go back</VisuallyHidden>
        </Button>
      )}
      <div className="flex-1 text-center">{children}</div>
    </div>
  )
}

// Panel Content (scrollable middle section)
function SlidingPanelContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cx("flex-1 overflow-y-auto px-4 @sm/panel:px-6 flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Panel Footer
function SlidingPanelFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cx(
        "flex flex-col-reverse gap-2 p-4 pt-3 @sm/panel:p-6 @sm/panel:pt-4 @sm/panel:flex-row @sm/panel:justify-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  SlidingPanels,
  SlidingPanel,
  SlidingPanelHeader,
  SlidingPanelContent,
  SlidingPanelFooter,
  useSlidingPanels,
}
export type { SlidingPanelsProps, SlidingPanelProps }
