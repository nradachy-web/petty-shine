/**
 * GOOGLE TAG AND GOOGLE ADS CONVERSIONS
 * ============================================================================
 *
 * NICK, READ THIS. Four values turn tracking on. They all live in one place,
 * the `GADS` object in src/lib/constants.ts. Until they are filled in, every
 * function in this file does nothing at all, silently, and the site loads no
 * Google script. That is deliberate: the site ships before the tag exists.
 *
 *   GADS.googleTagId        example "AW-1234567890"
 *     The Google Ads tag id. Google Ads > Tools > Data manager > Google tag.
 *     This is the master switch. While it is an empty string no gtag.js is
 *     loaded, no dataLayer is created, and no event fires anywhere.
 *
 *   GADS.labels.quoteForm   example "AbC-D_efGh12ijkLmn"
 *     The conversion label for a quote form submit. In Google Ads create a
 *     conversion action: goal "Submit lead form", source Website, count Once.
 *     Google shows you a snippet containing
 *         send_to: 'AW-1234567890/AbC-D_efGh12ijkLmn'
 *     Paste the part AFTER the slash. Pasting the whole thing also works,
 *     this file handles both.
 *     THIS IS THE ONE THAT MATTERS MOST. Account 668-110-4182 has no website
 *     form conversion today, so Smart Bidding is being fed map clicks.
 *
 *   GADS.labels.phoneClick  example "XyZ-1_abcDe34fghIjk"
 *     The conversion label for a click on a tel: link. Conversion action:
 *     goal "Contact", source Website, count Once. Two things cover this:
 *     the PhoneLink and CallLink components wire it per link, and the
 *     delegated listener in components/tracking/CtaClickTracking.tsx catches
 *     every other tel: link on the site. A repeat of the same conversion
 *     inside 1.5 seconds is dropped here, so the overlap cannot double count.
 *
 *   GADS.ga4Id (optional)   example "G-XXXXXXXXXX"
 *     GA4 measurement id. Only used by the root layout to add a second
 *     gtag config line. Conversions do not depend on it.
 *
 * WHAT COUNTS AS A CONVERSION HERE
 *   quote form submit   fires once, and only after Web3Forms accepts the
 *                       lead. A form that could not be delivered never fires
 *                       a conversion, because a conversion nobody received is
 *                       exactly the noise this rebuild exists to remove.
 *   phone click         fires on any tel: link click, anywhere on the site.
 *
 * DOUBLE COUNTING
 *   The form fires the conversion at the moment of the successful submit and
 *   records that it did so in sessionStorage. The /thank-you/ page then acts
 *   as a safety net: it fires only if a submit was recorded but not counted.
 *   Someone who bookmarks or reloads /thank-you/ never generates a phantom
 *   lead, and a real second request in the same session still counts.
 */

import { GADS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/* internals                                                           */
/* ------------------------------------------------------------------ */

type GtagFn = (...args: unknown[]) => void;
type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: GtagFn };

/** Widened to string on purpose: these are empty literals in constants today. */
const TAG_ID: string = GADS.googleTagId;
const LABEL_QUOTE: string = GADS.labels.quoteForm;
const LABEL_PHONE: string = GADS.labels.phoneClick;

/** Nothing in this file does anything until a tag id exists. */
export function tagIsLive(): boolean {
  return typeof window !== "undefined" && TAG_ID.length > 0;
}

/**
 * Mirrors Google's own stub so an event fired before gtag.js finishes
 * loading still queues in dataLayer instead of being lost.
 */
function ensureGtag(): GtagFn | null {
  if (!tagIsLive()) return null;
  const w = window as unknown as GtagWindow;
  if (!w.gtag) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer as unknown[]).push(arguments);
    };
  }
  return w.gtag ?? null;
}

/**
 * One click, one report.
 *
 * A tel: link can be wired twice without anyone meaning to: once by the
 * anchor's own onClick and once by the delegated listener in
 * components/tracking/CtaClickTracking.tsx. Both routes end up here, so the
 * guard lives here, in the one file every event passes through. An identical
 * event inside the window is dropped rather than sent twice.
 */
const RECENT = new Map<string, number>();
const DEDUPE_MS = 1500;

