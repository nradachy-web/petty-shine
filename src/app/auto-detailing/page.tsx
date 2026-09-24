import ServiceLanding, { hubMetadata } from "@/components/landing/ServiceLanding";
import { RuleLabel, SectionHead } from "@/components/ui";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import { DETAIL_PACKAGES, QUOTE_CTA_LABEL } from "@/lib/constants";
import { trackById } from "@/lib/landing";

const T = trackById("auto-detailing")!;

export const metadata = hubMetadata(T);

/** The five levels, stacked, each carrying the work below it. */
export default function AutoDetailingPage() {
  return (
    <ServiceLanding
      track={T}
      detailLabel="Levels"
      detail={
        <>
          <SectionHead
            title="What each level actually does."
            intro={
              <p>
                The levels stack, so each one carries the work below it. Pick by what the paint looks like now rather than by name, and if you are not sure, say what you see.
              </p>
            }
          />
          <div className="mt-8 border-b border-rule-light md:mt-10">
            {DETAIL_PACKAGES.map((pkg, i) => (
              <article key={pkg.id} id={pkg.id} className="min-w-0 border-t border-rule-light py-6">
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="ps-heading min-w-0 text-[1.2rem] md:text-[1.4rem]">
                    <span className="mr-3 font-mono text-[0.6875rem] tracking-[0.26em] text-ink-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {pkg.name}
                  </h3>
                  <PriceOrQuote service={T.quoteKey} value={pkg.fromPrice} quoteLabel={`${QUOTE_CTA_LABEL}, ${pkg.name}`} />
                </div>
                {"subtitle" in pkg ? (
                  <div className="mt-2">
                    <RuleLabel>{pkg.subtitle}</RuleLabel>
                  </div>
                ) : null}
                <p className="ps-prose mt-3 max-w-2xl">{pkg.blurb}</p>
              </article>
            ))}
          </div>
        </>
      }
    />
  );
}
