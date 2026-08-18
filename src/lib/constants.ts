/**
 * PETTY SHINE, single source of truth.
 *
 * Every price, product name, warranty term, credential and drive time below was
 * verified against a primary source on 2026-08-17 and carries that source in a
 * comment. Nothing here is invented.
 *
 * If a number changes, change it here only. No page may type a fact inline.
 * The site this replaces tells North Carolina customers about a ceramic coating
 * process "in the Holly and Grand Blanc, Michigan area" because its builder
 * typed facts into pages. That class of mistake is impossible here.
 *
 * Read _plan/RECON.md for the full evidence file and the open questions.
 */

import { money } from "./utils";

/* ============================================================
   PRICING MODE, the one switch

   Judson does not publish his prices, so this site does not publish
   them either. One line below decides that, and nothing else in the
   codebase has to change when it moves.

     PRICING_MODE = "private"   THE DEFAULT. Every price slot on the
                                site renders the "Quoted on your
                                vehicle" link into /quote/ with the
                                service preselected. No dollar figure
                                renders anywhere: not on the home page,
                                not in the service index, not on a
                                service page, not in schema, not in a
                                meta description.

     PRICING_MODE = "public"    The same slots print the real figure
                                out of this file and the site is priced
                                again. No page changes, no component
                                changes, no copy changes.

   THE REAL FIGURES STAY IN THIS FILE EITHER WAY. They are still the
   truth, the quote form still needs them to qualify a lead, and the
   internal record still prints them. Private mode keeps a number off
   the page. It does not delete it from the business, and it is not a
   reason to let one go stale.

   HOW TO FLIP IT. Change the string, run `npm run build`, then
   `npm run audit`. The audit reads this exact constant out of this
   file and fails the build if a dollar figure reached the rendered
   HTML while it says "private", so the flag cannot quietly drift away
   from what actually ships.

   PAGES MUST NOT BRANCH ON THIS BY HAND. Use <PriceOrQuote> from
   @/components/ui, which reads the flag for you and renders the quote
   link whenever the price is private or missing. priceIsPublic() and
   publicMoney() are here for the cases a component cannot cover, a
   sentence or a schema field that has to be written differently, for
   example a meta description that names a starting price.

   The type annotation on PRICING_MODE is deliberate. Written with
   `as const` the type narrows to "private" and every comparison
   against "public" becomes a compile error.
   ============================================================ */

export type PricingMode = "public" | "private";

export const PRICING_MODE: PricingMode = "private";

/** True when the site is allowed to print a dollar figure. */
export function priceIsPublic(): boolean {
  return PRICING_MODE === "public";
}

/**
 * A price formatted for the page, or null when there is nothing the
 * page is allowed to print. Null covers both cases that matter, the
 * flag being private and the service having no published price at
 * all, so a caller that handles null handles both.
 *
 * Use it for copy and for schema. For a slot in a table or a card use
 * <PriceOrQuote>, because null in a slot has to become a tappable
 * quote link and never an empty cell.
 */
export function publicMoney(value: number | null | undefined): string | null {
  if (!priceIsPublic()) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return money(value);
}

/**
 * One wording for every unpriced slot on the site. Nine of these on
 * one page have to read as one system rather than nine improvisations,
 * and it is a promise rather than a warning: the visitor is being told
 * what happens next, not told that something is missing.
 */
export const QUOTE_CTA_LABEL = "Quoted on your vehicle";

/* ============================================================
   THE BUSINESS
   ============================================================ */

