/**
 * HD AUTO STUDIO, single source of truth.
 *
 * Every price, warranty term, and service description below is taken
 * verbatim from the shop's own published material (hdautodetailing.com,
 * scraped 2026-08-11) or from Justin's Google Ads strategy submission.
 * Nothing here is invented. If a number changes, change it here only.
 */

export const BRAND = {
  name: "HD Auto Studio",
  legalName: "HD Automotive Detailing",
  formerName: "HD Automotive Detailing & Window Tinting",
  owner: "Justin Warwick",
  founded: 2017,
  tagline: "Exceptional results since 2017.",
  phoneDisplay: "(734) 408-1389",
  phoneTel: "+17344081389",
  phoneRaw: "734-408-1389",
  email: "justin@hdautodetailing.com",
  street: "10170 Industrial Drive",
  city: "Whitmore Lake",
  state: "MI",
  stateName: "Michigan",
  zip: "48189",
  get addressLine() {
    return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
  },
  geo: { lat: 42.4534868, lng: -83.7920292 },
  mapsUrl:
    "https://www.google.com/maps/place/HD+Automotive+Detailing+%26+Window+Tinting/@42.4534868,-83.7946041,17z/data=!3m1!4b1!4m6!3m5!1s0x88233509e1d9bc55:0x9b63cace25860de1!8m2!3d42.4534868!4d-83.7920292",
  facebook: "https://www.facebook.com/hdautodetailing48169",
  siteUrl: "https://www.hdautodetailing.com",
  hours: [
    { days: "Monday - Friday", time: "8:00 AM - 5:00 PM" },
    { days: "Saturday & Sunday", time: "By appointment only" },
  ],
  hoursShort: "Mon-Fri 8-5 · Weekends by appointment",
  /** Schema.org openingHours format */
  hoursSchema: ["Mo-Fr 08:00-17:00"],
} as const;

/** Web3Forms delivers the quote form to Justin's inbox. Public by design. */
export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "REPLACE_WITH_WEB3FORMS_KEY";

/** Google tag + Ads conversion labels. Filled in once the Ads account exists. */
export const GADS = {
  googleTagId: "", // e.g. AW-XXXXXXXXXX
  ga4Id: "", // e.g. G-XXXXXXXXXX
  labels: {
    quoteForm: "", // AW-XXXXXXXXXX/xxxxxxxxxxxxxxxxxxx
    phoneClick: "",
    emailClick: "",
  },
} as const;

export const NAV_LINKS = [
  {
    label: "Window Tint",
    href: "/window-tinting/",
    children: [
      { label: "Car Window Tinting", href: "/window-tinting/" },
      { label: "Ceramic Window Tint", href: "/ceramic-window-tint/" },
      { label: "LLumar ATC vs CTX", href: "/llumar-window-film/" },
      { label: "Home Window Film", href: "/residential-window-film/" },
      { label: "Commercial Window Film", href: "/commercial-window-film/" },
    ],
  },
  {
    label: "Protection",
    href: "/paint-protection-film/",
    children: [
      { label: "Paint Protection Film", href: "/paint-protection-film/" },
      { label: "Ceramic Coating", href: "/ceramic-coating/" },
      { label: "Paint Correction", href: "/paint-correction/" },
      { label: "Warranties", href: "/warranties/" },
    ],
  },
  { label: "Detailing", href: "/auto-detailing/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Our Work", href: "/gallery/" },
  { label: "About", href: "/about/" },
] as const;

/* ============================================================
   BODY TYPES, the spine of the price engine.
   Tint prices from the shop's published full-vehicle table.
   Detail prices from the shop's published "starting prices by
   vehicle size" table.
   ============================================================ */

export type BodyTypeId =
  | "coupe"
  | "sedan"
  | "pickup-2door"
  | "pickup-4door"
  | "suv-small"
  | "suv-full"
  | "minivan";

export interface BodyType {
  id: BodyTypeId;
  label: string;
  short: string;
  examples: string;
  /** full vehicle tint: all side + back windows, no windshield */
  tintDyed: number;
  tintCeramic: number;
  tintTime: string;
  /** detailing starting prices */
  detailInterior: number;
  detailFull: number;
  detailExterior: number;
}

export const BODY_TYPES: BodyType[] = [
  {
    id: "coupe",
    label: "2-Door Coupe",
    short: "Coupe",
    examples: "Mustang, Camaro, Corvette, Challenger",
    tintDyed: 225,
    tintCeramic: 350,
    tintTime: "2-3 hrs",
    detailInterior: 300,
    detailFull: 425,
    detailExterior: 200,
  },
  {
    id: "sedan",
    label: "4-Door Sedan",
    short: "Sedan",
    examples: "Accord, Malibu, 3-Series, Model 3",
    tintDyed: 350,
    tintCeramic: 500,
    tintTime: "3-4 hrs",
    detailInterior: 300,
    detailFull: 425,
    detailExterior: 200,
  },
  {
    id: "pickup-2door",
    label: "2-Door Pickup",
    short: "2-Dr Truck",
    examples: "Regular cab F-150, Silverado, Ram",
    tintDyed: 200,
    tintCeramic: 325,
    tintTime: "1-2 hrs",
    detailInterior: 300,
    detailFull: 450,
    detailExterior: 200,
  },
  {
    id: "pickup-4door",
    label: "4-Door Pickup",
    short: "4-Dr Truck",
    examples: "Crew cab F-150, Silverado, Ram, Tacoma",
    tintDyed: 275,
    tintCeramic: 400,
    tintTime: "1.5-2 hrs",
    detailInterior: 300,
    detailFull: 450,
    detailExterior: 200,
  },
  {
    id: "suv-small",
    label: "Small / Midsize SUV",
    short: "Small SUV",
    examples: "RAV4, Equinox, CR-V, Explorer",
    tintDyed: 325,
    tintCeramic: 450,
    tintTime: "2-3 hrs",
    detailInterior: 325,
    detailFull: 475,
    detailExterior: 225,
  },
  {
    id: "suv-full",
    label: "Full-Size SUV",
    short: "Full SUV",
    examples: "Tahoe, Suburban, Expedition, Yukon",
    tintDyed: 350,
    tintCeramic: 500,
    tintTime: "2-3 hrs",
    detailInterior: 350,
    detailFull: 475,
    detailExterior: 225,
  },
  {
    id: "minivan",
    label: "Minivan",
    short: "Minivan",
    examples: "Odyssey, Sienna, Pacifica, Carnival",
    tintDyed: 375,
    tintCeramic: 550,
    tintTime: "3-4 hrs",
    detailInterior: 375,
    detailFull: 525,
    detailExterior: 250,
  },
];

