"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Phone, MessageSquare } from "lucide-react";
import {
  BRAND,
  QUOTE,
  SERVICE_OPTIONS,
  WEB3FORMS_KEY,
  BODY_TYPES,
  type BodyTypeId,
} from "@/lib/constants";
import { cn, money } from "@/lib/utils";
import { asset } from "@/lib/asset";
import VehicleSelect, { EMPTY_VEHICLE, type VehiclePick } from "./VehicleSelect";

const STEPS = ["Vehicle", "Services", "Contact", "Review"] as const;

// Modern Apex attribution rails (public/apex-attribution.js, loaded in the
// root layout). attach() is additive and fire-and-forget: Web3Forms stays the
// delivery lane and this call never blocks or throws.
declare global {
  interface Window {
    apexAttribution?: {
      attach: (fields: {
        name?: string;
        email?: string;
        phone?: string;
        message?: string;
        isTest?: boolean;
      }) => void;
    };
  }
}

function attachToApexLedger(fields: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  try {
    const isTest =
      new URLSearchParams(window.location.search).get("apx_test") === "1";
    window.apexAttribution?.attach(isTest ? { ...fields, isTest: true } : fields);
  } catch {
    /* swallowed by contract */
  }
}

function captureUtm(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(
    (k) => {
      const v = p.get(k);
      if (v) out[k] = v;
    }
  );
  if (document.referrer) out.referrer = document.referrer;
  return Object.keys(out).length ? out : null;
}

const variants = {
  enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
};

