"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Desktop companion to the mobile call bar: a small plate that slides in
 * once the visitor has scrolled past the hero and its price tool. It names
 * the starting price so the click is a continuation, not a leap.
 */
export default function StickyCTA() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 950);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pointless on the pages that already are the destination.
  if (pathname.startsWith("/quote") || pathname.startsWith("/contact") || pathname.startsWith("/thank-you")) {
    return null;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 hidden lg:block"
        >
          <Link
            href="/quote/"
            className="group flex items-center gap-4 border-t-2 border-red bg-ink py-3.5 pl-5 pr-4 text-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.55)] transition-colors hover:bg-graphite"
          >
            <span>
              <span className="block font-display text-sm font-bold uppercase tracking-wide">
                Price my vehicle
              </span>
              <span className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-dim">
                Tint from $125 · about 90 seconds
              </span>
            </span>
            <span className="grid h-9 w-9 place-items-center bg-red transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
