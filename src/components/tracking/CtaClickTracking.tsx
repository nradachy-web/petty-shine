"use client";

import { useEffect } from "react";
import { trackPhoneClick } from "@/lib/gtag";

/**
 * One delegated listener covers every tel: and sms: link on the site: the
 * navbar, the hero, the sticky call rail, the footer, service pages, city
 * pages, the quote form. Any call link added later is tracked without anyone
 * remembering to wire it up, and nothing double fires because no page adds
 * its own handler.
 *
 * Capture phase, so a component's own onClick cannot swallow it first.
 *
 * Optional: put data-call-placement="sticky-rail" on a link and that string
 * rides along on the analytics event. It has no effect on the conversion.
 *
 * Mount once, in the root layout:
 *   import CtaClickTracking from "@/components/tracking/CtaClickTracking";
 *   <CtaClickTracking />
 *
 * Fires nothing at all until GADS.googleTagId is filled in. See src/lib/gtag.ts.
 */
export default function CtaClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const link = target?.closest<HTMLAnchorElement>(
        'a[href^="tel:"], a[href^="sms:"]'
      );
      if (!link) return;
      const placement =
        link.dataset.callPlacement ||
        link.closest<HTMLElement>("[data-call-placement]")?.dataset
          .callPlacement ||
        "link";
      trackPhoneClick(placement);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
