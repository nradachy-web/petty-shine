import type { Metadata } from "next";
import Link from "next/link";

import "@/components/landing/landing.css";
import QuoteForm from "@/components/quote/QuoteForm";
import HomeHero from "@/components/sections/HomeHero";
import ServiceCards from "@/components/sections/ServiceCards";
import TownChips from "@/components/sections/TownChips";
import PhoneLink from "@/components/tracking/PhoneLink";
import { Button, DatumRule, KeyValueList, KeyValueRow, Plate, Section, SectionHead } from "@/components/ui";
import { BRAND, CREDENTIALS, REVIEWS, REVIEW_SUMMARY, SERVICES } from "@/lib/constants";
import { longDate } from "@/lib/utils";

/* ============================================================================
   THE HOME PAGE

   REBUILT 2026-09-23 for the paid click. Four bands:

     1  hero        his own shop, one headline, one paragraph, two actions
     2  paper       the six services people pay to find, on his photography
     3  dark        the two credentials and the rating, one review, the work
     4  paper       how it works, the towns, and the form itself

   What left and where it went: the stat band and the credentials essay are
   now four rows on the record; the film ladder lives on /paint-protection-film/;
   the owner block lives on /about/; five reviews became one here and all of
   them on /reviews/. Every number still traces to constants.ts.
   ========================================================================== */

const TITLE = `${BRAND.name} | Ceramic Coating, PPF and Detailing, ${BRAND.city} ${BRAND.state}`;
const DESCRIPTION = `Ceramic coating, paint protection film, paint correction and auto detailing in ${BRAND.city}, ${BRAND.stateName}. ${CREDENTIALS[0].label}, ${CREDENTIALS[1].label}. Quoted on your vehicle.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
};

/** The six services the ad account and the search terms actually carry. */
const PAID = ["ceramic-coating", "paint-protection-film", "paint-correction", "paintless-dent-repair", "auto-detailing", "window-tinting"]
  .map((id) => SERVICES.find((s) => s.id === id)!);
const REST = SERVICES.filter((s) => !PAID.includes(s));

const LEAD_REVIEW = REVIEWS.find((r) => r.name === "Landon Brown") ?? REVIEWS[0];

const STEPS = [
  { title: "Send the vehicle", body: "Year, make, model and what you want done. Photos help. The form takes a minute." },
  { title: "Get a number in writing", body: "Size of the vehicle and condition of the paint decide the price, so it is quoted on your car and sent back before anything is scheduled." },
  { title: "Book the day", body: "Drop it at the shop in Randleman. We tell you the pickup day up front." },
] as const;

const WORK = [
  { id: "coating-corvette-c8", caption: "Ceramic coating, Corvette C8" },
  { id: "coating-g-wagon", caption: "Ceramic coating, Mercedes G-Class" },
  { id: "coating-challenger-hellcat", caption: "Correction and coating, Hellcat" },
] as const;

const MONO = "font-mono text-[0.6875rem] uppercase tracking-[0.18em]";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* 2. the services */}
      <Section plane="sheet" label="Services">
        <SectionHead
          align="split"
          title="What the shop does."
          intro={
            <p>
              Every job is quoted on the vehicle in front of us and the number goes to you in writing before any work starts.
            </p>
          }
        />
        <ServiceCards services={PAID} className="mt-8 md:mt-10" />
        <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-600">
          Also{" "}
          {REST.map((s, i) => (
            <span key={s.id}>
              <Link href={s.href} className="link-inline">
                {s.name.toLowerCase()}
              </Link>
              {i < REST.length - 2 ? ", " : i === REST.length - 2 ? " and " : ""}
            </span>
          ))}
          .
        </p>
      </Section>

      {/* 3. the record and the work */}
      <Section plane="shop" label="On the record">
        <div className="lp-proof">
          <div>
            <SectionHead
              title="Two credentials you can check before you call."
              intro={
                <p>
                  Gtechniq and STEK each publish the shops they have approved. {BRAND.name} is on both lists at this address, and neither list is ours to edit.
                </p>
              }
            />
            <KeyValueList className="mt-8" label="The record">
              {CREDENTIALS.map((c) => (
                <KeyValueRow key={c.id} k={c.id === "gtechniq" ? "Coating" : "Film"} v={c.label} mono={false} />
              ))}
              <KeyValueRow k="Reviews" v={`${REVIEW_SUMMARY.rating} from ${REVIEW_SUMMARY.count} on Google`} mono={false} />
              <KeyValueRow k="Shop" v={BRAND.addressLine} mono={false} />
            </KeyValueList>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {CREDENTIALS.map((c) => (
                <li key={c.id}>
                  <a href={c.source} target="_blank" rel="noopener noreferrer" className={`tap-24 ${MONO} text-cyan-300 underline-offset-4 hover:underline`}>
                    Check the {c.id === "gtechniq" ? "Gtechniq" : "STEK"} listing
                    <span className="sr-only"> for {c.label}. Opens in a new tab.</span>
                    <span aria-hidden="true"> {"↗"}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <blockquote className="lp-quote" style={{ borderTopWidth: 0, paddingTop: 0 }}>
              <span className="lp-quote__tick" aria-hidden="true" />
              <p className="lp-quote__text">{LEAD_REVIEW.text}</p>
              <footer className="lp-quote__by">
                <strong>{LEAD_REVIEW.name}</strong>
                <span>{LEAD_REVIEW.service}</span>
                <span>Google, checked {longDate(REVIEW_SUMMARY.checkedOn)}</span>
              </footer>
            </blockquote>
            <div className="mt-6">
              <Button href="/reviews/" tone="ghost" size="sm">
                Every review we can show
              </Button>
            </div>
          </div>
        </div>

        <DatumRule label="The work" className="mb-8 mt-14 md:mt-16" />
        <ul className="lp-work">
          {WORK.map((w) => (
            <li key={w.id}>
              <Plate id={w.id} sizes="(min-width: 640px) 30vw, 100vw" caption={w.caption} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-300">
          Every photograph on this site came out of this shop, off a vehicle that was in for work.{" "}
          <Link href="/gallery/" className="link-inline">
            See all the work
          </Link>
          .
        </p>
      </Section>

      {/* 4. how it works, the towns, the close */}
      <Section plane="sheet" label="How it works">
        <ol className="lp-steps">
          {STEPS.map((s) => (
            <li key={s.title} className="lp-step">
              <h3 className="lp-step__title">{s.title}</h3>
              <p className="lp-step__body">{s.body}</p>
            </li>
          ))}
        </ol>

        <DatumRule label="Service area" className="mb-6 mt-14 md:mt-16" />
        <p className="mb-5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
          Sixteen towns, each one measured from the shop door. The minutes on each chip are the real drive. If yours is not here, call and ask.
        </p>
        <TownChips />

        <DatumRule label="Get a price" className="mb-8 mt-14 md:mt-16" />
        <div id="quote" className="lp-close scroll-mt-24">
          <div>
            <h2 className="ps-display ps-display-lg">Send the vehicle. We will send a number back.</h2>
            <p className="ps-prose mt-5">
              It goes straight to the shop. The year, make and model is enough to start, and the number comes back in writing before anything is scheduled.
            </p>
            <PhoneLink placement="home-close" className="lp-call">
              <span className="min-w-0">
                <span className="lp-call__k">Rather call</span>
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
            <QuoteForm heading={null} intro={null} source="/" />
          </div>
        </div>
      </Section>
    </>
  );
}
