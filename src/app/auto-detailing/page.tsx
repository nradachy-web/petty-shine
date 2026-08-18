import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import { DetailTiers, DetailSizeTable } from "@/components/sections/PriceTables";
import ReviewWall from "@/components/sections/ReviewWall";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import { SEO, SPECIAL_CONDITIONS, reviewsFor } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Auto Detailing in Whitmore Lake, MI | Interior & Exterior",
  description: SEO.detailing.description,
  alternates: { canonical: "/auto-detailing/" },
};

const FAQ_DETAIL = [
  {
    q: "How long does a detail take?",
    a: "Most interior details run 3-6 hours. Interior and exterior together is usually 5-7. Vehicles with heavy contamination or special conditions take longer, and we'll tell you that before you book rather than at 4pm.",
  },
  {
    q: "Why is pricing listed as 'starting at'?",
    a: "Starting prices reflect vehicles in average condition. Final pricing depends on size, condition, and how much work it takes to get a proper result. Excessive pet hair, heavy staining, or long neglect all move the number.",
  },
  {
    q: "Do you need to see the vehicle before confirming pricing?",
    a: "It helps, but it isn't required in most normal cases. If your vehicle falls into one of the special conditions below, contact us ahead of time so we schedule enough time for it.",
  },
  {
    q: "Can every stain, odor, or bit of pet hair be removed?",
    a: "We achieve significant improvement in most cases, but no, not everything comes out. Results depend on material, severity, and how long it's been there. We'd rather set that expectation up front than oversell it.",
  },
  {
    q: "Will you perform extra services without asking?",
    a: "Never. If we find trouble areas or think something else is worth doing, we contact you first and let you decide. You will not be charged for work you didn't approve.",
  },
  {
    q: "What's the difference between exterior detailing and ceramic coating?",
    a: "An exterior detail cleans and decontaminates, then adds short-term protection with a ceramic sealant (System X Renew). A ceramic coating is a durable, years-long layer that requires far more preparation and is quoted separately.",
  },
  {
    q: "Do you offer maintenance details?",
    a: "Yes, for returning vehicles that have been properly maintained. Even without a coating, most vehicles benefit from a professional exterior detail once a year to catch buildup before it compounds.",
  },
  {
    q: "Can I drop off after hours?",
    a: "Yes. Overnight drop-offs go in the rear parking area with a secure key drop box on the side of the building, and we'll provide a code for after-hours pickup.",
  },
];

export default function DetailingPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Auto Detailing", href: "/auto-detailing/" }]} />
      <ServiceSchema
        name="Auto Detailing"
        description="Interior and exterior auto detailing in Whitmore Lake, Michigan, with extraction, decontamination, and ceramic sealant. Priced by vehicle size and condition."
        url="/auto-detailing/"
        price={200}
      />

      <PageHero
        eyebrow="Interior &amp; exterior"
        title={
          <>
            Auto detailing
            <br />
            in Whitmore Lake, MI
          </>
        }
        sub="Real-world messes handled properly: embedded dirt, spills, road salt, pet hair, and the buildup a car wash never touches. Extraction and agitation inside, decontamination and ceramic sealant outside."
        photo="detail-interior-before"
        price="From $200 · exterior detail"
      />

      <Section>
        <SectionHead
          align="split"
          eyebrow="Packages"
          title="Three ways to book it."
          intro="Every package is tailored to the condition of the vehicle rather than run through a fixed checklist. Starting prices below are for vehicles in average condition."
        />
        <div className="mt-10">
          <DetailTiers />
        </div>
      </Section>

      <Section tone="paper-2" id="pricing">
        <SectionHead
          align="split"
          eyebrow="By vehicle size"
          title="Starting prices, printed."
          intro="Larger vehicles take longer, so they cost more. That's the whole formula, no packages named after precious metals."
        />
        <div className="mt-10">
          <DetailSizeTable />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHead
              eyebrow="Tell us first"
              title="Some vehicles need more than a standard slot."
            />
            <Prose className="mt-6">
              <p>
                We&apos;re equipped for nearly anything and happy to take on the ugly
                jobs, but standard scheduling times and prices don&apos;t reflect
                extreme conditions. If your vehicle is on this list, let us know before
                booking so we can set aside the right amount of time.
              </p>
            </Prose>
          </div>
          <div className="md:col-span-7">
            <div className="plate p-6 md:p-7">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red" aria-hidden />
                <ul className="space-y-3">
                  {SPECIAL_CONDITIONS.map((c) => (
                    <li key={c} className="text-[0.9375rem] leading-snug text-body">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <ReviewWall
        items={reviewsFor("detailing", 3)}
        eyebrow="Detailing customers"
        title="Including the jobs nobody wants"
      />

      <FAQ items={FAQ_DETAIL} title="Detailing questions" />

      <CTABand
        title="Send a photo of the mess."
        body="Text a couple of pictures of the interior and we'll come back with a realistic price and time, including whether it falls into the special-conditions bucket."
      />
    </>
  );
}
