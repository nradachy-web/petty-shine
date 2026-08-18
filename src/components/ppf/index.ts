/**
 * THE COVERAGE PLAN.
 *
 * Paint protection film is the largest line in his ad account and the worst
 * converting page on his site, because that page lists four package names in
 * prose and shows no picture of what any of them covers. This answers the
 * question.
 *
 * FOR A PAGE BUILDER, this is the whole API:
 *
 *     import { PpfCoveragePlan, SpecificationPending } from "@/components/ppf";
 *
 *     <Section plane="shop" label="Coverage">
 *       <SectionHead title="What the film actually covers" />
 *       <PpfCoveragePlan />
 *     </Section>
 *     <Section plane="sheet" label="Film">
 *       <SpecificationPending />
 *     </Section>
 *
 * Both take no props beyond className. Every panel, label, tier and default
 * comes from src/lib/constants.ts.
 *
 * Put SpecificationPending directly under the plan. It is the honest answer to
 * the film and warranty contradiction on his current PPF page.
 *
 * WHAT USED TO BE HERE. A side profile car drawn in SVG, with a clip path per
 * panel, an animated fill order, chips, a sticky frame, a reduced motion
 * branch and a separate no-JS fallback stack. Six components and about 1,300
 * lines. It went through four redraws and still read as clip art, which is
 * what a car drawn in code reads as. It is now one server rendered table with
 * no client JavaScript at all. See the note at the top of CoverageMatrix.tsx.
 */

export { default as PpfCoveragePlan } from "./PpfCoveragePlan";
export { default as CoverageMatrix } from "./CoverageMatrix";
export { default as SpecificationPending } from "./SpecificationPending";
