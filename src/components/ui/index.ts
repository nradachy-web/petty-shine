/**
 * The shared primitives. Every page and section on this site is built
 * out of these and nothing else.
 *
 *   import { Section, DatumRule, KeyValueRow, Plate } from "@/components/ui";
 *
 * Deep imports work too, and every primitive is exported both as a
 * default and as a named export, so either import style compiles:
 *
 *   import Section from "@/components/ui/Section";
 *   import { Section } from "@/components/ui/Section";
 *
 * If you need something that is not here, build it in your own owned
 * file rather than editing one of these, and say so in your report.
 */

export { default as Section, SectionHead, Prose, PlanePanel } from "./Section";
export type { Plane, SectionProps, SectionWidth } from "./Section";

export { default as DatumRule } from "./DatumRule";
export { default as RuleLabel } from "./RuleLabel";
export type { RuleLabelTone } from "./RuleLabel";

export { default as KeyValueRow, KeyValueList } from "./KeyValueRow";
export type { KeyValueRowProps, KeyValueTone } from "./KeyValueRow";

export {
  default as Plate,
  BLEED_CLEARED,
  PLATE_MAX_WIDTH,
  isBleedCleared,
} from "./Plate";
export type { PlateProps, BleedClearedId } from "./Plate";

export { default as Reveal, RevealGroup, RevealItem } from "./Reveal";

/* The price slot. <PriceOrQuote> is the one a page should reach for:
   it reads PRICING_MODE for you and renders the quote link whenever
   the price is private or missing. See src/lib/constants.ts. */
export { default as PriceFigure, PriceOrQuote } from "./PriceFigure";
export type { PriceFigureProps, PriceOrQuoteProps } from "./PriceFigure";

export { default as QuoteLink } from "./QuoteLink";
export type { QuoteLinkProps } from "./QuoteLink";

export { default as Button } from "./Button";
export type { ButtonProps, ButtonTone } from "./Button";

export { default as Breadcrumbs } from "./Breadcrumbs";
export type { Crumb } from "./Breadcrumbs";
