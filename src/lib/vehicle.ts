/**
 * Vehicle lookup + body-type classification.
 *
 * Year / make / model come from the free fueleconomy.gov vehicle menu API
 * (CORS-open, no key). We take the classification one step further than a
 * plain picker: once a model is chosen we pull that vehicle's EPA VClass and
 * map it onto the body types the shop actually prices by, so a visitor gets
 * a real tint price instead of "contact us for a quote."
 *
 * Classification is always shown back to the visitor and is always
 * overridable, an EPA class can't tell a regular cab from a crew cab.
 */

import type { BodyTypeId } from "./constants";

export const FE_BASE = "https://www.fueleconomy.gov/ws/rest/vehicle";

export interface MenuItem {
  text: string;
  value: string;
}

/** fueleconomy returns a bare object when a menu has exactly one entry. */
export function parseMenu(data: unknown): MenuItem[] {
  const menuItem = (data as { menuItem?: MenuItem | MenuItem[] })?.menuItem;
  if (!menuItem) return [];
  return Array.isArray(menuItem) ? menuItem : [menuItem];
}

/**
 * EPA model strings carry drivetrain and fuel suffixes that mean nothing to
 * a customer picking their car ("F150 Pickup 4WD", "Camry AWD", "Tahoe 2WD").
 * Strip them for display and collapse the duplicates that creates, keeping
 * every raw name so we can still query the API.
 */
const NOISE =
  /\s+(2WD|4WD|AWD|FWD|RWD|4X4|4x2|FFV|CNG|Flex Fuel|Hybrid AWD)$/i;

export function cleanModel(raw: string): string {
  let out = raw;
  for (let i = 0; i < 3; i++) out = out.replace(NOISE, "");
  return out.trim();
}

export interface ModelGroup {
  /** what the visitor sees */
  label: string;
  /** every raw EPA model string that collapsed into this label */
  raw: string[];
}

export function groupModels(items: MenuItem[]): ModelGroup[] {
  const map = new Map<string, string[]>();
  for (const item of items) {
    const label = cleanModel(item.text);
    const list = map.get(label);
    if (list) list.push(item.text);
    else map.set(label, [item.text]);
  }
  return [...map.entries()]
    .map(([label, raw]) => ({ label, raw }))
    .sort((a, b) => a.label.localeCompare(b.label, "en", { numeric: true }));
}

/* ------------------------------------------------------------------
   Classification
   ------------------------------------------------------------------ */

export type Confidence = "high" | "medium" | "low";

export interface Classification {
  bodyType: BodyTypeId;
  confidence: Confidence;
  /** why we picked it, shown in small print so the guess is never opaque */
  reason: string;
}

/** Models the EPA lumps in with sedans that are unmistakably 2-door cars. */
const COUPES = [
  "corvette",
  "mustang",
  "camaro",
  "challenger",
  "miata",
  "mx-5",
  "brz",
  "gr86",
  "86",
  "supra",
  "370z",
  "350z",
  "z ",
  "nsx",
  "gt-r",
  "gt r",
  "cayman",
  "boxster",
  "911",
  "718",
  "tt ",
  "tts",
  "ttrs",
  "m2",
  "m4",
  "m8",
  "4 series coupe",
  "2 series",
  "8 series",
  "c 63 coupe",
  "amg gt",
  "viper",
  "firebird",
  "trans am",
  "chevelle",
  "el camino",
  "beetle",
  "brz",
  "veloster",
  "coupe",
  "convertible",
  "roadster",
  "spyder",
  "spider",
];

/** Full-size, three-row body-on-frame SUVs. */
const FULL_SIZE_SUVS = [
  "tahoe",
  "suburban",
  "yukon",
  "escalade",
  "expedition",
  "navigator",
  "sequoia",
  "land cruiser",
  "armada",
  "qx80",
  "qx56",
  "lx 570",
  "lx 600",
  "gx 460",
  "gx 550",
  "wagoneer",
  "grand wagoneer",
  "durango",
  "traverse",
  "palisade",
  "telluride",
  "atlas",
  "pilot",
  "ascent",
  "grand highlander",
  "carnival",
  "range rover",
  "gls",
  "g 550",
  "x7",
  "q7",
  "qx60",
  "mdx",
  "explorer",
  "grand cherokee l",
];