export const BRAND = {
  name: "Petty Shine",
  legalName: "Petty Shine LLC",
  owner: "Judson Petty",

  /** From his own shop banner. Used as the site's service taxonomy. */
  tagline: "Restore. Protect. Restyle. Maintain.",
  taglineWords: ["Restore", "Protect", "Restyle", "Maintain"] as const,

  /**
   * PHONE. Judson still confirms this before launch, but the evidence is
   * lopsided and the default is set accordingly.
   *
   * 336-653-9199 appears on: the banner hanging in his own shop, Yelp,
   * Nextdoor, YellowPages, Yahoo Local, BBB, STEK USA's installer directory,
   * Gtechniq's accredited detailer directory, and his own websites from 2019
   * through 2022. The two manufacturer directories matter most, because he
   * registered those himself.
   *
   * 336-799-4326 appears only on the current Duda site and on two scraper
   * directories that almost certainly pulled it from there. A number that
   * exists only on the site his outside web company built is very likely
   * THEIR call tracking number, which would stop working the day he leaves
   * them, and would route his calls through a vendor he is leaving.
   *
   * So the default is his real number. Confirm before launch anyway: the
   * click to call conversion is the most valuable thing this site produces.
   */
  phoneDisplay: "(336) 653-9199",
  phoneTel: "+13366539199",
  phoneRaw: "336-653-9199",

  street: "357 Branson Mill Road",
  city: "Randleman",
  state: "NC",
  stateName: "North Carolina",
  zip: "27317",
  county: "Randolph County",
  get addressLine() {
    return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
  },

  /** US Census Bureau geocoder, 2026-08-17. */
  geo: { lat: 35.889987, lng: -79.799807 },

  mapsUrl: "https://www.google.com/maps?cid=2113433454810919228",
  facebook: "https://www.facebook.com/PettyShineProfessionalServices/",
  instagram: "https://www.instagram.com/pettyshine_/",
  siteUrl: "https://www.pettyshine.com",

  hours: [
    { days: "Monday to Friday", time: "8:00 AM to 5:00 PM" },
    { days: "Saturday & Sunday", time: "Closed" },
  ],
  hoursShort: "Mon to Fri, 8 to 5",
  /** schema.org openingHours */
  hoursSchema: ["Mo-Fr 08:00-17:00"],
} as const;

/** Web3Forms delivers the quote form. Public by design. Key still needed. */
export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "REPLACE_WITH_WEB3FORMS_KEY";

/**
 * Google tag + Ads conversion labels.
 * The live account (CID 668-110-4182) has NO website conversions today. Every
 * conversion action on it is a Google hosted engagement signal, so the bidder
 * is optimizing toward "someone looked at the map". Filling these in is the
 * single highest value change this site makes to the ad account.
 */
export const GADS = {
  googleTagId: "", // AW-XXXXXXXXXX
  ga4Id: "", // G-XXXXXXXXXX
  labels: {
    quoteForm: "",
    phoneClick: "",
  },
} as const;

/* ============================================================
   CREDENTIALS

   Both of these are verified in the manufacturer's own installer
   directory, and neither appears anywhere on his current website.
   They are the trust spine of this site.
   ============================================================ */

export const CREDENTIALS = [
  {
    id: "gtechniq",
    label: "Gtechniq Accredited Detailer",
    body: "Crystal Serum Ultra is professional application only. Gtechniq states it can only be applied by a Gtechniq Accredited Detailer, and the guarantee is void if anyone else applies it.",
    /** Source: Gtechniq Find A Detailer directory. Listing shows
     *  "Petty Shine", 357 Branson Mill Rd, Randleman NC 27317,
     *  (336) 653-9199, type "Accredited Detailer Auto". */
    source: "https://www.gtechniq.co.uk/find-a-detailer/",
  },
  {
    id: "stek",
    label: "Authorized STEK Installer",
    body: "Listed in STEK USA's own installer directory as offering STEK clear paint protection film.",
    /** Source: https://www.stek-usa.com/installers/usa/nc/petty-shine/
     *  Tier shown is Authorized. Do NOT claim Black Label, that is a
     *  separate program he does not hold. */
    source: "https://www.stek-usa.com/installers/usa/nc/petty-shine/",
  },
] as const;

/* ============================================================
   NAVIGATION

   RESTORE / PROTECT / RESTYLE / MAINTAIN comes off his banner and is
   used as the real taxonomy. Auto Detailing stands alone at equal
   weight because "car detailing near me" is the highest volume real
   search term in his ad account (31 clicks) and must never be buried
   inside a category.
   ============================================================ */

export const NAV_LINKS = [
  {
    label: "Protect",
    href: "/paint-protection-film/",
    children: [
      { label: "Paint Protection Film", href: "/paint-protection-film/" },
      { label: "Ceramic Coating", href: "/ceramic-coating/" },
      { label: "Window Tinting", href: "/window-tinting/" },
    ],
  },
  {
    label: "Restore",
    href: "/paint-correction/",
    children: [
      { label: "Paint Correction", href: "/paint-correction/" },
      { label: "Paintless Dent Repair", href: "/paintless-dent-repair/" },
      { label: "Curbed Wheel Repair", href: "/wheel-repair/" },
    ],
  },
  { label: "Detailing", href: "/auto-detailing/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Our Work", href: "/gallery/" },
  { label: "About", href: "/about/" },
] as const;

