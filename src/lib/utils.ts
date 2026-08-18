import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ============================================================
   MONEY

   THE RAW FORMATTER. It knows nothing about whether the site is
   allowed to print a price, so it is the wrong thing to call from a
   page, a heading, a description or a schema field while PRICING_MODE
   is "private". `npm run audit` fails the build on a dollar figure
   that reaches the rendered HTML, and this function is the only way
   one can get there.

   From a page, call publicMoney() in src/lib/constants.ts, which
   returns null when there is nothing you may print, or render
   <PriceOrQuote> and let the component decide. This stays exported
   because the quote form, the internal record and public pricing mode
   all still need a formatted number.
   ============================================================ */

export function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/* ============================================================
   DISTANCE AND DRIVE TIME

   CITIES.miles and NEAREST_EXIT.miles are OSRM road measurements
   taken to one decimal place, but they are stored as plain JS
   numbers, so 32.0 is 32 and prints without its decimal. Burlington
   shipped as "32.0 mi" on the home page, which applied toFixed(1),
   and as "32 mi" on /areas/ and in the nearby list, which did not.

   One decimal is the precision the measurement was taken at, so every
   distance on the site prints at one decimal and goes through here.
   No page formats its own.
   ============================================================ */

/** The bare figure. "32.0", "4.1", "1.3". */
export function miles(n: number): string {
  return n.toFixed(1);
}

/** "32.0 miles". Prose, and any row whose key does not carry the unit. */
export function milesLong(n: number): string {
  return `${miles(n)} miles`;
}

/** "32.0 mi". The short form, for a row that also carries a drive time. */
export function milesShort(n: number): string {
  return `${miles(n)} mi`;
}

/** Drive times were measured in whole minutes. "44 minutes". */
export function driveTime(n: number): string {
  return `${n} minute${n === 1 ? "" : "s"}`;
}

/** "44 min". The short form, beside milesShort. */
export function driveTimeShort(n: number): string {
  return `${n} min`;
}

/** "32.0 mi, 44 min". The one row format for a list of towns. */
export function drive(m: number, mins: number): string {
  return `${milesShort(m)}, ${driveTimeShort(mins)}`;
}

/* ============================================================
   DATES

   A date that was read off a source on a stated day is a fact, and
   it gets one presentation everywhere it appears. The ISO string in
   constants.ts is the storage format, never the printed one.
   ============================================================ */

/** "2026-08-17" to "August 17, 2026". Formatted, never retyped. */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