export const TINT_ADDONS = {
  frontTwoDyed: 125,
  frontTwoCeramic: 175,
  windshieldDyed: 150,
  windshieldCeramic: 225,
} as const;

export const TINT_NOTES = [
  "Full-vehicle pricing covers all side and back windows. It does not include the full windshield, sunroof, or removal of existing tint.",
  "Sedan pricing can vary by year, make, and model, call to confirm.",
  "Classic vehicles are quoted individually.",
  "Final pricing depends on vehicle type, number of windows, and film selection. Exact pricing is confirmed before scheduling.",
] as const;

/* ============================================================
   FILM / COATING PRODUCTS
   ============================================================ */

export const TINT_FILMS = [
  {
    id: "dyed",
    name: "Dyed Window Tint",
    product: "LLumar ATC",
    fromPrice: 125,
    fromLabel: "2 front door windows",
    bestFor: "A clean factory look at the lowest cost",
    points: [
      "Clean, factory-style appearance",
      "UV protection",
      "Color stable, won't fade or discolor",
      "Cost-effective option",
    ],
  },
  {
    id: "ceramic",
    name: "Ceramic Window Tint",
    product: "LLumar CTX",
    fromPrice: 175,
    fromLabel: "2 front door windows",
    bestFor: "Heat rejection and daily driving comfort",
    points: [
      "Superior heat rejection",
      "Clear visibility, no haze",
      "Maximum heat control compared to dyed film",
      "Signal friendly, no interference with GPS or phones",
    ],
  },
  {
    id: "windshield",
    name: "Full Windshield Tint",
    product: "Dyed or ceramic",
    fromPrice: 150,
    fromLabel: "dyed · $225 ceramic",
    bestFor: "Glare reduction and cabin heat",
    points: [
      "Reduces glare",
      "Improves driving comfort",
      "Installed professionally",
      "Typically 1.5-2 hours",
    ],
  },
] as const;

export const COATINGS = [
  {
    id: "crystal",
    name: "System X Crystal+",
    subtitle: "Ceramic paint protection",
    /** manufacturer's published effectiveness rating */
    protection: "Up to 3 years",
    /** manufacturer's published warranty term (Element 119) */
    warranty: "2-year System X warranty",
    fromPrice: 900,
    blurb:
      "A professional ceramic coating that enhances protection, depth, and gloss while helping preserve paint condition from everyday exposure. A noticeable step up in appearance and durability over waxes and sealants.",
    bestFor: "Drivers who want real protection without a long-term commitment",
  },
  {
    id: "pro",
    name: "System X Pro+",
    subtitle: "High-gloss ceramic paint protection",
    protection: "Up to 6 years",
    warranty: "6-year System X warranty",
    fromPrice: 1400,
    blurb:
      "A longer-lasting coating formulated for increased durability, stronger hydrophobic performance, and improved gloss retention, for owners who want extended protection without stepping into a lifetime-tier product.",
    bestFor: "Long-term ownership and vehicles that live outside",
    featured: true,
  },
  {
    id: "maxg",
    name: "System X Max G+",
    subtitle: "Hyper-gloss long-term ceramic protection",
    protection: "10+ years",
    warranty: "Lifetime System X warranty",
    fromPrice: 1950,
    blurb:
      "The highest-level coating in the System X lineup, built to deliver exceptional gloss depth, surface clarity, and long-term durability while maintaining the protection benefits of the Max system.",
    bestFor: "New vehicles, show cars, and anyone chasing maximum gloss",
  },
] as const;

export const COATING_NOTES = [
  "Every ceramic coating includes proper paint preparation and at least one stage of machine polishing, coatings preserve paint as it is, so prep is what determines the result.",
  "Starting prices include one stage of paint correction plus the coating application.",
  "Final pricing is determined by vehicle size, paint condition, and the level of correction required.",
  "System X warranty coverage requires a warranty card registered within 30 days, plus an annual inspection within 30 days either side of the anniversary date.",
] as const;

/* ============================================================
   WARRANTIES, plain-English terms.

   Every line below is sourced from the manufacturer's own
   published material. Where a manufacturer does not publish a
   term (transferability on the film side, GeoShield's full
   terms), the site says so instead of guessing.
   ============================================================ */

export const WARRANTIES = [
  {
    id: "llumar",
    product: "LLumar® window film (ATC & CTX)",
    headline: "Manufacturer's lifetime limited warranty*",
    covers: [
      "Cracking",
      "Bubbling",
      "Yellowing",
      "Discoloration",
    ],
    excludes: ["Accidental damage", "Damage from improper cleaning"],
    notes: [
      "*Certain restrictions apply, see dealer for warranty details. That asterisk is LLumar's, and we carry it rather than hide it.",
      "LLumar does not publish a public warranty document, so ask us for the certificate that comes with your install and keep it with the vehicle.",
      "Transferable coverage is tied to LLumar's FormulaOne® line, sold only through SelectPro™ dealers. We install ATC and CTX, so don't assume transfer without asking.",
    ],
  },
  {
    id: "geoshield",
    product: "GeoShield Ceramic Shield paint protection film",
    headline: "10-year manufacturer warranty",
    covers: ["Delamination", "Yellowing", "Bubbling", "Cracking"],
    excludes: [
      "Impact damage beyond the film's design",
      "Improper washing or removal",
    ],
    notes: [
      "6.5-mil TPU core with ceramic-infused layers, a 135° water contact angle, and heat-activated self-healing for swirls and light scratches.",
      "GeoShield publishes the coverage line but not the full terms, so transferability and registration mechanics come from your paperwork, not a web page.",
    ],
  },
  {
    id: "systemx",
    product: "System X® ceramic coating (Element 119)",
    headline: "2-year, 6-year, and lifetime tiers",
    covers: [
      "Oxidation",
      "Loss of gloss",
      "UV damage",
      "Acid rain",
      "Paint chalking",
    ],
    excludes: [
      "Swirl marks, marring, scratches, scuffs, and chips",
      "Water spotting from hard water",
      "Damage from brush car washes or contaminated wash tools",
    ],
    notes: [
      "Warranty is registered in the vehicle owner's name and does not transfer with the car.",
      "An annual inspection by an approved applicator is required within 30 days either side of the anniversary date, and it carries a fee. Miss it and the warranty voids.",
      "Coverage is administered by Element 119 and capped at the cost of product, up to $1,000.",
      "Pro+ and Max G+ are 9H, Boeing spec approved, SGS tested, and register to CARFAX.",
    ],
  },
] as const;

