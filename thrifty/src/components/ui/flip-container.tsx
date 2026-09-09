
import type { ReactNode } from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { cx } from "../../lib/utils"

export interface FlipContainerProps {
  front: ReactNode
  back: ReactNode
  flipped?: boolean
  defaultFlipped?: boolean
  onFlipChange?: (v: boolean) => void
  className?: string
}

export function FlipContainer({
  front,
  back,
  flipped,
  defaultFlipped = false,
  onFlipChange,
  className,
}: FlipContainerProps) {
  const [isFlipped = false, setFlipped] = useControllableState({
    prop: flipped,
    defaultProp: defaultFlipped,
    onChange: onFlipChange,
  })

  return (
    <div
      className={cx("[perspective:600px] cursor-pointer", className)}
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={cx(
          "relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]",
          isFlipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {front}
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  )
}
