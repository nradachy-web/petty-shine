/**
 * DERIVED CITY FACTS
 *
 * Nothing in here is a new fact. Every value is arithmetic or a comparison
 * over the sixteen entries in CITIES, which were measured by road with OSRM
 * from 357 Branson Mill Road. If a statement cannot be produced from those
 * measured numbers it is not produced at all, which is why several of these
 * helpers return null rather than a sentence.
 *
 * This exists so the sixteen town pages differ in substance instead of in a
 * swapped noun. Each page gets its own rank, its own comparison against a
 * real neighbouring town, its own road classification and its own set of
 * towns that arrive on the same road.
 */

import { BRAND, CITIES, type City } from "@/lib/constants";

export const CITY_COUNT = CITIES.length;

/** CITIES is stored already sorted by measured road distance. */
export function rankOf(c: City): number {
  return CITIES.findIndex((x) => x.slug === c.slug) + 1;
}

export function cityHref(c: City): string {
  return `/areas/${c.slug}/`;
}

export function isHomeCounty(c: City): boolean {
  return c.county === BRAND.county;
}

/* ------------------------------------------------------------------ */
/* the road                                                            */
/* ------------------------------------------------------------------ */

export type RoadKind = "interstate-73" | "interstate-85" | "surface";

/**
 * Which class of road the measured route uses. It matters because the
 * shop's own interchange is on I-73, so an I-73 route ends at a ramp we
 * can name, and a surface route does not.
 */
export function roadKind(c: City): RoadKind {
  if (c.route.includes("I-73")) return "interstate-73";
  if (c.route.includes("I-85")) return "interstate-85";
  return "surface";
}

/** "I-73 and US 220 to NC 62" becomes ["I-73", "US 220", "NC 62"]. */
export function roadTokens(c: City): string[] {
  return c.route
    .split(/\s+(?:to|and)\s+/i)
    .map((t) => t.replace(/\s+(north|south|east|west)$/i, "").trim())
    .filter(Boolean);
}

export interface SharedRoad {
  road: string;
  others: City[];
}

/**
 * The other towns that arrive on the same numbered road. Prefers the road
 * the drive starts on, falls back to any road on the route, and returns
 * null when nothing on the route is shared with another town.
 */
export function sharedRoad(c: City): SharedRoad | null {
  const tokens = roadTokens(c);
  for (const road of tokens) {
    const others = CITIES.filter(
      (o) => o.slug !== c.slug && roadTokens(o).includes(road)
    );
    if (others.length > 0) return { road, others };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* the comparison                                                      */
/* ------------------------------------------------------------------ */

export interface PaceNote {
  /** "farther" means farther by road and no slower. */
  kind: "farther" | "closer";
  other: City;
  milesGap: number;
  minutesGap: number;
}

const MILES_GAP = 1.5;

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * The single most useful thing a town page can tell someone: the road
 * matters more than the mileage. Finds a town that is farther out by road
 * and no slower to reach, or failing that one that is closer and slower.
 *
 * Returns null when the measured set supports neither, which is the whole
 * point of returning null. Five of the sixteen towns get no pace note and
 * fall back to their neighbours in the ranking instead.
 */
export function paceNote(c: City): PaceNote | null {
  const farther = CITIES.filter(
    (o) => o.miles >= c.miles + MILES_GAP && o.minutes <= c.minutes
  ).sort(
    (a, b) => c.minutes - a.minutes - (c.minutes - b.minutes) || b.miles - a.miles
  )[0];

  if (farther) {
    return {
      kind: "farther",
      other: farther,
      milesGap: round1(farther.miles - c.miles),
      minutesGap: c.minutes - farther.minutes,
    };
  }

  const closer = CITIES.filter(
    (o) => o.miles <= c.miles - MILES_GAP && o.minutes >= c.minutes
  ).sort(
    (a, b) => b.minutes - c.minutes - (a.minutes - c.minutes) || a.miles - b.miles
  )[0];

  if (closer) {
    return {
      kind: "closer",
      other: closer,
      milesGap: round1(c.miles - closer.miles),
      minutesGap: closer.minutes - c.minutes,
    };
  }

  return null;
}

/** The towns immediately either side of this one in the distance ranking. */
export function neighbours(c: City): { closer: City | null; farther: City | null } {
  const i = CITIES.findIndex((x) => x.slug === c.slug);
  return {
    closer: i > 0 ? CITIES[i - 1] : null,
    farther: i < CITIES.length - 1 ? CITIES[i + 1] : null,
  };
}

/** The towns nearest this one by measured distance from the shop. */
export function nearestTowns(c: City, n = 4): City[] {
  return CITIES.filter((o) => o.slug !== c.slug)
    .slice()
    .sort((a, b) => Math.abs(a.miles - c.miles) - Math.abs(b.miles - c.miles))
    .slice(0, n)
    .sort((a, b) => a.miles - b.miles);
}

/* ------------------------------------------------------------------ */
/* counties                                                            */
/* ------------------------------------------------------------------ */

export interface CountyGroup {
  county: string;
  towns: City[];
}

/** Counties in order of how many measured towns sit in each. */
export function countyGroups(): CountyGroup[] {
  const map = new Map<string, City[]>();
  for (const c of CITIES) {
    const list = map.get(c.county) ?? [];
    list.push(c);
    map.set(c.county, list);
  }
  return [...map.entries()]
    .map(([county, towns]) => ({ county, towns }))
    .sort((a, b) => b.towns.length - a.towns.length || a.county.localeCompare(b.county));
}

/* ------------------------------------------------------------------ */
/* formatting                                                          */
/* ------------------------------------------------------------------ */

export function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/** "Randleman, Sophia and Archdale" */
export function nameList(towns: readonly City[]): string {
  const names = towns.map((t) => t.name);
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

/** Small counts read as words in prose. Prices and measurements stay figures. */
export function spell(n: number): string {
  return WORDS[n] ?? String(n);
}

/** spell(), capitalised, for a count that opens a sentence or a heading. */
export function spellCap(n: number): string {
  const w = spell(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
}
