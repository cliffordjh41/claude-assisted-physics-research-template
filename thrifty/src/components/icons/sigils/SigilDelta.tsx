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

export const SigilDelta = forwardRef<SVGSVGElement, LucideProps>(
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
      {/* Upward-pointing triangle */}
      <path d="M 12 4 L 21 20 L 3 20 Z" />
    </svg>
  )
)
SigilDelta.displayName = 'SigilDelta'