/* ============================================================
   FILM PERFORMANCE, Eastman's published data for the two
   automotive lines this shop installs. Values measured on
   single-pane 1/4" clear glass per NFRC guidelines.
   ============================================================ */

export const FILM_SPEC_FOOTNOTE =
  "Performance values published by Eastman Performance Films, measured on single-pane 1/4\" clear glass per NFRC guidelines. Actual performance varies with glass type and properties. LLumar®, CTX® and FormulaOne® are trademarks of Eastman Chemical Company or its subsidiaries.";

export interface FilmSpec {
  shade: string;
  vlt: number;
  tser: number;
  ir: number;
  uv: string;
  glare: number;
}

/** LLumar ATC, color-stable dyed. Note shade name ≠ measured VLT. */
export const ATC_SPECS: FilmSpec[] = [
  { shade: "ATC 05", vlt: 5, tser: 44, ir: 22, uv: ">99", glare: 94 },
  { shade: "ATC 15", vlt: 18, tser: 40, ir: 22, uv: ">99", glare: 79 },
  { shade: "ATC 20", vlt: 25, tser: 38, ir: 22, uv: ">99", glare: 72 },
  { shade: "ATC 30", vlt: 33, tser: 36, ir: 22, uv: ">99", glare: 63 },
  { shade: "ATC 35", vlt: 38, tser: 35, ir: 22, uv: ">99", glare: 57 },
  { shade: "ATC 40", vlt: 43, tser: 33, ir: 22, uv: ">99", glare: 51 },
  { shade: "ATC 50", vlt: 60, tser: 28, ir: 22, uv: ">99", glare: 32 },
];

/** LLumar CTX, ceramic. There is no CTX 20. */
export const CTX_SPECS: FilmSpec[] = [
  { shade: "CTX 05", vlt: 5, tser: 58, ir: 50, uv: ">99", glare: 94 },
  { shade: "CTX 15", vlt: 20, tser: 53, ir: 49, uv: ">99", glare: 78 },
  { shade: "CTX 25", vlt: 28, tser: 50, ir: 47, uv: ">99", glare: 69 },
  { shade: "CTX 30", vlt: 34, tser: 49, ir: 48, uv: ">99", glare: 62 },
  { shade: "CTX 35", vlt: 37, tser: 48, ir: 48, uv: ">99", glare: 58 },
  { shade: "CTX 40", vlt: 44, tser: 47, ir: 49, uv: ">99", glare: 50 },
  { shade: "CTX 50", vlt: 55, tser: 43, ir: 48, uv: ">99", glare: 37 },
];

export const PPF_PACKAGES = [
  {
    id: "partial-front",
    name: "Partial Front",
    fromPrice: 1200,
    blurb:
      "Entry-level protection for the areas most likely to take damage from daily driving and highway use.",
    includes: [
      "Full front bumper",
      'Partial hood (typically the front 18-24")',
      "Painted mirror caps",
    ],
    bestFor:
      "Daily drivers looking to reduce rock chips and road wear without full front coverage.",
  },
  {
    id: "full-front",
    name: "Full Front",
    fromPrice: 2200,
    blurb:
      "Seamless protection across the entire front end for vehicles that see frequent highway miles or long-term ownership.",
    includes: [
      "Full front bumper",
      "Full hood",
      "Full front fenders",
      "Painted mirror caps",
    ],
    bestFor:
      "Drivers who want clean, uniform protection with no visible lines on the hood.",
    featured: true,
  },
  {
    id: "full-vehicle",
    name: "Full Vehicle",
    fromPrice: 4900,
    blurb:
      "Maximum exterior protection for owners who want to preserve their paint long term and minimize wear across all painted surfaces.",
    includes: [
      "All painted exterior panels",
      "High-impact areas customized to the vehicle",
      "Coverage area varies by vehicle",
    ],
    bestFor:
      "Long-term ownership, new vehicles, and drivers who want the highest level of paint preservation.",
  },
] as const;

export const PPF_AREAS = [
  "Front bumper",
  "Hood (partial or full coverage)",
  "Headlights and fog lights",
  "Side mirrors",
  "Front fenders",
  "Rocker panels and lower doors",
  "High-impact areas specific to your vehicle",
] as const;

export const CORRECTION_LEVELS = [
  {
    id: "level-1",
    name: "Level 1, One-Step",
    fromPrice: 500,
    blurb:
      "A single-stage machine polish designed to significantly improve the overall appearance of the paint. Included with all ceramic coating jobs.",
    bestFor: [
      "Light swirl marks",
      "Light wash marring",
      "Minor surface scratches",
      "Dull or hazy paint",
    ],
    expect: [
      "Noticeable increase in gloss and clarity",
      "Removal of most light defects",
      "Ideal for well-maintained vehicles or a refresh",
    ],
  },
  {
    id: "level-2",
    name: "Level 2, Two-Step",
    fromPrice: 900,
    blurb:
      "A multi-stage correction that includes a compounding step to remove deeper defects, followed by a finishing polish to refine the paint.",
    bestFor: [
      "Moderate swirl marks",
      "Heavier scratches",
      "Oxidation",
      "Clear coat etching and water spot damage",
    ],
    expect: [
      "Dramatic improvement in clarity and depth",
      "Significantly reduced visible defects",
      "Excellent option before ceramic coating",
    ],
    featured: true,
  },
  {
    id: "level-3",
    name: "Level 3, Three-Step",
    fromPrice: 1500,
    blurb:
      "Our most intensive process, for heavily damaged or neglected paint. May include spot wet sanding where appropriate to safely reduce deep clear coat defects before multi-stage polishing.",
    bestFor: [
      "Deep scratches and severe swirl marks",
      "Heavy oxidation or etching",
      "Clear coat defects polishing alone can't fix",
    ],
    expect: [
      "Maximum achievable correction while preserving paint integrity",
      "The highest level of clarity, gloss, and refinement possible",
      "Recommended for show cars, high-end vehicles, and restorations",
    ],
  },
] as const;

export const CORRECTION_CAN = [
  "Swirl marks and wash-induced scratches",
  "Light to moderate surface scratches",
  "Oxidation and dull or faded paint",
  "Water spots and surface etching",
  "General paint haze and lack of clarity",
] as const;

