import { cn, money } from "@/lib/utils";
import "./primitives.css";

/**
 * A published price.
 *
 * Mono with tabular figures, because on this site mono means a real
 * sourced fact and tabular figures mean a column of prices lines up.
 * The number itself always comes from src/lib/constants.ts. Nothing on
 * this site types a price into a page, which is the whole reason the
 * old site could describe its ceramic coating process as happening in
 * a state 700 miles away and nobody caught it for years.
 *
 * `from` renders the "from $700" form his own site uses, which is the
 * honest one: every price he publishes is a starting price and the real
 * number depends on the vehicle.
 */
export default function PriceFigure({
  value,
  from = false,
  size = "md",
  className,
  id,
}: {
  value: number;
  /** prefix the figure with "from" */
  from?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
}) {
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

export { PriceFigure };
