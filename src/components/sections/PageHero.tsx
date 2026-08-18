import Link from "next/link";
import { Phone, Star } from "lucide-react";
import Photo from "@/components/ui/Photo";
import RuleLabel from "@/components/ui/RuleLabel";
import { BRAND, RATING } from "@/lib/constants";
import type { PhotoId } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * Standard interior-page hero: a real job photo behind an ink scrim,
 * eyebrow / H1 / sub, and the two CTAs that matter (price builder, phone).
 */
export default function PageHero({
  eyebrow,
  title,
  sub,
  photo,
  price,
  ctaLabel = "Get my price",
  ctaHref = "/quote/",
  compact = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  photo: PhotoId;
  price?: string;
  ctaLabel?: string;
  ctaHref?: string;
  compact?: boolean;
}) {
  return (
    <section className="on-wall relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Photo id={photo} priority sizes="100vw" className="opacity-55" />
        <div className="absolute inset-0 scrim-l" />
      </div>

      <div
        className={cn(
          "container-wide relative",
          compact ? "py-16 md:py-20" : "py-20 md:py-28 lg:py-32"
        )}
      >
        <div className="max-w-3xl">
          <RuleLabel tone="light">{eyebrow}</RuleLabel>
          <h1 className={cn("mt-6 text-white", compact ? "display-lg" : "display-xl")}>
            {title}
          </h1>
          {sub && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-light-2">{sub}</p>
          )}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={ctaHref} className="btn btn-primary btn-lg shrink-0 whitespace-nowrap">
              {ctaLabel}
            </Link>
            <a
              href={`tel:${BRAND.phoneTel}`}
              className="btn btn-outline-light btn-lg shrink-0 whitespace-nowrap"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {BRAND.phoneDisplay}
            </a>
            {price && (
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-white/70 sm:ml-3">
                {price}
              </span>
            )}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-white/70">
            <span className="flex items-center gap-1.5">
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-star text-star" />
                ))}
              </span>
              {RATING.value.toFixed(1)} · {RATING.count} Google reviews
            </span>
            <span>Est. {BRAND.founded}</span>
            <span>{BRAND.city}, {BRAND.state}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
