import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import LandingHero from "@/components/landing/LandingHero";
import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Breadcrumbs,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  Section,
  SectionHead,
} from "@/components/ui";
import { BRAND, CITIES, CREDENTIALS, REVIEWS, type City } from "@/lib/constants";
import { profileFor } from "@/lib/cityProfiles";
import {
  LANDING_TRACKS,
  hubHref,
  townHref,
  trackById,
  type LandingFaq,
  type LandingTrack,
} from "@/lib/landing";
import { driveTime, milesLong } from "@/lib/utils";
import "./landing.css";

/* ============================================================================
   THE SERVICE LANDING PAGE

   One template behind every paid click. Six bands, in this order:

     1  hero          photo, one heading, one paragraph, two actions, trust row
     2  what you get  four to six rows, each one a plain sentence
     3  proof         facts that trace to constants.ts, one review, one photo
     4  detail        hub pages only: the tiers, the coverage table, the law
        from town     town pages only: the measured drive and the nearby towns
     5  how it works  three steps, then the questions, then (hubs) the towns
     6  the close     the form beside the phone number

   Every string comes from src/lib/landing.ts or constants.ts. Nothing is
   typed in here except the three steps, which are the same on every page.
   ========================================================================== */

const STEPS = [
  { title: "Tell us about your vehicle", body: "Year, make, model and what you want done. It takes about a minute, and photos help." },
  { title: "Get your free quote", body: "We price it for your vehicle and get back to you fast. No pressure, no surprises." },
  { title: "Book your spot", body: "Pick a day that works, drop it off in Randleman, and drive away protected." },
] as const;

const CHECK_PATH = "M20 6 9 17l-5-5";

function Check({ title, body }: { title: string; body: string }) {
  return (
    <li className="lp-check">
      <svg className="lp-check__mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={CHECK_PATH} />
      </svg>
      <div className="min-w-0">
        <h3 className="lp-check__title">{title}</h3>
        <p className="lp-check__body">{body}</p>
      </div>
    </li>
  );
}

