/**
 * The Coverage Plan, generic types.
 *
 * The component is written against a PANEL MAP, never against paint
 * protection film specifically, so the identical component can serve the
 * window tint page later with a glass map and a different set of tiers.
 * Nothing below mentions PPF.
 */

/** Where a panel sits in the draw stack. */
export type CoverageLayer =
  /** clipped to the body outline, drawn in installation order */
  | "body"
  /** clipped, but drawn over every body panel so it stays readable */
  | "detail"
  /** not clipped at all, for a part that sits proud of the silhouette */
  | "free";

export interface CoveragePanelShape<Id extends string = string> {
  id: Id;
  /** SVG path data in the map's own viewBox */
  d: string;
  layer?: CoverageLayer;
  /**
   * Occlude what is underneath when this panel is NOT covered.
   *
   * A headlight sitting inside a covered bumper has to read as a hole in
   * the film, because Partial Front End genuinely leaves the headlights
   * bare. Body panels are transparent when uncovered so the shell shows
   * through; a headlight, a fog light and a mirror are not.
   */
  solid?: boolean;
}

export interface CoverageDecor {
  d: string;
  /** "glass" is filled and never carries film. "line" is a hairline seam. */
  kind: "glass" | "line";
}

export interface CoverageWheel {
  cx: number;
  cy: number;
  tire: number;
  rim: number;
  hub: number;
}

export interface CoverageMap<Id extends string = string> {
  /** stable key, used to build the SVG element ids */
  id: string;
  viewBox: string;
  /**
   * ONE body outline. It is the clip path for every panel and it is
   * drawn again on top, so a rough panel polygon still lands exactly
   * inside the shell with a crisp edge.
   */
  outline: string;
  decor?: CoverageDecor[];
  wheels?: CoverageWheel[];
  panels: CoveragePanelShape<Id>[];
  /** for the SVG title, for example "a car in side profile" */
  subject: string;
}

export interface CoveragePackage<Id extends string = string> {
  id: string;
  name: string;
  /** every panel this tier covers. A strict superset of the tier below. */
  panels: readonly Id[];
  /** only what this tier adds over the previous one */
  addedPanels: readonly Id[];
  addsOver: string | null;
  bestFor: string;
  note?: string;
}
