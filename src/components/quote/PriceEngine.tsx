"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight, Info, Loader2 } from "lucide-react";
import {
  BODY_TYPES,
  TINT_ADDONS,
  TINT_NOTES,
  BRAND,
  type BodyTypeId,
} from "@/lib/constants";
import { cn, money } from "@/lib/utils";
import VehicleSelect, { EMPTY_VEHICLE, type VehiclePick } from "./VehicleSelect";

/**
 * The instant tint price engine.
 *
 * Every competitor in this market answers "how much is tint?" with a contact
 * form. This answers it in about eight seconds: pick the vehicle, we map it
 * onto the body type the shop prices by (EPA vehicle class + model-name
 * heuristics), and show the shop's real published numbers. The guess is
 * always visible and always overridable.
 */
export default function PriceEngine({
  compact = false,
  heading = "What will my vehicle cost?",
}: {
  compact?: boolean;
  heading?: string;
}) {
  const [vehicle, setVehicle] = useState<VehiclePick>(EMPTY_VEHICLE);
  const [override, setOverride] = useState<BodyTypeId | null>(null);
  const [showAll, setShowAll] = useState(false);

  const detected = vehicle.classification?.bodyType ?? null;
  const activeId = override ?? detected;
  const body = BODY_TYPES.find((b) => b.id === activeId) ?? null;
  const ready = Boolean(vehicle.year && vehicle.make && vehicle.model);

  const vehicleLabel = [vehicle.year, vehicle.make, vehicle.model]
    .filter(Boolean)
    .join(" ");

  const quoteHref = body
    ? `/quote/?v=${encodeURIComponent(vehicleLabel)}&b=${body.id}`
    : "/quote/";

  return (
    <div
      className={cn(
        "plate border-t-[3px] border-t-red",
        compact ? "p-5 md:p-6" : "p-6 md:p-9"
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="rule-label">
            <span>Instant price</span>
          </span>
          <h3 className={cn("mt-4", compact ? "display-sm" : "display-md")}>{heading}</h3>
        </div>
        {!compact && (
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Real numbers from our published rate sheet, not a callback promise.
          </p>
        )}
      </div>

      <div className="mt-6">
        <VehicleSelect value={vehicle} onChange={setVehicle} stacked={compact} />
      </div>

      <AnimatePresence mode="wait">
        {ready && (
          <motion.div
            key={activeId ?? "loading"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7"
          >
            {vehicle.classifying && !body ? (
              <div className="flex items-center gap-3 border-t-2 border-line pt-6 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-red" aria-hidden />
                Looking up your {vehicle.make} {vehicle.model}…
              </div>
            ) : body ? (
              <>
                {/* what we think it is */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t-2 border-ink-text pt-5">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                    Priced as
                  </span>
                  <span className="font-display text-lg font-bold uppercase tracking-tight text-ink-text">
                    {body.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAll((s) => !s)}
                    className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-red underline underline-offset-4"
                  >
                    {showAll ? "Close" : "Not right?"}
                  </button>
                  {vehicle.classification && !override && (
                    <span className="w-full font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted sm:w-auto">
                      {vehicle.classification.reason}
                    </span>
                  )}
                </div>

                {showAll && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {BODY_TYPES.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setOverride(b.id);
                          setShowAll(false);
                        }}
                        className={cn(
                          "border px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors",
                          b.id === activeId
                            ? "border-red bg-red text-white"
                            : "border-line bg-white text-body hover:border-ink-text"
                        )}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* the numbers */}
                <div className="mt-6 grid gap-px bg-line sm:grid-cols-2">
                  <PriceCell
                    label="Full vehicle · dyed"
                    sub="LLumar ATC · all sides + back glass"
                    price={body.tintDyed}
                  />
                  <PriceCell
                    label="Full vehicle · ceramic"
                    sub="LLumar CTX · maximum heat rejection"
                    price={body.tintCeramic}
                    accent
                  />
                  <PriceCell
                    label="Front two windows"
                    sub={`Dyed ${money(TINT_ADDONS.frontTwoDyed)} · ceramic ${money(
                      TINT_ADDONS.frontTwoCeramic
                    )}`}
                    price={TINT_ADDONS.frontTwoDyed}
                  />
                  <PriceCell
                    label="Full windshield"
                    sub={`Dyed ${money(TINT_ADDONS.windshieldDyed)} · ceramic ${money(
                      TINT_ADDONS.windshieldCeramic
                    )}`}
                    price={TINT_ADDONS.windshieldDyed}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                  <span className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-red" aria-hidden />
                    Shop time {body.tintTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-red" aria-hidden />
                    Lifetime LLumar film warranty
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-red" aria-hidden />
                    Interior detail from {money(body.detailInterior)}
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href={quoteHref} className="btn btn-primary sm:flex-1">
                    Book this {body.short.toLowerCase()}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <a
                    href={`tel:${BRAND.phoneTel}`}
                    className="btn btn-outline sm:flex-none"
                  >
                    Or call {BRAND.phoneDisplay}
                  </a>
                </div>

                {/* proof at the moment of decision */}
                <figure className="mt-5 border-l-2 border-red bg-paper-2 px-4 py-3">
                  <blockquote className="text-[0.875rem] italic leading-relaxed text-body">
                    &ldquo;No bubbles, no fading, great lines, and great
                    communication.&rdquo;
                  </blockquote>
                  <figcaption className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                    Brevity Jones · 5-star Google review
                  </figcaption>
                </figure>

                <p className="mt-5 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-muted">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                  {TINT_NOTES[0]} {TINT_NOTES[3]}
                </p>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {!ready && !compact && (
        <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-muted">
          Pricing covers cars, trucks, SUVs, and minivans. Classic vehicles and
          existing-tint removal are quoted individually, {" "}
          <a href={`tel:${BRAND.phoneTel}`} className="link-underline">
            call or text {BRAND.phoneDisplay}
          </a>
          .
        </p>
      )}
    </div>
  );
}

function PriceCell({
  label,
  sub,
  price,
  accent,
}: {
  label: string;
  sub: string;
  price: number;
  accent?: boolean;
}) {
  return (
    <div className={cn("bg-white p-5", accent && "bg-paper-2")}>
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="price-from">from</span>
        <span className={cn("price text-[2rem]", accent && "text-red")}>
          {money(price)}
        </span>
      </p>
      <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{sub}</p>
    </div>
  );
}
