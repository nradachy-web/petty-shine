"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import CoverageDiagram from "./CoverageDiagram";
import CoverageLegend from "./CoverageLegend";
import type { CoverageMap, CoveragePackage } from "./types";
import "./coverage.css";

/**
 * THE COVERAGE PLAN.
 *
 * Paint protection film is the single largest line in his ad account,
 * 1,239 dollars over ninety days, and the page it lands on turns 170
 * clicks into 1 lead. That page lists four package names in prose,
 * prices none of them, and shows no picture of what any of them covers.
 * A visitor who just clicked an ad for PPF cannot answer the only
 * question they have, which is what do I actually get.
 *
 * This is the answer. Four tiers, each a strict superset of the one
 * below, drawn on a real car, with the panel list in words beside it.
 *
 * THE LAYOUT, and why it is three bands rather than two columns.
 *
 * The first pass put the drawing in a sticky left column beside a
 * fifteen row record, and the record is roughly twice the height of
 * everything on the left. Sticky rescued it on a real scroll and it
 * still opened with a column of dead space, which is exactly what a
 * screenshot catches. The record is not compressible: fifteen panels
 * named honestly is the point of the component.
 *
 * So the drawing takes the full width, which is what a 3.3 to 1 side
 * profile wants anyway, and under it two columns carry roughly equal
 * height: what this tier is and how to buy it on the left, the record
 * on the right in two ruled columns of eight and seven rows. Nothing is
 * sticky, because the whole component is now about one screen tall.
 *
 * WHAT IS DELIBERATE HERE
 *
 * Chips are the only control. There is no scroll driven tier switching
 * anywhere in this file, so chip state and scroll state have nothing to
 * disagree about. The chips are real radio inputs inside a fieldset, so
 * they carry a name, a group, arrow key navigation and a focus ring
 * without any of it being reimplemented.
 *
 * Coverage is signalled three ways, never by colour alone: the panel
 * fill lifts, its stroke goes cyan and thickens, and the record names it
 * in words. Every panel is listed every time, in installation order, so
 * the rows never reshuffle when a tier changes and the eye can follow
 * exactly which ones flipped. What is not covered is named too, in
 * pewter, because the honest negative is what earns the trust.
 *
 * Only the panels a tier ADDS animate, and they fill in PANEL_ORDER,
 * the real installation order, so the diagram reads as film being laid
 * on a car rather than as a user interface transition.
 *
 * The resting state is fully drawn. Nothing here needs a script to
 * become visible. Under reduced motion, and with JavaScript off, the
 * whole thing is replaced by a server rendered stack of all four
 * packages, each fully drawn, each with its own list and its own button.
 *
 * It is generic over the panel map, so the window tint page can hand it
 * a glass map and its own tiers and get the same component back.
 */

