import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import QuoteForm from "@/components/quote/QuoteForm";
import ServiceSchema from "@/components/seo/ServiceSchema";
import TrustBar from "@/components/sections/TrustBar";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Breadcrumbs,
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  PriceOrQuote,
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  CITIES,
  NEAREST_EXIT,
  REVIEWS,
  REVIEW_SUMMARY,
  SERVICES,
  type City,
} from "@/lib/constants";
import { drive, driveTime, milesLong } from "@/lib/utils";
import type { PhotoId } from "@/lib/photos";
import {
  CITY_COUNT,
  cityHref,
  isHomeCounty,
  nameList,
  nearestTowns,
  neighbours,
  ordinal,
  paceNote,
  rankOf,
  roadKind,
  sharedRoad,
  spell,
} from "./facts";

/**
 * THE TOWN PAGES
 *
 * These used to live under /window-tinting/, inherited from a tint led
 * business. Petty Shine's paid demand is detailing, coating, film and dent
 * repair, and his own search terms already carry Greensboro, High Point,
 * Lexington and Asheboro city modifiers against detailing queries, so the
 * town layer belongs at /areas/ and is scoped to the whole shop.
 *
 * Sixteen pages that differ only by a noun are doorway pages. Every page
 * here is built from that town's own measured road distance, drive time,
 * county and route, plus comparisons against the other fifteen measurements.
 * See ./facts.ts. Nothing is written per town by hand, and nothing is
 * asserted that the measurements do not support.
 */

/** One photo per town, so sixteen pages do not share one picture. */
const CITY_PHOTO: Record<string, PhotoId> = {
  "randleman-nc": "coating-huracan",
  "climax-nc": "detail-jeep-teal",
  "sophia-nc": "detail-mustang-red",
  "julian-nc": "coating-corvette-c8",
  "archdale-nc": "detail-f250-black",
  "asheboro-nc": "coating-g-wagon",
  "greensboro-nc": "detail-jeep-orange",
  "high-point-nc": "wheels-mustang",
  "trinity-nc": "coating-challenger-hellcat",
  "liberty-nc": "detail-raptor",
  "jamestown-nc": "coating-corvette-c7",
  "thomasville-nc": "wash-porsche-911",
  "kernersville-nc": "coating-supra",
  "burlington-nc": "detail-mustang-65",
  "lexington-nc": "coating-corvette-z06",
  "winston-salem-nc": "coating-challenger-demon",
};

/** Social proof beside the decision, rather than parked on /reviews/. */
const PROOF = REVIEWS.find((r) => r.name === "Landon Brown")!;

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

/**
 * The town page description, written to land between 150 and 160 characters
 * on all sixteen towns. The measured distance, drive time and road are what
 * make one of these different from the next, so they carry the sentence, and
 * the tail is chosen to fit rather than fixed.
 *
 * The first pass appended the phone number when it fitted and nothing when it
 * did not, which produced descriptions from 140 to 160. Climax came out at
 * 140 and Archdale at 144, which is roughly ten characters of Google result
 * left on the floor on a page whose whole job is being found locally.
 *
 * So the tail is a ladder, longest first, and the first clause that lands the
 * whole string inside the window wins. Every clause is built from a constant,
 * including the short exit form, which is the first clause of
 * NEAREST_EXIT.label rather than a second hand copy of it: "Exit 86, I-73 and
 * US 220" is right in a table and twenty four characters too long here.
 *
 * Verified across all sixteen towns: 151 to 160 characters, none outside.
 */
function cityDescription(c: City): string {
  const base =
    `Ceramic coating, paint protection film, tint and detailing for ${c.name}. ` +
    `${milesLong(c.miles)} from the shop, about ${driveTime(c.minutes)} on ${c.route}.`;

  const tails = [
    ` Open ${BRAND.hoursShort}.`,
    ` Call ${BRAND.phoneDisplay}.`,
    ` ${BRAND.hoursShort}.`,
    ` ${BRAND.city}, ${BRAND.state}.`,
    ` Off ${NEAREST_EXIT.label.split(",")[0]}.`,
    ` ${NEAREST_EXIT.label.split(",")[0]}.`,
    "",
  ];

  for (const tail of tails) {
    const full = base + tail;
    if (full.length >= 150 && full.length <= 160) return full;
  }

  /* Unreachable for the sixteen towns in CITIES today. If a seventeenth is
     added whose route name is long enough to break the ladder, the shortest
     honest string is still the right answer. */
  return base.length <= 160 ? base : base;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const c = CITIES.find((x) => x.slug === city);
  if (!c) return {};

  return {
    title: `Auto Detailing for ${c.name}, ${BRAND.state}`,
    description: cityDescription(c),
    alternates: { canonical: cityHref(c) },
  };
}

/* ------------------------------------------------------------------ */
/* the three sentences that make a town page its own page              */
/* ------------------------------------------------------------------ */

