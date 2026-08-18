import { trackPhoneClick } from "@/lib/gtag";

/**
 * Click to call is the most valuable event this site produces. The live Ads
 * account has no website call conversion at all today, so the bidder is being
 * fed "someone looked at the map". This is the wire for the real one.
 *
 * THERE IS EXACTLY ONE IMPLEMENTATION AND IT IS NOT THIS FILE.
 * Everything goes through trackPhoneClick in src/lib/gtag.ts, which is what
 * the build contract names. That is where the send_to is assembled, where the
 * empty tag id short circuits, and where the 1.5 second repeat guard lives.
 * The guard is why the per link handler and the delegated listener in
 * components/tracking/CtaClickTracking.tsx can both be active without double
 * counting a single tap.
 *
 * This file stays because the header, the mobile menu, the footer and the
 * sticky rail already import trackCall by name. It is a rename, nothing more.
 */
export function trackCall(placement: string) {
  trackPhoneClick(placement);
}
