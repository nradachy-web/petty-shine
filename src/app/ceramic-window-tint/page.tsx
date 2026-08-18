import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import PriceEngine from "@/components/quote/PriceEngine";
import { TintPriceTable } from "@/components/sections/PriceTables";
import ReviewWall from "@/components/sections/ReviewWall";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import FilmSpecTable from "@/components/sections/FilmSpecTable";
import ShadeSelector from "@/components/visualizer/ShadeSelector";
import Gallery from "@/components/sections/Gallery";
import { WORK } from "@/lib/work";
import {
  ATC_SPECS,
  CTX_SPECS,
  FILM_SPEC_FOOTNOTE,
  SEO,
  TINT_ADDONS,
  reviewsFor,
} from "@/lib/constants";
import { money } from "@/lib/utils";

export const metadata: Metadata = {
  title: SEO.ceramicTint.title,
  description: SEO.ceramicTint.description,
  alternates: { canonical: "/ceramic-window-tint/" },
};

const FAQ_CERAMIC = [
  {
    q: "Is ceramic window tint worth the extra money?",
    a: "If the car sits outside or you drive west in the afternoon, yes. LLumar CTX rejects up to 58% of total solar energy and up to 50% of infrared, against 44% and 22% for dyed ATC at the same darkness. On a full vehicle the upgrade runs about $125 to $175 depending on body type, roughly two tanks of gas for the life of the car.",
  },
  {
    q: "Will ceramic tint interfere with my phone, GPS, or keyless entry?",
    a: "No. LLumar publishes CTX as delivering excellent heat rejection without blocking electronic signal transmission. It contains no metal layer, which is what causes interference in cheaper metallic films.",
  },
  {
    q: "Does ceramic tint look different from dyed?",
    a: "From outside, barely. CTX is a color-stable charcoal with no mirrored finish, same as ATC. The difference shows up on your skin, not in the mirror. Sit in a coated car at 3pm in July and you'll feel it immediately.",
  },
  {
    q: "How dark can I go with ceramic tint?",
    a: "CTX runs from a light 50 shade all the way down to a 5% limo. Most daily drivers land at 35 for a factory look or 15 for a noticeably darker one. Stop by and we'll hold shade cards against your glass before you commit to anything.",
  },
  {
    q: "What VLT should I pick?",
    a: "Most drivers land at CTX 35 (37% measured VLT) for a factory look or CTX 15 (20%) for a noticeably darker one. Heat rejection barely changes across the range. CTX 50 still rejects 43% of solar energy versus 58% at CTX 05, so pick the look you want and let the ceramic do the heat work.",
  },
];


export default function CeramicWindowTintPage() {
  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Window Tinting", href: "/window-tinting/" },
          { label: "Ceramic Window Tint", href: "/ceramic-window-tint/" },
        ]}
      />
      <ServiceSchema
        name="Ceramic Window Tint"
        description="LLumar CTX ceramic window film installed in Whitmore Lake, Michigan. Up to 58% total solar energy rejection and up to 50% infrared rejection with no mirrored finish and no signal interference."
        url="/ceramic-window-tint/"
        price={175}
      />

      <PageHero
        eyebrow="LLumar CTX ceramic"
        title={
          <>
            Ceramic window tint
            <br />
            in Whitmore Lake, MI
          </>
        }
        sub="The film you buy when the heat is the problem. LLumar CTX rejects up to 58% of total solar energy and up to 50% of infrared, blocks more than 99% of UV, and does it without a mirrored look or a single bar of lost signal."
        photo="tint-chevelle-black"
        price={`From ${money(TINT_ADDONS.frontTwoCeramic)} · front two windows`}
      />

      <Section tone="paper-2">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow="Why ceramic"
              title="Same darkness. Completely different afternoon."
            />
            <Prose className="mt-6">
              <p>
                Dyed film cuts glare and blocks UV, and it does that well. What it
                doesn&apos;t do is stop the infrared energy that turns a parked car
                into an oven, that&apos;s the number that separates the two films.
              </p>
              <p>
                At the same visible darkness, CTX rejects roughly twice the infrared
                of ATC. You notice it three ways: the cabin cools down faster, the
                A/C stops fighting for the first ten minutes of every drive, and your
                left arm stops cooking on a westbound US-23 commute.
              </p>
            </Prose>
            <ul className="mt-7 space-y-3">
              {[
                "Up to 58% total solar energy rejection",
                "Up to 50% infrared rejection",
                "More than 99% UV blocked (300-380nm)",
                "No metal layer, no GPS, phone, or keyless interference",
                "Color-stable charcoal, no mirrored finish",
                "Manufacturer's lifetime limited warranty*",
              ].map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] leading-snug text-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <PriceEngine heading="Ceramic tint for my vehicle" />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHead
          align="split"
          eyebrow="The numbers"
          title="LLumar CTX, shade by shade."
          intro="Published performance data from Eastman, the manufacturer, rather than our own adjectives. Pick the visible light level you want and read across."
        />
        <div className="mt-10">
          <FilmSpecTable rows={CTX_SPECS} accent />
        </div>

        <h3 className="display-sm mt-14">And the dyed film, for comparison</h3>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
          LLumar ATC at the same shades. Note the infrared column, that&apos;s the
          entire argument for ceramic in one row.
        </p>
        <div className="mt-6">
          <FilmSpecTable rows={ATC_SPECS} />
        </div>

        <p className="mt-6 max-w-3xl text-[0.75rem] leading-relaxed text-muted">
          {FILM_SPEC_FOOTNOTE}
        </p>

        <Link href="/llumar-window-film/" className="btn btn-outline mt-8 inline-flex">
          Full ATC vs CTX comparison
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Section>

      <ShadeSelector defaultFilm="ctx" />

      <Section tone="paper-2">
        <SectionHead
          align="split"
          eyebrow="Ceramic pricing"
          title="What ceramic costs on your vehicle."
          intro="Ceramic is the right column. It runs $125-$175 above dyed on a full vehicle, and $50 on the front two windows."
        />
        <div className="mt-10">
          <TintPriceTable />
        </div>
      </Section>

      <Gallery
        items={WORK.filter((w) => w.category === "tint").slice(0, 6)}
        filterable={false}
        eyebrow="Ceramic installs"
        title="Recent ceramic tint work"
      />

      <ReviewWall items={reviewsFor("ceramic-tint", 3)} eyebrow="Customers" title="What they said afterward" />

      <FAQ items={FAQ_CERAMIC} title="Ceramic tint questions" />

      <CTABand
        title="Get the ceramic number for your car."
        body="Tell us the year, make, and model and we'll send back the exact ceramic price, the shade options, and how long the vehicle needs to be here."
      />
    </>
  );
}
