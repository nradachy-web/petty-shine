import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import CoverageDiagram from "./CoverageDiagram";
import type { CoverageMap, CoveragePackage } from "./types";
import "./coverage.css";

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
 * Only the default package's button is the solid cyan one, because the
 * cyan rule allows exactly one solid button per screen and because the
 * default is the tier that should be anchoring the ladder anyway.
 */

export interface CoverageStackProps<Id extends string> {
  map: CoverageMap<Id>;
  packages: readonly CoveragePackage<Id>[];
  order: readonly Id[];
  labels: Record<Id, string>;
  defaultPackageId: string;
  service: string;
  uid?: string;
  coveredLabel?: string;
  uncoveredLabel?: string;
  actionNote?: string;
  className?: string;
}

export default function CoverageStack<Id extends string>({
  map,
  packages,
  order,
  labels,
  defaultPackageId,
  service,
  uid = "cov-stack",
  coveredLabel = "Film goes on",
  uncoveredLabel = "Left bare",
  actionNote = "We do not publish film prices. Tell us the vehicle and we will price this package in writing.",
  className,
}: CoverageStackProps<Id>) {
  const totalPanels = map.panels.length;

  return (
    <div className={className ? `cov-static ${className}` : "cov-static"}>
      {packages.map((pkg, i) => {
        const set = new Set<Id>(pkg.panels);
        const on = order.filter((id) => set.has(id));
        const off = order.filter((id) => !set.has(id));
        const isDefault = pkg.id === defaultPackageId;

        return (
          <section className="cov-static__item" key={pkg.id}>
            <div className="cov-summary">
              <span className="cov-summary__name">{pkg.name}</span>
              <span className="cov-summary__count">
                {`${on.length} of ${totalPanels} panels`}
              </span>
            </div>

            <div className="cov__grid mt-6">
              <div className="cov__frame">
                <CoverageDiagram
                  map={map}
                  uid={`${uid}-${i}`}
                  order={order}
                  lit={set}
                  title={`${pkg.name}. ${on.length} of ${totalPanels} panels covered on ${map.subject}.`}
                />
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
                <p className="cov-note">{pkg.bestFor}</p>
                {pkg.note ? <p className="cov-note">{pkg.note}</p> : null}

                <p className="cov-subhead">{coveredLabel}</p>
                <KeyValueList label={`${pkg.name}, panels covered`}>
                  {on.map((id) => (
                    <KeyValueRow key={id} k={labels[id]} v="Covered" />
                  ))}
                </KeyValueList>

                {off.length > 0 ? (
                  <>
                    <p className="cov-subhead">{uncoveredLabel}</p>
                    <KeyValueList label={`${pkg.name}, panels not covered`}>
                      {off.map((id) => (
                        <KeyValueRow
                          key={id}
                          k={labels[id]}
                          v="Not included"
                          tone="pewter"
                        />
                      ))}
                    </KeyValueList>
                  </>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export { CoverageStack };
