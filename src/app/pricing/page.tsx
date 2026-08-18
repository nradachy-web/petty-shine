import type { Metadata } from "next";
import Link from "next/link";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  Breadcrumbs,
  Button,
  DatumRule,
  KeyValueList,
  KeyValueRow,
  Plate,
  PriceFigure,
  QuoteLink,
  Section,
  SectionHead,
} from "@/components/ui";
import {
  BRAND,
  COATING_ADDONS,
  COATINGS,
  DETAIL_PACKAGES,
  INTERIOR_ADDONS,
  INTERIOR_PACKAGES,
  MARINE_EXTRAS,
  MARINE_PACKAGES,
  SERVICES,
} from "@/lib/constants";
import { money } from "@/lib/utils";

/** The services with a published starting price, and the ones without. */
const PRICED = SERVICES.filter((s) => s.fromPrice !== null);
const QUOTED = SERVICES.filter((s) => s.fromPrice === null);

/** The cheapest published figure anywhere on the site. */
const FLOOR = Math.min(...PRICED.map((s) => s.fromPrice as number));

/* 153 characters. The old one ran to 196 and lost the whole second half,
   which is the part that says the unpriced work still gets a number. */
const DESCRIPTION =
  `Starting prices for detailing, interior, paint correction, ceramic coating ` +
  `and marine work in ${BRAND.city}, from ${money(FLOOR)}. ` +
  `Film, tint, dent and wheel are quoted.`;

export const metadata: Metadata = {
  title: "Pricing",
  description: DESCRIPTION,
  alternates: { canonical: "/pricing/" },
};

/**
 * `as const` gives every entry in these arrays its own literal type, so an
 * optional key like `subtitle` exists on some members of the union and not
 * others. `in` is the narrowing that works on that shape.
 */
function subtitleOf(item: object): string | undefined {
  return "subtitle" in item && typeof item.subtitle === "string"
    ? item.subtitle
    : undefined;
}

const CONTENTS = [
  { id: "detailing", label: "Detailing" },
  { id: "coating", label: "Ceramic coating" },
  { id: "marine", label: "Marine" },
  { id: "quoted", label: "Quoted on your vehicle" },
];

