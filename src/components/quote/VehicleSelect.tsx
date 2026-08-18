"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BODY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  FE_BASE,
  classify,
  fetchVClass,
  groupModels,
  parseMenu,
  type ModelGroup,
} from "@/lib/vehicle";

/**
 * YEAR / MAKE / MODEL, the real one.
 *
 * The same cascading picker the other auto sites in this practice use, running
 * on the free fueleconomy.gov vehicle menu API. It was deleted from this repo
 * during the rebrand as "dead code from the previous client", which was wrong,
 * and it is back.
 *
 * It does one thing beyond picking a car. Once a model is chosen it classifies
 * the vehicle into the body type Judson actually quotes by, name heuristics
 * first and the EPA VClass as the backup, and shows that guess back where the
 * visitor can correct it. So the lead in his inbox already says "full-size SUV"
 * rather than saying "Tahoe" and needing a reply to establish the same thing.
 * That matters more now, not less, because the site no longer publishes prices,
 * so every lead is a quote request.
 *
 * PROGRESSIVE ENHANCEMENT. Three <select> elements fed by fetch() are three
 * empty boxes with JavaScript off. So the server renders plain text inputs,
 * which work on their own and post correctly, and this swaps in the selects
 * after mount. Worst case the visitor types the car, which is what the form did
 * before and is still a perfectly good lead.
 *
 * It speaks the form's own four strings rather than a private shape, so the
 * existing validation, error summary and lead payload keep working untouched.
 */

export interface VehicleValue {
  year: string;
  make: string;
  model: string;
  bodyType: string;
}

const START_YEAR = 1984;

interface Props {
  value: VehicleValue;
  /** patch, never a whole object, so the caller keeps owning its own state */
  onChange: (patch: Partial<VehicleValue>) => void;
  /** ids and names for the three controls, so the caller keeps its refs */
  idFor: (name: string) => string;
  /** rendered under a control when the caller has an error for it */
  renderError?: (name: "year" | "make" | "model") => React.ReactNode;
  controlClass?: (name: "year" | "make" | "model") => string;
  registerRef?: (name: "year" | "make" | "model", el: HTMLElement | null) => void;
}

const LABEL = "field-label";

