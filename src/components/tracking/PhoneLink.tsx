"use client";

import type { ReactNode } from "react";
import { BRAND } from "@/lib/constants";
import { trackPhoneClick } from "@/lib/gtag";

/**
 * A tel: link that reports its own click.
 *
 * The click to call conversion is the most valuable thing this site produces,
 * because the live Ads account has no website call conversion at all today.
 * Two things cover it, on purpose:
 *
 *   1. this component, wired per link, and
 *   2. the delegated listener in CtaClickTracking.tsx, which catches every
 *      tel: link on the site including ones nobody remembered to wire.
 *
 * Both routes call the same helper in src/lib/gtag.ts, which drops a repeat
 * of the same conversion inside 1.5 seconds, so belt and braces never becomes
 * a double count.
 *
 * `placement` is diagnostic only: "sticky-rail", "contact-page", "quote-form".
 */
export default function PhoneLink({
  placement,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  placement: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <a
      href={`tel:${BRAND.phoneTel}`}
      data-call-placement={placement}
      onClick={() => trackPhoneClick(placement)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