export default function PricingPage() {
  return (
    <>
      <Breadcrumbs plane="sheet" trail={[{ label: "Pricing", href: "/pricing/" }]} />

      {/* ---------------------------------------------------------------
          Why the numbers are here at all, said plainly and once.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Pricing">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="ps-display ps-display-lg">What it costs</h1>

            <div className="ps-prose mt-6">
              <p>
                You should be able to find out roughly what something costs
                before you pick up the phone. So every price Petty Shine
                publishes is on this one page, in the order you would actually
                work through it.
              </p>
              <p>
                Every figure is a starting price. That is the honest form of
                it. What a vehicle costs depends on its size and on the
                condition of the paint or the interior, and a number given
                before anyone has looked at it would be a guess. The real
                number goes in writing before work begins.
              </p>
              <p>
                There are {QUOTED.length} services with no figure here,
                because no starting price is published for them. Those lines
                go straight to a quote rather than to a dead end.
              </p>
            </div>

            <DatumRule label="On this page" className="mt-10 mb-5" />
            <ul className="flex min-w-0 flex-wrap gap-x-6 gap-y-2">
              {CONTENTS.map((c) => (
                <li key={c.id}>
                  <Link href={`#${c.id}`} className="link-inline text-[0.9375rem]">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <KeyValueList label="How to read this page">
              <KeyValueRow
                k="Every figure"
                v="A starting price, not a final one"
                mono={false}
              />
              <KeyValueRow
                k="What moves it"
                v="Vehicle size, and the condition of the paint or interior"
                mono={false}
              />
              <KeyValueRow
                k="Final number"
                v="In writing before work begins"
                mono={false}
              />
              <KeyValueRow k="Shop" v={BRAND.addressLine} />
              <KeyValueRow k="Hours" v={BRAND.hoursShort} />
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          DETAILING, the volume ladder.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Exterior and interior" id="detailing">
        <SectionHead
          title="Detailing"
          intro={
            <p>
              Exterior levels stack, so each one carries the clean below it.
              Interior is priced on its own ladder, and a Level 1 interior
              comes with every exterior detail.
            </p>
          }
        />

        <div className="mt-11 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <h3 className="ps-rule-label">Exterior</h3>
            <KeyValueList className="mt-4" label="Exterior detailing prices">
              {DETAIL_PACKAGES.map((pkg) => (
                <KeyValueRow
                  key={pkg.id}
                  k={pkg.name}
                  note={subtitleOf(pkg)}
                  v={<PriceFigure value={pkg.fromPrice} from />}
                />
              ))}
            </KeyValueList>

            <div className="mt-6">
              <Button href="/auto-detailing/" tone="ghost" size="sm">
                What each level does
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <h3 className="ps-rule-label">Interior</h3>
            <KeyValueList className="mt-4" label="Interior detailing prices">
              {INTERIOR_PACKAGES.map((pkg, i) => (
                <KeyValueRow
                  key={pkg.id}
                  k={pkg.name}
                  note={i === 0 ? "Included with every exterior detail" : undefined}
                  v={<PriceFigure value={pkg.fromPrice} from />}
                />
              ))}
            </KeyValueList>

            <h3 className="ps-rule-label mt-9">Interior add-ons</h3>
            <KeyValueList className="mt-4" label="Interior add-ons">
              {INTERIOR_ADDONS.map((addon) => (
                <KeyValueRow
                  key={addon}
                  k={addon}
                  v={<QuoteLink service="interior" />}
                  tone="pewter"
                />
              ))}
            </KeyValueList>

            <div className="mt-6">
              <Button href="/interior-detailing/" tone="ghost" size="sm">
                What each interior level does
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          Evidence, so the page is not four tables and a phone number.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="The work" className="plane-arc">
        <SectionHead
          align="split"
          title="The price is the easy part to publish."
          intro={
            <p>
              The harder part is the work behind it, and that is on this site
              too. Every photo is a vehicle that came through the shop on
              Branson Mill Road, and none of it is stock photography.
            </p>
          }
        />

        <div className="mt-12">
          <Plate
            id="detail-f250-black"
            bleed
            caption="F-250 Super Duty after paint correction"
          />
        </div>

        <div className="mt-9">
          <Button href="/gallery/" tone="ghost">
            See more of the work
          </Button>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          CERAMIC COATING.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Gtechniq" id="coating" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Ceramic coating"
              intro={
                <p>
                  There are {COATINGS.length} tiers, separated by how much
                  correction happens before the coating goes on and by what
                  chemistry goes on afterward.
                </p>
              }
            />

            <div className="ps-prose mt-5">
              <p>
                The guarantee on a Gtechniq coating is issued by Gtechniq, not
                by us, and it carries real conditions.{" "}
                <Link href="/ceramic-coating/" className="link-inline">
                  The terms, in full
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Ceramic coating prices">
              {COATINGS.map((coating) => {
                const subtitle = subtitleOf(coating);
                return (
                  <KeyValueRow
                    key={coating.id}
                    k={subtitle ? `${coating.name}, ${subtitle}` : coating.name}
                    note={`${coating.guarantee} guarantee`}
                    /* The price, and a way to act on that exact tier. The
                       package key rides into the form, so a nine year lead
                       is not indistinguishable from a three year lead. */
                    v={
                      <>
                        <PriceFigure value={coating.fromPrice} from />
                        <span className="block">
                          <QuoteLink service="ceramic" package={coating.id}>
                            Quote this tier
                          </QuoteLink>
                        </span>
                      </>
                    }
                  />
                );
              })}
            </KeyValueList>

            <h3 className="ps-rule-label mt-9">Coating add-ons</h3>
            <KeyValueList className="mt-4" label="Coating add-ons">
              {COATING_ADDONS.map((addon) => (
                <KeyValueRow
                  key={addon}
                  k={addon}
                  v={<QuoteLink service="ceramic" />}
                  tone="pewter"
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          MARINE. Real published prices, and almost nobody local has them.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="On the water" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <Plate
              id="marine-boat-trailer"
              caption="Center console, after a marine detail"
              sizes="(min-width: 1024px) 36rem, 100vw"
            />
          </div>
          <div className="min-w-0 lg:col-span-6">
            <SectionHead
              size="md"
              title="The same process, on the water."
              intro={
                <p>
                  Boats get the same ladder as vehicles, priced separately
                  because a hull is not a fender. Interiors and marine coatings
                  are priced on their own.
                </p>
              }
            />
            <div className="mt-7">
              <Button href="/marine-detailing/" tone="ghost" size="sm">
                Marine detailing
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="sheet" label="Boats" id="marine" className="plane-arc">
        <SectionHead title="Marine" />

        <div className="mt-11 grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h3 className="ps-rule-label">Marine detailing</h3>
            <KeyValueList className="mt-4" label="Marine detailing prices">
              {MARINE_PACKAGES.map((pkg) => (
                <KeyValueRow
                  key={pkg.id}
                  k={pkg.name}
                  v={<PriceFigure value={pkg.fromPrice} from />}
                />
              ))}
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <h3 className="ps-rule-label">Marine interior and coating</h3>
            <KeyValueList className="mt-4" label="Marine extras prices">
              {MARINE_EXTRAS.map((extra) => (
                <KeyValueRow
                  key={extra.key}
                  k={extra.key}
                  v={<PriceFigure value={extra.value} from />}
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE UNPRICED FOUR. Never a dead grey label, always a tap target.
          --------------------------------------------------------------- */}
      <Section plane="shop" label="No published price" id="quoted" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="We quote these on the vehicle."
              intro={
                <p>
                  No starting price is published for these, so none is invented
                  here. What they cost turns on the panel count, the glass, the
                  size of the damage or the finish on the wheel, and that is a
                  look, not a guess.
                </p>
              }
            />

            <div className="ps-prose mt-5">
              <p>
                Send the vehicle through and the answer comes back with a real
                number on it.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KeyValueList label="Services quoted on the vehicle">
              {QUOTED.map((s) => (
                <KeyValueRow
                  key={s.id}
                  k={
                    <Link
                      href={s.href}
                      className="text-spec-000 underline decoration-rule-dark decoration-1 underline-offset-4 transition-colors hover:decoration-cyan-500"
                    >
                      {s.name}
                    </Link>
                  }
                  v={<QuoteLink service={s.quoteKey} />}
                  tone="pewter"
                />
              ))}
            </KeyValueList>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          One primary action, one solid cyan button: the form submit.
          --------------------------------------------------------------- */}
      <Section plane="sheet" label="Get a price" id="quote" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              title="Get the real number."
              intro={
                <p>
                  Tell us the year, make and model and which line above you are
                  looking at. It goes straight to the shop and comes back with
                  a price for that vehicle.
                </p>
              }
            />

            <PhoneLink
              placement="pricing-panel"
              className="mt-8 flex min-w-0 items-center justify-between gap-4 border border-rule-light bg-sheet-060 px-5 py-5 transition-colors hover:border-cyan-500"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-400">
                  Or call the shop
                </span>
                <span className="mt-1 block font-mono text-2xl tabular-nums text-ink-900">
                  {BRAND.phoneDisplay}
                </span>
              </span>
              <span className="h-px w-6 flex-none bg-cyan-500" aria-hidden />
            </PhoneLink>

            <KeyValueList className="mt-8" label="Shop">
              <KeyValueRow k="Address" v={BRAND.addressLine} />
              {BRAND.hours.map((h) => (
                <KeyValueRow key={h.days} k={h.days} v={h.time} />
              ))}
            </KeyValueList>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Send us the vehicle"
              intro="Pick the service, add the vehicle, and the number comes back from the shop."
              source="/pricing/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