export default function VehicleSelect({
  value,
  onChange,
  idFor,
  renderError,
  controlClass,
  registerRef,
}: Props) {
  /* Gates the enhancement. Until it flips, the server markup is on screen, so
     there is no flash of empty dropdowns and no dependency on a network call
     to render a usable form. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* Read the clock in an effect, never during render. This component is
     prerendered at build time, and a baked-in year would go stale in January. */
  const [maxYear, setMaxYear] = useState<number | null>(null);
  useEffect(() => setMaxYear(new Date().getFullYear() + 1), []);

  const years = useMemo(
    () =>
      maxYear
        ? Array.from({ length: maxYear - START_YEAR + 1 }, (_, i) => maxYear - i)
        : [],
    [maxYear]
  );

  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<ModelGroup[]>([]);
  const [loading, setLoading] = useState<"makes" | "models" | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [guessLabel, setGuessLabel] = useState<string | null>(null);

  /** Raw EPA model string for the class lookup, which the four strings lose. */
  const rawModel = useRef("");
  /** True once the visitor has corrected us, so we stop overwriting them. */
  const overridden = useRef(false);

  const { year, make, model, bodyType } = value;

  useEffect(() => {
    if (!year) {
      setMakes([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading("makes");
    fetch(`${FE_BASE}/menu/make?year=${year}`, {
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((d) =>
        setMakes(
          parseMenu(d)
            .map((i) => i.text)
            .sort()
        )
      )
      .catch(() => setMakes([]))
      .finally(() => setLoading(null));
    return () => ctrl.abort();
  }, [year]);

  useEffect(() => {
    if (!year || !make) {
      setModels([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading("models");
    fetch(`${FE_BASE}/menu/model?year=${year}&make=${encodeURIComponent(make)}`, {
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((d) => setModels(groupModels(parseMenu(d))))
      .catch(() => setModels([]))
      .finally(() => setLoading(null));
    return () => ctrl.abort();
  }, [year, make]);

  /* Classify once a model is chosen. Name heuristics answer most of it
     instantly, the EPA class is the fallback for the rest. */
  useEffect(() => {
    if (!year || !make || !model || overridden.current) return;
    const quick = classify(model);
    const label = (id: string) =>
      BODY_TYPES.find((b) => b.id === id)?.label ?? null;

    if (quick.confidence === "high") {
      setGuessLabel(label(quick.bodyType));
      setClassifying(false);
      onChange({ bodyType: quick.bodyType });
      return;
    }

    const ctrl = new AbortController();
    setClassifying(true);
    setGuessLabel(label(quick.bodyType));
    onChange({ bodyType: quick.bodyType });

    fetchVClass(Number(year), make, rawModel.current || model, ctrl.signal).then(
      (vclass) => {
        if (ctrl.signal.aborted || overridden.current) return;
        const settled = classify(model, vclass);
        setGuessLabel(label(settled.bodyType));
        setClassifying(false);
        onChange({ bodyType: settled.bodyType });
      }
    );
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, make, model]);

  const setYear = useCallback(
    (y: string) => {
      overridden.current = false;
      rawModel.current = "";
      setGuessLabel(null);
      onChange({ year: y, make: "", model: "", bodyType: "" });
    },
    [onChange]
  );

  const setMake = useCallback(
    (m: string) => {
      overridden.current = false;
      rawModel.current = "";
      setGuessLabel(null);
      onChange({ make: m, model: "", bodyType: "" });
    },
    [onChange]
  );

  const setModel = useCallback(
    (label: string) => {
      const group = models.find((g) => g.label === label);
      overridden.current = false;
      rawModel.current = group?.raw[0] ?? label;
      setGuessLabel(null);
      onChange({ model: label, bodyType: "" });
    },
    [models, onChange]
  );

  const cls = (n: "year" | "make" | "model") =>
    controlClass ? controlClass(n) : "field";

  const ref = (n: "year" | "make" | "model") => (el: HTMLElement | null) =>
    registerRef?.(n, el);

  /* ---- the no-JS and pre-hydration path -------------------------------- */
  if (!mounted) {
    return (
      <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="min-w-0">
          <label className={LABEL} htmlFor={idFor("year")}>
            Year <span className="text-ink-400">optional</span>
          </label>
          <input
            id={idFor("year")}
            ref={ref("year")}
            name="year"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            placeholder="2021"
            className={cls("year")}
            defaultValue={year}
          />
          {renderError?.("year")}
        </div>
        <div className="min-w-0">
          <label className={LABEL} htmlFor={idFor("make")}>
            Make
          </label>
          <input
            id={idFor("make")}
            ref={ref("make")}
            name="make"
            required
            autoComplete="off"
            placeholder="Chevrolet"
            className={cls("make")}
            defaultValue={make}
          />
          {renderError?.("make")}
        </div>
        <div className="col-span-2 min-w-0">
          <label className={LABEL} htmlFor={idFor("model")}>
            Model
          </label>
          <input
            id={idFor("model")}
            ref={ref("model")}
            name="model"
            required
            autoComplete="off"
            placeholder="Corvette"
            className={cls("model")}
            defaultValue={model}
          />
          {renderError?.("model")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="min-w-0">
          <label className={LABEL} htmlFor={idFor("year")}>
            Year <span className="text-ink-400">optional</span>
          </label>
          <select
            id={idFor("year")}
            ref={ref("year")}
            name="year"
            className={cls("year")}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          {renderError?.("year")}
        </div>

        <div className="min-w-0">
          <label className={LABEL} htmlFor={idFor("make")}>
            Make
          </label>
          <select
            id={idFor("make")}
            ref={ref("make")}
            name="make"
            className={cls("make")}
            value={make}
            disabled={!year || loading === "makes"}
            onChange={(e) => setMake(e.target.value)}
          >
            <option value="">
              {loading === "makes"
                ? "Loading"
                : year
                  ? "Select"
                  : "Pick a year first"}
            </option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {renderError?.("make")}
        </div>

        <div className="col-span-2 min-w-0">
          <label className={LABEL} htmlFor={idFor("model")}>
            Model
          </label>
          <select
            id={idFor("model")}
            ref={ref("model")}
            name="model"
            className={cls("model")}
            value={model}
            disabled={!make || loading === "models"}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="">
              {loading === "models"
                ? "Loading"
                : make
                  ? "Select"
                  : "Pick a make first"}
            </option>
            {models.map((g) => (
              <option key={g.label} value={g.label}>
                {g.label}
              </option>
            ))}
          </select>
          {renderError?.("model")}
        </div>
      </div>

      {/* The guess, shown back and always correctable. An EPA class cannot
          tell a regular cab from a crew cab, so this is never presented as
          settled. It travels with the lead either way. */}
      {model ? (
        <div className="mt-4 min-w-0 sm:max-w-sm">
          <label className={LABEL} htmlFor={idFor("bodyType")}>
            Body style
          </label>
          <select
            id={idFor("bodyType")}
            name="bodyType"
            className="field"
            value={bodyType}
            onChange={(e) => {
              overridden.current = true;
              setClassifying(false);
              onChange({ bodyType: e.target.value });
            }}
          >
            <option value="">{classifying ? "Working it out" : "Pick one"}</option>
            {BODY_TYPES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
          <p className="field-hint">
            {classifying
              ? "Checking the vehicle."
              : overridden.current
                ? "Thanks, that is what we will quote against."
                : guessLabel
                  ? `We read that as a ${guessLabel.toLowerCase()}. Change it if that is wrong.`
                  : "Pick the closest one."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
