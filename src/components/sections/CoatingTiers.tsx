import "./flagship.css";

import { KeyValueList, KeyValueRow } from "@/components/ui";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import { COATINGS, SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/Reveal";

/**
 * THE THREE COATINGS, SIDE BY SIDE.
 *
 * "Which one" is the question the coating page exists to answer, and
 * the first build answered it as three full width blocks stacked half
 * a screen apart, so the reader held tier one in memory while
 * scrolling to tier three. These are the same facts from the same
 * constants, on three cards that share one screen on desktop: the
 * years as a real figure, the published chemistry, every step, and
 * the tier's own qualified link into the quote form.
 *
 * The nine year tier carries the shop's own name and the accent
 * stroke: it is the one Gtechniq only lets an accredited shop apply,
 * which is the argument of the whole site.
 */

const SERVICE = SERVICES.find((s) => s.id === "ceramic-coating")!;

type Coating = (typeof COATINGS)[number];

function TierCard({ coating }: { coating: Coating }) {
  const subtitle = "subtitle" in coating ? coating.subtitle : null;
  const base = "base" in coating ? coating.base : null;
  const top = "top" in coating ? coating.top : null;
  const pending =
    "chemistryPending" in coating ? coating.chemistryPending : null;
  const lead = "proOnly" in coating;
  const years = Number.parseInt(coating.guarantee, 10);

  return (
    <li className={cn("tier", lead && "is-lead")}>
      <div className="tier__head">
        <p className="tier__flag">
          {lead ? "Accredited application only" : subtitle ?? " "}
        </p>
        <h3 className="tier__name mt-1">{coating.name}</h3>
        <p className="tier__years">
          <span className="tier__yearsN">{years}</span>
          <span className="tier__yearsUnit">year guarantee, from Gtechniq</span>
        </p>
      </div>

      <div className="tier__body">
        <p className="tier__best">{coating.bestFor}.</p>

        <KeyValueList label={`${coating.name} specification`}>
          {base ? <KeyValueRow k="Base coat" v={base} /> : null}
          {top ? <KeyValueRow k="Top coat" v={top} /> : null}
          {pending ? (
            <KeyValueRow
              k={pending.key}
              note={pending.note}
              v={pending.value}
              tone="pewter"
            />
          ) : null}
          {coating.includes.map((step, i) => (
            <KeyValueRow
              key={step}
              k={`Step ${String(i + 1).padStart(2, "0")}`}
              v={step}
              mono={false}
            />
          ))}
        </KeyValueList>

        <div className="tier__foot">
          {/* The tier goes with the click. Without the package key a lead
              off the nine year card and a lead off the three year card
              land in the shop inbox as the same lead. */}
          <PriceOrQuote
            service={SERVICE.quoteKey}
            package={coating.id}
            value={coating.fromPrice}
          />
        </div>
      </div>
    </li>
  );
}

export default function CoatingTiers({ className }: { className?: string }) {
  return (
    <RevealGroup as="ol" className={cn("tiers", className)}>
      {COATINGS.map((c) => (
        <TierCard key={c.id} coating={c} />
      ))}
    </RevealGroup>
  );
}

export { CoatingTiers };
