"use client";

/**
 * THE QUOTE FORM
 * ============================================================================
 * This is the only thing on the site that turns ad spend into a lead, so it
 * is kept as close to dependency free as the design allows: no icon library,
 * no animation library, no motion, and its own markup rather than shared
 * layout components. The one primitive it borrows is Button, so the primary
 * action matches every other primary action on the site. Drop it inline on
 * any page and it renders and submits on its own.
 *
 * USAGE
 *   <QuoteForm />                                  // /quote/ and /contact/
 *   <QuoteForm service="ppf" lockService />        // on /paint-protection-film/
 *   <QuoteForm service="ceramic" />                // preselected, still changeable
 *   <QuoteForm subject="boat" />                   // on /marine-detailing/
 *
 * URL PARAMS, so a visitor who clicked "Quoted on your vehicle" arrives
 * already qualified:
 *   /quote/?service=ppf&package=full-front
 *   /quote/?service=ceramic&package=petty-shine-nine
 *   service  matches ServiceLine.quoteKey in constants.ts
 *   package  matches PpfPackage.id or COATINGS[].id in constants.ts
 * A `service` prop wins over the URL, because the page it sits on knows what
 * it is about. The URL fills anything the props leave open.
 *
 * Two services ladder, so two services take a package: film coverage and
 * coating tier. Both render the chosen rung as a real select the visitor can
 * see and change, and both carry it into the lead, because a nine year
 * coating lead and a three year coating lead are worth different money and
 * used to arrive identical.
 *
 * DELIVERY
 * Web3Forms, and it degrades. Once WEB3FORMS_KEY is a real key the form
 * carries a real action and method, so with JavaScript off, or in the window
 * before hydration, the submit button does what a submit button does: a
 * plain POST to Web3Forms, which redirects to /thank-you/.
 *
 * While WEB3FORMS_KEY is still the placeholder there is nothing honest to
 * post to, so the form does NOT pretend the lead arrived: it says plainly
 * that nothing was sent, shows the visitor what they typed, and hands them
 * the phone number. In that state the no script path hides the submit button
 * outright rather than leaving a control that does nothing, and puts the
 * number in its place. No conversion fires either way, because a conversion
 * for a lead nobody received is the exact noise this rebuild exists to clear
 * out of the ad account.
 */

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  BODY_TYPES,
  BRAND,
  COATINGS,
  PPF_PACKAGES,
  SERVICES,
  WEB3FORMS_KEY,
} from "@/lib/constants";
import { trackQuoteSubmit } from "@/lib/gtag";
import VehicleSelect, { type VehicleValue } from "./VehicleSelect";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const OTHER_SERVICE = "other";

const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => ({ value: s.quoteKey, label: s.name })),
  { value: OTHER_SERVICE, label: "Something else" },
];

/**
 * THE LADDERS.
 *
 * Two services are sold in rungs, and the rung is most of the value of the
 * lead: full vehicle film is not partial front, and a nine year coating is
 * not a three year coating. Both used to collapse to the same lead, because
 * only film had a package field and only film carried its package in the
 * URL. Both are here now, both read the `package` param, and both put the
 * choice in the email under their own name.
 *
 * Everything comes out of constants.ts, so a new coating tier appears in
 * this select the moment it exists there.
 */
interface PackageGroup {
  /** the field label */
  label: string;
  /** the empty option, always first and always allowed */
  none: string;
  hint: string;
  /** how the choice is named in the lead email */
  lead: string;
  /** the field name, so a plain POST carries it too */
  field: string;
  options: Array<{ value: string; label: string }>;
}

const PACKAGE_GROUPS: Record<string, PackageGroup> = {
  ppf: {
    label: "Coverage",
    none: "Not sure yet",
    hint: "Not sure is a fine answer. We will walk you through it.",
    lead: "PPF coverage",
    field: "ppf_coverage",
    options: PPF_PACKAGES.map((p) => ({ value: p.id, label: p.name })),
  },
  ceramic: {
    label: "Coating",
    none: "Not sure yet",
    hint: "Not sure is a fine answer. We will walk you through it.",
    lead: "Coating tier",
    field: "coating_tier",
    options: COATINGS.map((c) => ({
      value: c.id,
      label: "subtitle" in c ? `${c.name}, ${c.subtitle}` : c.name,
    })),
  },
};

