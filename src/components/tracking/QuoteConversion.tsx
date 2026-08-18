"use client";

import { useEffect } from "react";
import { gtagEvent, adsConversion } from "@/lib/gtag";
import { GADS } from "@/lib/constants";

/**
 * /thank-you is only reachable after a successful quote submit, so mounting
 * here is the form-lead conversion trigger. Fires on both SPA navigation
 * from the form and a direct page load.
 */
export default function QuoteConversion() {
  useEffect(() => {
    adsConversion(GADS.labels.quoteForm);
    gtagEvent("generate_lead", { form: "quote" });
  }, []);
  return null;
}