export const CORRECTION_CANNOT = [
  "Scratches that have gone through the clear coat",
  "Peeling, failing, or delaminating clear coat",
  "Damage that requires repainting or bodywork",
  "Deep scratches that can't be corrected without compromising clear coat thickness",
] as const;

export const DETAIL_SERVICES = [
  {
    id: "interior",
    name: "Interior Detailing",
    fromPrice: 300,
    time: "3-6 hours",
    points: [
      "Seats, carpets, and floor mats deep cleaned with professional extraction and agitation to pull out embedded dirt, stains, and odor",
      "Plastics, vinyl, leather, and trim cleaned and conditioned to restore appearance and help prevent drying or discoloration",
      "Door panels, consoles, vents, cupholders, and hard-to-reach areas detailed to remove buildup routine cleaning misses",
    ],
  },
  {
    id: "full",
    name: "Full Interior & Exterior",
    fromPrice: 425,
    time: "5-7 hours",
    featured: true,
    points: [
      "Complete interior detail tailored to the condition of the vehicle",
      "Thorough hand wash plus chemical and clay bar decontamination to remove bonded contaminants",
      "Wheels, tires, wheel wells, and trim cleaned, then a ceramic sealant (System X Renew) applied for gloss and short-term protection",
    ],
  },
  {
    id: "exterior",
    name: "Exterior Detailing",
    fromPrice: 200,
    time: "2-4 hours",
    points: [
      "Wheels, tires, wheel wells, and exterior trim cleaned of brake dust, road grime, and buildup",
      "Safe hand wash and decontamination of painted surfaces",
      "Paint finished with a ceramic sealant (System X Renew) for added gloss and protection",
    ],
  },
] as const;

export const SPECIAL_CONDITIONS = [
  "Heavy pet hair or excessive fur buildup throughout the interior",
  "Severe staining, spills, or heavily neglected interior surfaces",
  "Mold, mildew, heavy smoke odors, or biohazard-related concerns",
  "Bodily fluids or waste requiring specialized cleaning procedures",
  "Work trucks or vehicles with heavy dirt, grease, or construction debris",
  "Excessive sand, mud, salt, or off-road contamination",
] as const;

export const ARCHITECTURAL_FILMS = [
  {
    id: "super-alloy",
    name: "Super Alloy",
    type: "Dual reflective solar film",
    blurb:
      "A dual reflective film for architectural glass that pairs heat control with clarity. The mirrored outer layer adds daytime privacy while the high-clarity inner layer keeps the view from inside.",
    specs: [
      { label: "Daytime privacy", value: "Mirrored outer layer" },
      { label: "UV rejection", value: "Up to 99%" },
      { label: "Total solar energy rejected", value: "Up to 87%" },
      { label: "Glare", value: "Reduced without killing daylight" },
    ],
  },
  {
    id: "solar-bronze",
    name: "Solar Bronze 20",
    type: "Decorative solar film",
    blurb:
      "A warm copper-finish architectural film that refreshes a building exterior while cutting solar heat gain and adding daytime privacy.",
    specs: [
      { label: "Finish", value: "Warm copper" },
      { label: "UV rejection", value: "Over 99%" },
      { label: "Heat", value: "Reduces solar heat gain" },
      { label: "Privacy", value: "Reflective during daylight" },
    ],
  },
  {
    id: "white-frost",
    name: "White Frost",
    type: "Decorative privacy film",
    blurb:
      "A frosted decorative film that diffuses natural light for privacy without blocking it, common on conference rooms, entries, and glass partitions.",
    specs: [
      { label: "Light transmission", value: "58%" },
      { label: "UV rejection", value: "99%" },
      { label: "Total solar energy rejected", value: "27%" },
      { label: "Use", value: "Privacy with daylight" },
    ],
  },
] as const;

/* ============================================================
   SERVICE CARDS
   ============================================================ */

export const SERVICES = [
  {
    id: "window-tinting",
    title: "Window Tinting",
    href: "/window-tinting/",
    photo: "tint-trans-am",
    from: 125,
    fromNote: "2 front windows",
    line: "Computer-cut LLumar film, installed in-house.",
    blurb:
      "Dyed or ceramic LLumar film for cars, trucks, and SUVs. Cuts glare, blocks UV, protects the interior, and makes summer driving bearable, backed by a nationwide lifetime film warranty.",
  },
  {
    id: "paint-protection-film",
    title: "Paint Protection Film",
    href: "/paint-protection-film/",
    photo: "ppf-corvette-c8-install",
    from: 1200,
    fromNote: "partial front",
    line: "Clear armor for the panels that take the hits.",
    blurb:
      "A clear, self-healing film over the bumper, hood, fenders, and mirrors, the areas rock chips find first. Ceramic-infused, and backed by a 10-year GeoShield manufacturer warranty.",
  },
  {
    id: "ceramic-coating",
    title: "Ceramic Coating",
    href: "/ceramic-coating/",
    photo: "coating-bentayga-front",
    from: 900,
    fromNote: "3-year System X Crystal",
    line: "System X, with the correction actually done first.",
    blurb:
      "Coatings lock in the paint exactly as it is, so every job starts with decontamination and machine polishing. Three tiers, 3 to 10 years of manufacturer-backed protection.",
  },
  {
    id: "paint-correction",
    title: "Paint Correction",
    href: "/paint-correction/",
    photo: "correction-yukon",
    from: 500,
    fromNote: "one-step polish",
    line: "Swirls out. Depth back in.",
    blurb:
      "Machine polishing that permanently refines the clear coat instead of hiding defects under filler. One, two, and three-step levels depending on what the paint needs.",
  },
  {
    id: "auto-detailing",
    title: "Auto Detailing",
    href: "/auto-detailing/",
    photo: "detail-interior-before",
    from: 200,
    fromNote: "exterior detail",
    line: "Real-world messes, handled properly.",
    blurb:
      "Interior extraction, exterior decontamination, and everything in between, dirt, spills, road salt, pet hair, and the buildup a car wash never touches.",
  },
  {
    id: "home-business",
    title: "Home & Business Film",
    href: "/residential-window-film/",
    photo: "commercial-hemlock",
    from: 0,
    fromNote: "quoted per project",
    line: "Solar control and privacy for glass that isn't on a car.",
    blurb:
      "Dual reflective, decorative, and privacy films for homes, offices, schools, and government buildings, heat rejection, glare control, and UV protection for interiors.",
  },
] as const;

