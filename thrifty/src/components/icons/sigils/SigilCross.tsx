import { forwardRef } from 'react'
import type { LucideProps } from 'lucide-react'

const defaultAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const SigilCross = forwardRef<SVGSVGElement, LucideProps>(
  ({ color = 'currentColor', size = 24, strokeWidth = 2, absoluteStrokeWidth, className, ...props }, ref) => (
    <svg
      ref={ref}
      {...defaultAttrs}
      width={size}
      height={size}
      stroke={color}
      strokeWidth={absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth}
      className={['lucide', className].filter(Boolean).join(' ')}
      {...props}
    >
      {/* Cross inscribed in circle — sight/target mark */}
      <circle cx="12" cy="12" r="9" />
      <path d="M 12 3 L 12 21 M 3 12 L 21 12" />
    </svg>
  )
)
SigilCross.displayName = 'SigilCross'