/* ============================================================
   SERVICE INDEX

   The numbered line item table. Auto Detailing is 01 deliberately.
   `fromPrice: null` means no published price, and the row must render
   a tappable "Quoted on your vehicle" link into the quote form. It is
   never a dead grey label.
   ============================================================ */

export interface ServiceLine {
  id: string;
  index: string;
  name: string;
  href: string;
  blurb: string;
  fromPrice: number | null;
  /** quote form service key when fromPrice is null */
  quoteKey: string;
}

export const SERVICES: ServiceLine[] = [
  {
    id: "auto-detailing",
    index: "01",
    name: "Auto Detailing",
    href: "/auto-detailing/",
    blurb: "Five levels, from a maintenance wash to a full paint correction.",
    fromPrice: 100,
    quoteKey: "detailing",
  },
  {
    id: "ceramic-coating",
    index: "02",
    name: "Ceramic Coating",
    href: "/ceramic-coating/",
    blurb: "Three tiers of Gtechniq protection, up to a nine year guarantee.",
    fromPrice: 700,
    quoteKey: "ceramic",
  },
  {
    id: "paint-protection-film",
    index: "03",
    name: "Paint Protection Film",
    href: "/paint-protection-film/",
    blurb: "STEK film over the panels that take the damage. Four coverage levels.",
    fromPrice: null,
    quoteKey: "ppf",
  },
  {
    id: "paint-correction",
    index: "04",
    name: "Paint Correction",
    href: "/paint-correction/",
    blurb: "Swirls, scratches, water spots and oxidation, cut and polished out.",
    fromPrice: 400,
    quoteKey: "correction",
  },
  {
    id: "interior-detailing",
    index: "05",
    name: "Interior Detailing",
    href: "/interior-detailing/",
    blurb: "Three levels, from a deep vacuum to full leather restoration.",
    fromPrice: 75,
    quoteKey: "interior",
  },
  {
    id: "paintless-dent-repair",
    index: "06",
    name: "Paintless Dent Repair",
    href: "/paintless-dent-repair/",
    blurb: "Dents, door dings and hail damage, out without touching the paint.",
    fromPrice: null,
    quoteKey: "pdr",
  },
  {
    id: "window-tinting",
    index: "07",
    name: "Window Tinting",
    href: "/window-tinting/",
    blurb: "Laminate and ceramic film, installed to the North Carolina limit.",
    fromPrice: null,
    quoteKey: "tint",
  },
  {
    id: "wheel-repair",
    index: "08",
    name: "Curbed Wheel Repair",
    href: "/wheel-repair/",
    blurb: "Curb rash repaired, plus wheel and brake caliper refinishing.",
    fromPrice: null,
    quoteKey: "wheel",
  },
  {
    id: "marine-detailing",
    index: "09",
    name: "Marine Detailing",
    href: "/marine-detailing/",
    blurb: "The same process, on the water. Three levels plus marine coatings.",
    fromPrice: 250,
    quoteKey: "marine",
  },
];

/* ============================================================
   CERAMIC COATING

   Prices verbatim from pettyshine.com/ceramic-coating.
   Chemistry names corrected to Gtechniq's own spelling: his current
   site writes "C1 Crystal lacquer" and "Exo", both wrong.
   ============================================================ */

