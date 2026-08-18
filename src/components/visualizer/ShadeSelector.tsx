"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ATC_SPECS, CTX_SPECS, type FilmSpec } from "@/lib/constants";
import Photo from "@/components/ui/Photo";
import RuleLabel from "@/components/ui/RuleLabel";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The shade selector. Drag through the LLumar lineup and watch the glass
 * darken over a real scene while the manufacturer's measured numbers update
 * beside it. Every figure is Eastman's published data, so the toy is also
 * the spec sheet. Default film is CTX because that is both the better film
 * and the better ticket.
 */
export default function ShadeSelector({
  defaultFilm = "ctx",
  tone = "wall",
}: {
  defaultFilm?: "ctx" | "atc";
  tone?: "wall" | "paper";
}) {
  const reduced = useReducedMotion();
  const [film, setFilm] = useState<"ctx" | "atc">(defaultFilm);
  const [idx, setIdx] = useState(2);

  const specs: FilmSpec[] = film === "ctx" ? CTX_SPECS : ATC_SPECS;
  const shade = specs[Math.min(idx, specs.length - 1)];
  const dark = tone === "wall";

  // Glass overlay strength: lower VLT, darker glass. Eased slightly so the
  // mid shades still read as distinct steps on screen.
  const overlay = Math.min(0.94, Math.pow(1 - shade.vlt / 100, 1.15));

  const bars = [
    { label: "Heat rejected", value: shade.tser, max: 60, unit: "% of total solar energy" },
    { label: "Infrared rejected", value: shade.ir, max: 60, unit: "% IR energy" },
    { label: "Glare cut", value: shade.glare, max: 100, unit: "%" },
  ];

  return (
    <section className={cn("section relative overflow-hidden", dark ? "on-wall grain" : "bg-paper-2")} id="shades">
      <div className="container-wide relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* the glass */}
          <div className="lg:col-span-7">
            <div className={cn("relative overflow-hidden border", dark ? "border-white/12" : "border-line bg-white")}>
              <div className="relative aspect-[16/10]">
                <Photo
                  id="tint-gto"
                  alt="Red Pontiac GTO seen through window film at the selected shade"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
                {/* the film */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-[#05070a]"
                  initial={false}
                  animate={{ opacity: overlay }}
                  transition={reduced ? { duration: 0 } : { duration: 0.5, ease }}
                />
                {/* shade readout stamped on the glass */}
                <div className="absolute left-4 top-4">
                  <motion.p
                    key={`${film}-${shade.shade}`}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl"
                  >
                    {shade.shade}
                  </motion.p>
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/70">
                    {shade.vlt}% of visible light through
                  </p>
                </div>
              </div>

              {/* slider rail */}
              <div className={cn("px-4 py-4 md:px-6", dark ? "bg-ink-2" : "bg-white")}>
                <input
                  type="range"
                  min={0}
                  max={specs.length - 1}
                  step={1}
                  value={idx}
                  onChange={(e) => setIdx(Number(e.target.value))}
                  aria-label="Tint shade"
                  className="shade-range w-full"
                />
                <p
                  className={cn(
                    "mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em]",
                    dark ? "text-dim" : "text-muted"
                  )}
                >
                  On-screen preview. Shade cards in the shop.
                </p>
                <div className="mt-2.5 flex justify-between">
                  {specs.map((s, i) => (
                    <button
                      key={s.shade}
                      type="button"
                      onClick={() => setIdx(i)}
                      className={cn(
                        "font-mono text-[0.625rem] tracking-[0.08em] transition-colors",
                        i === idx
                          ? "text-red"
                          : dark
                            ? "text-dim hover:text-light-2"
                            : "text-muted hover:text-ink-text"
                      )}
                    >
                      {s.shade.split(" ")[1]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* the numbers */}
          <div className="lg:col-span-5">
            <RuleLabel tone={dark ? "light" : "red"}>Pick your shade</RuleLabel>
            <h2 className={cn("display-md mt-6", dark && "text-white")}>
              Slide it darker. Watch what the film is doing.
            </h2>
            <p className={cn("mt-4 leading-relaxed", dark ? "text-light-2" : "text-muted")}>
              These are Eastman&apos;s measured numbers for the exact film we
              install, not marketing ranges. Shade names are product names; the
              measured light transmission sits under the preview.
            </p>

            {/* film toggle */}
            <div className="mt-7 inline-flex border border-current/20">
              {(
                [
                  ["ctx", "CTX ceramic"],
                  ["atc", "ATC dyed"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilm(id)}
                  className={cn(
                    "px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] transition-colors",
                    film === id
                      ? "bg-red text-white"
                      : dark
                        ? "text-light-2 hover:text-white"
                        : "text-body hover:text-ink-text"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-7 space-y-5">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="flex items-baseline justify-between">
                    <span
                      className={cn(
                        "font-mono text-[0.625rem] uppercase tracking-[0.18em]",
                        dark ? "text-dim" : "text-muted"
                      )}
                    >
                      {b.label}
                    </span>
                    <span className={cn("price text-xl", dark && "text-white")}>
                      {b.value}
                      <span className="text-sm">%</span>
                    </span>
                  </div>
                  <div className={cn("mt-1.5 h-[3px] w-full", dark ? "bg-white/10" : "bg-paper-3")}>
                    <motion.div
                      className="h-full bg-red"
                      initial={false}
                      animate={{ width: `${Math.min(100, (b.value / b.max) * 100)}%` }}
                      transition={reduced ? { duration: 0 } : { duration: 0.5, ease }}
                    />
                  </div>
                </div>
              ))}
              <p className={cn("font-mono text-[0.625rem] uppercase tracking-[0.14em]", dark ? "text-dim" : "text-muted")}>
                UV blocked: more than 99% at every shade, both films
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote/" className="btn btn-primary">
                Quote {film === "ctx" ? "ceramic" : "dyed"} {shade.shade}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/llumar-window-film/"
                className={cn("btn", dark ? "btn-outline-light" : "btn-outline")}
              >
                Full spec tables
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