function isRepeat(key: string): boolean {
  const now = Date.now();
  const last = RECENT.get(key);
  if (last !== undefined && now - last < DEDUPE_MS) return true;
  RECENT.set(key, now);
  if (RECENT.size > 40) {
    for (const [k, t] of RECENT) if (now - t > DEDUPE_MS) RECENT.delete(k);
  }
  return false;
}

/** A plain event. No-ops silently with no tag id. */
export function gtagEvent(name: string, params: Record<string, unknown> = {}): void {
  const gtag = ensureGtag();
  if (!gtag) return;
  if (isRepeat(`e:${name}:${JSON.stringify(params)}`)) return;
  gtag("event", name, params);
}

/** Accepts a bare label or a full "AW-123/label" string. */
function sendTo(label: string): string {
  if (!TAG_ID || !label) return "";
  return label.startsWith("AW-") ? label : `${TAG_ID}/${label}`;
}

/**
 * A Google Ads conversion. No-ops silently while its label is empty, which is
 * the state the site ships in.
 *
 * Exported because components/layout/callTracking.ts calls it directly with a
 * fully assembled "AW-123/label" send_to. Both forms work.
 */
export function adsConversion(
  label: string,
  params: Record<string, unknown> = {}
): void {
  const target = sendTo(label);
  if (!target) return;
  if (isRepeat(`c:${target}`)) return;
  const gtag = ensureGtag();
  if (!gtag) return;
  gtag("event", "conversion", { send_to: target, ...params });
}

/* ------------------------------------------------------------------ */
/* conversion 1 of 2: the phone click                                  */
/* ------------------------------------------------------------------ */

/**
 * Fire the click to call conversion.
 * `placement` is diagnostic only and never leaves the analytics event, so it
 * can be anything useful: "sticky-rail", "contact-page", "quote-form".
 */
export function trackPhoneClick(placement = "unknown"): void {
  adsConversion(LABEL_PHONE);
  gtagEvent("phone_click", { placement });
}

/* ------------------------------------------------------------------ */
/* conversion 2 of 2: the quote form                                   */
/* ------------------------------------------------------------------ */

export interface QuoteSubmission {
  /** short human label, for the receipt on /thank-you/ */
  service: string;
  packageName?: string;
  vehicle: string;
  name: string;
}

interface StoredSubmission extends QuoteSubmission {
  id: string;
  counted: boolean;
}

const STORE_KEY = "pettyshine.quote";

function readStore(): StoredSubmission | null {
  try {
    const raw = window.sessionStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSubmission;
    return parsed && typeof parsed.id === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function writeStore(value: StoredSubmission): void {
  try {
    window.sessionStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    /* storage can be unavailable in some in app browsers. Not fatal: the
       form has already fired its own conversion by the time this runs. */
  }
}

function newId(): string {
  return `q${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Called by QuoteForm the moment Web3Forms accepts the lead.
 * Fires the conversion, then records what was sent so /thank-you/ can show
 * the visitor a receipt and knows not to count the same lead twice.
 */
export function trackQuoteSubmit(submission: QuoteSubmission): void {
  const record: StoredSubmission = { ...submission, id: newId(), counted: false };
  fireQuoteConversion(record);
  record.counted = true;
  writeStore(record);
}

function fireQuoteConversion(record: StoredSubmission): void {
  adsConversion(LABEL_QUOTE, { transaction_id: record.id });
  gtagEvent("generate_lead", {
    form: "quote",
    service: record.service,
    package: record.packageName ?? "",
  });
}

/**
 * Read only. What the visitor just sent, for the receipt on /thank-you/.
 * Fires nothing. Returns null on a direct visit.
 */
export function readQuoteSubmission(): QuoteSubmission | null {
  if (typeof window === "undefined") return null;
  const record = readStore();
  if (!record) return null;
  const { service, packageName, vehicle, name } = record;
  return { service, packageName, vehicle, name };
}

/**
 * Called by the /thank-you/ page.
 * Returns what was submitted so the page can render a receipt, and fires the
 * conversion only if the submit was recorded but never counted. A direct or
 * repeat visit to /thank-you/ fires nothing.
 */
export function flushQuoteConversion(): QuoteSubmission | null {
  if (typeof window === "undefined") return null;
  const record = readStore();
  if (!record) return null;
  if (!record.counted) {
    fireQuoteConversion(record);
    record.counted = true;
    writeStore(record);
  }
  const { service, packageName, vehicle, name } = record;
  return { service, packageName, vehicle, name };
}
