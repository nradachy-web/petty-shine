import type { ReactNode } from "react";
import { priceIsPublic } from "@/lib/constants";
import { cn, money } from "@/lib/utils";
import QuoteLink from "./QuoteLink";
import "./primitives.css";

/**
 * THE PRICE SLOT, and the gate that keeps a number off the page.
 *
 * There is one rule here and everything else follows from it: a slot
 * that cannot print a price renders a tappable link into the quote
 * form. Never a dead grey label, never an empty cell, never a dash,
 * never the words "contact us". Four of his nine services publish no
 * price at all, and while PRICING_MODE is "private" none of the other
 * five may print one either, so on this site the quote link is the
 * common case rather than the exception.
 *
 * THE GATE LIVES IN THE COMPONENT ON PURPOSE. A page that forgets the
 * flag exists still does the right thing, because PriceFigure reads
 * PRICING_MODE itself and swaps to the link. The failure mode of
 * forgetting is a link, not a leak.
 *
 * `value` therefore accepts null and undefined. A service with no
 * published price is not a special case a caller has to remember to
 * handle. It is the same call with a null in it.
 *
 * When it does print, it prints mono with tabular figures, because on
 * this site mono means a sourced fact and tabular figures mean a
 * column of prices lines up. The number always comes out of
 * src/lib/constants.ts. Nothing on this site types a price into a
 * page, which is the whole reason the old site could describe its
 * ceramic coating process as happening in a state 700 miles away and
 * nobody caught it for years.
 *
 * `from` renders the "from $700" form his own price list uses, which
 * is the honest one: every price he publishes is a starting price and
 * the real number depends on the vehicle.
 */
export interface PriceFigureProps {
  /**
   * The raw number, straight out of constants.ts. null or undefined
   * means nothing is published for this service, which renders the
   * quote link exactly like private mode does.
   */
  value: number | null | undefined;
  /** prefix the figure with "from" */
  from?: boolean;
  size?: "sm" | "md" | "lg";
  /**
   * The quote form service key, for example "ppf" or "ceramic". It is
   * carried into /quote/ whenever the figure cannot render, so the
   * form arrives with the service already chosen. Always pass it.
   * ServiceLine.quoteKey in constants.ts is where it comes from.
   */
  service?: string;
  /** optional package key, so the lead arrives already qualified */
  package?: string;
  /** overrides the quote link label. Keep it a promise, never a warning. */
  quoteLabel?: ReactNode;
  className?: string;
  id?: string;
}

export default function PriceFigure({
  value,
  from = false,
  size = "md",
  service,
  package: pkg,
  quoteLabel,
  className,
  id,
}: PriceFigureProps) {
  if (!priceIsPublic() || typeof value !== "number" || !Number.isFinite(value)) {
    if (process.env.NODE_ENV !== "production" && !service) {
      console.warn(
        "PriceFigure: nothing to print and no `service`, so the quote link " +
          "cannot preselect anything. Pass service={...}, or use " +
          "<PriceOrQuote service={...} value={...} />, which requires it.",
      );
    }
    return (
      <QuoteLink service={service} package={pkg} className={className} id={id}>
        {quoteLabel}
      </QuoteLink>
    );
  }

  return (
    <span
      id={id}
      className={cn("price-fig", size !== "md" && `price-fig--${size}`, className)}
    >
      {from ? <span className="price-fig__from">from</span> : null}
      <span className="price-fig__n">{money(value)}</span>
    </span>
  );
}

export interface PriceOrQuoteProps extends Omit<PriceFigureProps, "service"> {
  /** required here, unlike PriceFigure, so the lead always arrives qualified */
  service: string;
}

/**
 * THE ONE A PAGE SHOULD USE.
 *
 *   <PriceOrQuote service="ceramic" value={COATINGS[0].fromPrice} />
 *   <PriceOrQuote service="ceramic" package={c.id} value={c.fromPrice} />
 *   <PriceOrQuote service="ppf" value={null} />
 *
 * Same component underneath, two differences that matter. `service`
 * is required, so the quote link always lands on a preselected form.
 * And `from` defaults to true, because every published price on this
 * site is a starting price and writing "from" nine times by hand is
 * nine chances to forget it once.
 *
 * A page never branches on PRICING_MODE to decide between a number
 * and a link. It writes this and moves on.
 */
export function PriceOrQuote({ from = true, ...rest }: PriceOrQuoteProps) {
  return <PriceFigure from={from} {...rest} />;
}

export { PriceFigure };
