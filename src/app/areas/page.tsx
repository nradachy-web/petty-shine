import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import CTABand from "@/components/sections/CTABand";
import Photo from "@/components/ui/Photo";
import { CITIES } from "@/lib/constants";
import type { PhotoId } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Service Area, Whitmore Lake, Ann Arbor, Brighton & Livingston County",
  description:
    "HD Auto Studio serves drivers across Washtenaw and Livingston County from one shop in Whitmore Lake. Measured drive distances from Ann Arbor, Brighton, South Lyon, Pinckney, Hamburg, and Dexter.",
  alternates: { canonical: "/areas/" },
};

export default function AreasPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Service Area", href: "/areas/" }]} />

      <PageHero
        eyebrow="Service area"
        title={
          <>
            One shop.
            <br />
            Fifteen miles.
          </>
        }
        sub="We don't do mobile work, so the question is how far you're driving. Every distance below is a measured road distance from that town centre to our door, not a marketing radius."
        photo="shop-exterior"
        compact
      />

      <Section>
        <Prose className="max-w-3xl">
          <p>
            HD Auto Studio is at 10170 Industrial Drive in Whitmore Lake, just off
            Main Street and minutes from US-23. That puts most of Washtenaw and
            southern Livingston County inside a twenty-minute drive, and Brighton and
            Hamburg inside fifteen.
          </p>
          <p>
            Howell, Novi, and Ypsilanti are all outside that radius, around twenty
            miles or more. We&apos;re happy to work on those vehicles, we&apos;re just
            not going to pretend we&apos;re local to them.
          </p>
        </Prose>

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => (
            <Link key={c.slug} href={`/window-tinting/${c.slug}/`} className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-graphite">
                <Photo
                  id={c.photo as PhotoId}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 border-t-2 border-ink-text pt-3">
                <h2 className="flex items-start justify-between gap-3 font-display text-xl font-bold uppercase tracking-tight text-ink-text transition-colors group-hover:text-red">
                  {c.name}
                  <ArrowUpRight
                    className="mt-0.5 h-5 w-5 shrink-0 text-red transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </h2>
                <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-red">
                  {c.miles} mi · about {c.minutes} min · {c.county}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                  {c.route}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper-2">
        <SectionHead
          eyebrow="Further out"
          title="Coming from further than that?"
          intro="Plenty of vehicles come from Howell, Novi, Northville, Ypsilanti, and Ann Arbor's far side. For a coating or a full PPF install, work that needs an overnight cure anyway, the extra ten minutes rarely matters. For a front-window tint, it's your call."
        />
      </Section>

      <CTABand />
    </>
  );
}
