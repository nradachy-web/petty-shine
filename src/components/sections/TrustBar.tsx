import { BRAND, CREDENTIALS, REVIEW_SUMMARY } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ============================================================================
   THE TRUST BAR

   One hairline row that sits directly under the hero. Measured off
   vassolaw.com, which runs a single row reading

     ***** 4.9 . 116 GOOGLE REVIEWS | 44245 FORD RD, CANTON MI | LICENSED IN
     MICHIGAN

   and is the highest value single addition available to this home page.
   Petty Shine's equivalent is stronger, because two of the four entries are
   manufacturer credentials that a visitor can verify in a directory this
   shop does not control:

     4.9 . 47 GOOGLE REVIEWS | GTECHNIQ ACCREDITED DETAILER |
     AUTHORIZED STEK INSTALLER | RANDLEMAN, NC

   EVERY VALUE COMES FROM constants.ts. The rating and the count are
   REVIEW_SUMMARY, checked on the date recorded there. The two credentials
   are the CREDENTIALS array and each one links to the `source` URL on its
   own record, which is the manufacturer's own directory. That link is the
   whole point: "you can check this yourself" is the argument, and a
   credential you cannot check is just another badge.

   IT IS REUSABLE ON PURPOSE. It takes no content props, so it cannot drift
   between pages, and it carries a plane so it can be dropped under any hero
   on any service page. plane="none" leaves the ground to the parent, which
   is how HomeHero floats it over the bottom of the photograph.

   AT 390 IT DOES NOT FIT ON ONE LINE and it never pretends to. Three
   deliberate states, none of which is a wrap accident:
     under 640   one item per row, hairline between each, reads as a record
     640 to 1023 two columns, two rows, same hairlines
     1024 and up one row under one continuous hairline, the reference layout
   The layout lives in globals.css under THE TRUST BAR.
   ========================================================================== */

export interface TrustBarProps {
  /**
   * "shop" and "sheet" paint their own ground, which is what a service
   * page wants. "none" paints nothing and inherits the plane variables
   * from whatever it is sitting inside, which is what a hero wants when
   * the bar floats over the photograph.
   */
  plane?: "shop" | "sheet" | "none";
  id?: string;
  className?: string;
}

const STAR =
  "M7.5 0.6l2.13 4.32 4.77.7-3.45 3.36.81 4.75-4.26-2.24-4.26 2.24.81-4.75L0.6 5.62l4.77-.7z";

/**
 * Five marks. Decorative, because the rating is spelled out in text right
 * beside them, so the whole svg is aria-hidden.
 *
 * FIVE LITERAL PATHS, NOT <defs> AND <use>. A defs id has to be unique in the
 * document, and this component is built to appear more than once on a page: a
 * service page can carry it under its hero and again above its quote form.
 * Two copies of one hardcoded id is invalid HTML and makes the second bar's
 * stars point at the first bar's definition. Repeating the path costs a few
 * bytes and cannot break.
 */
function Stars() {
  return (
    <span className="trustbar__stars" aria-hidden="true">
      <svg
        viewBox="0 0 87 15"
        width="58"
        height="10"
        focusable="false"
        role="presentation"
      >
        {[0, 18, 36, 54, 72].map((x) => (
          <path key={x} d={STAR} transform={`translate(${x} 0)`} />
        ))}
      </svg>
    </span>
  );
}

export default function TrustBar({
  plane = "shop",
  id,
  className,
}: TrustBarProps) {
  const [gtechniq, stek] = CREDENTIALS;

  return (
    <div
      id={id}
      className={cn(
        "trustbar",
        plane === "shop" && "plane-shop",
        plane === "sheet" && "plane-sheet",
        className
      )}
    >
      <div className="container-site">
        <ul className="trustbar__row">
          <li className="trustbar__item">
            <Stars />
            <span className="trustbar__value">
              {REVIEW_SUMMARY.rating}
              <span className="sr-only"> out of 5</span>
              <span aria-hidden="true"> · </span>
              {REVIEW_SUMMARY.count} {REVIEW_SUMMARY.source} reviews
            </span>
          </li>

          {[gtechniq, stek].map((c) => (
            <li key={c.id} className="trustbar__item">
              <a
                href={c.source}
                target="_blank"
                rel="noopener noreferrer"
                className="trustbar__link"
              >
                {c.label}
                <span className="sr-only">
                  , listed in the manufacturer&apos;s own directory. Opens in a
                  new tab.
                </span>
                <span className="trustbar__mark" aria-hidden="true">
                  {"↗"}
                </span>
              </a>
            </li>
          ))}

          <li className="trustbar__item">
            <span className="trustbar__text">
              {BRAND.city}, {BRAND.state}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export { TrustBar };