export const COATINGS = [
  {
    id: "three-year",
    name: "3 Year Coating",
    fromPrice: 700,
    guarantee: "3 year",
    /**
     * NO base or top coat is named here, deliberately. His published price
     * list names the chemistry on the 5 and 9 year tiers and names nothing
     * on this one, so there is nothing to name and nothing is invented.
     * See _plan/RECON.md, "REAL PRICING": the 3 Year entry reads "coating
     * application" and stops there.
     *
     * The row below states the absence instead of leaving a hole in a table
     * where the two dearer tiers both list a product. Delete it and add
     * `base` / `top` the moment Judson says what goes on this tier. It is
     * logged as a question for him in _plan/RECON.md.
     */
    chemistryPending: {
      key: "Coating",
      value: "Named before work begins",
      note: "No product published for this tier",
    },
    includes: [
      "Wash and paint decontamination",
      "One step paint enhancement polish to remove light to moderate swirls and scratches",
      "All exterior surfaces cleaned and prepped for coating",
      "Ceramic coating application",
    ],
    bestFor: "A driver who wants real protection without a long commitment",
  },
  {
    id: "five-year",
    name: "5 Year Coating",
    fromPrice: 1200,
    guarantee: "5 year",
    base: "Gtechniq C1 Crystal Lacquer",
    top: "Gtechniq EXOv5",
    includes: [
      "One step paint enhancement polish for light to moderate defects",
      "Optional two stage heavy cut and polish for deeper defects",
      "Exterior surfaces prepped for coating",
      "Base coat of Gtechniq C1 Crystal Lacquer",
      "Top coat of Gtechniq EXOv5",
    ],
    bestFor: "Long term ownership and vehicles that live outside",
    featured: true,
  },
  {
    id: "petty-shine-nine",
    name: "The Petty Shine",
    subtitle: "9 Year Coating",
    fromPrice: 1500,
    guarantee: "9 year",
    base: "Gtechniq Crystal Serum Ultra",
    top: "Gtechniq EXOv5",
    includes: [
      "Wash and paint decontamination",
      "Full paint correction, tailored to the vehicle, to remove swirls, scratches, water spots and oxidation",
      "Base coat of Gtechniq Crystal Serum Ultra",
      "Top coat of Gtechniq EXOv5",
    ],
    bestFor: "New vehicles, show cars, and anyone chasing maximum gloss",
    /** The differentiator. Verified professional-application-only. */
    proOnly: true,
  },
] as const;

export const COATING_ADDONS = [
  "Wheel coating",
  "Glass coating",
  "Plastic and trim coating",
  "Interior ceramic coating",
] as const;

/**
 * Gtechniq's own published terms, verbatim sources in _plan/RECON.md.
 * These are the honest ones. Publishing them is a trust asset, because no
 * competitor in the Triad publishes their coating's actual conditions.
 */
export const GTECHNIQ_FACTS = {
  proOnly:
    "Gtechniq states Crystal Serum Ultra can only be applied by a Gtechniq Accredited Detailer. You cannot buy it and you cannot have it applied by a shop that is not accredited.",
  hardness:
    "Gtechniq describes Crystal Serum Ultra as a hard 10h top layer over a softer 7h base, which it says gives improved swirl resistance over a regular 9h coating.",
  guaranteeTerms: [
    {
      key: "Issued by",
      value: "Gtechniq, not by us. Claims go directly to Gtechniq.",
    },
    {
      key: "Registration",
      value: "You must register within 30 days of application. The number is on the window sticker.",
    },
    {
      key: "Annual inspection",
      value: "Required. Miss it and the paint protection guarantee becomes invalid.",
    },
    {
      key: "Transfers",
      value: "No. The guarantee is yours, not the car's, and it ends if you sell it.",
    },
    {
      key: "Requires",
      value: "Application by a Gtechniq Accredited Detailer. We are one.",
    },
  ],
  maintenanceNote:
    "Gtechniq's own position is that a car looked after well and washed properly will easily reach the nine year guarantee. A coating is protection, not immunity.",
} as const;

/* ============================================================
   DETAILING

   Prices verbatim from pettyshine.com/detailing-package.
   ============================================================ */

export const DETAIL_PACKAGES = [
  {
    id: "maintenance",
    name: "Maintenance Detail",
    fromPrice: 100,
    blurb:
      "Not a car wash. A detailed clean for a vehicle that is already in good condition, including door jambs.",
  },
  {
    id: "level-1",
    name: "Level 1 Detail",
    subtitle: "Wash and wax",
    fromPrice: 200,
    blurb:
      "Everything in the maintenance detail, plus a wax or sealant for protection and hydrophobic behavior.",
  },
  {
    id: "level-2",
    name: "Level 2 Detail",
    subtitle: "Paint enhancement",
    fromPrice: 400,
    blurb:
      "Everything in Level 1, plus a machine polish that pulls back gloss and clarity. Ceramic coating available on qualifying paint.",
    featured: true,
  },
  {
    id: "level-3",
    name: "Level 3 Detail",
    subtitle: "Paint correction",
    fromPrice: 750,
    blurb:
      "True paint correction. Permanently removes medium to heavy defects such as water spots, swirls and scratches.",
  },
  {
    id: "the-petty-shine",
    name: "The Petty Shine",
    subtitle: "The ultimate detail",
    fromPrice: 800,
    blurb:
      "A custom package for the customer who wants the vehicle to look its absolute best, built around what the paint actually needs.",
  },
] as const;

