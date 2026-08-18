"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import RuleLabel from "@/components/ui/RuleLabel";

export interface QA {
  q: string;
  a: string;
}

/**
 * Plain semantic Q&A. Deliberately NOT wrapped in FAQPage schema,
 * Google deprecated FAQ rich results in May 2026, so the markup earns
 * nothing. The visible content is what gets pulled into AI Overviews,
 * so each answer is written to stand on its own.
 */
export default function FAQ({
  items,
  title = "Common questions",
  eyebrow = "FAQ",
  intro,
}: {
  items: readonly QA[];
  title?: string;
  eyebrow?: string;
  intro?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <RuleLabel>{eyebrow}</RuleLabel>
            <h2 className="display-md mt-6">{title}</h2>
            {intro && <p className="mt-4 leading-relaxed text-muted">{intro}</p>}
          </div>

          <div className="md:col-span-8">
            <div className="border-t-2 border-ink-text">
              {items.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.q} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "font-display text-lg font-bold leading-snug tracking-tight transition-colors",
                          isOpen ? "text-red" : "text-ink-text"
                        )}
                      >
                        {item.q}
                      </span>
                      <span className="mt-1 shrink-0 text-red">
                        {isOpen ? (
                          <Minus className="h-5 w-5" aria-hidden />
                        ) : (
                          <Plus className="h-5 w-5" aria-hidden />
                        )}
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300",
                        isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl leading-relaxed text-body">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
