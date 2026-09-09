import type { ComponentProps } from "react"
import { cx } from "../../lib/utils"

interface MeterProps extends Omit<ComponentProps<"div">, "children"> {
  value: number
  min?: number
  max?: number
  low?: number
  high?: number
  optimum?: number
  label?: string
  showValue?: boolean
}

const ROOT_BASE = "flex flex-col gap-1.5"
const TRACK_BASE = "relative h-2 w-full overflow-hidden rounded-full bg-mute"
const BAR_BASE = "h-full rounded-full transition-[width] duration-200"
const LABEL_ROW_BASE = "flex items-center justify-between text-xs text-mute-fg"

function zoneColor(
  value: number,
  min: number,
  max: number,
  low: number | undefined,
  high: number | undefined,
  optimum: number | undefined
) {
  if (low === undefined && high === undefined) return "bg-foreground"
  if (optimum !== undefined) {
    if (low !== undefined && high !== undefined) {
      if (value >= low && value <= high) return "bg-foreground"
      const optimalInLow = optimum < low
      const optimalInHigh = optimum > high
      if ((value < low && optimalInLow) || (value > high && optimalInHigh))
        return "bg-foreground/70"
      return "bg-alert"
    }
  }
  if (low !== undefined && value < low) return "bg-alert"
  if (high !== undefined && value > high) return "bg-alert"
  void min
  void max
  return "bg-foreground"
}

function Meter({
  className,
  value,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
  label,
  showValue,
  ...props
}: MeterProps) {
  const clamped = Math.min(max, Math.max(min, value))
  const pct = ((clamped - min) / (max - min)) * 100
  const color = zoneColor(clamped, min, max, low, high, optimum)

  return (
    <div className={cx(ROOT_BASE, className)} {...props}>
      {(label || showValue) && (
        <div className={LABEL_ROW_BASE}>
          {label && <span>{label}</span>}
          {showValue && <span>{clamped}</span>}
        </div>
      )}
      <div
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className={TRACK_BASE}
      >
        <div
          className={cx(BAR_BASE, color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export { Meter }