/**
 * The route strings in CITIES record which roads the measured drive uses,
 * not the order they are driven in, so nothing here asserts a sequence.
 */
function roadSentence(c: City): string {
  switch (roadKind(c)) {
    case "interstate-73":
      return `That route uses I-73, which is the interstate the shop sits beside. ${NEAREST_EXIT.label} is the interchange you want, ${milesLong(NEAREST_EXIT.miles)} from the door.`;
    case "interstate-85":
      return `That route uses I-85, which is not the interstate the shop sits beside. The closest interchange to the door is ${NEAREST_EXIT.label}, ${milesLong(NEAREST_EXIT.miles)} out.`;
    default:
      return `No interstate on that route. It is ${c.route} the whole way. The closest interchange to the shop is ${NEAREST_EXIT.label}, ${milesLong(NEAREST_EXIT.miles)} from the door.`;
  }
}

function paceSentence(c: City): string {
  const note = paceNote(c);

  if (note?.kind === "farther") {
    const timing =
      note.minutesGap === 0
        ? `the drive takes the same ${driveTime(c.minutes)}`
        : `gets here ${note.minutesGap} minute${note.minutesGap === 1 ? "" : "s"} quicker`;
    return `${note.other.name} sits ${milesLong(note.milesGap)} farther out and ${timing}. The road is the difference: ${c.route} from ${c.name}, ${note.other.route} from ${note.other.name}.`;
  }

  if (note?.kind === "closer") {
    const timing =
      note.minutesGap === 0
        ? `takes the same ${driveTime(c.minutes)}`
        : `takes ${note.minutesGap} minute${note.minutesGap === 1 ? "" : "s"} longer`;
    return `${note.other.name} is ${milesLong(note.milesGap)} closer to the shop and ${timing}, because it comes in on ${note.other.route}. Mileage is not what decides the drive here, the road is.`;
  }

  const { closer, farther } = neighbours(c);
  if (closer && farther) {
    return `${closer.name} is the next town in at ${milesLong(closer.miles)}. ${farther.name} is the next one out at ${milesLong(farther.miles)}.`;
  }
  if (farther) {
    return `Nothing we measured is closer. ${farther.name} is the next town out at ${milesLong(farther.miles)}.`;
  }
  return `Nothing we measured is farther. ${closer ? `${closer.name} is the next town in at ${milesLong(closer.miles)}.` : ""}`;
}

function rankSentence(c: City): string {
  const rank = rankOf(c);
  const where =
    rank === 1
      ? `the closest of the ${spell(CITY_COUNT)} towns we measured`
      : rank === CITY_COUNT
        ? `the longest run of the ${spell(CITY_COUNT)} towns we measured`
        : `the ${ordinal(rank)} closest of the ${spell(CITY_COUNT)} towns we measured`;

  const county = isHomeCounty(c)
    ? `${c.county}, the same county as the shop.`
    : `${c.county}, so the drive crosses a county line into ${BRAND.county}.`;

  return `${c.name} is ${where}. ${county}`;
}

