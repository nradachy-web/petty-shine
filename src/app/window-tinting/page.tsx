import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead } from "@/components/ui/Section";
import PriceEngine from "@/components/quote/PriceEngine";
import { TintPriceTable } from "@/components/sections/PriceTables";
import Gallery from "@/components/sections/Gallery";
import { WORK } from "@/lib/work";
import ReviewWall from "@/components/sections/ReviewWall";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import ShadeSelector from "@/components/visualizer/ShadeSelector";
import {
  BRAND,
  CITIES,
  FAQ_TINT,
  SEO,
  TINT_FILMS,
  reviewsFor,
} from "@/lib/constants";
import { money } from "@/lib/utils";

export const metadata: Metadata = {
  title: SEO.windowTinting.title,
  description: SEO.windowTinting.description,
  alternates: { canonical: "/window-tinting/" },
};

export default function WindowTintingPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Window Tinting", href: "/window-tinting/" }]} />
      <ServiceSchema
        name="Automotive Window Tinting"
        description="LLumar ATC dyed and CTX ceramic window film installed in-house in Whitmore Lake, Michigan, with published pricing by vehicle body type."
        url="/window-tinting/"
        price={125}
      />

      <PageHero
        eyebrow="Automotive window tint"
        title={
          <>
            Car window tinting in
            <br />
            Whitmore Lake, MI
          </>
        }
        sub="Computer-cut LLumar film, installed in a lit indoor bay by the person who owns the shop. Dyed film starts at $125 for the front two windows, and full vehicles are priced by body type right on this page."
        photo="tint-trans-am"
        ctaLabel="Price my vehicle"
      />

      {/* instant price */}
      <Section tone="paper-2">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow="Start here"
              title="Your car, your number, right now."
              intro="Pick the vehicle and we'll price it from the same rate sheet we quote over the phone. The two decisions left are film and shade, and the preview further down helps with both."
            />
            <ul className="mt-7 space-y-3">
              {[
                "Same-day and next-day openings are common for front-window work",
                "Front windows are usually under an hour, wait in the lobby",
                "Secure key drop and rear parking for after-hours drop-off",
                "Lifetime limited manufacturer warranty on LLumar film*",
              ].map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] leading-snug text-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <PriceEngine heading="What will tint cost for my vehicle?" />
          </div>
        </div>
      </Section>

      {/* film choice */}
      <Section>
        <SectionHead
          align="split"
          eyebrow="Two films"
          title="Dyed or ceramic. The difference is heat."
          intro={
            <>
              <p>
                Both are LLumar, both are color-stable, both block more than 99% of
                UV. Ceramic costs more because it rejects far more of the heat you
                actually feel, and it does it without a mirrored look or signal
                interference.
              </p>
              <Link href="/llumar-window-film/" className="btn btn-outline mt-5 inline-flex">
                Compare the full spec sheets
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </>
          }
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TINT_FILMS.map((f) => (
            <div key={f.id} className="plate flex h-full flex-col p-6 md:p-7">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-red">
                {f.product}
              </span>
              <h3 className="display-sm mt-2">{f.name}</h3>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="price-from">from</span>
                <span className="price text-[2.25rem] leading-none">
                  {money(f.fromPrice)}
                </span>
              </p>
              <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                {f.fromLabel}
              </p>
              <p className="mt-5 text-[0.9375rem] font-medium text-ink-text">
                Best for: {f.bestFor}
              </p>
              <ul className="mt-4 space-y-2.5">
                {f.points.map((p) => (
                  <li
                    key={p}
                    className="flex gap-2.5 text-[0.875rem] leading-snug text-body"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <ShadeSelector />

      {/* full price table */}
      <Section tone="paper-2" id="pricing">
        <SectionHead
          align="split"
          eyebrow="Full price list"
          title="Full-vehicle tint, by body type."
          intro="All side and back windows. Windshield, sunroof, and removal of existing tint are priced separately. Classic vehicles are quoted individually because the glass rarely matches a pattern."
        />
        <div className="mt-10">
          <TintPriceTable />
        </div>
      </Section>

      <Gallery
        items={WORK.filter((w) => w.category === "tint")}
        filterable={false}
        eyebrow="Tint work"
        title="Cars we've tinted"
        intro="Trucks, classics, daily drivers, and the odd Trans Am. Every one of these was filmed in our bay in Whitmore Lake."
      />

      <ReviewWall
        items={reviewsFor("tint", 3)}
        eyebrow="Tint customers"
        title="What tint customers say"
        intro="Verbatim from Google. No bubbles, no fading, no drama."
      />

      <FAQ
        items={FAQ_TINT}
        title="Window tint questions"
        intro={`Anything else, call or text ${BRAND.phoneDisplay}, you'll get Justin, not a call center.`}
      />

      {/* areas */}
      <Section tone="paper-2">
        <SectionHead
          eyebrow="Nearby"
          title="Tint customers drive here from all over the US-23 corridor."
        />
        <div className="mt-8 flex flex-wrap gap-2.5">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/window-tinting/${c.slug}/`}
              className="border border-line bg-white px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-body transition-colors hover:border-red hover:text-red"
            >
              {c.name} · {c.miles} mi
            </Link>
          ))}
        </div>
        <p className="mt-6 text-[0.8125rem] text-muted">
          * LLumar films carry a manufacturer&apos;s lifetime limited warranty.
          Certain restrictions apply, see dealer for warranty details.
        </p>
      </Section>

      <CTABand
        title="Tell us the vehicle. We'll tell you the number."
        body="Most tint jobs are quoted in one message. Send the year, make, and model, or just a photo of the car, and we'll come back with the exact price and the next opening."
      />
    </>
  );
}