/** Options offered in the quote form. */
export const SERVICE_OPTIONS = [
  { id: "window-tint", label: "Window Tint" },
  { id: "windshield-tint", label: "Windshield Tint" },
  { id: "ppf", label: "Paint Protection Film" },
  { id: "ceramic-coating", label: "Ceramic Coating" },
  { id: "paint-correction", label: "Paint Correction" },
  { id: "detailing", label: "Interior / Exterior Detailing" },
  { id: "home-business", label: "Home or Business Film" },
  { id: "not-sure", label: "Not sure yet, need advice" },
] as const;

/* ============================================================
   PROOF
   ============================================================ */

export const DIFFERENTIATORS = [
  {
    n: "01",
    title: "Owner-installed",
    body: "Justin has been doing this since 2017 and still does the work himself. You talk to the person holding the squeegee, not a service writer.",
  },
  {
    n: "02",
    title: "Prices published, not pried out",
    body: "Every service on this site lists what it starts at. You'll know the number before you call, and the final quote is confirmed before anything is scheduled.",
  },
  {
    n: "03",
    title: "No upsell theater",
    body: "If a service isn't a good fit for your vehicle or your goals, we say so. Additional work is never performed without your approval.",
  },
  {
    n: "04",
    title: "Controlled shop, not a driveway",
    body: "Tint, film, coatings, and correction all happen in a lit, temperature-controlled shop. That's why results are consistent, and why we don't do mobile.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    n: "01",
    title: "Tell us the vehicle",
    body: "Year, make, model, and what you want done. Call, text, or use the quote builder, it prices most tint jobs instantly.",
  },
  {
    n: "02",
    title: "Get a real number",
    body: "We confirm the exact price and how long the vehicle will be here before anything is booked. Coatings and correction start with an inspection.",
  },
  {
    n: "03",
    title: "Drop off or wait",
    body: "Front-window tint is usually under an hour and you can wait in the lobby. Longer jobs get a secure overnight key drop and rear parking.",
  },
  {
    n: "04",
    title: "Leave knowing the aftercare",
    body: "Cure times, wash guidance, and warranty registration get walked through at pickup, not emailed later and forgotten.",
  },
] as const;

export const WHAT_TO_EXPECT = [
  "Appointments are scheduled around your vehicle and the services selected.",
  "Select window tint services may be available same or next day, call for availability.",
  "Service time varies; some vehicles and services require an overnight stay.",
  "You're welcome to wait in our lobby for shorter services.",
  "Secure overnight key drop available, with parking behind the building.",
  "Clear communication before, during, and after your appointment.",
  "No high-pressure upsells, only services we genuinely recommend.",
] as const;

/**
 * Real customer reviews, transcribed verbatim from the Google Business
 * Profile on 2026-08-11 (typos and all). Nothing here is paraphrased.
 * `tags` route a review to the pages where it is relevant.
 */
export interface Review {
  name: string;
  meta: string;
  when: string;
  text: string;
  tags: string[];
  source: "Google";
}

export const REVIEWS: Review[] = [
  {
    name: "Jon Davis",
    meta: "Local Guide · 19 reviews",
    when: "3 months ago",
    text: "Take it from a guy who has had well over 100 vehicles between my wife and I tinted, Justin is second to none, his attention to detail and appreciation for quality is definitely recognized. I've used the same vendor for years, after noticing a decline in quality I decided to seek someone new and I'm glad I did!",
    tags: ["tint", "home"],
    source: "Google",
  },
  {
    name: "Brevity Jones",
    meta: "Local Guide · 148 reviews · 300 photos",
    when: "3 months ago",
    text: "We've used HD Automotive detailing to tint a couple of our vehicles. No bubbles, no fading, great lines, and great communication.",
    tags: ["tint", "home", "ceramic-tint"],
    source: "Google",
  },
  {
    name: "Brett Gutierrez",
    meta: "6 reviews",
    when: "5 months ago",
    text: "I've been coming to Justin for window tinting, ceramic coatings, paint protection film, and paint correction for years! This is a five star shop! Top notch customer care!",
    tags: ["home", "ppf", "coating", "correction"],
    source: "Google",
  },
  {
    name: "John Sparkman",
    meta: "Local Guide · 15 reviews",
    when: "a year ago",
    text: "I've had five of my vehicles ceramic coated by HD Automotive Detailing, and every experience has been exceptional. Their attention to detail is unmatched, each car comes out looking better than brand new. The ceramic coating finish is flawless and long-lasting, and they never cut corners. Their window tinting service is just as impressive. The quality of the tint, precision of the installation, and clean finish make a huge difference both in appearance and comfort.",
    tags: ["coating", "tint", "home"],
    source: "Google",
  },
  {
    name: "Arthur Skip Gorham",
    meta: "6 reviews",
    when: "2 years ago",
    text: "Justin did a 10-year Ceramic Coating on my new BMW X1, and I couldn't be happier. Scheduling and communications were exceptional and easy. Work was exquisite, and he even picked me up personally to retrieve my auto on the day of pickup. Justin really goes the extra mile. He's professional, fast, and courteous. He also does great work at very reasonable prices. I highly recommend.",
    tags: ["coating"],
    source: "Google",
  },
  {
    name: "Brendan Miller",
    meta: "2 reviews",
    when: "2 weeks ago",
    text: "I had Justin tint my new Ram windows, and he did an amazing job! Installing tint, especially on windshields, requires a lot of patience, so it's definitely not something to rush. Excellent customer service and very knowledgeable. I'm so happy with the results, and I'd definitely recommend him to anyone.",
    tags: ["tint", "ceramic-tint"],
    source: "Google",
  },
  {
    name: "Greg Creason",
    meta: "Local Guide · 7 reviews",
    when: "a month ago",
    text: "Justin has tinted the windows on several of our cars and they always look great and last as long as we keep the cars. Highly recommended.",
    tags: ["tint", "home"],
    source: "Google",
  },
  {
    name: "Bruce Bird",
    meta: "Local Guide · 110 reviews · 38 photos",
    when: "4 months ago",
    text: "Had my car windows tinted. This company was outstanding. Owner came in on a Saturday to do the job. Owner is great to work with. Very nice and knowledgeable. Pricing was wonderful. Car looks great. Will definitely be back for additional work.",
    tags: ["tint", "home"],
    source: "Google",
  },
  {
    name: "Jakey A",
    meta: "10 reviews",
    when: "3 months ago",
    text: "Called the store and talked to Justin and he was able to get my car in the next day and even came in early to accommodate me. Phenomenal service and great prices, will definitely be recommending to friends and family!",
    tags: ["tint", "home"],
    source: "Google",
  },
  {
    name: "Marc Marroquin",
    meta: "Local Guide · 30 reviews · 9 photos",
    when: "5 months ago",
    text: "I had a very unfortunate incident inside my car that led to a major overhaul of the interior (new back seat, new carpet, and more). Justin did a fantastic job working with me and bringing the car back to the 'pre-incident' state. He was very communicative, worked with my insurance, and was helpful throughout the whole process. I would recommend HD wholeheartedly for any interior work!",
    tags: ["detailing"],
    source: "Google",
  },
  {
    name: "James Jordan",
    meta: "Google review",
    when: "2 years ago",
    text: "I had my vehicle detailed and had tinting done as well as the ceramic coating very prompt and professional I highly recommend",
    tags: ["detailing", "coating"],
    source: "Google",
  },
];

