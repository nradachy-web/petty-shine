import type { Metadata } from "next";

import QuoteForm from "@/components/quote/QuoteForm";
import PhoneLink from "@/components/tracking/PhoneLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import KeyValueRow, { KeyValueList } from "@/components/ui/KeyValueRow";
import Plate from "@/components/ui/Plate";
import Section, { SectionHead } from "@/components/ui/Section";
import { BRAND, REVIEWS, REVIEW_SUMMARY } from "@/lib/constants";
import { longDate } from "@/lib/utils";
import { spell, spellCap } from "../areas/[city]/facts";

export const metadata: Metadata = {
  title: "Customer Reviews from Google",
  /* 158 characters. */
  description: `What ${spell(REVIEWS.length)} customers of ${BRAND.name} in ${BRAND.city}, ${BRAND.stateName} wrote on Google, quoted in full with the spelling and the punctuation left exactly as written.`,
  alternates: { canonical: "/reviews/" },
};

/* ============================================================================
   NO REVIEW MARKUP ON THIS PAGE, ON PURPOSE.

   Google treats review and aggregateRating markup about your own business,
   published on your own site, as self serving. It is ineligible for a rich
   result and has been since 2019. Emitting it would add risk and buy nothing,
   so this page carries breadcrumbs and nothing else, and the rating below is
   presented as what it is: a number read off his Google profile on a stated
   date.

   The quotes are verbatim. The capitalisation, the run on sentences and the
   missing full stops are the customers' own and are left alone, because a
   tidied up review is not a quote any more.
   ========================================================================== */

/**
 * One presentation of the check date, used everywhere it appears on this
 * page. It used to print as the raw ISO string in the table and as a written
 * date in the footnote, which read as two different readings of the profile.
 * The ISO string in constants.ts is storage, not display.
 */
const CHECKED = longDate(REVIEW_SUMMARY.checkedOn);

/** Derived from the spine, so these can never drift from the quotes below. */
const COATING_JOBS = REVIEWS.filter((r) =>
  r.service.toLowerCase().includes("ceramic")
).length;

const NAME_HIM = REVIEWS.filter((r) => r.text.includes(BRAND.owner.split(" ")[0])).length;

export default function ReviewsPage() {
  return (
    <>
      <Breadcrumbs plane="sheet" trail={[{ label: "Reviews", href: "/reviews/" }]} />

      <Section plane="sheet" label="Reviews">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="ps-display ps-display-lg">What customers said</h1>

            <div className="ps-prose mt-6">
              <p>
                {BRAND.name} is an auto detailing and ceramic coating shop at{" "}
                {BRAND.street} in {BRAND.city}, {BRAND.stateName}. Its Google
                profile shows {REVIEW_SUMMARY.rating} from{" "}
                {REVIEW_SUMMARY.count} reviews, read on {CHECKED}.
              </p>
              <p>
                {spellCap(REVIEWS.length)} of those reviews are quoted on this
                page, in full, with the spelling and the punctuation left
                exactly as they were written. Nothing is trimmed to the good
                part.
              </p>
              <p>
                The rating is not ours. It is what the profile showed on that
                date, and review counts move, so treat it as a reading rather
                than a badge.
              </p>
            </div>

            <div className="mt-8">
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ps-btn ps-btn--ghost ps-btn--sm"
              >
                Read them on Google
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <KeyValueList capped label="Google profile">
              <KeyValueRow
                k="Rating"
                v={`${REVIEW_SUMMARY.rating} out of 5`}
                strong
              />
              <KeyValueRow k="Reviews" v={String(REVIEW_SUMMARY.count)} />
              <KeyValueRow k="Source" v={REVIEW_SUMMARY.source} />
              <KeyValueRow
                k="Checked"
                v={CHECKED}
                tone="pewter"
                note="Read off the profile, not calculated here"
              />
              <KeyValueRow
                k="Quoted here"
                v={`${REVIEWS.length} in full`}
                tone="pewter"
              />
            </KeyValueList>
          </div>
        </div>
      </Section>

      <Section plane="shop" label="In their words">
        <SectionHead
          size="md"
          align="split"
          title="In their own words."
          intro={
            <p>
              {spellCap(COATING_JOBS)} of the {spell(REVIEWS.length)} are
              coating jobs and the rest are detailing. {spellCap(NAME_HIM)} of
              them name {BRAND.owner.split(" ")[0]} rather than the shop.
            </p>
          }
        />

        <div className="mt-9">
          <Plate
            id="coating-g-wagon"
            caption="Mercedes-Benz G-Class, coated"
            bleed
          />
        </div>

        <div className="mt-10 min-w-0 border-b border-rule-dark">
          {REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="grid min-w-0 gap-4 border-t border-rule-dark py-8 md:grid-cols-12 md:gap-10 md:py-10"
            >
              <figcaption className="min-w-0 md:col-span-4">
                <span className="block h-px w-6 bg-cyan-500" aria-hidden />
                <span className="ps-heading mt-4 block text-lg text-spec-000">
                  {review.name}
                </span>
                <span className="mt-3 block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-300">
                  {review.stars} of 5
                </span>
                <span className="mt-1 block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-pewter">
                  {review.service}
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

        <p className="cta-meta mt-8">
          Quoted verbatim from Google, {CHECKED}
        </p>
      </Section>

      <Section plane="sheet" label="Next step">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              size="md"
              title="Been here before?"
              intro={
                <p>
                  If we did work on your vehicle, the review goes on the same
                  Google profile the rating above came from. Say what you
                  brought in and what we did to it, because that is the part
                  the next person reads.
                </p>
              }
            />

            <div className="mt-7">
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ps-btn ps-btn--ghost"
              >
                Leave a review on Google
              </a>
            </div>

            <PhoneLink
              placement="reviews-page"
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
              <Button href="/gallery/" tone="ghost" size="sm">
                See the work
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <QuoteForm
              heading="Get a price for your vehicle"
              intro="It goes straight to the shop. Year, make, model and what you want done is enough to start."
              source="/reviews/"
              id="quote-form"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
