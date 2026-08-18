import type { Metadata } from "next";
import { Star, ExternalLink } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Section, SectionHead, Prose } from "@/components/ui/Section";
import CTABand from "@/components/sections/CTABand";
import { BRAND, RATING, REVIEWS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Customer Reviews, 5.0 Across 105 Google Reviews",
  description:
    "5.0 from 105 Google reviews as of August 2026, and 98% recommend on Facebook from 41 reviews. Verbatim customer reviews of HD Auto Studio in Whitmore Lake, Michigan.",
  alternates: { canonical: "/reviews/" },
};

export default function ReviewsPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Reviews", href: "/reviews/" }]} />

      <PageHero
        eyebrow="Reputation"
        title={
          <>
            5.0 across
            <br />
            105 Google reviews
          </>
        }
        sub="103 of them are five stars, one is four, and one is one. That last one is a complaint about how long a windshield took. We're leaving all three numbers on the page."
        photo="tint-chevelle-blue"
        compact
        ctaLabel="Get your quote"
      />

      <Section>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { n: RATING.value.toFixed(1), l: `Google rating · ${RATING.count} reviews` },
            { n: `${RATING.fiveStar}`, l: "five-star reviews" },
            {
              n: `${RATING.facebook.recommendPct}%`,
              l: `recommend on Facebook · ${RATING.facebook.count} reviews`,
            },
          ].map((s) => (
            <div key={s.l} className="plate p-6">
              <p className="price text-[3rem] leading-none">{s.n}</p>
              <p className="mt-3 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-muted">
                {s.l}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
          Figures verified {RATING.asOf}. Reviews below are transcribed verbatim,
          including the typos.
        </p>
      </Section>

      <Section tone="paper-2">
        <SectionHead
          eyebrow="In their words"
          title="Reviews, unedited."
          intro="Pulled from the Google Business Profile. We haven't tidied the grammar or cut the parts that don't flatter us."
        />

        <div className="mt-10 columns-1 gap-5 md:columns-2 lg:columns-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="plate mb-5 break-inside-avoid p-6">
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-star text-star" />
                ))}
              </span>
              <blockquote className="mt-4 text-[0.9375rem] leading-relaxed text-body">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4">
                <span className="block font-display text-sm font-bold uppercase tracking-wide text-ink-text">
                  {r.name}
                </span>
                <span className="mt-0.5 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                  {r.meta} · {r.when}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <a
          href={BRAND.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ink mt-6 inline-flex"
        >
          Read all {RATING.count} on Google
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHead eyebrow="How we ask" title="No gates, no incentives." />
          </div>
          <div className="md:col-span-7">
            <Prose>
              <p>
                Every customer gets the same request after pickup, with a direct link.
                We don&apos;t pre-screen anyone with a satisfaction survey, we
                don&apos;t route unhappy customers somewhere private, and we
                don&apos;t offer discounts or free add-ons in exchange for a review.
              </p>
              <p>
                All three of those are against Google&apos;s policies, and all three
                are common in this trade. A five-star average built that way
                isn&apos;t worth anything to you as a buyer.
              </p>
            </Prose>
          </div>
        </div>
      </Section>

      <CTABand />
    </>
  );
}
