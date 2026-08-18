import "./coverage.css";

/**
 * THE HAIRLINE UNDER THE DRAWING.
 *
 * Three swatches naming what the three treatments in the drawing mean,
 * and one sentence saying the drawing is one car and the quote is for
 * the visitor's own. It runs as a single ruled row directly under the
 * diagram, the way a trust bar runs under a hero.
 *
 * The swatches carry the same values the SVG does, read from the same
 * custom properties, so a change to the covered fill cannot leave the
 * legend describing the old one.
 */
export default function CoverageLegend({
  coveredLabel,
  uncoveredLabel,
  impactLabel,
  note,
  className,
}: {
  coveredLabel: string;
  uncoveredLabel: string;
  /** omitted when the map has no impact set */
  impactLabel?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={className ? `cov-legend ${className}` : "cov-legend"}>
      <ul className="cov-legend__keys">
        <li className="cov-legend__item">
          <span className="cov-swatch cov-swatch--on" aria-hidden="true" />
          {coveredLabel}
        </li>
        <li className="cov-legend__item">
          <span className="cov-swatch cov-swatch--off" aria-hidden="true" />
          {uncoveredLabel}
        </li>
        {impactLabel ? (
          <li className="cov-legend__item">
            <span className="cov-swatch cov-swatch--hit" aria-hidden="true" />
            {impactLabel}
          </li>
        ) : null}
      </ul>
      {note ? <p className="cov-legend__note">{note}</p> : null}
    </div>
  );
}

export { CoverageLegend };