export const INTERIOR_PACKAGES = [
  {
    id: "interior-1",
    name: "Level 1 Interior",
    fromPrice: 75,
    blurb:
      "Surfaces wiped to remove dust and light staining, windows cleaned, rubber mats deep cleaned, carpets and upholstery detailed vacuum. Included with every exterior detail.",
  },
  {
    id: "interior-2",
    name: "Level 2 Interior",
    fromPrice: 150,
    blurb:
      "Leather, plastics and vinyl cleaned then conditioned and protected. Carpets and upholstery brushed for a deeper clean.",
    featured: true,
  },
  {
    id: "interior-3",
    name: "Level 3 Interior",
    fromPrice: 250,
    blurb:
      "Leather, plastics and vinyl brought back to like new while sanitizing and disinfecting, plus an advanced carpet and upholstery cleaning process.",
  },
] as const;

export const INTERIOR_ADDONS = [
  "Steam cleaning for tight cracks and crevices",
  "Carpet or seat shampooing and hot water extraction",
] as const;

export const MARINE_PACKAGES = [
  { id: "marine-1", name: "Level 1", fromPrice: 250 },
  { id: "marine-2", name: "Level 2", fromPrice: 450 },
  { id: "marine-3", name: "Level 3", fromPrice: 2000 },
] as const;

export const MARINE_EXTRAS = [
  { key: "Interior, Level 1", value: 80 },
  { key: "Interior, Level 2", value: 200 },
  { key: "Ceramic coating", value: 150 },
] as const;

/* ============================================================
   PAINT PROTECTION FILM

   His four published packages, verbatim. NO PRICES: he publishes none
   and no source exists, so every PPF path ends in the quote form.

   Panel ids drive the Coverage Plan diagram. Each package is a strict
   superset of the one before it.
   ============================================================ */

export type PanelId =
  | "front-bumper"
  | "hood"
  | "headlight"
  | "fog-light"
  | "mirror"
  | "front-fender"
  | "rocker"
  | "lower-door"
  | "rear-impact"
  | "front-door"
  | "rear-door"
  | "roof"
  | "rear-fender"
  | "trunk"
  | "rear-bumper";

/** Real installation order. The diagram fills panels in this sequence. */
export const PANEL_ORDER: PanelId[] = [
  "front-bumper",
  "hood",
  "headlight",
  "fog-light",
  "mirror",
  "front-fender",
  "rocker",
  "lower-door",
  "rear-impact",
  "front-door",
  "rear-door",
  "roof",
  "rear-fender",
  "trunk",
  "rear-bumper",
];

export const PANEL_LABELS: Record<PanelId, string> = {
  "front-bumper": "Front bumper",
  hood: "Hood",
  headlight: "Headlights",
  "fog-light": "Fog lights",
  mirror: "Mirrors",
  "front-fender": "Front fenders",
  rocker: "Rocker panels",
  "lower-door": "Lower doors",
  "rear-impact": "Rear impact area",
  "front-door": "Front doors",
  "rear-door": "Rear doors",
  roof: "Roof",
  "rear-fender": "Rear fenders",
  trunk: "Trunk",
  "rear-bumper": "Rear bumper",
};

/** Panels that take the hits at highway speed. Drives the stipple overlay. */
export const IMPACT_PANELS: PanelId[] = [
  "front-bumper",
  "hood",
  "mirror",
  "headlight",
  "fog-light",
  "rocker",
];

export interface PpfPackage {
  id: string;
  order: number;
  name: string;
  /** every panel covered, strict superset of the package below */
  panels: PanelId[];
  /** only what this tier adds over the previous one */
  addedPanels: PanelId[];
  addsOver: string | null;
  bestFor: string;
  note?: string;
}

const PARTIAL: PanelId[] = ["front-bumper", "hood", "mirror"];
const FULL_FRONT: PanelId[] = [...PARTIAL, "front-fender"];
const TRACKBACK: PanelId[] = [...FULL_FRONT, "rocker", "lower-door", "rear-impact"];
const FULL_VEHICLE: PanelId[] = [
  ...TRACKBACK,
  "headlight",
  "fog-light",
  "front-door",
  "rear-door",
  "roof",
  "rear-fender",
  "trunk",
  "rear-bumper",
];

