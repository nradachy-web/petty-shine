import ServiceLanding, { hubMetadata } from "@/components/landing/ServiceLanding";
import { DatumRule, SectionHead } from "@/components/ui";
import QuoteLink from "@/components/ui/QuoteLink";
import { trackById } from "@/lib/landing";

const T = trackById("window-tinting")!;

export const metadata = hubMetadata(T);

/** The common ways a car gets tinted. No prices: every one is quoted on
    the glass, and the quote link carries the service into the form. */
const SETUPS = [
  { name: "Front two windows", body: "Match the factory rear tint, or add comfort and privacy up front." },
  { name: "Full vehicle", body: "Every side and rear window for complete comfort, privacy and UV protection." },
  { name: "Full vehicle with windshield strip", body: "Everything above plus a strip across the top of the windshield to cut sun and glare." },
  { name: "Clear windshield film", body: "Heat and UV rejection on the full windshield with a near clear film. Ask whether it suits your vehicle." },
] as const;

/** The process, in the order it happens in the shop. */
const PROCESS = [
  { title: "Free quote and consult", body: "Tell us your year, make and model and what you want from the tint. We recommend the right film and setup." },
  { title: "Prep and clean", body: "Every window is cleaned and decontaminated so nothing is trapped under the film." },
  { title: "Cut and fit", body: "Film is cut and shaped to your exact glass. Curved rear glass is heat shaped first so it lies flat." },
  { title: "Careful install", body: "Applied by hand, every bit of haze and water worked out, sharp edges and no bubbles." },
  { title: "Cure and care", body: "We explain the cure time and aftercare so the tint sets properly, and confirm the warranty for your vehicle." },
] as const;

export default function WindowTintingPage() {
  return (
    <ServiceLanding
      track={T}
      showSteps={false}
      detailLabel="Setups"
      detail={
        <>
          <SectionHead
            align="split"
            title="Pick the setup that fits."
            intro={
              <p>
                Not sure? Say how the car is used and we will recommend the right call with your free quote. Every setup is priced on your glass.
              </p>
            }
          />
          <ol className="lp-checks mt-8 md:mt-10">
            {SETUPS.map((s, i) => (
              <li key={s.name} className="lp-check">
                <span className="lp-check__mark font-mono text-[0.6875rem] leading-none tracking-[0.18em] text-cyan-ink" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="lp-check__title">{s.name}</h3>
                  <p className="lp-check__body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <QuoteLink service={T.quoteKey}>Get a free quote</QuoteLink>
          </div>

          <DatumRule label="Our process" className="mb-8 mt-16 md:mt-20" />
          <ol className="lp-steps">
            {PROCESS.map((s) => (
              <li key={s.title} className="lp-step">
                <h3 className="lp-step__title">{s.title}</h3>
                <p className="lp-step__body">{s.body}</p>
              </li>
            ))}
          </ol>
        </>
      }
    />
  );
}
