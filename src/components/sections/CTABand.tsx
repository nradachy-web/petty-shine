import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import DatumRule from "@/components/ui/DatumRule";
import QuoteLink from "@/components/ui/QuoteLink";
import "@/components/ui/primitives.css";

export interface CTABandProps {
  /**
   * "band" is a full section with its own plane and one solid cyan
   * button. "line" is a quiet ruled line with no button at all.
   *
   * USE "line" WHENEVER A PRIMARY ACTION IS ALREADY ON THE SCREEN.
   * Every page has exactly one primary action and exactly one solid
   * cyan button. A band stacked under an inline quote form, or two
   * bands inside one screen height, breaks both rules at once and
   * trains the visitor to ignore the button that matters.
   */
  variant?: "band" | "line";
  /** band only. Defaults to the shop plane. */
  plane?: "shop" | "sheet";
  /** mono caps label on the band's datum rule */
  label?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  /** quote form service key, carried into /quote/ */
  service?: string;
  /** quote form package key, so the lead arrives already qualified */
  package?: string;
  id?: string;
  className?: string;
}

const DEFAULT_TITLE = "Tell us the vehicle. We will tell you the number.";

const DEFAULT_BODY =
  "Published prices are starting prices. What your vehicle costs depends on its size and the condition of the paint, so we look at it before we quote it.";

const LINE_BODY =
  "Send us the year, make and model and we will come back with a number for it.";

function quoteHref(service?: string, pkg?: string): string {
  if (!service) return "/quote/";
  const params = new URLSearchParams({ service });
  if (pkg) params.set("package", pkg);
  return `/quote/?${params.toString()}`;
}

/**
 * The repeating "get a price" moment.
 *
 * His Google Ads account converts 170 PPF clicks into 1 lead, on a site
 * that publishes no price and offers no form. Every band on this site
 * ends in a number or a way to get one, and the phone link goes out as
 * a plain tel: anchor so the delegated listener in
 * components/tracking/CtaClickTracking.tsx fires the call conversion,
 * which his account does not have today at all.
 */
export default function CTABand({
  variant = "band",
  plane = "shop",
  label = "Next step",
  title = DEFAULT_TITLE,
  body,
  ctaLabel = "Get a price",
  service,
  package: pkg,
  id,
  className,
}: CTABandProps) {
  const href = quoteHref(service, pkg);

  /* ---- the quiet line ----
     No heading, no plane change, no solid button. Built to sit at the
     foot of a section that already carries the page's real CTA. */
  if (variant === "line") {
    return (
      <div id={id} className={cn("cta-line", className)}>
        <DatumRule />
        <div className="cta-line__row">
          <p className="cta-line__text">{body ?? LINE_BODY}</p>
          <div className="cta-line__actions">
            {service ? (
              <QuoteLink service={service} package={pkg}>
                {ctaLabel}
              </QuoteLink>
            ) : (
              <Link href="/quote/" className="quote-link">
                <span className="quote-link__text">{ctaLabel}</span>
                <span className="quote-link__arrow" aria-hidden="true">
                  {"→"}
                </span>
              </Link>
            )}
            <a href={`tel:${BRAND.phoneTel}`} className="cta-line__tel">
              Call {BRAND.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ---- the band ---- */
  return (
    <Section plane={plane} label={label} id={id} className={className}>
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <h2 className="ps-display ps-display-lg">{title}</h2>
          <p className="ps-prose mt-5 max-w-xl">{body ?? DEFAULT_BODY}</p>
        </div>

        <div className="flex flex-col gap-4 md:col-span-5">
          {/* The one solid cyan button on this screen. */}
          <Button href={href} tone="cyan" block>
            {ctaLabel}
          </Button>

          <a href={`tel:${BRAND.phoneTel}`} className="cta-line__tel justify-center">
            Or call {BRAND.phoneDisplay}
          </a>

          <p className="cta-meta mt-2">
            {BRAND.street}
            <br />
            <span className="whitespace-nowrap">
              {BRAND.city}, {BRAND.state} {BRAND.zip}
            </span>
            <br />
            {BRAND.hoursShort}
          </p>
        </div>
      </div>
    </Section>
  );
}

export { CTABand };
