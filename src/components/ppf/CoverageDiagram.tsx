"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import type { CoverageMap, CoveragePanelShape } from "./types";
import "./coverage.css";

/**
 * The drawing.
 *
 * One body outline, used three ways: as the clipPath every panel is cut
 * against, as the filled shell underneath them, and as the crisp edge
 * drawn last on top. Panels can therefore run past the silhouette and
 * still land exactly inside it, which is what lets the seams meet with
 * no gap and no double stroke along the body edge.
 *
 * The component is generic over the map. It knows nothing about paint
 * protection film, so a glass map and a different set of tiers will
 * drive the same code on the window tint page.
 */

export interface CoverageDiagramProps<Id extends string> {
  map: CoverageMap<Id>;
  /** unique per instance on the page. Builds the clipPath and pattern ids. */
  uid: string;
  /** installation order. Panels paint in this sequence. */
  order: readonly Id[];
  /**
   * INTERACTIVE MODE. For each panel, the tier indices that cover it,
   * space separated, for the CSS attribute selectors. Omit for static.
   */
  tiers?: Partial<Record<Id, string>>;
  /** STATIC MODE. The exact panels drawn as covered, no controls. */
  lit?: ReadonlySet<Id>;
  /** panels the stipple overlay marks, when the overlay is switched on */
  stipple?: readonly Id[];
  /** panel to outline, while its row in the record is being pointed at */
  highlight?: Id | null;
  /**
   * Per panel animation generation. Bumping a panel's number replays its
   * entrance: stroke draws first, then the fill arrives. Only ever bumped
   * for the panels a tier ADDS, so nothing already covered redraws.
   */
  generation?: Partial<Record<Id, number>>;
  /** seconds, per panel, so a tier fills in installation order */
  delays?: Partial<Record<Id, number>>;
  title: string;
  className?: string;
}