export function reviewsFor(tag: string, limit = 3): Review[] {
  return REVIEWS.filter((r) => r.tags.includes(tag)).slice(0, limit);
}

/**
 * Verified from the Google Business Profile on 2026-08-11: 105 total
 * reviews, 103 of them five-star, displayed as 5.0.
 *
 * Displayed on-page only. Deliberately NOT emitted as aggregateRating
 * schema: Google treats self-serving ratings on LocalBusiness markup as
 * ineligible for star results, so marking it up buys nothing and risks
 * a structured-data policy problem.
 */
export const RATING = {
  value: 5.0,
  count: 105,
  fiveStar: 103,
  asOf: "August 2026",
  facebook: { recommendPct: 98, count: 41 },
} as const;

/* ============================================================
   SERVICE AREA
   ============================================================ */

/**
 * Distances and drive times are measured road distances from each city
 * centre to 10170 Industrial Drive (OSRM routing, free-flow traffic,
 * 2026-08-11), not estimates. Round them down in copy, never up.
 *
 * Howell (19.6 mi) and Novi (23.7 mi) are deliberately absent: they fall
 * outside the 13-15 mile radius Justin specified, and a city page for a
 * town we can't reasonably claim is exactly the thin-page pattern Google
 * treats as doorway abuse.
 */
export interface City {
  slug: string;
  name: string;
  county: string;
  miles: number;
  minutes: number;
  route: string;
  /** why this city's drivers specifically end up here */
  angle: string;
  /** second paragraph, service mix that actually fits the area */
  detail: string;
  faq: { q: string; a: string };
  photo: string;
  reviewTag: string;
}

export const CITIES: City[] = [
  {
    slug: "ann-arbor",
    name: "Ann Arbor",
    county: "Washtenaw County",
    miles: 13.6,
    minutes: 20,
    route: "US-23 north to exit 49, then west on Nine Mile to Industrial Drive",
    angle:
      "Ann Arbor has plenty of places that will sell you window film. Very few will show you the price before you call, and fewer still install every job indoors in a controlled bay. That's the drive worth twenty minutes up US-23.",
    detail:
      "A lot of Ann Arbor cars live outside, permit lots, structures with open decks, and street parking that faces west all afternoon. That's the case for ceramic film rather than dyed: LLumar CTX rejects up to 58% of total solar energy instead of ATC's 44%, which is the difference you feel getting into a car that sat out all day on Thompson Street.",
    faq: {
      q: "Do you get a lot of Ann Arbor customers?",
      a: "Enough that the drive is well worn. We're 13.6 miles from downtown, about 20 minutes up US-23 with no traffic. Front-window tint takes under an hour, so most Ann Arbor customers wait in the lobby rather than arranging a ride home.",
    },
    photo: "tint-mustang-dark",
    reviewTag: "tint",
  },
  {
    slug: "brighton",
    name: "Brighton",
    county: "Livingston County",
    miles: 7.6,
    minutes: 14,
    route: "US-23 south from Grand River Avenue, exit at Nine Mile Road",
    angle:
      "Brighton is the closest real town to the shop, 7.6 miles, about 14 minutes down US-23. Close enough that dropping a vehicle off in the morning and picking it up the same afternoon is normal, not a favor.",
    detail:
      "Brighton runs on trucks and SUVs, and that's where the pricing math gets friendly: a four-door pickup is the cheapest full-vehicle tint on our board at $275 dyed, because there's less glass than a sedan. Ceramic coating and paint protection film are the other two reasons Brighton drivers make the trip, both need an indoor bay and an overnight cure, which nobody's driveway provides in a Michigan winter.",
    faq: {
      q: "How far is HD Auto Studio from Brighton?",
      a: "7.6 miles, about 14 minutes down US-23. We're at 10170 Industrial Drive in Whitmore Lake, just off Main Street, with parking and a secure key drop behind the building for after-hours drop-off.",
    },
    photo: "tint-ram-2500",
    reviewTag: "tint",
  },
  {
    slug: "south-lyon",
    name: "South Lyon",
    county: "Oakland County",
    miles: 10.5,
    minutes: 19,
    route: "Ten Mile Road west, then north on Whitmore Lake Road",
    angle:
      "South Lyon sits between two options: drive east into the Novi corridor and pay corridor prices, or drive 10.5 miles west and get published pricing from the person actually doing the work. Same films, shorter list of people touching your car.",
    detail:
      "Most South Lyon vehicles come in for tint, and a good share come back later for a coating on a new purchase. Because we're a shop and not a mobile setup, correction and coating work gets the lighting and the overnight cure it needs, the two things that decide whether a coating looks right in year three.",
    faq: {
      q: "Is it worth driving from South Lyon instead of going toward Novi?",
      a: "It's 10.5 miles and about 19 minutes. What you get for it is a published price sheet, film brands named on the page, and a shop that isn't stacking six cars a day. If the Novi shops quote you a number, bring it, we'll tell you honestly whether ours is different.",
    },
    photo: "tint-camaro-blue",
    reviewTag: "tint",
  },
  {
    slug: "pinckney",
    name: "Pinckney",
    county: "Livingston County",
    miles: 9.0,
    minutes: 16,
    route: "M-36 east through Hamburg to Whitmore Lake",
    angle:
      "Pinckney and the chain-of-lakes area is nine miles west on M-36, about 16 minutes. Lake country means vehicles that live in the sun, tow in the summer, and sit in road salt from December through March.",
    detail:
      "That combination is exactly what ceramic film and coatings are for. Tow rigs usually go dark on the back half, and the heat rejection is where CTX earns its premium. Salt is the other half: a coating makes winter washing far less of a fight, and an exterior detail in April undoes most of what the season did.",
    faq: {
      q: "Do you tint trucks and SUVs used for towing?",
      a: "Regularly. Trailer mirrors and factory privacy glass don't change the pricing. A four-door pickup starts at $275 dyed and $400 ceramic, and dark shades on the back half are the most common build on a tow rig.",
    },
    photo: "tint-silverado-blue",
    reviewTag: "tint",
  },
  {
    slug: "hamburg",
    name: "Hamburg",
    county: "Livingston County",
    miles: 3.1,
    minutes: 7,
    route: "M-36 east to Whitmore Lake Road",
    angle:
      "Hamburg is 3.1 miles away. Seven minutes. If you're in Hamburg Township you're closer to this shop than most people are to their own dentist, and same-day front-window tint is genuinely realistic when the schedule allows.",
    detail:
      "Being this close changes what's practical. You can drop a car for an interior detail and walk back for it. You can bring a vehicle in for a coating inspection without setting aside an afternoon. And for the annual System X inspection that keeps a coating warranty valid, being seven minutes out means it actually gets done.",
    faq: {
      q: "Can I get same-day tint in Hamburg?",
      a: "Often, yes, front-window work is usually under an hour, and we can sometimes fit it in same or next day depending on the vehicle and film. Call or text (734) 408-1389 and we'll tell you what's actually open rather than what the online calendar shows.",
    },
    photo: "tint-explorer",
    reviewTag: "tint",
  },
  {
    slug: "dexter",
    name: "Dexter",
    county: "Washtenaw County",
    miles: 11.8,
    minutes: 19,
    route: "North Territorial Road east to US-23 north",
    angle:
      "Dexter is 11.8 miles southwest, about 19 minutes on North Territorial. Most of what comes from Dexter isn't tint; it's paint. Correction, coatings, and film on vehicles people intend to keep.",
    detail:
      "That work can't be done well outdoors. Paint correction needs controlled lighting to even see the defects you're removing, and a ceramic coating needs a dry, temperature-stable overnight cure to bond properly. We run every correction and coating job in the shop, on our schedule, one vehicle at a time, which is why coatings here start with an inspection rather than a price over the phone.",
    faq: {
      q: "Do I need paint correction before a ceramic coating?",
      a: "At least one stage, and it's included in every coating we sell. A coating preserves paint exactly as it is on the day it's applied, swirls and all, so skipping the polish locks in the defects for the life of the coating.",
    },
    photo: "coating-audi-q8",
    reviewTag: "coating",
  },
  {
    slug: "whitmore-lake",
    name: "Whitmore Lake",
    county: "Northfield Township, Washtenaw County",
    miles: 4.8,
    minutes: 10,
    route: "you're already here, Main Street to Industrial Drive",
    angle:
      "This is home. The shop has been at 10170 Industrial Drive since long before anyone was searching for it, and most of the work that comes through the door is a neighbor, or a neighbor's referral, or the same customer with their next vehicle.",
    detail:
      "Local means a few practical things: we can look at a vehicle before quoting it, you can stop in during shop hours without an appointment just to ask, and the annual coating inspections that keep a warranty valid are a ten-minute errand instead of a project.",
    faq: {
      q: "Can I stop by without an appointment?",
      a: "To ask questions or have something looked at, absolutely, we're in Monday through Friday, 8 to 5. Actual work is by appointment so every vehicle gets the time it needs, and weekends are available by arrangement.",
    },
    photo: "shop-front",
    reviewTag: "home",
  },
];

