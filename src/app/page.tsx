import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import HomeHero from "@/components/sections/HomeHero";
import ServiceGrid from "@/components/sections/ServiceGrid";
import { ProofBar, WhyPanel, ProcessPanel } from "@/components/sections/Proof";
import WorkTicker from "@/components/fx/WorkTicker";
import ShadeSelector from "@/components/visualizer/ShadeSelector";
import ReviewWall from "@/components/sections/ReviewWall";
import Gallery from "@/components/sections/Gallery";
import { WORK } from "@/lib/work";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import RuleLabel from "@/components/ui/RuleLabel";
import { TintPriceTable } from "@/components/sections/PriceTables";
import { BRAND, CITIES, FAQ_GENERAL, SEO, reviewsFor } from "@/lib/constants";

export const metadata: Metadata = {
  title: SEO.home.title,
  description: SEO.home.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HomeHero />
      <ProofBar />
      <WorkTicker />
      <ServiceGrid />

      {/* published pricing, the wedge nobody else in this market touches */}
      <section className="section bg-paper-2">
        <div className="container-site">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <RuleLabel>Published pricing</RuleLabel>
              <h2 className="display-lg mt-6">
                Nobody else around here will print this table.
              </h2>
            </div>
            <p className="leading-relaxed text-muted md:col-span-5">
              Full-vehicle window tint by body type, in both films, with how long
              the car is actually here. No form to fill out, no &ldquo;call for
              pricing.&rdquo; Final numbers are confirmed before anything gets
              scheduled.
            </p>
          </div>

          <div className="mt-10">
            <TintPriceTable showNotes={false} />
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/pricing/" className="btn btn-ink">
              Every service, every price
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/quote/" className="btn btn-outline">
              Build my quote
            </Link>
          </div>
        </div>
      </section>

      <ShadeSelector />
      <WhyPanel />

      <Gallery
        items={WORK.slice(0, 6)}
        filterable={false}
        eyebrow="Recent work"
        title="Real cars, from this bay"
        intro="Daily drivers, work trucks, classics, and the occasional Bentley. Every photo on this site is a vehicle finished at 10170 Industrial Drive."
      />
      <div className="container-wide -mt-6 pb-16 md:pb-20">
        <Link href="/gallery/" className="btn btn-outline">
          See the full gallery
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <ReviewWall
        items={reviewsFor("home", 6)}
        title="Five stars, 103 times out of 105."
        intro="Pulled verbatim from our Google Business Profile. The one four-star review is in there too, we're not going to pretend otherwise."
      />

      <ProcessPanel />

      {/* service area */}
      <section className="section bg-paper-2">
        <div className="container-site">
          <div className="max-w-2xl">
            <RuleLabel>Service area</RuleLabel>
            <h2 className="display-md mt-6">
              Everything inside about fifteen miles of Whitmore Lake.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              We&apos;re a shop, not a van, so the question is how far you&apos;re
              driving, not how far we are. Every distance below is measured
              from that town centre to our door.
            </p>
          </div>

          <div className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/window-tinting/${c.slug}/`}
                className="group bg-paper-2 p-5 transition-colors hover:bg-white"
              >
                <span className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-tight text-ink-text transition-colors group-hover:text-red">
                  <MapPin className="h-4 w-4 text-red" aria-hidden />
                  {c.name}
                </span>
                <span className="mt-2 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                  {c.miles} mi · about {c.minutes} min
                </span>
                <span className="mt-1 block text-[0.8125rem] text-muted">{c.county}</span>
              </Link>
            ))}
            {/* seven towns in a four-up grid leaves one orphan cell, which
                would otherwise expose the container's hairline colour */}
            <div className="hidden bg-paper-2 sm:block" aria-hidden />
          </div>
        </div>
      </section>

      <FAQ
        items={FAQ_GENERAL}
        title="The questions we get asked most"
        intro={`Straight answers about timing, drop-off, warranties, and what we will and won't do. Anything not covered here, call or text ${BRAND.phoneDisplay}.`}
      />

      <CTABand />
    </>
  );
}
