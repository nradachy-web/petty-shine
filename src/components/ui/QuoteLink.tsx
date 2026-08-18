import type { ReactNode } from "react";
import Link from "next/link";
import { QUOTE_CTA_LABEL, SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import "./primitives.css";

export interface QuoteLinkProps {
  /**
   * The quote form service key, for example "ppf" or "ceramic". It
   * matches ServiceLine.quoteKey in constants.ts and rides into the
   * form as ?service=, so the visitor lands on a form that already
   * knows what they asked about.
   *
   * Optional only so that a slot with nothing else to go on still
   * renders a working link to /quote/ rather than nothing at all.
   * Pass it every time you can.
   */
  service?: string;
  /** optional package key, so the lead arrives already qualified */
  package?: string;
  /** overrides the default label. Keep it a promise, never a warning. */
  children?: ReactNode;
  /**
   * Overrides the accessible name. By default a link with the stock
   * label names its service too, so a screen reader running through
   * a page of nine of these hears nine different links.
   */
  ariaLabel?: string;
  className?: string;
  id?: string;
}

/**
 * "Quoted on your vehicle".
 *
 * Four of his nine services publish no price, and PPF is the one he
 * spends the most advertising: 170 clicks into 1 lead, on a page that
 * lists four package names in prose and prices none. A grey "call for
 * pricing" label on those rows is the single most expensive thing a
 * page can do, because it turns the highest intent moment on the site
 * into a dead end. With PRICING_MODE set to "private" that is now
 * every price slot on the site, so this component carries the whole
 * conversion path.
 *
 * So an unpriced row is never a dead grey label. It is this: a
 * tappable link, 44px tall, in the plane's link colour, carrying the
 * service and the package into /quote/ so the form arrives pre-filled
 * and the lead arrives qualified.
 *
 * The label is QUOTE_CTA_LABEL in constants.ts, one wording for the
 * whole site. `package` is destructured as `pkg` because `package` is
 * a reserved word in strict mode and cannot be used as a binding name.
 */
export default function QuoteLink({
  service,
  package: pkg,
  children,
  ariaLabel,
  className,
  id,
}: QuoteLinkProps) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (pkg) params.set("package", pkg);
  const query = params.toString();
  const href = query ? `/quote/?${query}` : "/quote/";

  /* The visible words stay inside the accessible name, so the link
     still answers to what a speech user can see on it. */
  const serviceName = service
    ? SERVICES.find((s) => s.quoteKey === service)?.name
    : undefined;
  const label =
    ariaLabel ??
    (children == null && serviceName
      ? `${QUOTE_CTA_LABEL}, ${serviceName}`
      : undefined);

  return (
    <Link
      id={id}
      href={href}
      className={cn("quote-link", className)}
      aria-label={label}
    >
      <span className="quote-link__text">{children ?? QUOTE_CTA_LABEL}</span>
      <span className="quote-link__arrow" aria-hidden="true">
        {"→"}
      </span>
    </Link>
  );
}

export { QuoteLink };