export interface CoveragePlanProps<Id extends string> {
  map: CoverageMap<Id>;
  packages: readonly CoveragePackage<Id>[];
  /** real installation order. Panels paint and list in this sequence. */
  order: readonly Id[];
  labels: Record<Id, string>;
  /** panels the "what gets hit at highway speed" overlay marks */
  impactPanels?: readonly Id[];
  /** which tier is selected on arrival. Anchor it at the common sale. */
  defaultPackageId: string;
  /** quote form service key, for example "ppf" */
  service: string;
  /** overrides the generated element id prefix */
  uid?: string;
  /** copy */
  legend?: string;
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

const COVERED = "Covered";
const ADDED = "Covered, added here";
const NOT_COVERED = "Not included";

/** "a, b and c". No serial comma, and never a rule of three for its own sake. */
function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default function CoveragePlan<Id extends string>({
  map,
  packages,
  order,
  labels,
  impactPanels = [],
  defaultPackageId,
  service,
  uid: uidProp,
  legend = "Coverage level",
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
}: CoveragePlanProps<Id>) {
  const generated = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const uid = uidProp ?? `cov-${generated}`;

  const defaultIdx = Math.max(
    0,
    packages.findIndex((p) => p.id === defaultPackageId)
  );
  const totalPanels = map.panels.length;

  /** Every panel that is both drawn and ordered, in installation order. */
  const drawn = useMemo(() => {
    const has = new Set<Id>(map.panels.map((p) => p.id));
    return order.filter((id) => has.has(id));
  }, [map, order]);
  const split = Math.ceil(drawn.length / 2);

  /** For every panel, which tier indices cover it. Drives the CSS. */
  const tiers = useMemo(() => {
    const out: Partial<Record<Id, string>> = {};
    for (const panel of map.panels) {
      const inTiers: number[] = [];
      packages.forEach((pkg, i) => {
        if (pkg.panels.includes(panel.id)) inTiers.push(i);
      });
      if (inTiers.length) out[panel.id] = inTiers.join(" ");
    }
    return out;
  }, [map, packages]);

  const [activeIdx, setActiveIdx] = useState(defaultIdx);
  const [impactOn, setImpactOn] = useState(false);
  const [hovered, setHovered] = useState<Id | null>(null);
  const [generation, setGeneration] = useState<Partial<Record<Id, number>>>({});
  const [delays, setDelays] = useState<Partial<Record<Id, number>>>({});

  const rootRef = useRef<HTMLDivElement>(null);
  const covered = useRef<Set<Id>>(new Set(packages[defaultIdx]?.panels ?? []));

  /** Replay the entrance for exactly these panels, in this order. */
  const runEntrance = useCallback((added: readonly Id[]) => {
    if (added.length === 0) return;
    setGeneration((g) => {
      const next = { ...g };
      for (const id of added) next[id] = (next[id] ?? 0) + 1;
      return next;
    });
    setDelays((d) => {
      const next = { ...d };
      added.forEach((id, i) => {
        next[id] = i * 0.085;
      });
      return next;
    });
  }, []);

  const select = useCallback(
    (idx: number) => {
      const pkg = packages[idx];
      if (!pkg) return;
      const next = new Set<Id>(pkg.panels);
      // Only what this step adds. Stepping back down adds nothing, so
      // nothing animates and the panels simply go quiet.
      const added = order.filter((id) => next.has(id) && !covered.current.has(id));
      covered.current = next;
      setActiveIdx(idx);
      runEntrance(added);
    },
    [order, packages, runEntrance]
  );

  /**
   * The first entrance, on scroll in. The pre animation state is applied
   * inside the intersect callback and never before it, so the diagram
   * cannot be left undrawn by an observer that never fires.
   */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof window === "undefined") return;
    const reduce =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (!reduce || reduce.matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            io.disconnect();
            runEntrance(order.filter((id) => covered.current.has(id)));
            return;
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [order, runEntrance]);

  const active = packages[activeIdx] ?? packages[0];
  const activeSet = useMemo(
    () => new Set<Id>(active?.panels ?? []),
    [active]
  );

