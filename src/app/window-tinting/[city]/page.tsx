import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Navigation } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import PriceEngine from "@/components/quote/PriceEngine";
import { TintPriceTable } from "@/components/sections/PriceTables";
import ReviewWall from "@/components/sections/ReviewWall";
import FAQ from "@/components/sections/FAQ";
import CTABand from "@/components/sections/CTABand";
import ServiceSchema from "@/components/seo/ServiceSchema";
import Photo from "@/components/ui/Photo";
import { BRAND, CITIES, FAQ_TINT, SERVICES, reviewsFor } from "@/lib/constants";
import type { PhotoId } from "@/lib/photos";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const c = CITIES.find((x) => x.slug === city);
  if (!c) return {};

  // Titles are deliberately varied rather than a [City] template,
  // repeated boilerplate across sibling pages is exactly what Google's
  // title guidance warns about, and what makes a city layer look thin.
  const title =
    c.slug === "whitmore-lake"
      ? "Window Tinting in Whitmore Lake, MI, Our Home Shop"
      : `Window Tinting for ${c.name}, MI, ${c.minutes} Minutes via ${c.route
          .split(" ")
          .slice(0, 2)
          .join(" ")}`;

  return {
    title,
    description: `LLumar window tint, PPF and ceramic coating for ${c.name} drivers, ${c.miles} miles from our Whitmore Lake shop. Published pricing by vehicle type and a straight answer on Michigan tint law.`,
    alternates: { canonical: `/window-tinting/${c.slug}/` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const c = CITIES.find((x) => x.slug === city);
  if (!c) notFound();

  const others = CITIES.filter((x) => x.slug !== c.slug);

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Window Tinting", href: "/window-tinting/" },
          { label: c.name, href: `/window-tinting/${c.slug}/` },
        ]}
      />
      <ServiceSchema
        name={`Window Tinting for ${c.name}, MI`}
        description={`LLumar automotive window film installed at HD Auto Studio in Whitmore Lake, ${c.miles} miles from ${c.name}, Michigan.`}
        url={`/window-tinting/${c.slug}/`}
        price={125}
      />

      <PageHero
        eyebrow={`${c.name} · ${c.county}`}
        title={
          <>
            Window tinting for
            <br />
            {c.name} drivers
          </>
        }
        sub={c.angle}
        photo={c.photo as PhotoId}
        price={`${c.miles} mi · about ${c.minutes} min`}
      />

      {/* the drive, stated plainly */}
      <section className="border-b border-line bg-paper-2">
        <div className="container-wide grid gap-px bg-line sm:grid-cols-3">
          {[
            { n: `${c.miles} mi`, l: `from ${c.name} to our door` },
            { n: `~${c.minutes} min`, l: "typical drive time" },
            { n: "Under 1 hr", l: "most front-window installs" },
          ].map((s) => (
            <div key={s.l} className="bg-paper-2 px-5 py-7 text-center">
              <p className="price text-[2.25rem] leading-none">{s.n}</p>
              <p className="mt-2 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-muted">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHead
              eyebrow="Getting here"
              title={`${c.name} to 10170 Industrial Drive`}
            />
            <p className="mt-6 flex items-start gap-3 border-l-2 border-red pl-4 text-[0.9375rem] leading-relaxed text-body">
              <Navigation className="mt-1 h-4 w-4 shrink-0 text-red" aria-hidden />
              {c.route}
            </p>
            <Prose className="mt-6">
              <p>{c.detail}</p>
            </Prose>

            <ul className="mt-7 space-y-3">
              {[
                "Published pricing by body type, no callback required",
                "Indoor bay, controlled lighting and temperature",
                "Wait in the lobby for shorter work, or use the secure key drop",
                "Shop only, never mobile, that's why results repeat",
              ].map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] leading-snug text-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <PriceEngine heading={`Price my ${c.name} vehicle`} />
          </div>
        </div>
      </Section>

      <Section tone="paper-2">
        <SectionHead
          align="split"
          eyebrow="Pricing"
          title="Same published rates, wherever you drive from."
          intro="We don't price by ZIP code. The table below is what your vehicle costs, full stop."
        />
        <div className="mt-10">
          <TintPriceTable showNotes={false} />
        </div>
      </Section>

      {/* other services, this page is a destination, not a funnel */}
      <Section tone="paper-2">
        <SectionHead
          eyebrow="Also for you"
          title={`Everything else we do for ${c.name} vehicles`}
        />
        <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.filter((s) => s.id !== "window-tinting").map((s) => (
            <Link key={s.id} href={s.href} className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-graphite">
                <Photo
                  id={s.photo as PhotoId}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-4 border-t-2 border-ink-text pt-3 font-display text-lg font-bold uppercase tracking-tight text-ink-text transition-colors group-hover:text-red">
                {s.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-snug text-muted">{s.line}</p>
            </Link>
          ))}
        </div>
      </Section>

      <ReviewWall
        items={reviewsFor(c.reviewTag, 3)}
        eyebrow="Customers"
        title="From our Google reviews"
        intro={`5.0 across 105 reviews. Here are three of them.`}
      />

      <FAQ
        items={[c.faq, ...FAQ_TINT.slice(0, 5)]}
        title={`${c.name} questions`}
        intro={`Anything else, call or text ${BRAND.phoneDisplay}.`}
      />

      <Section tone="paper-2">
        <SectionHead eyebrow="Nearby" title="Other towns we serve" />
        <div className="mt-8 flex flex-wrap gap-2.5">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/window-tinting/${o.slug}/`}
              className="border border-line bg-white px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-body transition-colors hover:border-red hover:text-red"
            >
              {o.name} · {o.miles} mi
            </Link>
          ))}
        </div>
      </Section>

      <CTABand
        eyebrow={`${c.name} quotes`}
        title="Send the vehicle. Get the number."
        body={`We're ${c.miles} miles away and the price is already on this page. Tell us the year, make, and model and we'll confirm it plus the next opening.`}
      />
    </>
  );
}