export default function CoverageDiagram<Id extends string>({
  map,
  uid,
  order,
  tiers,
  lit,
  stipple,
  highlight,
  generation,
  delays,
  title,
  className,
}: CoverageDiagramProps<Id>) {
  const clipId = `${uid}-clip`;
  const stipId = `${uid}-stipple`;
  const titleId = `${uid}-title`;

  const byId = new Map(map.panels.map((p) => [p.id, p]));
  const sequence = order.filter((id) => byId.has(id));

  const draw = (shape: CoveragePanelShape<Id>): ReactNode => (
    <CoveragePath
      key={shape.id}
      shape={shape}
      dataIn={tiers?.[shape.id]}
      isLit={lit ? lit.has(shape.id) : undefined}
      generation={generation?.[shape.id] ?? 0}
      delay={delays?.[shape.id] ?? 0}
    />
  );

  const layerOf = (id: Id) => byId.get(id)?.layer ?? "body";
  const bodyPanels = sequence.filter((id) => layerOf(id) === "body");
  const detailPanels = sequence.filter((id) => layerOf(id) === "detail");
  const freePanels = sequence.filter((id) => layerOf(id) === "free");
  const stippleSet = new Set<Id>(stipple ?? []);
  const highlightShape = highlight ? byId.get(highlight) : undefined;

  return (
    <svg
      className={className ? `cov-svg ${className}` : "cov-svg"}
      viewBox={map.viewBox}
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{title}</title>

      <defs>
        <clipPath id={clipId}>
          <path d={map.outline} />
        </clipPath>
        {/* The stipple is coarse on purpose. A fine dot screen collapses
            into a flat wash once the diagram is 360 pixels wide on a
            phone, which is exactly where most of his ad traffic lands. */}
        <pattern
          id={stipId}
          width="13"
          height="13"
          patternUnits="userSpaceOnUse"
        >
          <circle className="cov-stipple-dot" cx="3" cy="3" r="2" fillOpacity="0.6" />
          <circle className="cov-stipple-dot" cx="9.5" cy="9.5" r="2" fillOpacity="0.6" />
        </pattern>
      </defs>

      {map.wheels?.map((w, i) => (
        <g key={`wheel-${i}`}>
          <circle
            className="cov-wheel"
            cx={w.cx}
            cy={w.cy}
            r={w.tire}
            strokeWidth="2"
          />
          <circle
            className="cov-wheel--open"
            cx={w.cx}
            cy={w.cy}
            r={w.rim}
            strokeWidth="2"
          />
          <circle
            className="cov-wheel--open"
            cx={w.cx}
            cy={w.cy}
            r={w.hub}
            strokeWidth="2"
          />
        </g>
      ))}

      <path className="cov-shell-fill" d={map.outline} />

      <g clipPath={`url(#${clipId})`}>
        {bodyPanels.map((id) => draw(byId.get(id)!))}
      </g>

      {map.decor?.map((d, i) =>
        d.kind === "glass" ? (
          <path
            key={`decor-${i}`}
            className="cov-glass-fill"
            d={d.d}
            strokeWidth="1.5"
          />
        ) : (
          <path
            key={`decor-${i}`}
            className="cov-line"
            d={d.d}
            strokeWidth="1.4"
          />
        )
      )}

      <g clipPath={`url(#${clipId})`}>
        {detailPanels.map((id) => draw(byId.get(id)!))}
      </g>
      {freePanels.map((id) => draw(byId.get(id)!))}

      {stippleSet.size > 0 ? (
        <g className="cov-stipple">
          <g clipPath={`url(#${clipId})`}>
            {sequence
              .filter((id) => stippleSet.has(id) && layerOf(id) !== "free")
              .map((id) => (
                <path key={`st-${id}`} d={byId.get(id)!.d} fill={`url(#${stipId})`} />
              ))}
          </g>
          {sequence
            .filter((id) => stippleSet.has(id) && layerOf(id) === "free")
            .map((id) => (
              <path key={`stf-${id}`} d={byId.get(id)!.d} fill={`url(#${stipId})`} />
            ))}
        </g>
      ) : null}

      {highlightShape ? (
        <g clipPath={highlightShape.layer === "free" ? undefined : `url(#${clipId})`}>
          <path className="cov-hi" d={highlightShape.d} />
        </g>
      ) : null}

      {/* The outline drawn last, so it stays crisp over every fill. */}
      <path className="cov-edge" d={map.outline} strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * One panel.
 *
 * RESTING STATE, and this is the rule that matters most here: the path
 * is server rendered with no inline style at all, so the static HTML
 * contains a fully drawn panel. framer-motion is handed animation
 * controls that stay empty until something asks for an entrance, and
 * `initial={false}` keeps it from writing a starting state into the
 * markup. Every failure mode therefore ends with the diagram drawn:
 *
 *   JS never runs           -> drawn, no animation.
 *   Hydration throws        -> drawn, no animation.
 *   Nothing ever intersects -> drawn, no animation.
 *
 * Both animated values also finish at their resting value, 1, so a panel
 * that has animated once and is then switched off simply changes colour
 * through the CSS transition rather than staying half drawn.
 */
function CoveragePath<Id extends string>({
  shape,
  dataIn,
  isLit,
  generation,
  delay,
}: {
  shape: CoveragePanelShape<Id>;
  dataIn?: string;
  isLit?: boolean;
  generation: number;
  delay: number;
}) {
  const controls = useAnimationControls();
  const seen = useRef(0);

  useEffect(() => {
    if (generation === 0 || generation === seen.current) return;
    seen.current = generation;
    controls.set({ pathLength: 0, fillOpacity: 0 });
    controls.start({
      pathLength: 1,
      fillOpacity: 1,
      transition: {
        pathLength: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
        fillOpacity: { duration: 0.34, delay: delay + 0.36 },
      },
    });
  }, [controls, generation, delay]);

  return (
    <motion.path
      className="cov-panel"
      d={shape.d}
      data-panel={shape.id}
      data-in={dataIn}
      data-lit={isLit === undefined ? undefined : String(isLit)}
      data-solid={shape.solid ? "true" : undefined}
      animate={controls}
      initial={false}
    />
  );
}

export { CoverageDiagram };
