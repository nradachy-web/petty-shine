"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * The one hook behind every entrance animation on this site.
 *
 * THE RULE IT EXISTS TO ENFORCE
 * A component must never server render its own hidden state. The
 * previous build used framer-motion's `initial={{opacity:0}}` with
 * `whileInView` and `viewport={{once:true}}`, which writes
 * `style="opacity:0"` straight into the static HTML. The content then
 * depends on one IntersectionObserver callback firing to ever be seen.
 * On the page whose only job was quoting coating tiers, that hid every
 * tier and every price, and nobody noticed for weeks.
 *
 * So the flow here is inverted:
 *   1. The component renders visible. That is what lands in the static
 *      export and what a reader with JavaScript off gets, permanently.
 *   2. This hook ADDS the pre-animation state in a layout effect, which
 *      runs before paint, so there is no flash of the finished state.
 *   3. The observer removes it on intersect.
 *
 * Every failure mode therefore ends with the content visible:
 *   JS never runs            -> visible, no animation.
 *   Hydration throws         -> visible, no animation.
 *   No IntersectionObserver  -> visible, no animation.
 *   Reduced motion requested -> visible, no animation, nothing touched.
 *   Observer never fires     -> the only bad case, and it cannot happen
 *                               before the pre-state is applied because
 *                               both happen in the same effect.
 *
 * Test it by loading any page with JavaScript disabled.
 *
 * @param attr  the data attribute the CSS keys off, either
 *              "data-ps-reveal" or "data-ps-rule"
 * @param delay seconds, published to CSS as --ps-delay
 */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useEnterOnce<T extends HTMLElement>(attr: string, delay = 0) {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: do nothing at all. Not a faster animation, not a
    // zero duration transition. The element is already in its finished
    // state, so the correct behaviour is to leave it alone.
    const reduce =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (!reduce || reduce.matches) return;

    // Never hide something we have no way of un-hiding.
    if (typeof IntersectionObserver === "undefined") return;

    if (delay > 0) el.style.setProperty("--ps-delay", `${delay}s`);
    el.setAttribute(attr, "pending");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute(attr, "in");
            io.disconnect();
            return;
          }
        }
      },
      // threshold 0 rather than a ratio: the datum rule is a 1px tall
      // target and a ratio based threshold is unreliable on those.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      // If this element is being torn down mid-animation, leave it in
      // the visible state rather than the hidden one.
      el.setAttribute(attr, "in");
      el.style.removeProperty("--ps-delay");
    };
  }, [attr, delay]);

  return ref;
}

export default useEnterOnce;
