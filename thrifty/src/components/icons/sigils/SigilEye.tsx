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

export const SigilEye = forwardRef<SVGSVGElement, LucideProps>(
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
      {/* Vesica piscis eye outline + pupil */}
      <path d="M 2 12 C 8 6 16 6 22 12 C 16 18 8 18 2 12 Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
)
SigilEye.displayName = 'SigilEye'
