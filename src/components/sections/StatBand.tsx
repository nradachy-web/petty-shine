import "./flagship.css";

import { COATINGS, CREDENTIALS, REVIEW_SUMMARY } from "@/lib/constants";
import { PHOTOS } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * THE STAT BAND.
 *
 * Four numbers, every one of them derived from the same constants the
 * rest of the site prints, so none of them can drift:
 *
 *   4.9   the Google rating, with the review count under it
 *   9 yr  the longest guarantee the shop sells, read off COATINGS
 *   2     the manufacturer accreditations, read off CREDENTIALS
 *   29    real job photos on this site, read off the photo registry
 *
 * The reference sites both open their argument with a stat row. This
 * one differs in a single way that matters: nothing in it is a claim.
 * Each cell is a checkable count of something this site already shows.
 */

/** Longest guarantee on the coating ladder, in years. Derived, never
    typed: parse the leading integer out of each tier's guarantee. */
const MAX_YEARS = Math.max(
  ...COATINGS.map((c) => Number.parseInt(c.guarantee, 10))
);

const PHOTO_COUNT = Object.keys(PHOTOS).length;

export default function StatBand({ className }: { className?: string }) {
  return (
    <dl className={cn("stat-band", className)}>
      <div className="stat-cell">
        <dd className="stat-cell__n">
          {REVIEW_SUMMARY.rating}
          <span className="stat-cell__mark" aria-hidden="true">
            &#9733;
          </span>
        </dd>
        <dt className="stat-cell__label">
          Rating across {REVIEW_SUMMARY.count} {REVIEW_SUMMARY.source} reviews
        </dt>
      </div>

      <div className="stat-cell">
        <dd className="stat-cell__n">
          {MAX_YEARS}
          <span className="stat-cell__unit">yr</span>
        </dd>
        <dt className="stat-cell__label">
          Longest coating guarantee, issued by Gtechniq
        </dt>
      </div>

      <div className="stat-cell">
        <dd className="stat-cell__n">{CREDENTIALS.length}</dd>
        <dt className="stat-cell__label">
          Manufacturer accreditations, both checkable in their own
          directories
        </dt>
      </div>

      <div className="stat-cell">
        <dd className="stat-cell__n">{PHOTO_COUNT}</dd>
        <dt className="stat-cell__label">
          Real jobs photographed on this site. None of it is stock
        </dt>
      </div>
    </dl>
  );
}

export { StatBand };
