import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import { CorrectionTiers } from "@/components/sections/PriceTables";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import Photo from "@/components/ui/Photo";
import { CORRECTION_CAN, CORRECTION_CANNOT, SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Paint Correction and Swirl Removal in Whitmore Lake, MI",
  description: SEO.correction.description,
  alternates: { canonical: "/paint-correction/" },
};

const FAQ_CORRECTION = [
  {
    q: "How long does paint correction take?",
    a: "One full day to several days, depending on vehicle size, paint condition, and the level of correction. We set the timeframe during the inspection so you're not guessing.",
  },
  {
    q: "Will paint correction remove all scratches?",
    a: "It removes or significantly reduces surface-level defects. Scratches through the clear coat can't be safely polished out and may need paint. We'll tell you which category yours fall into before we start, not after.",
  },
  {
    q: "Is paint correction safe for my vehicle?",
    a: "When it's done correctly. Correction removes a very small, controlled amount of clear coat to level the surface. We won't attempt a correction that would compromise clear coat thickness, that's a permanent problem in exchange for a temporary improvement.",
  },
  {
    q: "How long do the results last?",
    a: "The correction itself is permanent, you removed the defects. Keeping it that way depends on how the car is washed. Most customers add a ceramic coating afterward to protect the finish they just paid for and make maintenance safer.",
  },
  {
    q: "Do I need a coating after correction?",
    a: "Not required, strongly recommended. Correction restores the paint; a coating protects the corrected finish and makes ongoing washing far less likely to reintroduce swirls.",
  },
  {
    q: "Is paint correction the same as waxing?",
    a: "No. Wax can temporarily improve appearance and often hides defects. Correction refines the paint itself so the defects are gone rather than filled.",
  },
  {
    q: "Why does pricing require an inspection?",
    a: "Because defect severity, paint thickness, and overall condition vary wildly between two cars of the same model. An inspection lets us recommend the right level and give you an accurate number instead of a range.",
  },
];

export default function PaintCorrectionPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Paint Correction", href: "/paint-correction/" }]} />
      <ServiceSchema
        name="Paint Correction"
        description="One, two, and three-step machine paint correction in Whitmore Lake, Michigan. Swirl marks, oxidation, water spots, and light scratches permanently reduced."
        url="/paint-correction/"
        price={500}
      />

      <PageHero
        eyebrow="Machine polishing"
        title={
          <>
            Paint correction
            <br />
            in Whitmore Lake, MI
          </>
        }
        sub="Swirl marks, wash scratches, oxidation, and water spot etching, removed rather than hidden. Nearly ten years of hands-on correction on everything from daily drivers to Porsche, Bentley, and show cars."
        photo="correction-yukon"
        price="From $500 · one-step"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHead
              eyebrow="What it is"
              title="Removing defects, not filling them."
            />
            <Prose className="mt-6">
              <p>
                Paint correction is the process of removing defects from the clear
                coat, swirl marks, light scratches, scuffs, oxidation, water spots,
                and general haze. Unlike a wax or glaze that temporarily masks them,
                correction permanently refines the surface.
              </p>
              <p>
                Done wrong it can permanently damage a finish, which is why it needs
                patience, proper technique, and a real understanding of clear coat
                limits. Every vehicle here gets approached individually, with the goal
                of the best achievable result that still leaves the paint healthy.
              </p>
            </Prose>
          </div>

          <div className="lg:col-span-6 grid gap-px bg-line sm:grid-cols-2">
            <div className="bg-paper-2 p-6">
              <h3 className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-good">
                <Check className="h-4 w-4" aria-hidden /> Can fix
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.875rem] leading-snug text-body">
                {CORRECTION_CAN.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="bg-paper-2 p-6">
              <h3 className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-red">
                <X className="h-4 w-4" aria-hidden /> Can&apos;t fix
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.875rem] leading-snug text-body">
                {CORRECTION_CANNOT.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper-2" id="pricing">
        <SectionHead
          align="split"
          eyebrow="Levels"
          title="One step, two step, or everything we've got."
          intro="Which level a vehicle needs comes out of the inspection. Level 1 is included with every ceramic coating we install."
        />
        <div className="mt-10">
          <CorrectionTiers />
        </div>
      </Section>

      <Section tone="wall">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <SectionHead
              tone="light"
              eyebrow="The natural next step"
              title="Correct it, then protect it."
              intro="Correction restores the paint. A ceramic coating is what keeps the result from being undone by the next six months of washing. Every coating we sell includes at least one stage of correction for exactly this reason."
            />
            <Link href="/ceramic-coating/" className="btn btn-primary mt-7 inline-flex">
              Ceramic coating options
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="md:col-span-5">
            <div className="aspect-[4/3] overflow-hidden">
              <Photo id="coating-lincoln-white" sizes="(min-width: 768px) 40vw, 100vw" />
            </div>
          </div>
        </div>
      </Section>

      <FAQ items={FAQ_CORRECTION} title="Paint correction questions" />

      <CTABand
        eyebrow="Book an inspection"
        title="Bring it in and we'll tell you what's actually achievable."
        body="Correction quotes need eyes on the paint. We'll show you what a test section looks like, explain what will and won't come out, and price it from there."
      />
    </>
  );
}
