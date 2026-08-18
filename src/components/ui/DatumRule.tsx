"use client";

import { cn } from "@/lib/utils";
import RuleLabel from "./RuleLabel";
import { useEnterOnce } from "./useEnterOnce";
import "./primitives.css";

/**
 * THE MOTIF.
 *
 * A full width 1px hairline whose first 24px is solid cyan and whose
 * remainder is the plane's rule colour. It comes from two places at
 * once: the edge to edge white hairline under RESTORE PROTECT RESTYLE
 * MAINTAIN on his own shop banner, and the datum line in an engineering
 * drawing, the reference surface every other dimension is measured from.
 *
 * The optional label rides above it in mono caps, exactly the way the
 * tagline sits on the banner and the way dimension text sits on a
 * dimension line.
 *
 * It draws in from the left, scaleX 0 to 1 over 500ms, on section enter.
 * That is the only ornamental animation on this site.
 *
 * Built from two spans rather than a hard stop gradient, because the
 * design rules forbid gradients outright and this is honestly what the
 * thing is: a cyan tick followed by a hairline.
 *
 * RESTING STATE: fully drawn. The scaleX(0) state is added by JS after
 * mount and only when the visitor has not asked for reduced motion, so
 * a rule can never be missing from the static HTML.
 */
export default function DatumRule({
  label,
  delay = 0,
  className,
  labelTone,
  id,
}: {
  /** mono uppercase label riding on the rule, like CAD dimension text */
  label?: string;
  /** seconds */
  delay?: number;
  className?: string;
  labelTone?: "default" | "strong" | "quiet" | "accent";
  id?: string;
}) {
  const ref = useEnterOnce<HTMLDivElement>("data-ps-rule", delay);

  return (
    <div id={id} ref={ref} className={cn("datum", className)}>
      {label ? (
        <span className="datum__label">
          <RuleLabel tone={labelTone}>{label}</RuleLabel>
        </span>
      ) : null}
      <span className="datum__line" aria-hidden="true">
        <span className="datum__tick" />
        <span className="datum__rest" />
      </span>
    </div>
  );
}

export { DatumRule };
