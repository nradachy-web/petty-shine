import type { Metadata } from "next";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import ServiceCards from "@/components/sections/ServiceCards";
import TrustBar from "@/components/sections/TrustBar";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Breadcrumbs,
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  CREDENTIALS,
  NAV_LINKS,
  REVIEWS,
  REVIEW_SUMMARY,
  SERVICES,
  type ServiceLine,
} from "@/lib/constants";
import { spell, spellCap } from "../areas/[city]/facts";

/* ============================================================================
   THE INDEX OF EVERYTHING

   One job: get a thumb from "I need something done" to the right page in as
   few taps as possible.

   SECOND PASS. The first pass split the nine services into "Priced on the
   site" and "Priced on your vehicle", which was the right split while five of
   them published a starting price. DIRECTION-V2 takes pricing off the site,
   so that split now separates nothing: all nine are quoted on the vehicle,
   and a heading reading "Priced on the site" over a column of quote links is
   simply false.

   What replaces it is a split that is about the work rather than about the
   money, and it is his own: PROTECT and RESTORE are the two groups his
   navigation already runs, and they come off the banner hanging in his shop.
   Both groups are DERIVED FROM NAV_LINKS rather than typed here, so the page
   cannot disagree with the menu above it. Everything NAV_LINKS does not put
   in a group is detailing, which is his highest volume search term and gets
   the third group to itself.

   Nine identical quote links is the point, not a compromise. One wording,
   one behaviour, one arrow, so the page reads as a system rather than as
   nine improvisations. QuoteLink gives each one its own accessible name.

   THIRD PASS. The rows became cards. Nine ruled text rows on a page that
   sits on 29 real job photos was the index selling the work without ever
   showing it. ServiceCards carries the same nine services, the same order,
   the same one quote link each, and puts each service's own photograph on
   its card. The three groups stay: they are the h2 structure the page ranks
   on, and the blurbs are the only place the groups get explained. Each
   group's grid runs full width because svc-grid is its own responsive
   layout and its sizes attribute assumes container width.
   ========================================================================== */

/** The two grouped entries in the site navigation, in menu order. */
const NAV_GROUPS = NAV_LINKS.filter(
  (l): l is Extract<typeof l, { children: readonly unknown[] }> =>
    "children" in l
);

interface ServiceGroup {
  key: string;
  label: string;
  blurb: string;
  rows: ServiceLine[];
}

const GROUP_BLURB: Record<string, string> = {
  Protect:
    "Film and coating go on before the damage does. This is the work you buy while the paint is still good, and the two makers behind it both list this shop by name.",
  Restore:
    "Paint that has already been marked, a dent, a curbed wheel. Work that puts a vehicle back to where it was rather than keeping it there.",
};

const GROUPED: ServiceGroup[] = NAV_GROUPS.map((g) => ({
  key: g.label,
  label: g.label,
  blurb: GROUP_BLURB[g.label],
  /* Sorted by the service index rather than by menu order. The menu puts
     film first because it carries the most ad spend, but a column reading
     03, 02, 07 down the page reads as a mistake, and the index is the one
     number that identifies a service across the whole site. */
  rows: g.children
    .map((c) => SERVICES.find((s) => s.href === c.href))
    .filter((s): s is ServiceLine => Boolean(s))
    .sort((a, b) => a.index.localeCompare(b.index)),
}));

/** Everything the navigation does not file under a group. */
const GROUPED_IDS = new Set(GROUPED.flatMap((g) => g.rows.map((s) => s.id)));

const GROUPS: ServiceGroup[] = [
  {
    key: "detailing",
    label: "Detailing",
    blurb:
      "The volume work, and the thing most people actually come in for. Cars, trucks, interiors and boats, at whatever level the paint needs.",
    rows: SERVICES.filter((s) => !GROUPED_IDS.has(s.id)),
  },
  ...GROUPED,
];

/** Social proof sits next to the decision, not parked on /reviews/. */
const PROOF = REVIEWS.find((r) => r.name === "Scott Fischer")!;

