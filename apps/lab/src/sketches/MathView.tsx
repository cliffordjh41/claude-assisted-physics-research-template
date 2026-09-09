import { useMemo } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

// The gravitation law and the central-force equations the `gravity` crate
// implements and the other views integrate, laid out as three equal cells.
const EQUATIONS: { tex: string; caption: string }[] = [
  {
    tex: String.raw`F = \dfrac{G\,m_1 m_2}{r^2}`,
    caption: "Newton's law of universal gravitation",
  },
  {
    tex: String.raw`\ddot{\mathbf{r}} = -\,\dfrac{\mu\,\mathbf{r}}{\lvert \mathbf{r} \rvert^{3}}`,
    caption: "central-force equation of motion, with mu = G M",
  },
  {
    tex: String.raw`v^2 = \mu\left(\dfrac{2}{r} - \dfrac{1}{a}\right)`,
    caption: "vis-viva: speed at radius r on an orbit of semi-major axis a",
  },
]

export function MathView() {
  const items = useMemo(
    () =>
      EQUATIONS.map((e) => ({
        caption: e.caption,
        html: katex.renderToString(e.tex, {
          displayMode: true,
          throwOnError: false,
        }),
      })),
    [],
  )

  // Narrow screens: stacked vertically but compact (smaller equations, tight
  // padding) so the three do not crowd out the visuals. Wide screens: a 3-up
  // grid at full size.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800 text-white">
      {items.map((it) => (
        <div
          key={it.caption}
          className="flex flex-col items-center justify-center gap-1 px-4 py-2.5"
        >
          <div
            className="text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: it.html }}
          />
          <div className="text-[10px] text-neutral-500 text-center">{it.caption}</div>
        </div>
      ))}
    </div>
  )
}