export const PPF_PACKAGES: PpfPackage[] = [
  {
    id: "partial-front",
    order: 0,
    name: "Partial Front End",
    panels: PARTIAL,
    addedPanels: PARTIAL,
    addsOver: null,
    bestFor: "The cheapest way to cover the three things that get hit first.",
  },
  {
    id: "full-front",
    order: 1,
    name: "Full Front End",
    panels: FULL_FRONT,
    addedPanels: ["front-fender"],
    addsOver: "Partial Front End",
    bestFor: "The most common job we do. No film line down the middle of the hood.",
  },
  {
    id: "full-front-trackback",
    order: 2,
    name: "Full Front End with Trackback",
    panels: TRACKBACK,
    addedPanels: ["rocker", "lower-door", "rear-impact"],
    addsOver: "Full Front End",
    bestFor: "Highway miles, and anything low enough to pick up road spray.",
    note: "Lower door where applicable to the vehicle.",
  },
  {
    id: "full-vehicle",
    order: 3,
    name: "Full Vehicle",
    panels: FULL_VEHICLE,
    addedPanels: [
      "headlight",
      "fog-light",
      "front-door",
      "rear-door",
      "roof",
      "rear-fender",
      "trunk",
      "rear-bumper",
    ],
    addsOver: "Full Front End with Trackback",
    bestFor: "Every painted surface. Long term ownership and cars you intend to keep.",
  },
];

/** Full Front End. Anchors the ladder at the most common real sale. */
export const PPF_DEFAULT_PACKAGE = "full-front";

/**
 * STEK DYNOshield, verbatim from stek-usa.com/paint-protection-film/dynoshield/.
 * He is an Authorized STEK installer, verified in STEK's own directory.
 *
 * NOTE the warranty term is deliberately NOT stated on the site. STEK's two
 * websites publish different numbers (stek-usa.com says 10 years for
 * DYNOshield, stekautomotive.com's index shows the DYNO series at 12), and
 * his current site promises an XPEL warranty he cannot back. See PENDING_SPEC.
 */
export const PPF_FILM = {
  brand: "STEK",
  product: "DYNOshield",
  specs: [
    { key: "Finish", value: "Glossy" },
    { key: "Thickness", value: "8 mils" },
    { key: "Self healing", value: "Light scratches, with heat or hot water" },
    { key: "Surface", value: "Hydrophobic and stain resistant" },
  ],
  /** Honest limits, both from the manufacturers' own FAQs. */
  limits: [
    "Film is a sacrificial layer. It takes the chip so the paint does not, and film that has taken a hit is film doing its job.",
    "Self healing works on light scratches and swirls. STEK's own FAQ says a scratch that penetrates the topcoat will not self heal.",
  ],
} as const;

/**
 * The honest gap. Renders as a bordered SPECIFICATION PENDING block on the
 * PPF and tint pages. Delete the entry the moment Judson confirms, and the
 * real value drops into the same rows with zero layout change.
 */
export const PENDING_SPEC = {
  heading: "Specification pending",
  rows: [
    { key: "Film", value: "Confirmed at consultation" },
    { key: "Warranty", value: "Confirmed in writing before work begins" },
  ],
  note: "We do not publish a film warranty we have not verified for your vehicle. Ask us and we will put it in writing.",
} as const;

/* ============================================================
   WINDOW TINT, and North Carolina law

   Verified against G.S. 20-127. No prices published, no film brand
   published, and deliberately NO warranty claim: his current site
   promises "lifetime warranties" on films it never names, which is
   unenforceable and moves the liability onto this site.
   ============================================================ */

export const NC_TINT_LAW = {
  statute: "N.C.G.S. 20-127",
  rows: [
    {
      key: "Every window except the windshield",
      value: "At least 35% light transmission",
      cite: "G.S. 20-127(b)(1)",
    },
    {
      key: "Front, back and rear glass",
      value: "Same 35% standard. North Carolina allows no darker rear glass.",
      cite: "G.S. 20-127(b)(1)",
    },
    {
      key: "Windshield",
      value:
        "Top strip only, no more than five inches down or below the AS1 line, whichever is longer",
      cite: "G.S. 20-127(b)",
    },
    {
      key: "Reflectivity",
      value: "20% or less",
      cite: "G.S. 20-127(b)(2)",
    },
    {
      key: "Meter tolerance",
      value:
        "A window measuring above 32% on an approved meter is conclusively presumed legal",
      cite: "G.S. 20-127(b)(1)",
    },
    {
      key: "Clear UV film on the windshield",
      value: "Expressly allowed, as long as it does not obstruct vision",
      cite: "G.S. 20-127(b)",
    },
  ],
  /** The myth worth killing on the page. */
  myth:
    "There is no darker allowance for rear glass in North Carolina. The 35% standard applies to every window on a passenger car except the windshield, and the windshield rules apply without exception.",
} as const;