export const metadata: Metadata = {
  title: "Auto Detailing and Ceramic Coating Services",
  /* 158 characters. The old one advertised "5 published starting prices",
     which stopped being true the day PRICING_MODE went private. */
  description: `${spellCap(SERVICES.length)} services at ${BRAND.name} in ${BRAND.city}, ${BRAND.stateName}. Detailing, paint correction, ceramic coating, paint protection film, tint, dent and wheel repair.`,
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <>
      <ServiceSchema
        name={`Auto detailing and vehicle protection in ${BRAND.city}, ${BRAND.stateName}`}
        description={`${BRAND.name} does auto detailing, paint correction, ceramic coating, paint protection film, window tinting, paintless dent repair, curbed wheel repair and marine detailing at ${BRAND.addressLine}.`}
        url="/services/"
        serviceType="Auto detailing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[{ label: "Services", href: "/services/" }]}
      />

      <Section plane="sheet" label="Services" rhythm="snug">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-lg">Everything the shop does</h1>

            <div className="ps-prose mt-6">
              <p>
                {BRAND.name} is one shop at {BRAND.street} in {BRAND.city},{" "}
                {BRAND.stateName}, and these are the{" "}
                {spell(SERVICES.length)} things it does to a vehicle. Auto
                detailing, paint correction, ceramic coating, paint protection
                film, window tinting, paintless dent repair, curbed wheel
                repair, interiors and boats.
              </p>
              <p>
                None of them carries a published price. What a job costs moves
                with the size of the vehicle and the condition of the paint
                far more than it moves with the name of the service, so every
                card below goes to the form with that service already filled
                in, and the number comes back in writing.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <PhoneLink
              placement="services-index"
              className="flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Or just call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-400">
              {BRAND.hoursShort} · {BRAND.addressLine}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/pricing/" tone="ghost" size="sm">
                How a job gets priced
              </Button>
              <Button href="/gallery/" tone="ghost" size="sm">
                See the work
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* The trust row runs directly under the opening block, the way the
          reference sites run it under the hero. Every value in it comes out
          of constants and both credentials link into the maker's own
          directory, which is the part a visitor can check. */}
      <TrustBar plane="sheet" />

      {/* ---------------------------------------------------------------
          THE NINE, IN THREE GROUPS.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="The list">
        <div className="grid min-w-0 gap-14 lg:gap-20">
          {GROUPS.map((g) => (
            <div key={g.key} className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <h2 className="ps-display ps-display-md">{g.label}</h2>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-400">
                  {spell(g.rows.length)} services
                </p>
              </div>
              <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
                {g.blurb}
              </p>

              {/* The cards carry the photos, the links and the quote asks.
                  Full width, not beside the heading: svc-grid brings its own
                  one, two, three column layout and its image sizes assume
                  container width. */}
              <ServiceCards services={g.rows} className="mt-7 md:mt-8" />
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          AUTHORITY. Both entries are in the manufacturer's own directory,
          and both link to it, which is the difference between a credential
          and a badge.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="Credentials">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-display ps-display-lg">
              Both makers list this shop by name.
            </h2>
            <div className="ps-prose mt-5">
              <p>
                A coating and a film install are only worth what stands behind
                them. Gtechniq and STEK each carry {BRAND.name} in their own
                installer directory, which anyone can go and check, and which
                is not something a website can award itself.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/ceramic-coating/" tone="ghost" size="sm">
                Ceramic coating
              </Button>
              <Button href="/paint-protection-film/" tone="ghost" size="sm">
                Paint protection film
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id="coating-corvette-c8"
              priority
              caption="Corvette C8, ceramic coated"
              sizes="(min-width: 1024px) 44rem, 100vw"
            />
          </div>
        </div>

        <DatumRule label="Verified" className="mt-12 mb-7" />
        <div className="grid min-w-0 gap-x-14 gap-y-8 md:grid-cols-2">
          {CREDENTIALS.map((cr) => (
            <div key={cr.id} className="min-w-0 border-t border-rule-dark pt-6">
              <p className="font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-spec-000">
                {cr.label}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-300">
                {cr.body}
              </p>
              <p className="mt-4">
                <a
                  href={cr.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-inline text-[0.9375rem]"
                >
                  Check the listing yourself
                </a>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          WHERE THE WORK COMES FROM.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Where the work comes from" rhythm="snug">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Same list, wherever you are driving from."
              intro={
                <p>
                  Every service on this page is done at the one address. The
                  service area pages carry the measured road distance and
                  drive time from each town, so you can see the run before you
                  commit to it.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/areas/" tone="ghost" size="sm">
                Drive times by town
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="The shop">
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              <KeyValueRow k="County" v={BRAND.county} tone="pewter" />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
              <KeyValueRow k="Phone" v={BRAND.phoneDisplay} />
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE ONE PRIMARY ACTION, with a real review sitting beside it.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Get a price" rhythm="snug">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-display ps-display-md">
              Not sure which one you need?
            </h2>
            <div className="ps-prose mt-5">
              <p>
                Describe the vehicle and what is bothering you about it.
                Swirls, a dent, a curbed wheel, sun on the interior. We will
                tell you which service fixes it and what that one costs on
                your vehicle.
              </p>
            </div>

            <figure className="mt-8 border-t border-rule-light pt-7">
              <span className="block h-px w-6 bg-cyan-500" aria-hidden />
              <blockquote className="mt-4">
                <p className="max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
                  {PROOF.text}
                </p>
              </blockquote>
              <figcaption className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                {PROOF.name} · {REVIEW_SUMMARY.source} ·{" "}
                {REVIEW_SUMMARY.rating} from {REVIEW_SUMMARY.count} reviews
              </figcaption>
            </figure>

            <div className="mt-6">
              <Button href="/reviews/" tone="ghost" size="sm">
                All {spell(REVIEWS.length)} reviews, in full
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Get a price for your vehicle"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/services/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
