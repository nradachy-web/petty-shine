"use client";

import { useEffect } from "react";
import { flushQuoteConversion } from "@/lib/gtag";

/**
 * Mounted on /thank-you/ only.
 *
 * The quote form already fires the conversion the moment Web3Forms accepts
 * the lead. This is the safety net for the case where the form fired before
 * gtag.js was ready to receive it: flushQuoteConversion() fires only when a
 * submit was recorded in this session and not yet counted.
 *
 * A bookmark, a reload, or someone landing on /thank-you/ directly fires
 * nothing. The old site's version fired on every mount, which is how a
 * conversion column fills up with visits that were never leads.
 */
export default function QuoteConversion() {
  useEffect(() => {
    flushQuoteConversion();
  }, []);

  return null;
}