  return (
    <div
      ref={rootRef}
      className={className ? `cov cov-live ${className}` : "cov cov-live"}
      data-active={activeIdx}
      data-impact={impactOn ? "true" : undefined}
    >
      {/* The control. One row, full width, above the drawing. */}
      <fieldset className="cov-chips">
        <legend className="cov-chips__legend">{legend}</legend>
        {packages.map((pkg, i) => (
          <label key={pkg.id} className="cov-chip" htmlFor={`${uid}-tier-${i}`}>
            <input
              id={`${uid}-tier-${i}`}
              className="cov-radio cov-chip__mark"
              type="radio"
              name={`${uid}-tier`}
              value={String(i)}
              checked={i === activeIdx}
              onChange={() => select(i)}
            />
            {pkg.name}
          </label>
        ))}
      </fieldset>

      {/* The drawing, full width, on its own hairline ruled bar. */}
      <div className="cov__stage">
        <CoverageDiagram
          map={map}
          uid={uid}
          order={order}
          tiers={tiers}
          stipple={impactPanels}
          highlight={hovered}
          highlightCovered={hovered ? activeSet.has(hovered) : true}
          generation={generation}
          delays={delays}
          title={`${active.name}. ${active.panels.length} of ${totalPanels} panels covered on ${map.subject}.`}
        />
        <CoverageLegend
          coveredLabel={coveredLabel}
          uncoveredLabel={uncoveredLabel}
          impactLabel={impactPanels.length > 0 ? impactSwatchLabel : undefined}
          note={subjectNote}
        />
      </div>

      <div className="cov__cols">
        {/* What this tier is, and the way to buy it. */}
        <div className="cov__sell">
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className="cov-tier"
              data-tier={i}
              data-default={i === defaultIdx ? "true" : undefined}
            >
              <div className="cov-summary">
                <span className="cov-summary__name">{pkg.name}</span>
                <span className="cov-summary__count">
                  {`${pkg.panels.length} of ${totalPanels} panels`}
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
            </div>
          ))}

          {/* LOSS AVERSION, TRUTHFULLY. Film is sacrificial, so the honest
              argument is what the front of the car looks like without it.
              It was a bare checkbox under the drawing in the first pass
              and nobody was going to find it. It is a block of its own
              now, with the reason stated before the switch. */}
          {impactPanels.length > 0 ? (
            <div className="cov-impact">
              <p className="cov-impact__head">{impactHead}</p>
              <p className="cov-impact__body">{impactBody}</p>
              <label className="cov-toggle" htmlFor={`${uid}-impact`}>
                <input
                  id={`${uid}-impact`}
                  className="cov-check cov-toggle__mark"
                  type="checkbox"
                  checked={impactOn}
                  onChange={(e) => setImpactOn(e.currentTarget.checked)}
                />
                <span className="cov-toggle__text">{impactLabel}</span>
              </label>
              <p className="cov-caption cov-impact-note">{impactNote}</p>
            </div>
          ) : null}

          <div className="cov-action">
            {packages.map((pkg, i) => (
              <div
                key={pkg.id}
                className="cov-tier"
                data-tier={i}
                data-default={i === defaultIdx ? "true" : undefined}
              >
                <Button
                  href={`/quote/?service=${service}&package=${pkg.id}`}
                  tone="cyan"
                  block
                >
                  {`Get a price on ${pkg.name}`}
                </Button>
              </div>
            ))}
            <p className="cov-caption">{actionNote}</p>
          </div>
        </div>

        {/* The record. Every panel named, covered and uncovered alike, in
            installation order, split into two ruled columns so it stands
            level with the column beside it. */}
        {/* NOT the live region. All four tiers are rendered here and CSS
            picks one, so announcing this element announces sixty rows of
            record every time a chip is touched. The live region is the one
            line summary at the end of the component. */}
        <div className="cov__record">
          <p className="cov-subhead">{recordLabel}</p>
          {packages.map((pkg, i) => {
            const set = new Set<Id>(pkg.panels);
            const valueOf = (id: Id) => {
              if (!set.has(id)) return NOT_COVERED;
              if (pkg.addsOver && pkg.addedPanels.includes(id)) return ADDED;
              return COVERED;
            };
            const column = (ids: readonly Id[], label: string) => (
              <KeyValueList label={label}>
                {ids.map((id) => (
                  <div
                    key={id}
                    className="cov-row"
                    onPointerEnter={
                      i === activeIdx ? () => setHovered(id) : undefined
                    }
                    onPointerLeave={
                      i === activeIdx ? () => setHovered(null) : undefined
                    }
                  >
                    <KeyValueRow
                      k={labels[id]}
                      v={valueOf(id)}
                      tone={set.has(id) ? "default" : "pewter"}
                    />
                  </div>
                ))}
              </KeyValueList>
            );
            return (
              <div
                key={pkg.id}
                className="cov-tier"
                data-tier={i}
                data-default={i === defaultIdx ? "true" : undefined}
              >
                <div className="cov-record__split">
                  {column(drawn.slice(0, split), `${pkg.name}, panel coverage`)}
                  {column(
                    drawn.slice(split),
                    `${pkg.name}, panel coverage continued`
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* THE LIVE REGION, and the only one.

          Changing a chip changes one sentence here: the tier and how many
          panels it covers. The record itself is not live, because every
          tier is in the DOM at once and only CSS hides three of them, so a
          live region around it reads the whole catalogue aloud on every
          chip. Atomic, so the sentence is announced whole rather than as
          whichever words happened to change. */}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {`${active.name}. ${active.panels.length} of ${totalPanels} panels covered.`}
      </span>
    </div>
  );
}

export { CoveragePlan };
