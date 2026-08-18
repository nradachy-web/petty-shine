/**
 * THE COVERAGE PLAN.
 *
 * The flagship. Paint protection film is the largest line in his ad
 * account and the worst converting page on his site, because that page
 * lists four package names in prose and shows no picture of what any of
 * them covers. This answers the question.
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
 * PpfCoveragePlan takes no props. Every panel, label, tier and default
 * comes from src/lib/constants.ts.
 *
 * TWO THINGS THE PAGE MUST RESPECT
 *   1. The plan's action bar is a solid cyan button, so it is the one
 *      solid cyan button on that screen. Every other action on the same
 *      screen is tone="ghost".
 *   2. Put SpecificationPending directly under the plan. It is the
 *      honest answer to the film and warranty contradiction on his
 *      current PPF page, and it is only worth anything where the film
 *      question is being asked.
 *
 * FOR THE WINDOW TINT PAGE LATER: nothing in CoveragePlanFrame,
 * CoveragePlan, CoverageStack or CoverageDiagram mentions film. Build a
 * CoverageMap of glass panels, define the tint tiers the same way
 * PPF_PACKAGES is defined, and pass them to CoveragePlanFrame.
 */

export { default as PpfCoveragePlan } from "./PpfCoveragePlan";
export { default as SpecificationPending } from "./SpecificationPending";

export { default as CoveragePlanFrame } from "./CoveragePlanFrame";
export type { CoveragePlanFrameProps } from "./CoveragePlanFrame";

export { default as CoveragePlan } from "./CoveragePlan";
export type { CoveragePlanProps } from "./CoveragePlan";

export { default as CoverageStack } from "./CoverageStack";
export type { CoverageStackProps } from "./CoverageStack";

export { default as CoverageDiagram } from "./CoverageDiagram";
export type { CoverageDiagramProps } from "./CoverageDiagram";

export { default as CAR_SIDE_MAP } from "./carSideMap";

export type {
  CoverageLayer,
  CoverageMap,
  CoveragePackage,
  CoveragePanelShape,
  CoverageDecor,
  CoverageWheel,
} from "./types";
