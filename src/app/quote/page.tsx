import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, SERVICES } from "@/lib/constants";
import { spell } from "../areas/[city]/facts";

export const metadata: Metadata = {
  title: "Get a Quote",
  /* 155 characters, inside what Google shows on a phone. */
  description:
    "Send Petty Shine your vehicle and what you want done. Detailing, ceramic coating, paint protection film, tint and dent repair in Randleman, North Carolina.",
  alternates: { canonical: "/quote/" },
};

const STEPS = [
  { n: "01", text: "You send the vehicle and what you want done." },
  { n: "02", text: "We come back with a price for that vehicle." },
  { n: "03", text: "You pick a date and drop it off." },
];

/**
 * PRICING IS PRIVATE, SO THIS PAGE STOPPED CLAIMING OTHERWISE.
 *
 * This section used to be a "Published starting prices" table built from
 * SERVICES.filter(s => s.fromPrice !== null). With PRICING_MODE set to
 * "private" every one of those value cells rendered the identical "Quoted
 * on your vehicle" link, under a heading that read "What we publish before
 * you ask", on the one page that exists to take a quote request. The page
 * contradicted itself in the same screen, and the five links pointed back
 * at /quote/ with nothing preselected, from /quote/.
 *
 * What replaces it is the honest version of the same job: the nine things
 * he quotes, each one linking to the page that explains it, so a visitor
 * who is not sure which line to pick in the form above can go and read.
 * No cell is a price, so no cell can be a dead one.
 */
const ALL_SERVICES = SERVICES;

export default function QuotePage() {
  return (
    <>
      <Breadcrumbs plane="sheet" trail={[{ label: "Get a quote", href: "/quote/" }]} />

      {/* ---------------------------------------------------------------
          THE FIRST FIELD IS THE POINT OF THIS PAGE.

          It used to sit around 920px down a phone, behind the heading, a
          paragraph, the three step list, the call panel and the hours: five
          things to scroll past on the one page that exists to be filled in.
          The heading and one line stay above the form, and everything that
          is context rather than an action now sits under it.

          On a phone that is just document order. From 1024 up the three
          blocks are placed explicitly, so the desktop layout is what it was:
          the heading and the steps stacked in the left column with the form
          beside them.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Quote request">
        {/* auto then 1fr, because the form spans both rows and is taller
            than they are. Two auto rows would split that surplus down the
            middle and open a hole under the heading. */}
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-14">
          <div className="min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <h1 className="ps-display ps-display-lg">Tell us about the vehicle.</h1>

            {/* THE WHO AND THE WHERE COME FIRST, IN TEXT.

                DIRECTION-V2 section 6 asks for the who, the what and the
                where inside the first hundred words of every page. This one
                is in the sitemap at 0.9 and it opened on "Nothing on this
                site carries a price", which names no business and no town.
                An assistant lifting a sentence off this page had nothing to
                attach it to, and a searcher landing here from an ad had to
                scroll to the footer to learn whose form it is. Both facts
                come out of BRAND, so neither can drift. */}
            <div className="ps-prose mt-6">
              <p>
                {BRAND.name} is an auto detailing shop at {BRAND.street} in{" "}
                {BRAND.city}, {BRAND.stateName}. Nothing on this site carries a
                price, because the vehicle decides it. Send yours and we will
                come back with a number for that one, in writing, before any
                work starts.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <QuoteForm heading={null} intro={null} source="/quote/" id="quote-form" />
          </div>

          <div className="min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-2">
            <ol className="min-w-0 border-t border-rule-light">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="flex min-w-0 gap-4 border-b border-rule-light py-4"
                >
                  <span className="font-mono text-[0.75rem] tabular-nums tracking-[0.14em] text-cyan-ink">
                    {s.n}
                  </span>
                  <span className="min-w-0 text-[0.9375rem] leading-relaxed text-ink-600">
                    {s.text}
                  </span>
                </li>
              ))}
            </ol>

            <PhoneLink
              placement="quote-page"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-4 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Rather call
                </span>
                <span className="mt-1 block font-mono text-xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <KeyValueList className="mt-6">
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="The work">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Every car on this site came through this shop."
              intro={
                <p>
                  No stock photography. If you want to see the standard before
                  you send anything, start there.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/gallery/" tone="ghost">
                See the work
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="coating-corvette-c8-side"
              caption="Ceramic coating, Corvette C8"
              sizes="(min-width: 1024px) 45rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Everything we quote">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="What goes in the form."
              intro={
                <p>
                  These are the {spell(ALL_SERVICES.length)} services the shop
                  quotes. If you are not sure which one you want, open the page
                  for it and read what the work actually is, then come back and
                  send the vehicle.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/pricing/" tone="ghost" size="sm">
                What moves the number
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Everything we quote">
              {ALL_SERVICES.map((s) => (
                <KeyValueRow
                  key={s.id}
                  k={
                    <Link href={s.href} className="link-inline">
                      {s.index} {s.name}
                    </Link>
                  }
                  v={s.blurb}
                  mono={false}
                  layout="prose"
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>
    </>
  );
}
