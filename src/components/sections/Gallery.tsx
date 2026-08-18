"use client";

import { useState } from "react";
import Photo from "@/components/ui/Photo";
import RuleLabel from "@/components/ui/RuleLabel";
import { WORK, type Work } from "@/lib/work";
import { cn } from "@/lib/utils";

const FILTERS = [
  "All",
  "tint",
  "ppf",
  "coating",
  "correction",
  "detail",
  "flat glass",
] as const;

export function WorkCard({ item, priority }: { item: Work; priority?: boolean }) {
  // Every tile shares one frame so rows stay level and captions line up;
  // the portrait sources centre-crop via object-cover in Photo.
  return (
    <figure className="group">
      <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
        <Photo
          id={item.photo}
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <figcaption className="placard mt-3">
        <span className="placard-line">
          <span className="text-ink-text">{item.vehicle}</span>
        </span>
        <span className="mt-1 block pl-[22px]">
          {item.service} · {item.film}
        </span>
      </figcaption>
    </figure>
  );
}

export default function Gallery({
  items = WORK,
  filterable = true,
  title = "Every car on this page was done here",
  eyebrow = "The work",
  intro,
}: {
  items?: Work[];
  filterable?: boolean;
  title?: string;
  eyebrow?: string;
  intro?: string;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <section className="section">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <RuleLabel>{eyebrow}</RuleLabel>
            <h2 className="display-md mt-6">{title}</h2>
            {intro && <p className="mt-4 leading-relaxed text-muted">{intro}</p>}
          </div>

          {filterable && (
            <div className="no-bar flex gap-2 overflow-x-auto">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "shrink-0 border px-3.5 py-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] transition-colors",
                    filter === f
                      ? "border-red bg-red text-white"
                      : "border-line bg-white text-body hover:border-ink-text"
                  )}
                >
                  {f === "ppf" ? "PPF" : f}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item, i) => (
            <WorkCard key={item.photo} item={item} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