export default function QuoteForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [vehicle, setVehicle] = useState<VehiclePick>(EMPTY_VEHICLE);
  const [bodyOverride, setBodyOverride] = useState<BodyTypeId | null>(null);
  const [prefill, setPrefill] = useState<string>("");
  const [color, setColor] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    zip: "",
    notes: "",
  });
  const [prefer, setPrefer] = useState<"Call" | "Text" | "Email">("Text");
  const [smsConsent, setSmsConsent] = useState({ marketing: false, nonMarketing: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill from the price engine: /quote/?v=2024+Ford+F150&b=pickup-4door
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const v = p.get("v");
    const b = p.get("b") as BodyTypeId | null;
    if (v) setPrefill(v);
    if (b && BODY_TYPES.some((t) => t.id === b)) setBodyOverride(b);
    const s = p.get("s");
    if (s && SERVICE_OPTIONS.some((o) => o.id === s)) setServices([s]);
  }, []);

  const bodyId = bodyOverride ?? vehicle.classification?.bodyType ?? null;
  const body = BODY_TYPES.find((b) => b.id === bodyId) ?? null;

  const vehicleStr =
    [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || prefill;

  const toggleService = (id: string) =>
    setServices((p) => (p.includes(id) ? p.filter((s) => s !== id) : [...p, id]));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !vehicleStr) e.vehicle = "Pick your year, make, and model.";
    if (step === 1 && services.length === 0) e.services = "Choose at least one service.";
    if (step === 2) {
      if (!contact.name.trim()) e.name = "We need a name to put on the quote.";
      if (!contact.phone.trim()) e.phone = "A phone number gets you the fastest answer.";
      if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
        e.email = "That email looks off.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) {
      setDir(1);
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const serviceLabels = services.map(
    (id) => SERVICE_OPTIONS.find((o) => o.id === id)?.label ?? id
  );

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const utm = captureUtm();
    const message = [
      `New quote request from ${contact.name}`,
      ``,
      `Vehicle: ${vehicleStr}${color ? ` (${color})` : ""}`,
      body ? `Body type: ${body.label}` : "",
      `Services: ${serviceLabels.join(", ")}`,
      body && services.includes("window-tint")
        ? `Published tint price for this body type: ${money(
            body.tintDyed
          )} dyed / ${money(body.tintCeramic)} ceramic`
        : "",
      ``,
      `Name: ${contact.name}`,
      `Phone: ${contact.phone}`,
      contact.email ? `Email: ${contact.email}` : "",
      contact.zip ? `ZIP: ${contact.zip}` : "",
      `Prefers: ${prefer}`,
      contact.notes ? `Notes: ${contact.notes}` : "",
      ``,
      `SMS marketing consent: ${smsConsent.marketing ? "Yes" : "No"}`,
      `SMS service-update consent: ${smsConsent.nonMarketing ? "Yes" : "No"}`,
      utm ? `\nSource: ${JSON.stringify(utm)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const hasKey = WEB3FORMS_KEY && !WEB3FORMS_KEY.startsWith("REPLACE");

    try {
      if (hasKey) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New quote: ${contact.name}, ${vehicleStr}`,
            from_name: "HD Auto Studio Website",
            name: contact.name,
            phone: contact.phone,
            email: contact.email || BRAND.email,
            vehicle: vehicleStr,
            services: serviceLabels.join(", "),
            preferred_contact: prefer,
            sms_marketing_consent: smsConsent.marketing ? "Yes" : "No",
            sms_nonmarketing_consent: smsConsent.nonMarketing ? "Yes" : "No",
            message,
          }),
        });
        if (!res.ok) throw new Error("send failed");
      } else if (typeof window !== "undefined") {
        console.warn("[QuoteForm] WEB3FORMS_KEY not set. Lead not delivered:", message);
      }
      attachToApexLedger({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message,
      });
      router.push("/thank-you/");
    } catch {
      setSubmitError(QUOTE.error);
      setSubmitting(false);
    }
  };

  return (
    <div className="plate p-5 md:p-8">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => i < step && (setDir(-1), setStep(i))}
              className={cn(
                "font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors",
                i <= step ? "text-red" : "text-muted",
                i < step && "cursor-pointer hover:text-ink-text"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="h-[3px] w-full bg-paper-3">
          <motion.div
            className="h-full bg-red"
            initial={false}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="relative min-h-[340px] overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="display-sm">{QUOTE.steps.vehicle.header}</h3>
                  <p className="mt-1.5 text-sm text-muted">{QUOTE.steps.vehicle.helper}</p>
                </div>

                {prefill && !vehicle.year && (
                  <p className="border-l-2 border-red bg-paper-2 px-4 py-3 text-sm text-body">
                    Carried over from the price builder:{" "}
                    <strong className="text-ink-text">{prefill}</strong>
                    {body ? ` · ${body.label}` : ""}. Re-pick below if that isn&apos;t right.
                  </p>
                )}

                <VehicleSelect value={vehicle} onChange={setVehicle} />
                {errors.vehicle && (
                  <p className="text-sm text-error">{errors.vehicle}</p>
                )}

                {body && (
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                    Priced as {body.label} · tint from {money(body.tintDyed)}
                  </p>
                )}

                <div>
                  <label className="field-label" htmlFor="q-color">
                    Color (optional)
                  </label>
                  <input
                    id="q-color"
                    className="field"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Black, Pearl White"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="display-sm">{QUOTE.steps.services.header}</h3>
                  <p className="mt-1.5 text-sm text-muted">
                    {QUOTE.steps.services.helper}
                  </p>
                </div>
                {errors.services && <p className="text-sm text-error">{errors.services}</p>}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {SERVICE_OPTIONS.map((o) => {
                    const sel = services.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => toggleService(o.id)}
                        className={cn(
                          "flex items-center gap-3 border p-3.5 text-left transition-colors",
                          sel
                            ? "border-red bg-red-wash"
                            : "border-line bg-white hover:border-ink-text"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-5 w-5 shrink-0 place-items-center border",
                            sel ? "border-red bg-red" : "border-line"
                          )}
                        >
                          {sel && (
                            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                          )}
                        </span>
                        <span
                          className={cn(
                            "text-[0.9375rem] font-medium",
                            sel ? "text-ink-text" : "text-body"
                          )}
                        >
                          {o.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="display-sm">{QUOTE.steps.contact.header}</h3>
                  <p className="mt-1.5 text-sm text-muted">{QUOTE.steps.contact.helper}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="q-name">
                      Name *
                    </label>
                    <input
                      id="q-name"
                      className={cn("field", errors.name && "border-error")}
                      value={contact.name}
                      onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-error">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="field-label" htmlFor="q-phone">
                      Phone *
                    </label>
                    <input
                      id="q-phone"
                      type="tel"
                      className={cn("field", errors.phone && "border-error")}
                      value={contact.phone}
                      onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                      placeholder="(734) 555-0123"
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-error">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="field-label" htmlFor="q-email">
                      Email (optional)
                    </label>
                    <input
                      id="q-email"
                      type="email"
                      className={cn("field", errors.email && "border-error")}
                      value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-error">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="field-label" htmlFor="q-zip">
                      ZIP (optional)
                    </label>
                    <input
                      id="q-zip"
                      className="field"
                      value={contact.zip}
                      onChange={(e) => setContact((c) => ({ ...c, zip: e.target.value }))}
                      placeholder="48189"
                      autoComplete="postal-code"
                    />
                  </div>
                </div>

                <div>
                  <span className="field-label">Best way to reach you</span>
                  <div className="flex gap-2">
                    {(["Text", "Call", "Email"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrefer(p)}
                        className={cn(
                          "border px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors",
                          prefer === p
                            ? "border-red bg-red text-white"
                            : "border-line bg-white text-body hover:border-ink-text"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="q-notes">
                    Anything we should know? (optional)
                  </label>
                  <textarea
                    id="q-notes"
                    className="field resize-none"
                    rows={3}
                    value={contact.notes}
                    onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                    placeholder="Timeline, existing tint to remove, pet hair, specific questions…"
                  />
                </div>

                <div className="space-y-3 border border-line bg-paper-2 p-4">
                  <ConsentCheckbox
                    checked={smsConsent.nonMarketing}
                    onChange={() =>
                      setSmsConsent((c) => ({ ...c, nonMarketing: !c.nonMarketing }))
                    }
                    label={QUOTE.smsConsent.nonMarketing}
                  />
                  <ConsentCheckbox
                    checked={smsConsent.marketing}
                    onChange={() =>
                      setSmsConsent((c) => ({ ...c, marketing: !c.marketing }))
                    }
                    label={QUOTE.smsConsent.marketing}
                  />
                  <p className="text-xs leading-relaxed text-muted">
                    Consent is not a condition of purchase. See our{" "}
                    <a href={asset("/privacy-policy/")} className="link-underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href={asset("/terms/")} className="link-underline">
                      Terms
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="display-sm">{QUOTE.steps.review.header}</h3>
                  <p className="mt-1.5 text-sm text-muted">{QUOTE.steps.review.helper}</p>
                </div>
                <div className="divide-y divide-line border border-line bg-white">
                  <ReviewRow label="Vehicle" value={`${vehicleStr}${color ? ` · ${color}` : ""}`} />
                  {body && <ReviewRow label="Body type" value={body.label} />}
                  <ReviewRow label="Services" value={serviceLabels.join(", ")} />
                  <ReviewRow label="Name" value={contact.name} />
                  <ReviewRow label="Phone" value={contact.phone} />
                  {contact.email && <ReviewRow label="Email" value={contact.email} />}
                  <ReviewRow label="Reach me by" value={prefer} />
                  {contact.notes && <ReviewRow label="Notes" value={contact.notes} />}
                </div>
                <div className="flex items-start gap-3 border-l-2 border-red bg-paper-2 px-4 py-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-red" aria-hidden />
                  <p className="text-sm leading-relaxed text-body">
                    Justin replies from{" "}
                    <span className="font-semibold text-ink-text">
                      {BRAND.phoneDisplay}
                    </span>
                    . Watch for that number, during shop hours it&apos;s usually the same
                    day.
                  </p>
                </div>
                <p className="text-xs text-muted">{QUOTE.trustMicro}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && (
        <p className="mt-4 border border-error bg-red-wash px-4 py-3 text-sm text-error">
          {submitError}{" "}
          <a href={`tel:${BRAND.phoneTel}`} className="underline">
            Call {BRAND.phoneDisplay}
          </a>
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={back} className="btn btn-outline btn-sm">
            Back
          </button>
        ) : (
          <a
            href={`tel:${BRAND.phoneTel}`}
            className="inline-flex min-w-0 items-center gap-2 text-sm text-muted transition-colors hover:text-red"
          >
            <Phone className="h-4 w-4" /> Rather call?{" "}
            <span className="whitespace-nowrap">{BRAND.phoneDisplay}</span>
          </a>
        )}

        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="btn btn-primary">
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className={cn("btn btn-primary", submitting && "opacity-60")}
          >
            {submitting ? "Sending…" : QUOTE.submit}
          </button>
        )}
      </div>
    </div>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition-colors",
          checked ? "border-red bg-red" : "border-line bg-white"
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </span>
      <span className="text-xs leading-relaxed text-muted">{label}</span>
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <span className="text-right text-sm text-ink-text">{value}</span>
    </div>
  );
}