const MINIVANS = [
  "odyssey",
  "sienna",
  "pacifica",
  "town & country",
  "town and country",
  "grand caravan",
  "carnival",
  "transit connect wagon",
  "metris",
];

const PICKUPS = [
  "f150",
  "f-150",
  "f250",
  "f-250",
  "f350",
  "f-350",
  "silverado",
  "sierra",
  "ram 1500",
  "ram 2500",
  "ram 3500",
  "ram pickup",
  "tacoma",
  "tundra",
  "colorado",
  "canyon",
  "ranger",
  "frontier",
  "titan",
  "ridgeline",
  "gladiator",
  "maverick",
  "santa cruz",
  "cybertruck",
  "lightning",
  "hummer ev pickup",
  "r1t",
  "pickup",
];

function has(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

/**
 * Map an EPA VClass + model name onto one of the shop's priced body types.
 * Model-name matches win over VClass because the EPA class can't distinguish
 * a Mustang from a Malibu (both "Subcompact/Midsize Cars").
 */
export function classify(model: string, vclass?: string): Classification {
  const m = model.toLowerCase();
  const v = (vclass || "").toLowerCase();

  if (has(m, MINIVANS)) {
    return { bodyType: "minivan", confidence: "high", reason: "minivan" };
  }
  if (has(m, PICKUPS) || v.includes("pickup")) {
    return {
      bodyType: "pickup-4door",
      confidence: "medium",
      reason: "pickup, switch to 2-door if yours is a regular cab",
    };
  }
  if (has(m, FULL_SIZE_SUVS)) {
    return { bodyType: "suv-full", confidence: "high", reason: "full-size SUV" };
  }
  if (has(m, COUPES)) {
    return { bodyType: "coupe", confidence: "high", reason: "2-door" };
  }

  if (v) {
    if (v.includes("minivan") || v.includes("vans, passenger")) {
      return { bodyType: "minivan", confidence: "medium", reason: `EPA class: ${vclass}` };
    }
    if (v.includes("standard sport utility")) {
      return { bodyType: "suv-full", confidence: "medium", reason: `EPA class: ${vclass}` };
    }
    if (v.includes("sport utility")) {
      return { bodyType: "suv-small", confidence: "medium", reason: `EPA class: ${vclass}` };
    }
    if (v.includes("two seater") || v.includes("minicompact")) {
      return { bodyType: "coupe", confidence: "medium", reason: `EPA class: ${vclass}` };
    }
    if (
      v.includes("compact") ||
      v.includes("midsize") ||
      v.includes("large cars") ||
      v.includes("station wagon")
    ) {
      return { bodyType: "sedan", confidence: "medium", reason: `EPA class: ${vclass}` };
    }
    if (v.includes("van")) {
      return { bodyType: "minivan", confidence: "low", reason: `EPA class: ${vclass}` };
    }
  }

  return {
    bodyType: "sedan",
    confidence: "low",
    reason: "we couldn't tell, pick your body style",
  };
}

/** Pull the EPA VClass for a raw model string. Returns undefined on any failure. */
export async function fetchVClass(
  year: number,
  make: string,
  rawModel: string,
  signal?: AbortSignal
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `${FE_BASE}/menu/options?year=${year}&make=${encodeURIComponent(
        make
      )}&model=${encodeURIComponent(rawModel)}`,
      { headers: { Accept: "application/json" }, signal }
    );
    const id = parseMenu(await res.json())[0]?.value;
    if (!id) return undefined;
    const detail = await fetch(`${FE_BASE}/${id}`, {
      headers: { Accept: "application/json" },
      signal,
    });
    const data = (await detail.json()) as { VClass?: string };
    return data?.VClass;
  } catch {
    return undefined;
  }
}
