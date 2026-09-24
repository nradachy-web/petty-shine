import ServiceLanding, { hubMetadata } from "@/components/landing/ServiceLanding";
import { KeyValueList, KeyValueRow, SectionHead } from "@/components/ui";
import { PriceOrQuote } from "@/components/ui/PriceFigure";
import { DETAIL_PACKAGES, QUOTE_CTA_LABEL } from "@/lib/constants";
import { trackById } from "@/lib/landing";

const T = trackById("paint-correction")!;
const LEVELS = ["level-2", "level-3"].map((id) => DETAIL_PACKAGES.find((p) => p.id === id)!);

export const metadata = hubMetadata(T);

/** The two levels, the one decision this page exists to help with. */
export default function PaintCorrectionPage() {
  return (
    <ServiceLanding
      track={T}
      detailLabel="Two levels"
      detail={
        <>
          <SectionHead
            title="How far do you want it taken."
            intro={
              <p>
                Both levels are machine polishing on the same paint. What changes is how many stages it takes, how much clear coat comes off, and how much of the damage goes with it.
              </p>
            }
          />
          <KeyValueList className="mt-8 md:mt-10" label="Paint correction levels">
            {LEVELS.map((pkg) => (
              <KeyValueRow
                key={pkg.id}
                k={"subtitle" in pkg ? `${pkg.name}, ${pkg.subtitle}` : pkg.name}
                v={pkg.blurb}
                mono={false}
              />
            ))}
            <KeyValueRow
              k="Price"
              v={<PriceOrQuote service={T.quoteKey} value={null} quoteLabel={QUOTE_CTA_LABEL} />}
              tone="pewter"
            />
          </KeyValueList>
        </>
      }
    />
  );
}
