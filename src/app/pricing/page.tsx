import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead } from "@/components/ui/Section";
import PriceEngine from "@/components/quote/PriceEngine";
import {
  TintPriceTable,
  CoatingTiers,
  PpfTiers,
  CorrectionTiers,
  DetailSizeTable,
} from "@/components/sections/PriceTables";
import CTABand from "@/components/sections/CTABand";
import { SEO, TINT_NOTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Window Tint, PPF and Ceramic Coating Prices | Whitmore Lake, MI",
  description: SEO.pricing.description,
  alternates: { canonical: "/pricing/" },
};

const JUMPS = [
  { label: "Window tint", href: "#window-tint" },
  { label: "Paint protection film", href: "#ppf" },
  { label: "Ceramic coating", href: "#ceramic-coating" },
  { label: "Paint correction", href: "#paint-correction" },
  { label: "Detailing", href: "#detailing" },
];

export default function PricingPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Pricing", href: "/pricing/" }]} />

      <PageHero
        eyebrow="Every service, every price"
        title={
          <>
            What it costs.
            <br />
            All of it.
          </>
        }
        sub="No packages named after precious metals, no 'call for pricing', no form standing between you and a number. These are the same figures we quote on the phone. Final pricing is confirmed against your specific vehicle before anything is scheduled."
        photo="tint-durango-srt"
        compact
      />

      <div className="border-b border-line bg-paper-2">
        <div className="no-bar container-wide flex gap-2 overflow-x-auto py-4">
          {JUMPS.map((j) => (
            <a
              key={j.href}
              href={j.href}
              className="shrink-0 border border-line bg-white px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-body transition-colors hover:border-red hover:text-red"
            >
              {j.label}
            </a>
          ))}
        </div>
      </div>

      <Section id="window-tint">
        <SectionHead
          align="split"
          eyebrow="Window tint"
          title="Window tint pricing"
          intro="Full-vehicle pricing covers all side and back windows in the film you choose. Front two windows and the full windshield are priced separately."
        />
        <div className="mt-10">
          <TintPriceTable showNotes={false} />
          <ul className="mt-6 space-y-2">
            {TINT_NOTES.map((n) => (
              <li key={n} className="flex gap-3 text-[0.875rem] leading-relaxed text-muted">
                <span className="mt-2 h-px w-3 shrink-0 bg-red" aria-hidden />
                {n}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 lg:max-w-2xl">
          <PriceEngine heading="Price my exact vehicle" />
        </div>
      </Section>

      <Section tone="paper-2" id="ppf">
        <SectionHead
          align="split"
          eyebrow="Paint protection film"
          title="PPF pricing"
          intro="GeoShield Ceramic Shield, 6.5-mil, with a 10-year manufacturer warranty. Final pricing depends on vehicle size, paint condition, and coverage."
        />
        <div className="mt-10">
          <PpfTiers />
        </div>
      </Section>

      <Section id="ceramic-coating">
        <SectionHead
          align="split"
          eyebrow="Ceramic coating"
          title="Ceramic coating pricing"
          intro="Every tier includes hand wash, chemical decontamination, clay bar, and at least one stage of machine polishing. Additional correction is quoted after inspection."
        />
        <div className="mt-10">
          <CoatingTiers />
        </div>
      </Section>

      <Section tone="paper-2" id="paint-correction">
        <SectionHead
          align="split"
          eyebrow="Paint correction"
          title="Paint correction pricing"
          intro="Which level a car needs comes out of the inspection, paint thickness and defect severity vary enormously between two of the same model."
        />
        <div className="mt-10">
          <CorrectionTiers />
        </div>
      </Section>

      <Section id="detailing">
        <SectionHead
          align="split"
          eyebrow="Detailing"
          title="Detailing pricing"
          intro="Starting prices for vehicles in average condition. Heavy pet hair, severe staining, mold, or construction grime need a conversation first, those aren't standard slots."
        />
        <div className="mt-10">
          <DetailSizeTable />
        </div>
      </Section>

      <CTABand
        eyebrow="Confirm your number"
        title="The prices are real. The quote makes them exact."
        body="Send the year, make, model, and what you want done. You'll get the confirmed price and the next available slot, usually the same day during shop hours."
      />
    </>
  );
}
