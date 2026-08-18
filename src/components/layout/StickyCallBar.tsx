"use client";

import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { BRAND } from "@/lib/constants";

/**
 * Mobile action bar. Justin takes texts as readily as calls, so both get
 * equal weight, a text is a lower-friction first contact for the under-40
 * half of this market, and it still lands as a lead.
 */
export default function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-red bg-ink/95 backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-3">
        <a
          href={`tel:${BRAND.phoneTel}`}
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-white"
        >
          <Phone className="h-[18px] w-[18px] text-red" aria-hidden />
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em]">
            Call
          </span>
        </a>
        <a
          href={`sms:${BRAND.phoneTel}`}
          className="flex flex-col items-center justify-center gap-1 border-x border-white/10 py-2.5 text-white"
        >
          <MessageSquare className="h-[18px] w-[18px] text-red" aria-hidden />
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em]">
            Text
          </span>
        </a>
        <Link
          href="/quote/"
          className="flex flex-col items-center justify-center gap-1 bg-red py-2.5 text-white"
        >
          <span className="font-display text-[0.9375rem] font-bold uppercase leading-none">
            Get price
          </span>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white/80">
            2 minutes
          </span>
        </Link>
      </div>
    </div>
  );
}
