import type { Metadata } from "next";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Plate from "@/components/ui/Plate";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, CREDENTIALS, REVIEWS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About the Shop",
  description: `${BRAND.owner} runs ${BRAND.name} at ${BRAND.street} in ${BRAND.city}, ${BRAND.stateName}. Gtechniq Accredited Detailer and Authorized STEK installer.`,
  alternates: { canonical: "/about/" },
};

/* ============================================================================
   THE ONE PAGE WITHOUT A TABLE ON IT.

   Everywhere else on this site the sourced fact voice is IBM Plex Mono and
   the facts arrive as ruled key and value rows. Not here. The design rules
   reserve mono for prices, spec values, warranty terms and citations, and
   say plainly that it never sets the About page, so there is not a single
   KeyValueRow below and every sentence is Archivo.

   What is left has to carry itself on evidence. What this page is allowed to
   say is bounded hard by _plan/RECON.md: no founding year, no years in
   business, no family language, and nothing whatsoever about the road this
   shop happens to sit on. So the page is built out of the three things that
   are actually proven: the photographs, the two manufacturer directories
   that list him, and the reviews that use his name.

   FIRST NAME is derived rather than typed, because BRAND.owner is the spine.
   ========================================================================== */

const FIRST_NAME = BRAND.owner.split(" ")[0];

const GTECHNIQ = CREDENTIALS.find((c) => c.id === "gtechniq")!;
const STEK = CREDENTIALS.find((c) => c.id === "stek")!;

/** Link labels describing where each citation points. */
const SOURCE_LABEL: Record<string, string> = {
  gtechniq: "Look him up in Gtechniq's detailer directory",
  stek: "Look him up in STEK USA's installer directory",
};

/** The reviews that use his name, pulled from the spine rather than chosen. */
const BY_NAME = REVIEWS.filter((r) => r.text.includes(FIRST_NAME));

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs plane="sheet" trail={[{ label: "About", href: "/about/" }]} />

      <Section plane="sheet" label="About">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">
              {BRAND.owner} runs this shop.
            </h1>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <div className="ps-prose">
              <p>
                {BRAND.name} works out of one building at {BRAND.street} in{" "}
                {BRAND.city}. It is open {BRAND.hours[0].days},{" "}
                {BRAND.hours[0].time}, and closed at the weekend.
              </p>
              <p>
                The banner hanging in the shop says{" "}
                {BRAND.taglineWords.join(", ").toLowerCase()}. That is the
                whole business in four words, and it is
                how this site is laid out: paint put right, film and coating
                put on, glass done, then kept that way.
              </p>
              <p>
                Most shops answer a price question with a phone number. This
                one publishes what it can publish, says which services depend
                on the vehicle, and quotes those after looking at it.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="The shop" className="plane-arc">
        <SectionHead
          size="md"
          align="split"
          title="What comes through the door."
          intro={
            <p>
              A McLaren GT and a Lamborghini Huracan are in the photographs on
              this site. So is a lifted F-250, a Jeep on 37s, a 1965 Mustang, a
              Porsche 911 and a center console boat on its trailer. Nothing
              about the process changes with the badge on the hood.
            </p>
          }
        />

        <div className="mt-9">
          <Plate
            id="coating-huracan"
            caption="The shop, with the Gtechniq banner on the right"
            bleed
            priority
          />
        </div>

        <div className="mt-9 grid min-w-0 grid-cols-2 items-start gap-x-4 gap-y-7 sm:gap-5">
          <Plate
            id="wheels-mustang"
            caption="Mustang, wheels off"
            sizes="(min-width: 1240px) 36rem, 45vw"
          />
          <Plate
            id="detail-f250-black"
            caption="F-250 Super Duty, corrected"
            sizes="(min-width: 1240px) 36rem, 45vw"
          />
        </div>

        <div className="mt-10">
          <Button href="/gallery/" tone="ghost">
            See all of it
          </Button>
        </div>
      </Section>

      <Section plane="sheet" label="Credentials" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Two things you can check yourself."
              intro={
                <p>
                  Neither of these is a badge anyone here designed. Both are
                  entries in a manufacturer&rsquo;s own directory, put there by
                  the manufacturer, and both are worth checking before you hand
                  any shop your car.
                </p>
              }
            />
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="border-t border-rule-light">
              {[GTECHNIQ, STEK].map((credential) => (
                <div key={credential.id} className="border-b border-rule-light py-7">
                  <h3 className="ps-heading text-xl text-ink-900">
                    {credential.label}
                  </h3>
                  <div className="ps-prose mt-3">
                    <p>{credential.body}</p>
                    <p>
                      <a
                        href={credential.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {SOURCE_LABEL[credential.id]}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ps-prose mt-8">
              <p>
                It is also why the coating page names the products the way
                Gtechniq names them, and prints what the guarantee actually
                asks of you rather than only what it promises.
              </p>
            </div>

            <div className="mt-6">
              <Button href="/ceramic-coating/" tone="ghost" size="sm">
                The coating page
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="In their words" className="plane-arc">
        <SectionHead
          size="md"
          align="split"
          title="The reviews use his name."
          intro={
            <p>
              {BY_NAME.length} of the {REVIEWS.length} reviews quoted on this
              site name {FIRST_NAME} rather than the shop. They are below, in
              full, with the spelling and the punctuation left as written.
            </p>
          }
        />

        <div className="mt-10 min-w-0 border-b border-rule-dark">
          {BY_NAME.map((review) => (
            <figure
              key={review.name}
              className="grid min-w-0 gap-4 border-t border-rule-dark py-8 md:grid-cols-12 md:gap-10 md:py-10"
            >
              <figcaption className="min-w-0 md:col-span-4">
                <span className="block h-px w-6 bg-cyan-500" aria-hidden />
                {/* No mono anywhere in this page's copy, including here. The
                    service tag that /reviews/ carries beside each quote is
                    deliberately dropped. */}
                <span className="ps-heading mt-4 block text-lg text-spec-000">
                  {review.name}
                </span>
              </figcaption>

              <blockquote className="min-w-0 md:col-span-8">
                <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-spec-000">
                  {review.text}
                </p>
              </blockquote>
            </figure>
          ))}
        </div>

        <div className="mt-9">
          <Button href="/reviews/" tone="ghost">
            All {REVIEWS.length} reviews
          </Button>
        </div>
      </Section>

      <Section plane="sheet" label="Next step" className="plane-arc">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Bring it by."
              intro={
                <p>
                  The shop is at {BRAND.addressLine}, open{" "}
                  {BRAND.hoursShort}. Call and talk it through, or send the
                  vehicle through the form and we will come back with a price
                  for it.
                </p>
              }
            />

            <PhoneLink
              placement="about-page"
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

            <div className="mt-7">
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

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Get a price for your vehicle"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/about/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
