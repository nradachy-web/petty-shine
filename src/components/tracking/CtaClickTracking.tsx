"use client";

import { useEffect } from "react";
import { gtagEvent, adsConversion } from "@/lib/gtag";
import { GADS } from "@/lib/constants";

/**
 * One delegated listener covers every tel:, sms:, and mailto: CTA on the
 * site, navbar, hero, sticky bar, footer, service pages, city pages, so
 * any CTA added later is tracked without touching this file. Capture phase
 * so component handlers can't swallow the click first.
 *
 * Ads conversions no-op until GADS.labels are filled in.
 */
export default function CtaClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const link = target?.closest<HTMLAnchorElement>(
        'a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"]'
      );
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        adsConversion(GADS.labels.phoneClick);
        gtagEvent("phone_call_click", { link_url: href });
      } else if (href.startsWith("sms:")) {
        adsConversion(GADS.labels.phoneClick);
        gtagEvent("sms_click", { link_url: href });
      } else {
        adsConversion(GADS.labels.emailClick);
        gtagEvent("email_click", { link_url: href });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
