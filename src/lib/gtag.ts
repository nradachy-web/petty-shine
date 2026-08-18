// Google tag event helper. Mirrors the official gtag stub so events queue in
// dataLayer even if gtag.js has not finished loading when the event fires.
type GtagWindow = typeof window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (!w.gtag) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer as unknown[]).push(arguments);
    };
  }
  w.gtag("event", name, params);
}

/** Fires a Google Ads conversion only when a label has actually been set. */
export function adsConversion(sendTo: string, extra?: Record<string, unknown>) {
  if (!sendTo) return;
  gtagEvent("conversion", { send_to: sendTo, ...extra });
}