/* ============================================================
   FAQ, verbatim from the shop's published answers
   ============================================================ */

export const FAQ_GENERAL = [
  {
    q: "Where are you located?",
    a: "Our shop is at 10170 Industrial Drive, Whitmore Lake, MI 48189, a short drive from Brighton, Hamburg, Pinckney, Ann Arbor, and the rest of Livingston and Washtenaw County.",
  },
  {
    q: "Do you require appointments?",
    a: "Yes. All services are performed by appointment so each vehicle gets the time and attention it needs. Window tint can often be scheduled sooner than longer services.",
  },
  {
    q: "Do you offer same-day service?",
    a: "Some window tint services may be available same or next day depending on the vehicle and film selection. Detailing, paint correction, and ceramic coating usually require more time and may involve an overnight stay.",
  },
  {
    q: "Can I wait while my vehicle is being worked on?",
    a: "For shorter services, you're welcome to wait in our lobby. Longer services may require leaving the vehicle with us for the day or overnight.",
  },
  {
    q: "Can I drop off outside of business hours?",
    a: "Yes. We offer secure after-hours drop-off and pickup. Overnight drop-offs go in the rear parking area with a secure key drop box on the side of the building, and we'll provide a code for after-hours pickup.",
  },
  {
    q: "What brands or products do you use?",
    a: "LLumar window film for automotive tint, System X for ceramic coatings, GeoShield CeramicShield for paint protection film, and professional-grade detailing and correction products with proven results.",
  },
  {
    q: "Do you offer mobile detailing?",
    a: "Most services are performed at our Whitmore Lake shop so we can control lighting, temperature, and results, especially for paint correction, ceramic coatings, window tint, and PPF. Limited mobile service may be available for select situations; ask and we'll tell you straight.",
  },
  {
    q: "How much do your services cost?",
    a: "Every service page on this site lists real starting prices. Final pricing depends on vehicle size and condition, things like excessive pet hair, heavy staining, or neglect affect it. We confirm the exact number before anything is scheduled.",
  },
] as const;

export const FAQ_TINT = [
  {
    q: "How long does window tint take?",
    a: "Front door windows are typically completed in under an hour. Full windshield tint usually takes about 1.5-2 hours depending on the vehicle. Full vehicles take between 2-5 hours depending on vehicle type and which windows are being tinted.",
  },
  {
    q: "What's the difference between dyed and ceramic window tint?",
    a: "Dyed film gives a clean, factory-style look with UV protection at the lowest cost. Ceramic film adds significantly more heat rejection and comfort while keeping visibility clear. If your car bakes in the sun or you commute west in the evening, ceramic is worth it.",
  },
  {
    q: "Will window tint interfere with electronics or signals?",
    a: "No. The films we use are designed not to interfere with electronics, GPS, or mobile signals.",
  },
  {
    q: "How long until I can roll my windows down?",
    a: "48 to 72 hours after the tint is applied is our typical recommendation, depending on the weather.",
  },
  {
    q: "How long does window tint take to cure?",
    a: "Curing time varies with weather, but most films fully cure within a few days. Some haze or small water pockets during that window are normal. We go over care instructions at pickup.",
  },
  {
    q: "What type of warranty do you offer?",
    a: "Every tint job comes with our satisfaction guarantee plus a nationwide LLumar warranty honored at any LLumar dealer. It covers fading, discoloration, cracking, peeling, bubbling, and other manufacturing defects. It does not cover accidental damage.",
  },
  {
    q: "How do I know which option is right for my vehicle?",
    a: "We'll walk through the options based on your vehicle, how you drive it, and your budget before anything is scheduled. No pressure.",
  },
] as const;