/* ============================================================
   REVIEWS

   Verbatim, with the customer's own punctuation and typos intact.
   Birdeye breaks the rating out as Google (47), Birdeye (0), so all
   47 are Google reviews. RECHECK the count on publish day, review
   counts move. No aggregateRating schema: self serving markup is
   ineligible and Google ignores it.
   ============================================================ */

export const REVIEW_SUMMARY = {
  rating: 4.9,
  count: 47,
  source: "Google",
  checkedOn: "2026-08-17",
} as const;

export const REVIEWS = [
  {
    name: "Landon Brown",
    stars: 5,
    text: "We took our 2023 Suburban to Judson to wash, detail and ceramic coat our vehicle. Judson's team did an outstanding job. We were impressed and we will be coming back for more services. This is the best place for ceramic coating hands down do not go anywhere else for this service. Just take it to Judson. He will take care of the rest.",
    service: "Ceramic coating",
  },
  {
    name: "Scott Fischer",
    stars: 5,
    text: "Judson and his team were extremely professional throughout the entire process, from quoting and scheduling to the final inspection. Their attention to detail and commitment to quality were outstanding. I would highly recommend Petty Shine for anyone looking for top-notch auto detailing and ceramic coating services.",
    service: "Detailing and ceramic coating",
  },
  {
    name: "Bill Murphy",
    stars: 5,
    text: "They are not just Detailers, It is the shine, durability and service They did my car a month ago When it came time to wash it, I simply and easily hosed off the bugs and dried the car 15 min total Very pleased !!!",
    service: "Ceramic coating",
  },
  {
    name: "Jacob Freeman",
    stars: 5,
    text: "Took my car in for a basic inside/outside detail and these guys made it look better than when I bought it new. Fair price for an excellent job. Plan on returning for every detail from now on",
    service: "Detailing",
  },
  {
    name: "Steve Singleton",
    stars: 5,
    text: "Very professional and great communication Great job",
    service: "Detailing",
  },
] as const;

/* ============================================================
   SERVICE AREA

   Drive distances and times measured with OSRM on 2026-08-17 from
   357 Branson Mill Rd. Never publish a drive time that was not
   measured.
   ============================================================ */

export interface City {
  slug: string;
  name: string;
  county: string;
  miles: number;
  minutes: number;
  /** the road people actually take to get here */
  route: string;
}

export const CITIES: City[] = [
  { slug: "randleman-nc", name: "Randleman", county: "Randolph County", miles: 4.1, minutes: 9, route: "US 220 Business" },
  { slug: "climax-nc", name: "Climax", county: "Guilford County", miles: 7.7, minutes: 15, route: "Randleman Road to NC 62" },
  { slug: "sophia-nc", name: "Sophia", county: "Randolph County", miles: 8.5, minutes: 14, route: "US 220 Business to Old High Point Street" },
  { slug: "julian-nc", name: "Julian", county: "Guilford County", miles: 11.3, minutes: 22, route: "Davis Mill Road to NC 62" },
  { slug: "archdale-nc", name: "Archdale", county: "Randolph County", miles: 12.8, minutes: 23, route: "I-73 and US 220 to NC 62" },
  { slug: "asheboro-nc", name: "Asheboro", county: "Randolph County", miles: 14.3, minutes: 20, route: "I-73 and US 220 south" },
  { slug: "greensboro-nc", name: "Greensboro", county: "Guilford County", miles: 15.2, minutes: 20, route: "I-73 and US 220 to Freeman Mill Road" },
  { slug: "high-point-nc", name: "High Point", county: "Guilford County", miles: 15.9, minutes: 28, route: "NC 62 to NC 610" },
  { slug: "trinity-nc", name: "Trinity", county: "Randolph County", miles: 16.4, minutes: 27, route: "NC 62 to I-85" },
  { slug: "liberty-nc", name: "Liberty", county: "Randolph County", miles: 18.3, minutes: 31, route: "NC 62 to US 421" },
  { slug: "jamestown-nc", name: "Jamestown", county: "Guilford County", miles: 18.6, minutes: 26, route: "US 29 to Vickrey Chapel Road" },
  { slug: "thomasville-nc", name: "Thomasville", county: "Davidson County", miles: 21.6, minutes: 33, route: "I-85 to NC 109" },
  { slug: "kernersville-nc", name: "Kernersville", county: "Forsyth County", miles: 27.4, minutes: 33, route: "I-73 to US 421" },
  { slug: "burlington-nc", name: "Burlington", county: "Alamance County", miles: 32.0, minutes: 44, route: "I-85 to NC 62" },
  { slug: "lexington-nc", name: "Lexington", county: "Davidson County", miles: 32.1, minutes: 46, route: "I-85 to US 64" },
  { slug: "winston-salem-nc", name: "Winston-Salem", county: "Forsyth County", miles: 37.5, minutes: 45, route: "I-73 to US 421" },
];

