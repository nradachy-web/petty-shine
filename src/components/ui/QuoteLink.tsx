import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import "./primitives.css";

export interface QuoteLinkProps {
  /** the quote form service key, for example "ppf" or "tint" */
  service: string;
  /** optional package key, so the lead arrives already qualified */
  package?: string;
  /** overrides the default label. Keep it a promise, never a warning. */
  children?: ReactNode;
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
 * into a dead end.
 *
 * So an unpriced row is never a dead grey label. It is this: a tappable
 * link, 44px tall, in the plane's link colour, carrying the service and
 * the package into /quote/ so the form arrives pre-filled and the lead
 * arrives qualified.
 *
 * `package` is destructured as `pkg` because `package` is a reserved
 * word in strict mode and cannot be used as a binding name.
 */
export default function QuoteLink({
  service,
  package: pkg,
  children,
  className,
  id,
}: QuoteLinkProps) {
  const params = new URLSearchParams({ service });
  if (pkg) params.set("package", pkg);
  const href = `/quote/?${params.toString()}`;

  return (
    <Link id={id} href={href} className={cn("quote-link", className)}>
      <span className="quote-link__text">
        {children ?? "Quoted on your vehicle"}
      </span>
      <span className="quote-link__arrow" aria-hidden="true">
        {"→"}
      </span>
    </Link>
  );
}

export { QuoteLink };