export const QUOTE = {
  eyebrow: "Quote builder",
  header: "Build your quote",
  sub: "Four short steps. Most tint jobs price instantly.",
  steps: {
    vehicle: {
      header: "What are we working on?",
      helper:
        "Pick your vehicle and we'll price tint instantly from our published rates.",
    },
    services: {
      header: "What are you after?",
      helper: "Choose everything you're considering, we'll sort out the details.",
    },
    contact: {
      header: "Where do we send it?",
      helper: "Justin answers texts. A phone number gets you the fastest response.",
    },
    review: {
      header: "Look it over",
      helper: "Confirm the details and we'll be in touch shortly.",
    },
  },
  submit: "Send my request",
  error:
    "That didn't send. Please try again, or call or text us and we'll take care of it.",
  trustMicro:
    "No spam and no mailing lists. Your details are used to quote your vehicle and nothing else.",
  smsConsent: {
    // A2P-compliant consent language, mirrored from the Midwest Tint build.
    marketing:
      "I agree to receive marketing text messages from HD Auto Studio at the phone number provided. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.",
    nonMarketing:
      "I agree to receive non-marketing text messages from HD Auto Studio about my appointment, quote, or service updates. Message and data rates may apply. Reply STOP to opt out or HELP for help.",
  },
} as const;

/* ============================================================
   SEO
   ============================================================ */

export const SEO = {
  home: {
    title:
      "Window Tint, PPF & Ceramic Coating in Whitmore Lake, MI | HD Auto Studio",
    description:
      "LLumar window tint from $125, GeoShield paint protection film, and System X ceramic coatings, installed in-house in Whitmore Lake, MI. Serving Ann Arbor, Brighton, South Lyon & Pinckney since 2017.",
  },
  windowTinting: {
    title: "Window Tinting in Whitmore Lake, MI | LLumar Film from $125",
    description:
      "Professional LLumar window tinting in Whitmore Lake, Michigan. Dyed film from $125, ceramic from $175, full vehicles priced by body type. Lifetime film warranty. Serving Ann Arbor & Brighton.",
  },
  ceramicTint: {
    title: "Ceramic Window Tint in Whitmore Lake, MI | LLumar CTX from $175",
    description:
      "LLumar CTX ceramic window tint installed in Whitmore Lake, MI. Maximum heat rejection, clear visibility, no signal interference. Published pricing by vehicle type.",
  },
  windshieldTint: {
    title: "Windshield Tint in Whitmore Lake, MI | From $150 | HD Auto Studio",
    description:
      "Full windshield tint in dyed or ceramic film, installed in Whitmore Lake, MI. Cuts glare and cabin heat. Typically 1.5-2 hours. From $150 dyed, $225 ceramic.",
  },
  ppf: {
    title: "Paint Protection Film in Whitmore Lake, MI | PPF from $1,200",
    description:
      "GeoShield CeramicShield paint protection film installed in Whitmore Lake, Michigan. Partial front from $1,200, full front from $2,200, full vehicle from $4,900. 10-year manufacturer warranty.",
  },
  coating: {
    title: "Ceramic Coating in Whitmore Lake, MI | System X from $900",
    description:
      "System X ceramic coatings in Whitmore Lake, MI, 3, 6, and 10-year options from $900. Every coating includes decontamination and machine polishing. Serving Ann Arbor, Brighton & Howell.",
  },
  correction: {
    title: "Paint Correction in Whitmore Lake, MI | From $500 | HD Auto Studio",
    description:
      "One, two, and three-step paint correction in Whitmore Lake, Michigan. Remove swirls, oxidation, and water spots for real gloss and clarity. Nearly 10 years of hands-on experience.",
  },
  detailing: {
    title: "Auto Detailing in Whitmore Lake, MI | Interior & Exterior from $200",
    description:
      "Interior and exterior auto detailing in Whitmore Lake, MI. Extraction, decontamination, and ceramic sealant. Published starting prices by vehicle size. Serving Ann Arbor and Brighton.",
  },
  homeBusiness: {
    title: "Home & Business Window Tinting | Whitmore Lake & Ann Arbor, MI",
    description:
      "Residential and commercial window film in Whitmore Lake, MI. Dual reflective, decorative, and privacy films that cut heat, glare, and UV for homes, offices, schools, and government buildings.",
  },
  pricing: {
    title: "Pricing | Window Tint, PPF, Ceramic Coating & Detailing Costs",
    description:
      "Real published prices for window tint, paint protection film, ceramic coatings, paint correction, and detailing at HD Auto Studio in Whitmore Lake, MI.",
  },
  gallery: {
    title: "Our Work | Window Tint, PPF & Ceramic Coating Gallery",
    description:
      "Vehicles finished at HD Auto Studio in Whitmore Lake, Michigan, window tint, paint protection film, ceramic coatings, and paint correction on daily drivers, trucks, classics, and exotics.",
  },
  about: {
    title: "About HD Auto Studio | Whitmore Lake, MI Since 2017",
    description:
      "Justin Warwick has run HD Auto Studio in Whitmore Lake since 2017. Not a volume shop, not a franchise, proper prep, honest recommendations, and clear expectations.",
  },
  contact: {
    title: "Contact HD Auto Studio | Whitmore Lake, MI | (734) 408-1389",
    description:
      "Call or text (734) 408-1389, or send your vehicle details for a quote. HD Auto Studio, 10170 Industrial Drive, Whitmore Lake, MI 48189. Mon-Fri 8-5.",
  },
  faq: {
    title: "FAQ | Window Tint, Ceramic Coating & Detailing Questions",
    description:
      "Answers about window tint, ceramic coatings, paint protection film, and detailing at HD Auto Studio in Whitmore Lake, MI, timing, pricing, warranties, drop-off, and aftercare.",
  },
  quote: {
    title: "Get a Quote, Tint, PPF, Coating & Detailing Pricing",
    description:
      "Build a quote for window tint, PPF, ceramic coating, correction, or detailing. Most tint jobs price instantly from our published rates.",
  },
} as const;