/* ------------------------------------------------------------------ */

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const c = CITIES.find((x) => x.slug === city);
  if (!c) notFound();

  const photo = CITY_PHOTO[c.slug] ?? "coating-huracan";
  const road = sharedRoad(c);
  const nearby = nearestTowns(c, 4);

  return (
    <>
      {/* Service node tied to the business @id in the root layout. areaServed
          comes from CITIES, so it names every town this shop was measured to
          rather than only the one in the URL. */}
      <ServiceSchema
        name={`Auto detailing and vehicle protection for ${c.name}, ${BRAND.state}`}
        description={`${BRAND.name} does auto detailing, paint correction, ceramic coating, paint protection film, window tinting and dent repair at ${BRAND.addressLine}, ${milesLong(c.miles)} by road from ${c.name} on ${c.route}.`}
        url={cityHref(c)}
        serviceType="Auto detailing"
      />

      <Breadcrumbs
        plane="sheet"
        trail={[
          { label: "Service area", href: "/areas/" },
          { label: c.name, href: cityHref(c) },
        ]}
      />

      <Section plane="sheet" label={`${c.name}, ${BRAND.state} · ${c.county}`}>
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">Auto detailing for {c.name}</h1>

            <div className="ps-prose mt-6">
              <p>
                {BRAND.name} does auto detailing, ceramic coating, paint
                protection film and window tinting at {BRAND.street} in{" "}
                {BRAND.city}, {BRAND.stateName}. From {c.name} that is{" "}
                {milesLong(c.miles)} by road and about {driveTime(c.minutes)} on{" "}
                {c.route}. There and back is roughly{" "}
                {driveTime(c.minutes * 2)}.
              </p>
              <p>{roadSentence(c)}</p>
              <p>{paceSentence(c)}</p>
              <p>{rankSentence(c)}</p>
            </div>

            <PhoneLink
              placement={`city-${c.slug}`}
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <KeyValueList label={`The drive from ${c.name}`}>
              <KeyValueRow k="Distance" v={milesLong(c.miles)} />
              <KeyValueRow k="Drive time" v={`about ${driveTime(c.minutes)}`} />
              <KeyValueRow
                k="There and back"
                v={`about ${driveTime(c.minutes * 2)}`}
                tone="pewter"
              />
              <KeyValueRow k="Route" v={c.route} />
              <KeyValueRow k="County" v={c.county} tone="pewter" />
              <KeyValueRow k="Nearest exit" v={NEAREST_EXIT.label} />
              <KeyValueRow
                k="From the exit"
                v={milesLong(NEAREST_EXIT.miles)}
                tone="pewter"
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>

            <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-400">
              Road distance and drive time were measured from the shop door, not
              estimated.
            </p>

            <div className="mt-6">
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ps-btn ps-btn--ghost ps-btn--sm"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Every value in this row comes out of constants, and both credentials
          link into the manufacturer's own directory. On a town page it is
          doing the most work it does anywhere, because a visitor arriving
          from a local search has never heard of this shop. */}
      <TrustBar plane="sheet" />

      <Section plane="shop" label="The shop">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="One building, one address."
              intro={
                <p>
                  A vehicle that comes in from {c.name} is worked on in the same
                  building as every other one, at {BRAND.street}. Every photo on
                  this site is a real job that came through it. No stock
                  photography anywhere on it.
                </p>
              }
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/gallery/" tone="ghost">
                See the work
              </Button>
              <Button href="/contact/" tone="ghost">
                Directions
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Plate
              id={photo}
              priority
              caption={`At the shop, ${BRAND.city} ${BRAND.state}`}
              sizes="(min-width: 1024px) 45rem, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Services">
        <SectionHead
          size="md"
          align="split"
          className="md:items-start"
          /* "a vehicle from Archdale", not "a Archdale vehicle". The town
             name is interpolated, so an article in front of it is right on
             fourteen of the sixteen and wrong on Archdale and Asheboro, both
             of which shipped an h2 reading "Everything a Archdale vehicle".
             Moving the name behind the noun retires the article problem
             instead of special casing two towns. */
          title={`Everything a vehicle from ${c.name} can come in for`}
          intro={
            <p>
              None of the {spell(SERVICES.length)} publishes a price, because
              size and the condition of the paint move the number more than
              the name of the service does. Every row below goes to the form
              with that service already filled in, and the number comes back
              in writing before any work starts.
            </p>
          }
        />

        <KeyValueList className="mt-8" label="Services">
          {SERVICES.map((s) => (
            <KeyValueRow
              key={s.id}
              k={
                <Link href={s.href} className="link-inline">
                  {s.index} {s.name}
                </Link>
              }
              v={<PriceOrQuote service={s.quoteKey} value={s.fromPrice} size="sm" />}
            />
          ))}
        </KeyValueList>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/services/" tone="ghost" size="sm">
            Every service, with what each one covers
          </Button>
          <Button href="/pricing/" tone="ghost" size="sm">
            How a job gets priced
          </Button>
        </div>

        {/* The nearby towns ride inside this section rather than opening one
            of their own. Two sheet sections back to back put 96px of section
            padding on each side of a hairline nobody can see, which is the
            dead vertical space DIRECTION-V2 section 3 asks to be tightened.
            A datum rule is the site's own sub divider and costs 44px. */}
        <DatumRule label="Nearby" className="mt-14 mb-8" />

        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-heading text-xl text-ink-900">
              {road ? `Also on ${road.road}` : `Towns either side of ${c.name}`}
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-600">
              {road
                ? `${nameList(road.others)} ${road.others.length === 1 ? "reaches" : "reach"} the shop on the same road as ${c.name}.`
                : `${c.name} is the only town we measured that comes in on ${c.route}. These are the closest to it by road distance.`}
            </p>
            <div className="mt-6">
              <Button href="/areas/" tone="ghost" size="sm">
                All {spell(CITY_COUNT)} towns
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Nearby towns">
              {(road ? road.others : nearby).map((o) => (
                <KeyValueRow
                  key={o.slug}
                  k={
                    <Link href={cityHref(o)} className="link-inline">
                      {o.name}
                    </Link>
                  }
                  v={drive(o.miles, o.minutes)}
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Get a price" rhythm="snug">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="ps-display ps-display-md">
              Send the vehicle, get the number.
            </h2>
            <div className="ps-prose mt-5">
              <p>
                Year, make and model, and what is bothering you about it. That
                is a smaller ask than booking a job and it is all we need to
                come back with a real number for your vehicle.
              </p>
              <p>
                If you would rather talk it through, call the shop. It is open{" "}
                {BRAND.hoursShort}.
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
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Get a price for your vehicle"
              intro={`It goes straight to the shop. Year, make, model and what you want done is enough to start.`}
              source={cityHref(c)}
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