function serviceLabel(value: string): string {
  return SERVICE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function packageLabel(service: string, value: string): string {
  return (
    PACKAGE_GROUPS[service]?.options.find((o) => o.value === value)?.label ?? ""
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

function phoneLooksReal(value: string): boolean {
  const d = digitsOf(value);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
}

/** Field order drives both the error summary and where focus lands. */
const FIELD_ORDER = [
  "year",
  "make",
  "model",
  "service",
  "name",
  "phone",
  "email",
] as const;

type FieldName = (typeof FIELD_ORDER)[number];
type Errors = Partial<Record<FieldName, string>>;

interface FormValues {
  year: string;
  make: string;
  model: string;
  /** body type id, set by the picker's classifier or by the visitor */
  bodyType: string;
  service: string;
  pkg: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  company: string; // honeypot
}

const EMPTY: FormValues = {
  year: "",
  make: "",
  model: "",
  bodyType: "",
  service: "",
  pkg: "",
  name: "",
  phone: "",
  email: "",
  message: "",
  company: "",
};

type Status = "idle" | "sending" | "network-error" | "not-connected";

/* ------------------------------------------------------------------ */
/* WHAT THE FORM IS ASKING ABOUT                                        */
/*                                                                      */
/* The three vehicle fields are the same fields whatever comes in on    */
/* the trailer, but the examples in them are not. A boat owner reading  */
/* "2021 / Ford / F-150" on the marine page is being asked for the      */
/* wrong object, and the page copy used to apologise for it in prose    */
/* instead. Pass subject="boat" and the legend, the examples and the    */
/* error messages all move together.                                    */
/* ------------------------------------------------------------------ */

export type QuoteSubject = "vehicle" | "boat";

const SUBJECTS = {
  vehicle: {
    noun: "vehicle",
    legend: "The vehicle",
    label: "Vehicle",
    year: "2021",
    make: "Ford",
    model: "F-150",
  },
  boat: {
    noun: "boat",
    legend: "The boat",
    label: "Boat",
    year: "2018",
    make: "Sea Ray",
    model: "Sundancer",
  },
} as const;

const KEY_IS_SET = Boolean(WEB3FORMS_KEY) && !WEB3FORMS_KEY.startsWith("REPLACE");

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Where a plain POST lands. Web3Forms follows this on a successful send. */
const NO_JS_REDIRECT = `${BRAND.siteUrl}/thank-you/`;

/* ------------------------------------------------------------------ */
/* FIELD STYLING                                                        */
/*                                                                      */
/* .field, .field-label and .field-hint come from globals.css and read  */
/* the plane variables, so the same form renders correctly on paper and */
/* on the dark plane with no prop.                                      */
/*                                                                      */
/* The invalid state is an inset ring rather than a thicker border, on  */
/* purpose. .field sets border-width unlayered, and in Tailwind v4 an   */
/* unlayered declaration beats any utility no matter the specificity,   */
/* so a border-2 utility would silently do nothing here. The ring is a  */
/* box-shadow, which .field only sets on :focus, so the error ring      */
/* shows at rest and the focus ring takes over while typing.            */
/* ------------------------------------------------------------------ */

const LABEL_CLS = "field-label";

function controlCls(invalid: boolean): string {
  return cx("field", invalid && "ring-2 ring-inset ring-ink-900");
}

/* ------------------------------------------------------------------ */

export interface QuoteFormProps {
  /** ServiceLine.quoteKey, for example "ppf". Wins over the URL param. */
  service?: string;
  /** PpfPackage.id, for example "full-front". Only used when service is ppf. */
  package?: string;
  /** Render the service as a fixed line instead of a select. */
  lockService?: boolean;
  /**
   * What the three vehicle fields are asking about. Drives the legend, the
   * example values and the error messages. Defaults to a road vehicle.
   */
  subject?: QuoteSubject;
  /** Heading above the fields. Pass null to drop it when the page has one. */
  heading?: string | null;
  /** One line under the heading. */
  intro?: string | null;
  /** Where the form sits, carried into the lead email. */
  source?: string;
  id?: string;
  className?: string;
}

export default function QuoteForm({
  service,
  package: packageProp,
  lockService = false,
  subject = "vehicle",
  heading = "Get a price for your vehicle",
  intro = "It goes straight to the shop. The more you put here, the closer the first number is.",
  source,
  id,
  className,
}: QuoteFormProps) {
  const router = useRouter();
  const subj = SUBJECTS[subject];
  const uid = useId().replace(/:/g, "");
  const fid = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState<FormValues>({
    ...EMPTY,
    service: service ?? "",
    pkg: service && PACKAGE_GROUPS[service] ? packageProp ?? "" : "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serviceUnlocked, setServiceUnlocked] = useState(false);

  /**
   * False in the served HTML and until this component has mounted, which is
   * exactly the window where onSubmit does not exist yet. It decides two
   * things, and nothing cosmetic:
   *   - who validates. The browser does it from the required attributes
   *     until React can do it better.
   *   - whether the submit button is live while there is no key to post to.
   *     A form with no key and no action would submit to its own URL, wipe
   *     what the visitor typed and put their name and phone number in the
   *     address bar. The button waits instead.
   */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const controls = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});
  const summaryRef = useRef<HTMLDivElement | null>(null);

  /**
   * Read the URL on mount rather than with useSearchParams, because this is a
   * static export: the query string only ever exists in the browser, and
   * useSearchParams would force a Suspense boundary on every page that
   * embeds the form.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlService = params.get("service")?.trim().toLowerCase() ?? "";
    const urlPackage = params.get("package")?.trim().toLowerCase() ?? "";

    setValues((v) => {
      const next = { ...v };
      if (!service && SERVICE_OPTIONS.some((o) => o.value === urlService)) {
        next.service = urlService;
      }
      const activeService = service ?? next.service;
      const group = PACKAGE_GROUPS[activeService];
      if (
        !packageProp &&
        group &&
        group.options.some((o) => o.value === urlPackage)
      ) {
        next.pkg = urlPackage;
      }
      return next;
    });
    // props are the page's own intent and never change after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (name: keyof FormValues, value: string) => {
    setValues((v) => {
      const next = { ...v, [name]: value };
      // A rung belongs to one ladder. Changing the service always drops it.
      if (name === "service") next.pkg = "";
      return next;
    });
    if (name in errors) {
      setErrors((e) => {
        const next = { ...e };
        delete next[name as FieldName];
        return next;
      });
    }
  };

  const group = PACKAGE_GROUPS[values.service];
  const showPackage = Boolean(group);
  const showServiceSelect = !lockService || serviceUnlocked;

  function validate(v: FormValues): Errors {
    const e: Errors = {};

    if (v.year.trim()) {
      const year = Number(digitsOf(v.year));
      const max = new Date().getFullYear() + 2;
      if (!/^\d{4}$/.test(v.year.trim()) || year < 1900 || year > max) {
        e.year = `Use a four digit year, for example ${subj.year}.`;
      }
    }
    if (!v.make.trim()) e.make = `Add the make, for example ${subj.make}.`;
    if (!v.model.trim()) e.model = `Add the model, for example ${subj.model}.`;
    if (!v.service) e.service = "Pick what you want done.";
    if (v.name.trim().length < 2) e.name = "Tell us who to ask for.";
    if (!v.phone.trim()) {
      e.phone = "We need a number to call you back on.";
    } else if (!phoneLooksReal(v.phone)) {
      e.phone = "That is not a 10 digit phone number.";
    }
    if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) {
      e.email = "Check that email address, it looks incomplete.";
    }
    return e;
  }

  function focusFirstError(e: Errors) {
    const first = FIELD_ORDER.find((name) => e[name]);
    if (!first) return;
    const el = controls.current[first];
    if (el) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
      summaryRef.current?.focus();
    }
  }

  const vehicleString = [values.year, values.make, values.model]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");

  /* The body type in words, because "suv-full" means nothing in an inbox.
     This is the whole reason the picker classifies: the lead should already
     say what size the vehicle is, since every quote he gives depends on it. */
  const bodyTypeLabel =
    BODY_TYPES.find((b) => b.id === values.bodyType)?.label ?? "";

  function buildPayload() {
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    const gclid = params.get("gclid") ?? "";
    const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      .map((k) => {
        const val = params.get(k);
        return val ? `${k}=${val}` : "";
      })
      .filter(Boolean)
      .join(" ");

    const chosenService = serviceLabel(values.service);
    const chosenPackage =
      group && values.pkg ? packageLabel(values.service, values.pkg) : "";

    const lines = [
      `${subj.label}: ${vehicleString || "not given"}`,
      bodyTypeLabel ? `Body style: ${bodyTypeLabel}` : "",
      `Service: ${chosenService}`,
      chosenPackage && group ? `${group.lead}: ${chosenPackage}` : "",
      "",
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      values.email.trim() ? `Email: ${values.email.trim()}` : "",
      "",
      values.message.trim() ? `Notes: ${values.message.trim()}` : "",
      "",
      `Sent from: ${source ?? (typeof window !== "undefined" ? window.location.pathname : "/")}`,
      gclid ? `gclid: ${gclid}` : "",
      utm ? `Campaign: ${utm}` : "",
      typeof document !== "undefined" && document.referrer
        ? `Referrer: ${document.referrer}`
        : "",
    ].filter((line) => line !== "");

    const payload: Record<string, unknown> = {
      access_key: WEB3FORMS_KEY,
      subject: `Quote request: ${values.name.trim()}, ${vehicleString || chosenService}`,
      from_name: `${BRAND.name} website`,
      name: values.name.trim(),
      phone: values.phone.trim(),
      vehicle: vehicleString,
      body_style: bodyTypeLabel,
      service: chosenService,
      message: lines.join("\n"),
      botcheck: false,
    };
    if (values.email.trim()) payload.email = values.email.trim();
    if (chosenPackage && group) payload[group.field] = chosenPackage;
    if (gclid) payload.gclid = gclid;

    return { payload, chosenService, chosenPackage };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    // Honeypot. A bot gets the same screen a person gets, and no conversion.
    if (values.company.trim()) {
      router.push("/thank-you/");
      return;
    }

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus("idle");
      requestAnimationFrame(() => focusFirstError(found));
      return;
    }

    setErrors({});
    setStatus("sending");

    const { payload, chosenService, chosenPackage } = buildPayload();

    if (!KEY_IS_SET) {
      // Loud in development, still visible in a production console, and the
      // visitor is told the truth on screen instead of a fake confirmation.
      if (process.env.NODE_ENV !== "production") {
        console.group("%c[QuoteForm] LEAD NOT DELIVERED", "color:#00C1F3;font-weight:bold");
        console.warn(
          "WEB3FORMS_KEY is still the placeholder, so this request was not sent anywhere.\n" +
            "Fix: set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in the environment, or paste the key\n" +
            "into WEB3FORMS_KEY in src/lib/constants.ts. Get it from web3forms.com using\n" +
            "the address that should receive the leads."
        );
        console.info("The lead that would have been sent:", payload);
        console.groupEnd();
      } else {
        console.warn(
          "[QuoteForm] Web3Forms access key is not configured. The request was not sent."
        );
      }
      setStatus("not-connected");
      return;
    }

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (!res.ok || body?.success === false) throw new Error("web3forms rejected the submission");

      trackQuoteSubmit({
        service: chosenService,
        packageName: chosenPackage || undefined,
        vehicle: vehicleString,
        name: values.name.trim(),
      });

      router.push("/thank-you/");
    } catch (err) {
      console.error("[QuoteForm] send failed", err);
      setStatus("network-error");
    }
  }

  /* ---------------------------------------------------------------- */

  const errorList = FIELD_ORDER.filter((name) => errors[name]);

  return (
    <form
      id={id}
      /* StickyCallBar watches for this attribute and hides the whole rail
         while the form is on screen, so a 56px bar can never sit over a
         field or the submit button. Without it the rail floats over the
         form on every page that embeds it. The rail matches
         "[data-quote-form], #quote-form", so this must stay on the root
         element of the form, not on a wrapper a page happens to add. */
      data-quote-form=""
      /* THE FORM POSTS ON ITS OWN.
         With a real key this is an ordinary HTML form pointed at Web3Forms,
         so the submit button works with JavaScript off and in the window
         before this component hydrates. onSubmit takes over the moment it
         can, and it always preventDefaults, so a hydrated browser never
         does the plain POST. */
      action={KEY_IS_SET ? WEB3FORMS_ENDPOINT : undefined}
      method={KEY_IS_SET ? "post" : undefined}
      /* Browser validation until React's own is available. */
      noValidate={hydrated}
      onSubmit={onSubmit}
      className={cx(
        "plane-sheet min-w-0 border border-rule-light bg-sheet-060 p-5 text-ink-600 sm:p-7",
        className
      )}
    >
      {/* What Web3Forms needs to deliver a plain POST, and nothing more. The
          JavaScript path builds its own richer payload in buildPayload. */}
      {KEY_IS_SET && (
        <>
          <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
          <input
            type="hidden"
            name="subject"
            value={`Quote request from the ${BRAND.name} website`}
          />
          <input type="hidden" name="from_name" value={`${BRAND.name} website`} />
          <input type="hidden" name="redirect" value={NO_JS_REDIRECT} />
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} />
        </>
      )}

      {/* the datum rule, drawn inline so this component stays standalone */}
      <div aria-hidden className="flex h-px w-full">
        <span className="h-px w-6 flex-none bg-cyan-500" />
        <span className="h-px flex-1 bg-rule-light" />
      </div>

      {heading ? (
        <div className="mt-5">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-ink-400">
            Quote request
          </p>
          <h2 className="ps-heading mt-2 text-2xl text-ink-900 sm:text-3xl">
            {heading}
          </h2>
          {intro ? <p className="mt-3 max-w-md leading-relaxed">{intro}</p> : null}
        </div>
      ) : null}

      {/* error summary, focusable, listed in field order */}
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 border-2 border-ink-900 bg-sheet-000 p-4"
        >
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-900">
            Check these before sending
          </p>
          <ul className="mt-2 space-y-1">
            {errorList.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => controls.current[name]?.focus()}
                  className="text-left text-[0.9375rem] font-semibold text-ink-900 underline decoration-cyan-ink underline-offset-4"
                >
                  {errors[name]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------- the vehicle ---------------- */}
      <fieldset className="mt-7 min-w-0 border-0 p-0">
        <legend className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-900">
          {subj.legend}
        </legend>

        {/* A boat has no EPA record, so the picker only serves vehicles.
            The marine page keeps plain fields, which is the same markup the
            picker itself falls back to with JavaScript off. */}
        <div className="mt-4">
          {subject === "boat" ? (
            <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="min-w-0">
                <label className={LABEL_CLS} htmlFor={fid("year")}>
                  Year <span className="text-ink-400">optional</span>
                </label>
                <input
                  id={fid("year")}
                  ref={(el) => {
                    controls.current.year = el;
                  }}
                  name="year"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  placeholder={subj.year}
                  className={controlCls(Boolean(errors.year))}
                  value={values.year}
                  onChange={(e) => set("year", e.target.value)}
                  aria-invalid={errors.year ? true : undefined}
                  aria-describedby={errors.year ? fid("year-error") : undefined}
                />
                <FieldError id={fid("year-error")} message={errors.year} />
              </div>

              <div className="min-w-0">
                <label className={LABEL_CLS} htmlFor={fid("make")}>
                  Make
                </label>
                <input
                  id={fid("make")}
                  ref={(el) => {
                    controls.current.make = el;
                  }}
                  name="make"
                  required
                  autoComplete="off"
                  placeholder={subj.make}
                  className={controlCls(Boolean(errors.make))}
                  value={values.make}
                  onChange={(e) => set("make", e.target.value)}
                  aria-invalid={errors.make ? true : undefined}
                  aria-describedby={errors.make ? fid("make-error") : undefined}
                />
                <FieldError id={fid("make-error")} message={errors.make} />
              </div>

              <div className="col-span-2 min-w-0">
                <label className={LABEL_CLS} htmlFor={fid("model")}>
                  Model
                </label>
                <input
                  id={fid("model")}
                  ref={(el) => {
                    controls.current.model = el;
                  }}
                  name="model"
                  required
                  autoComplete="off"
                  placeholder={subj.model}
                  className={controlCls(Boolean(errors.model))}
                  value={values.model}
                  onChange={(e) => set("model", e.target.value)}
                  aria-invalid={errors.model ? true : undefined}
                  aria-describedby={errors.model ? fid("model-error") : undefined}
                />
                <FieldError id={fid("model-error")} message={errors.model} />
              </div>
            </div>
          ) : (
            <VehicleSelect
              value={{
                year: values.year,
                make: values.make,
                model: values.model,
                bodyType: values.bodyType,
              }}
              onChange={(patch: Partial<VehicleValue>) =>
                setValues((v) => {
                  const next = { ...v, ...patch };
                  return next;
                })
              }
              idFor={fid}
              controlClass={(n: "year" | "make" | "model") =>
                controlCls(Boolean(errors[n]))
              }
              registerRef={(n: "year" | "make" | "model", el: HTMLElement | null) => {
                controls.current[n] = el as HTMLInputElement | null;
              }}
              renderError={(n: "year" | "make" | "model") => (
                <FieldError id={fid(`${n}-error`)} message={errors[n]} />
              )}
            />
          )}
        </div>
      </fieldset>

      {/* ---------------- what you want done ---------------- */}
      <fieldset className="mt-7 min-w-0 border-0 p-0">
        <legend className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-900">
          What you want done
        </legend>

        <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label className={LABEL_CLS} htmlFor={fid("service")}>
              Service
            </label>

            {showServiceSelect ? (
              <select
                id={fid("service")}
                ref={(el) => {
                  controls.current.service = el;
                }}
                name="service"
                required
                className={controlCls(Boolean(errors.service))}
                value={values.service}
                onChange={(e) => set("service", e.target.value)}
                aria-invalid={errors.service ? true : undefined}
                aria-describedby={errors.service ? fid("service-error") : undefined}
              >
                <option value="">Choose one</option>
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex min-w-0 items-center justify-between gap-3 border border-rule-light bg-sheet-000 px-3.5 py-3">
                <span className="font-mono text-[0.9375rem] text-ink-900">
                  {serviceLabel(values.service)}
                </span>
                <button
                  type="button"
                  onClick={() => setServiceUnlocked(true)}
                  /* py/-my rather than a taller box: this is the only way back
                     out of a locked service, and at 18px it was under the
                     minimum target size. The padding gives it a 34px hit area
                     and the negative margin hands the space back, so the
                     locked row does not change height. */
                  className="-my-2 flex-none py-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-cyan-ink underline underline-offset-4"
                >
                  Change
                </button>
                {/* The locked line is text, not a control, so a plain POST
                    would carry no service at all without this. */}
                <input type="hidden" name="service" value={values.service} />
              </div>
            )}
            <FieldError id={fid("service-error")} message={errors.service} />
          </div>

          {group && (
            <div className="min-w-0">
              <label className={LABEL_CLS} htmlFor={fid("pkg")}>
                {group.label} <span className="text-ink-400">optional</span>
              </label>
              <select
                id={fid("pkg")}
                name={group.field}
                className={controlCls(false)}
                value={values.pkg}
                onChange={(e) => set("pkg", e.target.value)}
                aria-describedby={fid("pkg-hint")}
              >
                <option value="">{group.none}</option>
                {group.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <p id={fid("pkg-hint")} className="field-hint">
                {group.hint}
              </p>
            </div>
          )}
        </div>
      </fieldset>

      {/* ---------------- how to reach you ---------------- */}
      <fieldset className="mt-7 min-w-0 border-0 p-0">
        <legend className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-900">
          How to reach you
        </legend>

        <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label className={LABEL_CLS} htmlFor={fid("name")}>
              Name
            </label>
            <input
              id={fid("name")}
              ref={(el) => {
                controls.current.name = el;
              }}
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              className={controlCls(Boolean(errors.name))}
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? fid("name-error") : undefined}
            />
            <FieldError id={fid("name-error")} message={errors.name} />
          </div>

          <div className="min-w-0">
            <label className={LABEL_CLS} htmlFor={fid("phone")}>
              Phone
            </label>
            <input
              id={fid("phone")}
              ref={(el) => {
                controls.current.phone = el;
              }}
              name="phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="336 555 0148"
              className={controlCls(Boolean(errors.phone))}
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? fid("phone-error") : undefined}
            />
            <FieldError id={fid("phone-error")} message={errors.phone} />
          </div>

          <div className="min-w-0 sm:col-span-2">
            <label className={LABEL_CLS} htmlFor={fid("email")}>
              Email <span className="text-ink-400">optional</span>
            </label>
            <input
              id={fid("email")}
              ref={(el) => {
                controls.current.email = el;
              }}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              className={controlCls(Boolean(errors.email))}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? fid("email-error") : undefined}
            />
            <FieldError id={fid("email-error")} message={errors.email} />
          </div>
        </div>
      </fieldset>

      {/* ---------------- anything else ---------------- */}
      <div className="mt-7 min-w-0">
        <label className={LABEL_CLS} htmlFor={fid("message")}>
          Anything else <span className="text-ink-400">optional</span>
        </label>
        <textarea
          id={fid("message")}
          name="message"
          rows={4}
          placeholder="Condition, timeline, anything you want us to look at."
          className={controlCls(false)}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      {/* honeypot. Clipped rather than display:none, which some bots skip. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={fid("company")}>Company</label>
        <input
          id={fid("company")}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>

      {/* ---------------- delivery states ---------------- */}
      {status === "network-error" && (
        <div role="alert" className="mt-7 border-2 border-ink-900 bg-sheet-000 p-4">
          <p className="ps-heading text-lg text-ink-900">That did not send.</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed">
            Your details are still here, so press send again. If it fails twice,
            call the shop and we will take it down over the phone.
          </p>
          <div className="mt-4">
            <PhoneLink placement="quote-form-error" className="ps-btn ps-btn--ghost ps-btn--sm">
              Call {BRAND.phoneDisplay}
            </PhoneLink>
          </div>
        </div>
      )}

      {status === "not-connected" && (
        <NotConnectedNotice
          name={values.name.trim()}
          vehicleLabel={subj.label}
          vehicle={vehicleString}
          service={serviceLabel(values.service)}
          coverageLabel={group?.label ?? "Coverage"}
          coverage={
            group && values.pkg ? packageLabel(values.service, values.pkg) : ""
          }
          phone={values.phone.trim()}
          onEdit={() => setStatus("idle")}
        />
      )}

      {/* ---------------- submit ---------------- */}
      <div className="mt-8 border-t border-rule-light pt-6">
        {/* NO KEY YET, SO NO SILENT BUTTON.
            With a real access key the form above carries a real action and
            method and this whole block disappears: the submit button posts
            to Web3Forms on its own and lands on /thank-you/, with or without
            JavaScript.

            Until then there is nothing to post to, so rather than leave a
            control that swallows the press, the no script path removes the
            button outright and puts the number where the button was. The
            style tag is the only way to do that, because whether scripting
            is on is not something the server can know. */}
        {!KEY_IS_SET && (
          <noscript>
            <style>{`[data-quote-form] [data-js-submit]{display:none}`}</style>
            <div className="border-2 border-ink-900 bg-sheet-000 p-5">
              <p className="ps-heading text-lg text-ink-900">
                Sending needs JavaScript.
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">
                It is off in this browser, so call the shop instead and we
                will take the {subj.noun} and the job down over the phone.
              </p>
              <p className="mt-4">
                <a
                  href={`tel:${BRAND.phoneTel}`}
                  className="ps-btn ps-btn--cyan"
                >
                  Call {BRAND.phoneDisplay}
                </a>
              </p>
              <p className="mt-4 font-mono text-[0.75rem] leading-relaxed text-ink-400">
                {BRAND.hoursShort}
              </p>
            </div>
          </noscript>
        )}

        <div data-js-submit="">
          <Button
            type="submit"
            tone="cyan"
            block
            /* No key and no hydration yet means no honest destination, and a
               submit here would reload the page with the visitor's name and
               phone number in the address bar. It goes live the instant this
               component mounts, and with a real key it is never disabled at
               all, because then the plain POST works on its own. */
            disabled={status === "sending" || (!KEY_IS_SET && !hydrated)}
          >
            {status === "sending" ? "Sending" : "Send the request"}
          </Button>
        </div>

        <p aria-live="polite" className="sr-only">
          {status === "sending" ? "Sending your request" : ""}
        </p>

        <p className="mt-4 text-center text-[0.9375rem]">
          Rather talk it through?{" "}
          <PhoneLink
            placement="quote-form"
            className="font-mono text-cyan-ink underline underline-offset-4"
          >
            {BRAND.phoneDisplay}
          </PhoneLink>
        </p>

        <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-400">
          Sending this lets us call or text you back about this request, and
          nothing else. See the{" "}
          <Link href="/privacy-policy/" className="text-cyan-ink underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* pieces                                                              */
