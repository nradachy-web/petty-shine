"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Phone, Star, ChevronDown } from "lucide-react";
import Photo from "@/components/ui/Photo";
import PriceEngine from "@/components/quote/PriceEngine";
import { BRAND, RATING } from "@/lib/constants";

/**
 * The hero copy enters on a CSS animation rather than a JS one. A CSS
 * keyframe always completes on its own, so the headline can never be left
 * stranded at opacity 0 the way a JS-driven entrance can if scripting fails.
 * framer-motion is kept only for the photo parallax, which is decorative.
 */
const rise = (delay: number) => ({
  className: "fade-up",
  style: { animationDelay: `${delay}s` } as React.CSSProperties,
});

/**
 * Home hero. The photo drifts against the scroll (parallax) while the copy
 * enters as a timed sequence: place, promise, price tool. The one question
 * every visitor arrives with gets answered inside the first screen.
 */
export default function HomeHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.25]);

  return (
    <section ref={ref} className="on-wall relative isolate overflow-hidden">
      <motion.div className="absolute inset-0 -z-10" style={{ y: photoY }}>
        <motion.div
          className="h-full w-full"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            reduce
              ? { duration: 0.6 }
              : { opacity: { duration: 1.1 }, scale: { duration: 14, ease: "linear" } }
          }
        >
          <Photo
            id="ppf-corvette-c8-install"
            priority
            sizes="100vw"
            className="opacity-50"
          />
        </motion.div>
        <div className="absolute inset-0 scrim-l" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="container-wide relative py-11 md:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-6">
            <div {...rise(0.1)}>
              <span className="rule-label text-[0.625rem] tracking-[0.22em] sm:text-[0.6875rem] sm:tracking-[0.34em]" style={{ "--rule-color": "#ffffff" } as React.CSSProperties}>
                <span>
                  {BRAND.city}, {BRAND.state} · Est. {BRAND.founded}
                </span>
              </span>
            </div>

            <h1 className="display-xl mt-5 text-[clamp(2.15rem,5.6vw,4.25rem)] text-white">
              <span className="block fade-up" style={{ animationDelay: "0.22s" }}>
                Tint, film, and coatings.
              </span>
              <span className="block fade-up text-red" style={{ animationDelay: "0.34s" }}>
                Priced on the page.
              </span>
            </h1>

            <p
              className="fade-up mt-5 max-w-xl leading-relaxed text-light-2 md:text-lg"
              style={{ animationDelay: "0.46s" }}
            >
              LLumar window film, GeoShield paint protection film, and System X
              ceramic coatings, installed in-house at our Whitmore Lake shop for
              drivers in Ann Arbor, Brighton, South Lyon, Pinckney, and Hamburg.
              Every number is on this site before you call.
            </p>

            <div className="fade-up mt-6 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.56s" }}>
              <a href="#price" className="btn btn-primary btn-lg">
                Price my vehicle
              </a>
              <a href={`tel:${BRAND.phoneTel}`} className="btn btn-outline-light btn-lg">
                <Phone className="h-4 w-4" aria-hidden />
                {BRAND.phoneDisplay}
              </a>
            </div>

            <div
              className="fade-up mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-white/70"
              style={{ animationDelay: "0.68s" }}
            >
              <span className="flex items-center gap-2">
                <span className="flex" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-star text-star" />
                  ))}
                </span>
                {RATING.value.toFixed(1)} from {RATING.count} Google reviews
              </span>
              <span>Shop only, never mobile</span>
              <span>Owner-installed</span>
            </div>
          </div>

          <div
            id="price"
            style={{ animationDelay: "0.4s" }}
            className="fade-up scroll-mt-24 lg:col-span-6 xl:col-start-8 xl:col-span-5"
          >
            <PriceEngine compact heading="What does tint cost for my car?" />
          </div>
        </div>

        {!reduce && (
          <motion.a
            href="#after-hero"
            aria-label="Scroll to content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 lg:block"
          >
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="block text-white/50"
            >
              <ChevronDown className="h-5 w-5" aria-hidden />
            </motion.span>
          </motion.a>
        )}
      </motion.div>
    </section>
  );
}
