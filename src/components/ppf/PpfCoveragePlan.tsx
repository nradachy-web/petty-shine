import CoverageMatrix from "./CoverageMatrix";

/**
 * The Coverage Plan, wired to Petty Shine's four published PPF packages.
 *
 * Every panel id, every label, the installation order, the impact set and the
 * default tier come out of src/lib/constants.ts. Nothing here is typed in, so
 * what the visitor reads cannot drift from the four packages he actually sells.
 *
 * Drop it on a page with no props:
 *
 *     <Section plane="shop" label="Coverage">
 *       <PpfCoveragePlan />
 *     </Section>
 *
 * THIS USED TO BE A DRAWING. Four versions of a side profile car in SVG, and
 * the verdict on the last one was that it looked like a high school project.
 * A car drawn in code reads as clip art however the fills are tuned, and the
 * three sites this work is measured against carry no illustrations at all.
 * See the note at the top of CoverageMatrix.tsx.
 *
 * It is now a server component with no state and no client JavaScript, so
 * there is no hydration, no reduced motion branch and no separate no-JS
 * fallback to keep in sync. All four packages are on screen at once.
 */
export default function PpfCoveragePlan({
  className,
}: {
  className?: string;
}) {
  return <CoverageMatrix className={className} />;
}

export { PpfCoveragePlan };