/* ------------------------------------------------------------------ */

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-2 text-[0.8125rem] font-semibold text-ink-900">
      <span aria-hidden className="mt-[0.45em] h-2 w-2 flex-none bg-ink-900" />
      {message}
    </p>
  );
}

/**
 * The honest state. WEB3FORMS_KEY is still the placeholder, so nothing was
 * sent and we do not say it was. No conversion fires here either.
 */
function NotConnectedNotice({
  name,
  vehicleLabel,
  vehicle,
  service,
  coverage,
  coverageLabel,
  phone,
  onEdit,
}: {
  name: string;
  vehicleLabel: string;
  vehicle: string;
  service: string;
  coverage: string;
  /** "Coverage" on film, "Coating" on a coating. */
  coverageLabel: string;
  phone: string;
  onEdit: () => void;
}) {
  const rows: Array<[string, string]> = [
    ["Name", name],
    [vehicleLabel, vehicle || "not given"],
    ["Service", service],
  ];
  if (coverage) rows.push([coverageLabel, coverage]);
  rows.push(["Phone", phone]);

  return (
    <div role="status" className="mt-7 border-2 border-ink-900 bg-sheet-000 p-5">
      <p className="ps-heading text-xl text-ink-900">Nothing was sent yet.</p>
      <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed">
        The form on this site is not connected to the shop inbox yet, so your
        request is still sitting in this browser. Here is exactly what you
        filled in. Call the shop and we will take it down.
      </p>

      <dl className="mt-5 border-t border-rule-light">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-4 border-b border-rule-light py-2.5"
          >
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-400">
              {k}
            </dt>
            <dd className="text-right font-mono text-[0.875rem] tabular-nums text-ink-900">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <PhoneLink placement="quote-form-not-connected" className="ps-btn ps-btn--cyan">
          Call {BRAND.phoneDisplay}
        </PhoneLink>
        <Button type="button" tone="ghost" onClick={onEdit}>
          Edit my details
        </Button>
      </div>

      {process.env.NODE_ENV !== "production" && (
        <p className="mt-5 border-t border-rule-light pt-4 font-mono text-[0.6875rem] leading-relaxed text-ink-400">
          Development build only. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY, or
          paste the key into WEB3FORMS_KEY in src/lib/constants.ts. The full
          payload is in the console.
        </p>
      )}
    </div>
  );
}
