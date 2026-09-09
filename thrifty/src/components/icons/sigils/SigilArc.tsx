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

export const SigilArc = forwardRef<SVGSVGElement, LucideProps>(
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
      {/* 270° open arc — horseshoe opening at bottom */}
      <path d="M 6 18 A 9 9 0 1 0 18 18" />
    </svg>
  )
)
SigilArc.displayName = 'SigilArc'
