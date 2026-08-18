"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  FE_BASE,
  classify,
  fetchVClass,
  groupModels,
  parseMenu,
  type Classification,
  type ModelGroup,
} from "@/lib/vehicle";

export interface VehiclePick {
  year: number | null;
  make: string;
  model: string;
  /** raw EPA model string, kept for the API lookups */
  rawModel: string;
  classification: Classification | null;
  /** true while the EPA class lookup is still in flight */
  classifying: boolean;
}

export const EMPTY_VEHICLE: VehiclePick = {
  year: null,
  make: "",
  model: "",
  rawModel: "",
  classification: null,
  classifying: false,
};

const CURRENT_YEAR = new Date().getFullYear() + 1;
const START_YEAR = 1984;

interface Props {
  value: VehiclePick;
  onChange: (v: VehiclePick) => void;
  /** stack the three selects instead of using a 3-up grid */
  stacked?: boolean;
}

export default function VehicleSelect({ value, onChange, stacked }: Props) {
  const years = useMemo(
    () =>
      Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) => CURRENT_YEAR - i),
    []
  );

  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<ModelGroup[]>([]);
  const [loading, setLoading] = useState<"makes" | "models" | null>(null);

  const { year, make, model } = value;

  // makes for the chosen year
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
      .then((d) => setMakes(parseMenu(d).map((i) => i.text).sort()))
      .catch(() => setMakes([]))
      .finally(() => setLoading(null));
    return () => ctrl.abort();
  }, [year]);

  // models for the chosen make
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

  // classify once a model is chosen: name heuristics first, EPA class as backup
  useEffect(() => {
    if (!year || !make || !model) return;
    const raw = value.rawModel || model;
    const quick = classify(model);
    if (quick.confidence === "high") {
      onChange({ ...value, classification: quick, classifying: false });
      return;
    }
    const ctrl = new AbortController();
    onChange({ ...value, classification: quick, classifying: true });
    fetchVClass(year, make, raw, ctrl.signal).then((vclass) => {
      if (ctrl.signal.aborted) return;
      onChange({
        ...value,
        classification: classify(model, vclass),
        classifying: false,
      });
    });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, make, model]);

  const setYear = useCallback(
    (y: number | null) =>
      onChange({ ...EMPTY_VEHICLE, year: y }),
    [onChange]
  );

  const setMake = useCallback(
    (m: string) =>
      onChange({ ...EMPTY_VEHICLE, year: value.year, make: m }),
    [onChange, value.year]
  );

  const setModel = useCallback(
    (label: string) => {
      const group = models.find((g) => g.label === label);
      onChange({
        ...value,
        model: label,
        rawModel: group?.raw[0] ?? label,
        classification: null,
        classifying: Boolean(label),
      });
    },
    [models, onChange, value]
  );

  return (
    <div className={cn("grid gap-4", stacked ? "grid-cols-1" : "sm:grid-cols-3")}>
      <div>
        <label className="field-label" htmlFor="veh-year">
          Year
        </label>
        <select
          id="veh-year"
          className="field"
          value={year ?? ""}
          onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Select</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="veh-make">
          Make
        </label>
        <select
          id="veh-make"
          className="field"
          value={make}
          disabled={!year || loading === "makes"}
          onChange={(e) => setMake(e.target.value)}
        >
          <option value="">
            {loading === "makes" ? "Loading…" : year ? "Select" : "Pick a year"}
          </option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="veh-model">
          Model
        </label>
        <select
          id="veh-model"
          className="field"
          value={model}
          disabled={!make || loading === "models"}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">
            {loading === "models" ? "Loading…" : make ? "Select" : "Pick a make"}
          </option>
          {models.map((g) => (
            <option key={g.label} value={g.label}>
              {g.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