function Faq({ items }: { items: LandingFaq[] }) {
  return (
    <ul className="lp-faq">
      {items.map((f) => (
        <li key={f.q}>
          <details className="lp-faq__item">
            <summary className="lp-faq__q">{f.q}</summary>
            <p className="lp-faq__a">{f.a}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}

function FaqSchema({ items, url }: { items: LandingFaq[]; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BRAND.siteUrl}${url}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

/** Metadata for a hub page, so the six page files stay four lines each. */
export function hubMetadata(t: LandingTrack): Metadata {
  return {
    title: t.hub.title,
    description: t.hub.description,
    alternates: { canonical: hubHref(t) },
  };
}

export function townMetadata(t: LandingTrack, c: City): Metadata {
  return {
    title: t.town.title(c),
    description: t.town.description(c),
    alternates: { canonical: townHref(t, c) },
  };
}

export interface ServiceLandingProps {
  track: LandingTrack;
  /** Present on a town page, absent on the hub. */
  city?: City;
  /** Hub pages only: the tiers, the coverage table, the statute. */
  detail?: ReactNode;
  detailLabel?: string;
  /** Paper by default. The film page runs its coverage renders on the dark plane. */
  detailPlane?: "sheet" | "shop";
  /** False when the detail band carries its own process, so the three
      generic steps do not repeat it. The questions still render. */
  showSteps?: boolean;
}

export default function ServiceLanding({ track: t, city: c, detail, detailLabel, detailPlane = "sheet", showSteps = true }: ServiceLandingProps) {
  const url = c ? townHref(t, c) : hubHref(t);
  const review = t.reviewName ? REVIEWS.find((r) => r.name === t.reviewName) ?? null : null;
  const faqs = c && t.townFaq ? [...t.faqs, t.townFaq(c)] : t.faqs;
  const profile = c ? profileFor(c.slug) : undefined;
  const others = LANDING_TRACKS.filter((x) => x.id !== t.id);
  const nearby = c
    ? CITIES.filter((o) => o.slug !== c.slug)
        .slice()
        .sort((a, b) => Math.abs(a.miles - c.miles) - Math.abs(b.miles - c.miles))
        .slice(0, 4)
        .sort((a, b) => a.miles - b.miles)
    : [];

  const title = c ? t.town.h1(c) : t.hub.h1;
  const lead = c
    ? `${t.town.lead(c)} ${c.name} is ${milesLong(c.miles)} from the shop, about ${driveTime(c.minutes)} on ${c.route}.`
    : t.hub.lead;
  const description = c ? t.town.description(c) : t.hub.description;
  const schemaName = c ? `${t.noun} for ${c.name}, ${BRAND.state}` : `${t.noun} in ${BRAND.city}, ${BRAND.state}`;

  return (
    <>
      <ServiceSchema name={schemaName} description={description} url={url} serviceType={t.noun} />
      <FaqSchema items={faqs} url={url} />

      <Breadcrumbs
        plane="shop"
        trail={c ? [{ label: t.noun, href: hubHref(t) }, { label: c.name, href: url }] : [{ label: t.noun, href: url }]}
      />

      {/* 1. the hero */}
      <LandingHero
        photo={t.heroPhoto}
        focus={t.heroFocus}
        eyebrow={c ? `${t.noun} · ${c.name}, ${BRAND.state}` : t.eyebrow}
        title={title}
        lead={lead}
        ctaLabel={t.ctaLabel}
        size="lg"
        phonePlacement={`${t.slug}-hero`}
        ariaLabel={`${schemaName}, ${BRAND.name}`}
        phoneDisplay={BRAND.phoneDisplay}
      />

      {/* 2. what you get */}
      <Section plane="sheet" label="What you get">
        <SectionHead title={t.checksHeading} />
        <ul className="lp-checks mt-8 md:mt-10">
          {t.checks.map((ch) => (
            <Check key={ch.title} title={ch.title} body={ch.body} />
          ))}
        </ul>
      </Section>

      {/* 3. proof */}
      <Section plane="shop" label="On the record">
        <div className="lp-proof">
          <div>
            <SectionHead title={t.proofHeading} intro={<p>{t.proofIntro}</p>} />
            <KeyValueList className="mt-8" label={t.proofHeading}>
              {t.proofRows.map((r) => (
                <KeyValueRow key={r.k} k={r.k} v={r.v} mono={false} />
              ))}
            </KeyValueList>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {CREDENTIALS.map((cr) => (
                <li key={cr.id}>
                  <a
                    href={cr.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-24 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-cyan-300 underline-offset-4 hover:underline"
                  >
                    {cr.label}
                    <span className="sr-only">, listed in the manufacturer&apos;s own directory. Opens in a new tab.</span>
                    <span aria-hidden="true"> {"↗"}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {t.proofPhoto ? (
              <Plate id={t.proofPhoto} sizes="(min-width: 1024px) 36rem, 100vw" caption={PHOTO_CAPTION(t)} />
            ) : null}
            {review ? (
              <blockquote className={t.proofPhoto ? "lp-quote mt-8" : "lp-quote"} style={t.proofPhoto ? undefined : { borderTopWidth: 0, paddingTop: 0 }}>
                <span className="lp-quote__tick" aria-hidden="true" />
                <p className="lp-quote__text">{review.text}</p>
                <footer className="lp-quote__by">
                  <strong>{review.name}</strong>
                  <span>{review.service}</span>
                  <span>{review.stars} stars on Google</span>
                </footer>
              </blockquote>
            ) : null}
          </div>
        </div>
      </Section>

      {/* 4a. hub detail */}
      {!c && detail ? (
        <Section plane={detailPlane} label={detailLabel}>
          {detail}
        </Section>
      ) : null}

      {/* 4b. from the town */}
      {c ? (
        <Section plane="sheet" label={`From ${c.name}`}>
          <div className="lp-town">
            <div>
              <SectionHead
                size="md"
                title={`${c.name} to the shop, measured.`}
                intro={
                  profile ? (
                    <p>
                      {profile.angle} {profile.approach}
                    </p>
                  ) : undefined
                }
              />
              <KeyValueList className="mt-7" label={`The drive from ${c.name}`}>
                <KeyValueRow k="Distance by road" v={milesLong(c.miles)} />
                <KeyValueRow k="Drive time, about" v={driveTime(c.minutes)} />
                <KeyValueRow k="Route" v={c.route} mono={false} />
                <KeyValueRow k="County" v={c.county} mono={false} />
                <KeyValueRow k="Shop" v={BRAND.addressLine} mono={false} />
              </KeyValueList>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-600">
                Measured by road from the shop door, not estimated.{" "}
                <Link href={`/areas/${c.slug}/`} className="link-inline">
                  Everything about the drive from {c.name}
                </Link>
                .
              </p>
            </div>
            <div>
              <DatumRule label={`${t.noun} nearby`} className="mb-5" />
              <ul className="lp-chips">
                {nearby.map((o) => (
                  <li key={o.slug}>
                    <Link href={townHref(t, o)} className="lp-chip">
                      {o.name}
                      <span className="lp-chip__meta">{o.minutes} min</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <DatumRule label={`More for ${c.name}`} className="mb-5 mt-10" />
              <ul className="lp-chips">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={townHref(o, c)} className="lp-chip">
                      {o.noun}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ) : null}

      {/* 5. how it works, the questions, the towns */}
      <Section plane={c ? "shop" : "sheet"} label={showSteps || c ? "How it works" : "Questions"}>
        {showSteps || c ? (
          <>
            <ol className="lp-steps">
              {STEPS.map((s) => (
                <li key={s.title} className="lp-step">
                  <h3 className="lp-step__title">{s.title}</h3>
                  <p className="lp-step__body">{s.body}</p>
                </li>
              ))}
            </ol>
            <DatumRule label="Questions" className="mb-6 mt-14 md:mt-16" />
          </>
        ) : null}
        <Faq items={faqs} />

        {!c ? (
          <>
            <DatumRule label="Where the cars come from" className="mb-6 mt-14 md:mt-16" />
            <p className="mb-5 max-w-2xl text-[0.9375rem] leading-relaxed">
              {t.noun} for every town we measured from the shop door. The minutes on each are the real drive.
            </p>
            <ul className="lp-chips">
              {CITIES.map((o) => (
                <li key={o.slug}>
                  <Link href={townHref(t, o)} className="lp-chip">
                    {o.name}
                    <span className="lp-chip__meta">{o.minutes} min</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Section>

      {/* 6. the close */}
      <Section plane={c ? "sheet" : "shop"} label="Free quote" id="quote">
        <div className="lp-close">
          <div>
            <h2 className="ps-display ps-display-lg">Get your free quote.</h2>
            <p className="ps-prose mt-5">
              Tell us about your vehicle and what you want done. We will get back to you fast with a free, no pressure quote. Prefer to talk? Call us.
            </p>
            <PhoneLink placement={`${t.slug}-close`} className="lp-call">
              <span className="min-w-0">
                <span className="lp-call__k">Prefer to call</span>
                <span className="lp-call__n">{BRAND.phoneDisplay}</span>
              </span>
              <span className="lp-call__tick" aria-hidden="true" />
            </PhoneLink>
            <p className="lp-meta">
              {BRAND.hoursShort}
              <br />
              {BRAND.addressLine}
            </p>
          </div>
          <div>
            <QuoteForm service={t.quoteKey} source={url} heading={null} intro={null} />
          </div>
        </div>
      </Section>
    </>
  );
}

function PHOTO_CAPTION(t: LandingTrack): string {
  return t.proofPhoto ? `${t.noun}, in the shop` : "";
}

export { trackById };
