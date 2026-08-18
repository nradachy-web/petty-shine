import { Star } from "lucide-react";
import { BRAND, RATING, REVIEWS, type Review } from "@/lib/constants";
import RuleLabel from "@/components/ui/RuleLabel";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Reviews are shown as visible content only, no aggregateRating markup.
 * Google treats self-serving ratings on a business's own LocalBusiness
 * schema as ineligible for star results, so the markup buys nothing and
 * carries policy risk. The count and date are always stated together.
 */
export default function ReviewWall({
  items = REVIEWS.slice(0, 6),
  title = "105 reviews. One of them is four stars.",
  eyebrow = "What customers say",
  intro,
}: {
  items?: Review[];
  title?: string;
  eyebrow?: string;
  intro?: string;
}) {
  return (
    <section className="section bg-paper-2">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <RuleLabel>{eyebrow}</RuleLabel>
            <h2 className="display-md mt-6">{title}</h2>
            {intro && <p className="mt-4 max-w-xl leading-relaxed text-muted">{intro}</p>}
          </div>
          <a
            href={BRAND.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="plate flex items-center gap-4 px-5 py-4"
          >
            <span className="price text-[2.25rem] leading-none">
              {RATING.value.toFixed(1)}
            </span>
            <span>
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-star text-star" />
                ))}
              </span>
              <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                {RATING.count} Google reviews · {RATING.asOf}
              </span>
            </span>
          </a>
        </div>

        <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {items.map((r) => (
            <RevealItem key={r.name} className="h-full">
            <figure className="plate lift flex h-full flex-col p-6">
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-star text-star" />
                ))}
              </span>
              <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-body">
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
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
          {RATING.fiveStar} of {RATING.count} Google reviews are five stars, as of{" "}
          {RATING.asOf} · {RATING.facebook.recommendPct}% recommend on Facebook from{" "}
          {RATING.facebook.count} reviews
        </p>
      </div>
    </section>
  );
}
