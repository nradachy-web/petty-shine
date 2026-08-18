import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import Photo from "@/components/ui/Photo";
import RuleLabel from "@/components/ui/RuleLabel";
import { money } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { PhotoId } from "@/lib/photos";

export default function ServiceGrid({
  title = "Six services. One shop. Every price published.",
  eyebrow = "What we do",
  intro = "Tint, film, coatings, correction, and detailing all happen in-house at 10170 Industrial Drive, in a lit, temperature-controlled bay rather than a driveway. That's the whole reason the results are repeatable.",
}: {
  title?: string;
  eyebrow?: string;
  intro?: string;
}) {
  return (
    <section className="section">
      <div className="container-wide">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <RuleLabel>{eyebrow}</RuleLabel>
            <h2 className="display-lg mt-6">{title}</h2>
          </div>
          <p className="leading-relaxed text-muted md:col-span-5">{intro}</p>
        </div>

        <RevealGroup className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {SERVICES.map((s) => (
            <RevealItem key={s.id}>
            <Link href={s.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
                <Photo
                  id={s.photo as PhotoId}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {s.from > 0 && (
                  <span className="absolute left-0 top-0 bg-ink px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white">
                    from {money(s.from)}
                    <span className="ml-1.5 text-white/60">{s.fromNote}</span>
                  </span>
                )}
              </div>

              <div className="mt-5 border-t-2 border-ink-text pt-4">
                <h3 className="flex items-start justify-between gap-3 font-display text-xl font-bold uppercase tracking-tight text-ink-text transition-colors group-hover:text-red">
                  {s.title}
                  <ArrowUpRight
                    className="mt-0.5 h-5 w-5 shrink-0 text-red transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </h3>
                <p className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-red">
                  {s.line}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                  {s.blurb}
                </p>
              </div>
            </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
