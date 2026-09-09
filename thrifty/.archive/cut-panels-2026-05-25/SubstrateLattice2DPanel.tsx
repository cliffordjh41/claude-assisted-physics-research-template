// Substrate triangular lattice (2D) — visualization.
//
// Renders a finite region of the 2D equilateral-triangular lattice.
// Basis vectors at 60°: e1 = (1, 0), e2 = (1/2, √3/2). Vertex (i, j)
// at i·e1 + j·e2. Each interior vertex has six nearest neighbors at
// edge length a; clicking a vertex highlights that hexagon of neighbors.
//
// Centroid markers (toggleable) show the regular-tetrahedron-apex
// positions where a close-packed layer-above lattice seats its vertices.
// Upward-triangle centroids at (i + 1/3, j + 1/3) in basis coords;
// downward-triangle centroids at (i + 2/3, j + 2/3).
//
// Inter-layer spacing in close-packing = a·√(2/3) ≈ 0.8165 a
// (height of the regular tetrahedron with all edges a).
//
// Cross-reference: substrate-transverse-wave-speed-in-physical-units.md
// §IV-bis sub-step 1 names substrate-internal length scale λ as the
// FCC 12-NN primitive-cell distance per Kelvin 1893 Baltimore Lectures
// Appendix I §22-25. This Panel visualizes the in-plane 2D substructure
// of that primitive cell viewed along its [111] axis.

export const meta = {
  id: "substrate-lattice-2d",
  label: "Substrate Lattice 2D",
  tier: "content" as const,
  placement: "any" as const,
};

import { useMemo, useState } from "react";
import type { PanelProps } from "../../types/panel";

const SQRT3_OVER_2 = Math.sqrt(3) / 2;
const SQRT_2_OVER_3 = Math.sqrt(2 / 3);

// Basis-coord to Cartesian-coord conversion.
function basisToCart(i: number, j: number): [number, number] {
  return [i + j / 2, j * SQRT3_OVER_2];
}

// Visible lattice extent (in basis-coord integer units).
const N_ROWS = 7;
const N_COLS = 10;

interface VertexNode {
  i: number;
  j: number;
  x: number;
  y: number;
  key: string;
}

const VERTICES: VertexNode[] = (() => {
  const out: VertexNode[] = [];
  for (let j = 0; j < N_ROWS; j++) {
    for (let i = 0; i < N_COLS; i++) {
      const [x, y] = basisToCart(i, j);
      out.push({ i, j, x, y, key: `${i},${j}` });
    }
  }
  return out;
})();

// Forward-only edge offsets — each edge drawn once.
const FORWARD_EDGES: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 1],
];

interface EdgeLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
}

const EDGES: EdgeLine[] = (() => {
  const out: EdgeLine[] = [];
  for (const v of VERTICES) {
    for (const [di, dj] of FORWARD_EDGES) {
      const ni = v.i + di;
      const nj = v.j + dj;
      if (ni < 0 || ni >= N_COLS || nj < 0 || nj >= N_ROWS) continue;
      const [nx, ny] = basisToCart(ni, nj);
      out.push({ x1: v.x, y1: v.y, x2: nx, y2: ny, key: `${v.key}->${ni},${nj}` });
    }
  }
  return out;
})();

interface CentroidMark {
  x: number;
  y: number;
  key: string;
  kind: "up" | "down";
}

const CENTROIDS: CentroidMark[] = (() => {
  const out: CentroidMark[] = [];
  for (let j = 0; j < N_ROWS - 1; j++) {
    for (let i = 0; i < N_COLS - 1; i++) {
      const [ux, uy] = basisToCart(i + 1 / 3, j + 1 / 3);
      out.push({ x: ux, y: uy, key: `up-${i}-${j}`, kind: "up" });
      const [dx, dy] = basisToCart(i + 2 / 3, j + 2 / 3);
      out.push({ x: dx, y: dy, key: `dn-${i}-${j}`, kind: "down" });
    }
  }
  return out;
})();

