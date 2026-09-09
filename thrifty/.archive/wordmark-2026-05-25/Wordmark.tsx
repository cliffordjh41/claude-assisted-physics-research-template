// Wordmark SVG component — ex wisey brand kit
// Variants: lowercase / uppercase × light (black) / dark (white)

interface WordmarkProps {
  case?: "lower" | "upper"
  variant?: "light" | "dark"   // light = black text, dark = white text
  name?: string
  scale?: number
  className?: string
}

export function Wordmark({
  case: textCase = "lower",
  variant = "light",
  name = "ex wisey",
  scale = 1,
  className,
}: WordmarkProps) {
  const isUpper = textCase === "upper"
  const text = isUpper ? name.toUpperCase() : name.toLowerCase()
  const fill = variant === "dark" ? "#ffffff" : "#000000"
  const weight = isUpper ? 600 : 400
  const tracking = isUpper ? "0.22em" : "0.06em"
  const vbW = isUpper ? 220 : 160
  const vbH = 36

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      width={vbW * scale}
      height={vbH * scale}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x={vbW / 2}
        y={vbH / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "18px",
          fontWeight: weight,
          letterSpacing: tracking,
          fill,
        }}
      >
        {text}
      </text>
    </svg>
  )
}

// Banner — wider format for social / headers
interface BannerProps {
  case?: "lower" | "upper"
  variant?: "light" | "dark"
  width?: number
  className?: string
}

export function WordmarkBanner({
  case: textCase = "lower",
  variant = "light",
  width = 600,
  className,
}: BannerProps) {
  const isUpper = textCase === "upper"
  const text = isUpper ? "EX WISEY" : "ex wisey"
  const fill = variant === "dark" ? "#ffffff" : "#000000"
  const bg = variant === "dark" ? "#000000" : "#ffffff"
  const weight = isUpper ? 600 : 400
  const tracking = isUpper ? "0.22em" : "0.06em"
  const height = Math.round(width / 5)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width={width} height={height} fill={bg} />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: `${Math.round(height * 0.28)}px`,
          fontWeight: weight,
          letterSpacing: tracking,
          fill,
        }}
      >
        {text}
      </text>
    </svg>
  )
}
