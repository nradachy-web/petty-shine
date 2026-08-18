"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { trackCall } from "./callTracking";

/**
 * THE CALL RAIL.
 *
 * 56px of bar over a 1px datum rule, appearing after 400px of scroll, sitting
 * above the home indicator on a notched phone.
 *
 * Two things here are structural rather than cosmetic:
 *
 * 1. IT RESERVES ITS OWN SPACE. The component renders a permanent 88px spacer
 *    as well as the fixed bar, so the last 88px of the document is always
 *    empty and the rail can never sit on top of a submit button or a closing
 *    CTA. The spacer is static markup, present with JavaScript disabled, and
 *    it never changes size, so it contributes nothing to layout shift.
 *    THIS REQUIRES <StickyCallBar /> TO BE THE LAST THING IN <body>, after
 *    <Footer />. Anywhere else and the reservation lands in the wrong place.
 *
 * 2. IT GETS OUT OF THE WAY OF THE FORM. Any element carrying
 *    `data-quote-form` (or id="quote-form") hides the rail while it is on
 *    screen, because a persistent call bar competing with the inline quote
 *    form is the rail costing a lead instead of producing one.
 *
 * 3. THE QUOTE HALF NEVER THROWS AWAY QUALIFICATION. Almost every page on
 *    this site carries an inline, service locked quote form, so a rail that
 *    always pointed at a bare /quote/ was taking a visitor who had already
 *    told us what they wanted and standing him back at the front door. The
 *    rail now scrolls to the form on the page it is on. It resolves that in
 *    two stages so it degrades cleanly:
 *      served HTML  ->  /quote/?service=<this page's service>
 *      after mount  ->  #<the inline form on this page>
 *    The href in the static file is therefore always a real, working URL
 *    that carries the page's service, which is what a visitor with
 *    JavaScript off, or a crawler, or a click landing between paint and
 *    hydration, follows.
 *
 * BREAKPOINT. The rail runs to 1279px, not to 1023px. Above 1024 the header
 * has room for either the phone number or the GET A QUOTE button but not
 * both, so the number took the header (it is sticky, it is on screen at
 * every scroll position, and a call is the more valuable action) and the
 * quote action stays here until 1280, where the header can carry both again.
 */

const SHOW_AFTER_PX = 400;
const QUOTE_FORM_SELECTOR = "[data-quote-form], #quote-form";

/** Used only if a page mounts a form that forgot to give itself an id. */
const FALLBACK_FORM_ID = "quote-form";

/**
 * The service this route is about, so the served href carries it into the
 * form. Longest match wins, which is what makes a nested route resolve to
 * its parent service rather than to nothing.
 */
function fallbackQuoteHref(pathname: string): string {
  const match = SERVICES.filter(
    (s) => pathname === s.href || pathname.startsWith(s.href)
  ).sort((a, b) => b.href.length - a.href.length)[0];

  return match ? `/quote/?service=${match.quoteKey}` : "/quote/";
}

export default function StickyCallBar() {
  const pathname = usePathname();
  const [scrolledPast, setScrolledPast] = useState(false);
  const [formOnScreen, setFormOnScreen] = useState(false);
  const [formHash, setFormHash] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolledPast(window.scrollY > SHOW_AFTER_PX);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setFormOnScreen(false);
    setFormHash(null);
    if (typeof IntersectionObserver === "undefined") return;

    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setFormOnScreen(onScreen.size > 0);
    });

    const watched = new WeakSet<Element>();
    const scan = () => {
      const found = document.querySelectorAll<HTMLElement>(QUOTE_FORM_SELECTOR);
      found.forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });

      // The first form on the page becomes the rail's quote target. An id is
      // given to it only if the page did not, so the anchor always resolves.
      const first = found[0];
      if (!first) return;
      if (!first.id) first.id = FALLBACK_FORM_ID;
      setFormHash(`#${first.id}`);
    };

    // Run now for server rendered forms, then keep watching, because a client
    // rendered form can mount after this effect has already run.
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  const show = scrolledPast && !formOnScreen;

  const servedQuoteHref = useMemo(() => fallbackQuoteHref(pathname), [pathname]);
  const quoteLabelCls =
    "flex min-w-0 items-center justify-center border-l border-rule-dark px-2 text-center font-display text-[0.75rem] font-medium uppercase tracking-[0.1em] text-spec-000 sm:text-[0.8125rem] sm:tracking-[0.12em]";

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 bg-shop-000 xl:hidden",
          "transition-[transform,visibility] duration-200 ease-out",
          show ? "visible translate-y-0" : "invisible translate-y-full"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <span aria-hidden className="datum-rule" />

        <div className="grid h-14 grid-cols-[1.45fr_1fr]">
          {/* Label over datum, so the number never wraps on a 320px phone. */}
          <a
            href={`tel:${BRAND.phoneTel}`}
            onClick={() => trackCall("sticky_rail")}
            aria-label={`Call Petty Shine on ${BRAND.phoneDisplay}`}
            className="flex min-w-0 flex-col items-center justify-center gap-0.5 bg-cyan-500 px-2 text-ink-900"
          >
            <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.2em]">
              Call
            </span>
            <span className="whitespace-nowrap font-mono text-[0.9375rem] font-medium tabular-nums">
              {BRAND.phoneDisplay}
            </span>
          </a>

          {formHash ? (
            /* A plain anchor, because this is a jump inside the current
               document and next/link would run it through the router. */
            <a href={formHash} className={quoteLabelCls}>
              Get a quote
            </a>
          ) : (
            <Link href={servedQuoteHref} className={quoteLabelCls}>
              Get a quote
            </Link>
          )}
        </div>
      </div>

      {/* The reservation. Static, always present, never resized. */}
      <div
        aria-hidden
        className="xl:hidden"
        style={{ height: "calc(88px + env(safe-area-inset-bottom))" }}
      />
    </>
  );
}