// Six nearest-neighbor offsets in basis-coords.
const NN_OFFSETS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
];

const VIEW_PAD = 0.5;
const VIEW_MIN_X = -VIEW_PAD;
const VIEW_MIN_Y = -VIEW_PAD;
const VIEW_W = (N_COLS - 1) + (N_ROWS - 1) / 2 + 2 * VIEW_PAD;
const VIEW_H = (N_ROWS - 1) * SQRT3_OVER_2 + 2 * VIEW_PAD;

export function SubstrateLattice2DPanel(_props: PanelProps) {
  const [latticeSpacing, setLatticeSpacing] = useState(1);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showCentroids, setShowCentroids] = useState(true);

  const selected = selectedKey
    ? VERTICES.find((v) => v.key === selectedKey) ?? null
    : null;

  const neighborKeys = useMemo(() => {
    if (!selected) return new Set<string>();
    const out = new Set<string>();
    for (const [di, dj] of NN_OFFSETS) {
      out.add(`${selected.i + di},${selected.j + dj}`);
    }
    return out;
  }, [selected]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-background text-foreground">
      <div className="shrink-0 h-11 border-b border-line px-3 flex items-center justify-between">
        <h2 className="text-xs font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing)">
          substrate lattice — 2d
        </h2>
        <div className="text-[10px] text-mute-fg font-mono">
          a = {latticeSpacing.toFixed(3)}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center p-3">
        <svg
          viewBox={`${VIEW_MIN_X} ${VIEW_MIN_Y} ${VIEW_W} ${VIEW_H}`}
          className="w-full h-full max-w-full max-h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {EDGES.map(({ x1, y1, x2, y2, key }) => (
            <line
              key={key}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={0.02}
              opacity={0.3}
            />
          ))}

          {showCentroids &&
            CENTROIDS.map(({ x, y, key }) => (
              <circle
                key={key}
                cx={x}
                cy={y}
                r={0.05}
                fill="currentColor"
                opacity={0.35}
              />
            ))}

          {selected &&
            VERTICES.filter((v) => neighborKeys.has(v.key)).map((nbr) => (
              <line
                key={`hl-${nbr.key}`}
                x1={selected.x}
                y1={selected.y}
                x2={nbr.x}
                y2={nbr.y}
                stroke="currentColor"
                strokeWidth={0.05}
                opacity={1}
              />
            ))}

          {VERTICES.map((v) => {
            const isSelected = selectedKey === v.key;
            const isNeighbor = neighborKeys.has(v.key);
            return (
              <circle
                key={v.key}
                cx={v.x}
                cy={v.y}
                r={isSelected ? 0.15 : isNeighbor ? 0.1 : 0.07}
                fill="currentColor"
                opacity={isSelected ? 1 : isNeighbor ? 0.85 : 0.55}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedKey(isSelected ? null : v.key)}
              />
            );
          })}
        </svg>
      </div>

      <div className="shrink-0 border-t border-line px-3 py-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="text-[10px] uppercase tracking-(--theme-letter-spacing) text-mute-fg shrink-0">
            edge a
          </label>
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.01}
            value={latticeSpacing}
            onChange={(e) => setLatticeSpacing(parseFloat(e.target.value))}
            className="flex-1 accent-foreground"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] text-mute-fg font-mono">
            tetrahedral height = a·√(2/3) ≈{" "}
            {(latticeSpacing * SQRT_2_OVER_3).toFixed(4)}
          </div>
          <button
            onClick={() => setShowCentroids((s) => !s)}
            className={`px-2 py-0.5 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) border border-line transition-colors ${
              showCentroids
                ? "bg-foreground text-background"
                : "text-mute-fg hover:text-foreground"
            }`}
          >
            centroids {showCentroids ? "on" : "off"}
          </button>
        </div>

        <div className="text-[10px] text-mute-fg min-h-[1em]">
          {selected
            ? `(i, j) = (${selected.i}, ${selected.j}) — 6 nearest neighbors at distance a`
            : "click a vertex"}
        </div>
      </div>
    </div>
  );
}
