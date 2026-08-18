import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import CoverageDiagram from "./CoverageDiagram";
import CoverageLegend from "./CoverageLegend";
import type { CoverageMap, CoveragePackage } from "./types";
import "./coverage.css";

/** "a, b and c". No serial comma, and never a rule of three for its own sake. */
function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * THE FALLBACK, and it is a real one, not a placeholder.
 *
 * All four packages, each fully drawn, each with its own coverage list
 * and its own action button. It is server rendered into the static HTML
 * every time, and CSS decides whether it or the interactive plan is the
 * one on screen:
 *
 *   prefers-reduced-motion: reduce  -> this, no motion of any kind
 *   JavaScript disabled             -> this, via a <style> inside
 *                                      <noscript> in CoveragePlanSection
 *   everything else                 -> the interactive plan
 *
 * Nothing is lost in the swap. This stack carries strictly more on
 * screen at once than the interactive version does, just taller.
 *
 * IT USES THE SAME THREE BANDS AS THE PLAN, deliberately. The first pass
 * gave it a one column layout of its own to dodge the dead space under
 * the sticky frame, which meant the fallback and the real thing did not
 * look like the same component. Now the plan is not sticky and the two
 * balance for the same reason: drawing full width, then the sell and the
 * record side by side at roughly equal height.
 *
 * Only the default package's button is the solid cyan one, because the
 * cyan rule allows exactly one solid button per screen and because the
 * default is the tier that should be anchoring the ladder anyway.
 */

export interface CoverageStackProps<Id extends string> {
  map: CoverageMap<Id>;
  packages: readonly CoveragePackage<Id>[];
  order: readonly Id[];
  labels: Record<Id, string>;
  /** panels the "what gets hit at highway speed" overlay marks */
  impactPanels?: readonly Id[];
  defaultPackageId: string;
  service: string;
  uid?: string;
  impactHead?: string;
  impactBody?: string;
  impactLabel?: string;
  impactNote?: string;
  impactSwatchLabel?: string;
  coveredLabel?: string;
  uncoveredLabel?: string;
  recordLabel?: string;
  subjectNote?: string;
  actionNote?: string;
  className?: string;
}

export default function CoverageStack<Id extends string>({
  map,
  packages,
  order,
  labels,
  impactPanels = [],
  defaultPackageId,
  service,
  uid = "cov-stack",
  impactHead = "At highway speed",
  impactBody = "Film is the layer that takes the damage instead of the paint. Rocks and road grit land on the front of the car first.",
  impactLabel = "Show what gets hit at highway speed",
  impactNote = "Pewter marks the panels that take stone chips and road spray first.",
  impactSwatchLabel = "Takes the hits",
  coveredLabel = "Film goes on",
  uncoveredLabel = "Left bare",
  recordLabel = "Every panel on the car",
  subjectNote = "One car, drawn to scale. Coverage is quoted panel by panel on your own vehicle.",
  actionNote = "We do not publish film prices. Tell us the vehicle and we will price this package in writing.",
  className,
}: CoverageStackProps<Id>) {
  const totalPanels = map.panels.length;
  const has = new Set<Id>(map.panels.map((p) => p.id));
  const drawn = order.filter((id) => has.has(id));
  const split = Math.ceil(drawn.length / 2);

  return (
    <div className={className ? `cov-static ${className}` : "cov-static"}>
      {packages.map((pkg, i) => {
        const set = new Set<Id>(pkg.panels);
        const on = order.filter((id) => set.has(id));
        const isDefault = pkg.id === defaultPackageId;
        const valueOf = (id: Id) => {
          if (!set.has(id)) return "Not included";
          if (pkg.addsOver && pkg.addedPanels.includes(id))
            return "Covered, added here";
          return "Covered";
        };
        const column = (ids: readonly Id[], label: string) => (
          <KeyValueList label={label}>
            {ids.map((id) => (
              <KeyValueRow
                key={id}
                k={labels[id]}
                v={valueOf(id)}
                tone={set.has(id) ? "default" : "pewter"}
              />
            ))}
          </KeyValueList>
        );

        return (
          <section
            className="cov-static__item"
            key={pkg.id}
            aria-label={pkg.name}
          >
            <div className="cov__stage">
              <CoverageDiagram
                map={map}
                uid={`${uid}-${i}`}
                order={order}
                lit={set}
                stipple={impactPanels}
                title={`${pkg.name}. ${on.length} of ${totalPanels} panels covered on ${map.subject}.`}
              />
              <CoverageLegend
                coveredLabel={coveredLabel}
                uncoveredLabel={uncoveredLabel}
                impactLabel={
                  impactPanels.length > 0 ? impactSwatchLabel : undefined
                }
                note={subjectNote}
              />
            </div>

            <div className="cov__cols">
              <div className="cov__sell">
                <div className="cov-summary">
                  <span className="cov-summary__name">{pkg.name}</span>
                  <span className="cov-summary__count">
                    {`${on.length} of ${totalPanels} panels`}
                  </span>
                </div>
                <p className="cov-note">{pkg.bestFor}</p>
                {pkg.addsOver ? (
                  <p className="cov-note">
                    {`Everything in ${pkg.addsOver}, plus ${listOf(
                      pkg.addedPanels.map((id) => labels[id].toLowerCase())
                    )}.`}
                  </p>
                ) : null}
                {pkg.note ? <p className="cov-note">{pkg.note}</p> : null}

                {/* The overlay works here too, and it needs no script:
                    the checkbox is the state and :has() reads it. Losing
                    the honest loss aversion argument in the fallback was
                    not an acceptable trade. */}
                {impactPanels.length > 0 ? (
                  <div className="cov-impact">
                    <p className="cov-impact__head">{impactHead}</p>
                    <p className="cov-impact__body">{impactBody}</p>
                    <label className="cov-toggle" htmlFor={`${uid}-${i}-impact`}>
                      <input
                        id={`${uid}-${i}-impact`}
                        className="cov-check cov-toggle__mark"
                        type="checkbox"
                      />
                      <span className="cov-toggle__text">{impactLabel}</span>
                    </label>
                    <p className="cov-caption cov-impact-note">{impactNote}</p>
                  </div>
                ) : null}

                <div className="cov-action">
                  <Button
                    href={`/quote/?service=${service}&package=${pkg.id}`}
                    tone={isDefault ? "cyan" : "ghost"}
                    block
                  >
                    {`Get a price on ${pkg.name}`}
                  </Button>
                  {isDefault ? (
                    <p className="cov-caption">{actionNote}</p>
                  ) : null}
                </div>
              </div>

              <div className="cov__record">
                <p className="cov-subhead">{recordLabel}</p>
                <div className="cov-record__split">
                  {column(drawn.slice(0, split), `${pkg.name}, panel coverage`)}
                  {column(
                    drawn.slice(split),
                    `${pkg.name}, panel coverage continued`
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export { CoverageStack };