/** Nearest interchange. Useful, factual, and a real directions hook. */
export const NEAREST_EXIT = {
  label: "Exit 86, I-73 and US 220",
  miles: 1.3,
} as const;

/* ============================================================
   THINGS THIS SITE MUST NEVER SAY

   Enforced by scripts/audit-forbidden.mjs, which fails the build.
   Every entry traces to a primary source check in _plan/RECON.md.
   ============================================================ */

export const FORBIDDEN_CLAIMS = [
  {
    pattern: "XPEL",
    why: "He is not an XPEL installer. XPEL's own installer sitemap has 2,953 entries and zero hits for Randleman, Petty or Asheboro. His current site promises an XPEL warranty under a STEK heading. That is the single worst factual error on the old site.",
  },
  {
    pattern: "lifetime warranty",
    why: "Neither STEK nor XPEL publishes a lifetime PPF warranty, and his tint page promises lifetime warranties on films it never names. An unnamed lifetime warranty is unenforceable.",
  },
  {
    pattern: "Richard Petty | NASCAR | Petty Enterprises | Petty's Garage | racing heritage | racing country",
    why: "ON HOLD, NOT PROHIBITED. Updated 2026-08-18. Judson has told Nick directly that he is Richard Petty's grandson, so this is his own claim about his own family, not a marketing invention. It stays off the site only until he states the relationship in his own words, for two reasons. First, precision: the publicly documented grandchildren are Adam (d. 2000), Austin and Montgomery Lee through Kyle, Hanna and Maggie through Sharon, and Thad Moffitt through Rebecca, and no Judson appears anywhere public, so the degree may be great-nephew or cousin rather than grandson. In Randolph County this is the most fact-checkable sentence on the whole site and getting the generation wrong costs him credibility with exactly the customers he wants. Note that Richard Petty's own paternal grandfather was named Judson Ellsworth Petty, so the name genuinely recurs in that line. Second, permission: Richard Petty's name is actively licensed commercial property, and using it to sell services is Judson's relationship to spend, not ours. When he confirms, write it in his wording, keep it free of racing imagery, never name Petty's Garage or the Museum as a landmark, and never imply endorsement by Richard Petty or any Petty business.",
  },
  {
    pattern: "Level Cross",
    why: "The Census places the shop inside Level Cross township, which is factually true and would be a natural local hook. It is also the historic home of Petty Enterprises, so building any narrative on it reads as the heritage claim. Use the Randleman address only.",
  },
  {
    pattern: "since 2017 | family owned | generations | legacy",
    why: "2017-03-06 is the LLC formation date, which is not proof of when he started taking customers. And in this specific context every family and heritage phrase reads as a coded reference to the racing family.",
  },
  {
    pattern: "BBB accredited",
    why: "His BBB profile shows an A+ rating and states explicitly that the business is NOT BBB accredited.",
  },
  {
    pattern: "Black Label",
    why: "STEK's directory shows his tier as Authorized. Black Label is a separate program he does not hold.",
  },
  {
    pattern: "never chips | prevents all | never yellows | permanent UV",
    why: "Both film manufacturers frame PPF as a sacrificial layer and exclude impact damage from warranty. STEK specifically excludes environmental yellowing.",
  },
  {
    pattern: "Michigan | Holly | Grand Blanc",
    why: "The old site's ceramic page describes a process in the Holly and Grand Blanc, Michigan area. This is the template-leak defect the rebuild exists to fix.",
  },
] as const;
