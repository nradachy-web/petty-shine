import Link from "next/link";

import "./coverage.css";

import {
  IMPACT_PANELS,
  PANEL_LABELS,
  PANEL_ORDER,
  PPF_DEFAULT_PACKAGE,
  PPF_PACKAGES,
  type PanelId,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * THE COVERAGE MATRIX.
 *
 * Every body area on one axis, all four packages on the other, so the answer
 * to "what do I actually get" is one glance and the answer to "what does the
 * next tier add" is the column beside it.
 *
 * WHY THIS REPLACED A DRAWING. There were four attempts at a side profile car
 * drawn in SVG. Nick's verdict on the last one was that it looked like a high
 * school project, and he was right: a car drawn in code reads as clip art no
 * matter how the fills are tuned. The three sites this work is measured
 * against, vassolaw.com, top-choicedetailing.com and midwesttintdetail.com,
 * contain no illustrations at all. They are typography and real photography.
 * That was the signal.
 *
 * A matrix is also the honest form for this information. Coverage is a list of
 * panels, not a picture, and a list of panels is exactly what the shop quotes
 * from. It plays to the design language the rest of the site already runs on,
 * which is ruled key and value rows in mono with tabular figures.
 *
 * NO JAVASCRIPT ANYWHERE IN IT. The full matrix is server rendered and every
 * package is on screen at once, so there is no state to lose, nothing to
 * hydrate, no reduced motion branch and no fallback stack to keep in sync.
 * The previous component needed all four of those.
 */

const COVERED = PPF_PACKAGES.map(
  (p) => new Set<PanelId>(p.panels as PanelId[])
);

/** Which tier first adds a given area, for the "added here" emphasis. */
const ADDED_AT = new Map<PanelId, number>();
PPF_PACKAGES.forEach((p, i) => {
  for (const id of p.addedPanels as PanelId[]) {
    if (!ADDED_AT.has(id)) ADDED_AT.set(id, i);
  }
});

const DEFAULT_INDEX = Math.max(
  0,
  PPF_PACKAGES.findIndex((p) => p.id === PPF_DEFAULT_PACKAGE)
);

function Mark({ on, added }: { on: boolean; added: boolean }) {
  if (!on) {
    return (
      <span className="cov-mark cov-mark--off" aria-hidden="true">
        <span className="cov-mark__bar" />
      </span>
    );
  }
  return (
    <span
      className={cn("cov-mark", added && "cov-mark--added")}
      aria-hidden="true"
    >
      <span className="cov-mark__box" />
    </span>
  );
}

export default function CoverageMatrix({ className }: { className?: string }) {
  return (
    <div className={cn("cov-matrix", className)}>
      <p className="cov-matrix__hint" aria-hidden="true">
        Slide for all four levels {"→"}
      </p>
      <div className="cov-matrix__scroll">
        <table className="cov-table">
          <caption className="sr-only">
            Which body panels each paint protection film package covers.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="cov-table__corner">
                Body area
              </th>
              {PPF_PACKAGES.map((p, i) => (
                <th
                  key={p.id}
                  scope="col"
                  className={cn(
                    "cov-table__pkg",
                    i === DEFAULT_INDEX && "is-lead"
                  )}
                >
                  <span className="cov-table__pkgIndex">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="cov-table__pkgName">{p.name}</span>
                  {i === DEFAULT_INDEX ? (
                    <span className="cov-table__pkgNote">
                      most common job
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PANEL_ORDER.map((id) => {
              const impact = IMPACT_PANELS.includes(id);
              return (
                <tr key={id}>
                  <th scope="row" className="cov-table__area">
                    {PANEL_LABELS[id]}
                    {impact ? (
                      <span className="cov-table__hit" title="Takes the hits at highway speed">
                        <span aria-hidden="true">&#9679;</span>
                        <span className="sr-only">
                          , takes the hits at highway speed
                        </span>
                      </span>
                    ) : null}
                  </th>
                  {PPF_PACKAGES.map((p, i) => {
                    const on = COVERED[i].has(id);
                    return (
                      <td
                        key={p.id}
                        className={cn(
                          "cov-table__cell",
                          i === DEFAULT_INDEX && "is-lead"
                        )}
                      >
                        <Mark on={on} added={i > 0 && ADDED_AT.get(id) === i} />
                        <span className="sr-only">
                          {on ? "covered" : "not included"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="cov-table__corner" />
              {PPF_PACKAGES.map((p, i) => (
                <td
                  key={p.id}
                  className={cn(
                    "cov-table__cta",
                    i === DEFAULT_INDEX && "is-lead"
                  )}
                >
                  <Link
                    href={`/quote/?service=ppf&package=${p.id}`}
                    className="cov-table__link"
                  >
                    Price this one
                    <span aria-hidden="true"> &rarr;</span>
                    <span className="sr-only">, {p.name}</span>
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="cov-matrix__legend">
        <span className="cov-matrix__key">
          <span className="cov-mark__box" aria-hidden="true" /> covered
        </span>
        <span className="cov-matrix__key">
          <span className="cov-mark__box cov-mark__box--hollow" aria-hidden="true" /> added at
          this level
        </span>
        <span className="cov-matrix__key">
          <span className="cov-matrix__dot" aria-hidden="true" /> takes the hits at
          highway speed
        </span>
      </p>

      <p className="cov-matrix__note">
        Each level contains everything in the level before it. Lower door where
        applicable to the vehicle. Coverage is confirmed panel by panel on your
        own car before anything is quoted.
      </p>
    </div>
  );
}
