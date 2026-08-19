import Link from "next/link";

import "../sections/flagship.css";

import {
  PANEL_LABELS,
  PANEL_ORDER,
  PPF_DEFAULT_PACKAGE,
  PPF_PACKAGES,
  type PanelId,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/Reveal";

/**
 * THE COVERAGE LADDER, the home page's one glance version of the film
 * offer. Four rungs, each with its real panel count out of the full
 * fifteen, the panels that rung adds, and the same qualified link into
 * the quote form the matrix carries. The full row by row matrix lives
 * on the film page, which this component links as its closing line.
 *
 * Everything is derived from PPF_PACKAGES: the counts come off array
 * lengths and the adds come off addedPanels, so this can never
 * disagree with the matrix or with what the shop actually sells.
 */

const TOTAL = PANEL_ORDER.length;

/** The rung's own adds, spelled out. The first rung has no rung below
    it, so its "adds" are simply what it covers. */
function addsLine(added: readonly PanelId[], isFirst: boolean): string {
  const names = added.map((id) => PANEL_LABELS[id]);
  const list =
    names.length <= 4
      ? names.join(", ")
      : `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`;
  return isFirst ? list : `Adds ${list.toLowerCase()}`;
}

export default function CoverageLadder({ className }: { className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <RevealGroup as="ol" className="ladder">
        {PPF_PACKAGES.map((p, i) => {
          const lead = p.id === PPF_DEFAULT_PACKAGE;
          return (
            <li key={p.id} className={cn("ladder__rung", lead && "is-lead")}>
              <div className="ladder__meta">
                <span className="ladder__index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {lead ? (
                  <span className="ladder__flag">Most common job</span>
                ) : null}
              </div>
              <h3 className="ladder__name">{p.name}</h3>
              <p className="ladder__count">
                <span className="ladder__countN">{p.panels.length}</span>
                <span className="ladder__countOf">of {TOTAL} panels</span>
              </p>
              <p className="ladder__adds">
                {addsLine(p.addedPanels, i === 0)}. {p.bestFor}
              </p>
              <div className="ladder__foot">
                <Link
                  href={`/quote/?service=ppf&package=${p.id}`}
                  className="quote-link"
                >
                  <span className="quote-link__text">Price this one</span>
                  <span className="quote-link__arrow" aria-hidden="true">
                    {"→"}
                  </span>
                  <span className="sr-only">, {p.name}</span>
                </Link>
              </div>
            </li>
          );
        })}
      </RevealGroup>
    </div>
  );
}

export { CoverageLadder };
