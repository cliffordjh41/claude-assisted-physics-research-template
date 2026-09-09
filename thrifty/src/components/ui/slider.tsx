import type { ComponentProps } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

const ROOT_BASE =
  "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"

const TRACK_BASE =
  "bg-mute relative grow overflow-hidden rounded-lg data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"

const RANGE_BASE =
  "bg-action absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"

const THUMB_BASE =
  "border-action bg-background ring-focus/50 block size-4 shrink-0 rounded-lg border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  // The accessible name belongs on the thumb (role="slider"), not the Root —
  // pull it off the spread and forward it to each thumb.
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  const values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]
  return (
    <SliderPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={className ? `${ROOT_BASE} ${className}` : ROOT_BASE}
      {...props}
    >
      <SliderPrimitive.Track className={TRACK_BASE}>
        <SliderPrimitive.Range className={RANGE_BASE} />
      </SliderPrimitive.Track>
      {Array.from({ length: values.length }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={THUMB_BASE}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
