/**
 * LANDING TRACKS
 *
 * One record per paid service. Every service hub page and every
 * service-by-town page (/{service}/{town}/) is composed from the record
 * below plus the measured town facts in CITIES, so ninety six pages read
 * from six sources of truth instead of ninety six hand written files.
 *
 * RULES FOR EVERY STRING IN THIS FILE
 *   1. Nothing here may say what constants.ts does not back. No price, no
 *      warranty term for film or tint, no film brand for tint, no racing
 *      family, no "allowed" wording (Judson asked for it to go), nothing in
 *      FORBIDDEN_CLAIMS. scripts/audit-forbidden.mjs runs on the built HTML.
 *   2. Plain sentences, short. No em or en dashes anywhere.
 *   3. The theme Judson chose is "protect your investment". Use it where it
 *      is true. Do not repeat it in every heading.
 *   4. A town page must differ from its siblings in substance. Anything
 *      that takes a City gets the measured miles, minutes, route and county
 *      to work with, and src/lib/cityProfiles.ts adds one honest sentence of
 *      geography per town. Never invent a landmark, a neighbourhood or a
 *      weather claim.
 */

import type { City } from "./constants";
import type { PhotoId } from "./photos";

export type TrackId =
  | "ceramic-coating"
  | "paint-protection-film"
  | "paint-correction"
  | "paintless-dent-repair"
  | "auto-detailing"
  | "window-tinting";

export interface LandingCheck {
  title: string;
  body: string;
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface ProofRow {
  k: string;
  v: string;
}

export interface LandingTrack {
  /** Same id as the SERVICES entry it sells. */
  id: TrackId;
  /** The URL segment, no slashes. Matches SERVICES[id].href. */
  slug: string;
  /** Short noun for headings and links: "Ceramic coating". */
  noun: string;
  /** The line under the wordmark in the hero, mono caps. */
  eyebrow: string;
  /** Must be in BLEED_CLEARED (src/components/ui/Plate.tsx). */
  heroPhoto: PhotoId;
  /** object-position for the hero crop, "x% y%". */
  heroFocus: string;
  /** Second real photo for the proof band, or null for text only. */
  proofPhoto: PhotoId | null;

  /** The hub page, /{slug}/ */
  hub: {
    /** Under 9 words. One emphasised word wrapped in *asterisks* renders cyan. */
    h1: string;
    lead: string;
    /** <title>, without the site name. Under 60 characters. */
    title: string;
    /** meta description, 120 to 160 characters. */
    description: string;
  };

  /** The town pages, /{slug}/{town}/ */
  town: {
    h1: (c: City) => string;
    /** One or two sentences that open the page. The drive sentence is
        appended by the template, so do not repeat miles or minutes. */
    lead: (c: City) => string;
    title: (c: City) => string;
    description: (c: City) => string;
  };

  /** "What you get". Four to six rows. */
  checksHeading: string;
  checks: LandingCheck[];

  /** The proof band: facts that trace to constants.ts, and one review. */
  proofHeading: string;
  proofIntro: string;
  proofRows: ProofRow[];
  /** Name of the REVIEWS entry to quote, or null to quote none. */
  reviewName: string | null;

  /** Three to five questions. Answers under 60 words. */
  faqs: LandingFaq[];
  /** Optional town specific question appended on town pages. */
  townFaq?: (c: City) => LandingFaq;

  /** SERVICES[id].quoteKey, for the form and the quote links. */
  quoteKey: string;
  /** The primary button. */
  ctaLabel: string;
  /** Other tracks to cross link, in order. Two or three. */
  related: TrackId[];
}

/* ------------------------------------------------------------------ */
/* The six tracks                                                      */
/* ------------------------------------------------------------------ */

const CERAMIC: LandingTrack = {
  id: "ceramic-coating",
  slug: "ceramic-coating",
  noun: "Ceramic coating",
  eyebrow: "Ceramic coating · Gtechniq Accredited",
  heroPhoto: "coating-corvette-c8",
  heroFocus: "50% 54%",
  proofPhoto: "coating-huracan",
  hub: {
    h1: "Protect your investment for up to *nine* years.",
    lead: "Three Gtechniq coatings, three, five and nine year guarantees, applied by an accredited detailer in Randleman. Free quotes for your vehicle, fast and with no pressure.",
    title: "Ceramic Coating in Randleman, NC",
    description:
      "Ceramic coating in Randleman, North Carolina by a Gtechniq Accredited Detailer. Three coatings with 3, 5 and 9 year guarantees. Free quotes for your vehicle.",
  },
  town: {
    h1: (c) => `Ceramic coating for ${c.name} drivers.`,
    lead: (c) =>
      `Gtechniq coatings with three, five and nine year guarantees, applied in our Randleman shop for ${c.name} owners who want the paint protected and easy to keep clean.`,
    title: (c) => `Ceramic Coating for ${c.name}, NC`,
    description: (c) =>
      `Ceramic coating for ${c.name}, NC drivers by a Gtechniq Accredited Detailer in Randleman. Three coatings, 3 to 9 year guarantees, and free quotes.`,
  },
  checksHeading: "What a coating job includes.",
  checks: [
    {
      title: "Wash and decontamination",
      body: "Iron, tar and bonded grit come off before anything goes on, so the coating bonds to paint and not to dirt.",
    },
    {
      title: "Paint prepared to the tier",
      body: "A one step enhancement polish on the three and five year coatings. A full paint correction on the nine year coating.",
    },
    {
      title: "Gtechniq chemistry",
      body: "C1 Crystal Lacquer under EXOv5 on the five year coating. Crystal Serum Ultra under EXOv5 on the nine year coating.",
    },
    {
      title: "A guarantee issued by Gtechniq",
      body: "Registered within 30 days, inspected once a year, and backed by the manufacturer rather than by us.",
    },
    {
      title: "Add ons on request",
      body: "Wheels, glass, plastic trim and interior surfaces can be coated at the same visit.",
    },
  ],
  proofHeading: "Why the nine year coating matters.",
  proofIntro:
    "Crystal Serum Ultra is professional application only. Gtechniq lists the shops it has accredited to apply it, and Petty Shine is on that list at this address.",
  proofRows: [
    { k: "Accreditation", v: "Gtechniq Accredited Detailer" },
    { k: "Nine year base coat", v: "Gtechniq Crystal Serum Ultra" },
    { k: "Top coat", v: "Gtechniq EXOv5" },
    { k: "Guarantee", v: "3, 5 or 9 years, issued by Gtechniq" },
  ],
  reviewName: "Landon Brown",
  faqs: [
    {
      q: "How long does a ceramic coating take?",
      a: "Usually two to four days, most of it paint preparation. The nine year coating starts with a full correction, which is the longest part of the job.",
    },
    {
      q: "Which coating should I pick?",
      a: "Three year for real protection on a shorter commitment. Five year for long term ownership and cars that live outside. Nine year for new vehicles, show cars and maximum gloss.",
    },
    {
      q: "Does a coating stop rock chips?",
      a: "No. A coating resists chemicals, UV and light swirls and makes washing easier. Paint protection film is what takes impacts.",
    },
    {
      q: "What does the guarantee require?",
      a: "Register it within 30 days and bring the car back for an annual inspection. It stays with you, not the car, and it is issued by Gtechniq.",
    },
  ],
  townFaq: (c) => ({
    q: `Do I need to leave the car in Randleman?`,
    a: `Yes, coating work is done in the shop. ${c.name} is about ${c.minutes} minutes away on ${c.route}, and we will tell you the pickup day when we quote the job.`,
  }),
  quoteKey: "ceramic",
  ctaLabel: "Get a Free Quote",
  related: ["paint-protection-film", "paint-correction", "auto-detailing"],
};

const PPF: LandingTrack = {
  id: "paint-protection-film",
  slug: "paint-protection-film",
  noun: "Paint protection film",
  eyebrow: "Paint protection film · Authorized STEK Installer",
  heroPhoto: "coating-g-wagon",
  heroFocus: "50% 46%",
  proofPhoto: "ppf-install-closeup",
  hub: {
    h1: "Protect your investment where the *road* hits first.",
    lead: "Clear STEK film over the panels that take the damage, installed in Randleman by an Authorized STEK Installer. Four coverage levels. Free quotes for your vehicle, fast.",
    title: "Paint Protection Film in Randleman, NC",
    description:
      "Paint protection film in Randleman, North Carolina from an Authorized STEK Installer. Four coverage levels, drawn panel by panel. Free quotes for your vehicle.",
  },
  town: {
    h1: (c) => `Paint protection film for ${c.name} drivers.`,
    lead: (c) =>
      `Clear STEK film over the panels that take rock chips and road grit, installed in our Randleman shop for ${c.name} owners who want the factory paint kept under it.`,
    title: (c) => `Paint Protection Film for ${c.name}, NC`,
    description: (c) =>
      `Paint protection film for ${c.name}, NC drivers, installed by an Authorized STEK Installer in Randleman. Four coverage levels, and free quotes.`,
  },
  checksHeading: "The four coverage levels.",
  checks: [
    {
      title: "Partial front end",
      body: "Front bumper, hood and mirrors. The three panels that get hit first.",
    },
    {
      title: "Full front end",
      body: "Adds the front fenders. The most common job in the shop, with no film line down the middle of the hood.",
    },
    {
      title: "Full front end with trackback",
      body: "Adds the rockers, lower doors and rear impact areas. For highway miles and anything low enough to pick up road spray.",
    },
    {
      title: "Full vehicle",
      body: "Every painted panel. For long term ownership and cars you intend to keep.",
    },
    {
      title: "STEK DYNOshield",
      body: "Glossy 8 mil film, hydrophobic and stain resistant, self healing on light scratches with heat or hot water.",
    },
    {
      title: "Film and terms confirmed first",
      body: "Which STEK film goes on your vehicle and what backs it is confirmed with you before any work starts.",
    },
  ],
  proofHeading: "Why an authorized installer matters.",
  proofIntro:
    "STEK publishes its own installer directory, and Petty Shine is listed there at this address. Film is a sacrificial layer. It takes the chip so the paint does not, and film that has taken a hit is film doing its job.",
  proofRows: [
    { k: "Credential", v: "Authorized STEK Installer" },
    { k: "Film", v: "STEK DYNOshield, glossy" },
    { k: "Thickness", v: "8 mils" },
    { k: "Coverage", v: "Four levels, from three panels to every panel" },
  ],
  reviewName: "Scott Fischer",
  faqs: [
    {
      q: "Does film stop rock chips?",
      a: "It takes them. Film is a layer thick enough to absorb an impact, so the chip lands in the film instead of the paint. Film that has taken enough hits gets replaced, and the paint under it stays original.",
    },
    {
      q: "Which coverage level do I need?",
      a: "Full front end is the most common job. Add trackback if you drive a lot of highway miles or the car sits low. Full vehicle is for cars you plan to keep for years.",
    },
    {
      q: "Does the film self heal?",
      a: "Light scratches and swirls do, with heat or hot water. STEK's own FAQ says a scratch that goes through the topcoat will not.",
    },
    {
      q: "What is the warranty?",
      a: "STEK backs its film. The exact term for the film on your vehicle is confirmed with your quote, because we do not publish a term we have not verified for your car.",
    },
  ],
  townFaq: (c) => ({
    q: `How long is the car in Randleman?`,
    a: `It depends on the coverage level. We give you the drop off and pickup days with the quote. ${c.name} is about ${c.minutes} minutes from the shop on ${c.route}.`,
  }),
  quoteKey: "ppf",
  ctaLabel: "Get a Free Quote",
  related: ["ceramic-coating", "paint-correction", "window-tinting"],
};

const CORRECTION: LandingTrack = {
  id: "paint-correction",
  slug: "paint-correction",
  noun: "Paint correction",
  eyebrow: "Paint correction · Machine polishing",
  heroPhoto: "detail-f250-black",
  heroFocus: "56% 50%",
  proofPhoto: "correction-reflection",
  hub: {
    h1: "Swirls and scratches, cut out for *good*.",
    lead: "Machine polishing that levels swirls, scratches, water spots and oxidation out of the clear coat instead of hiding them. Two levels, quoted on the paint in front of us. Free quotes, fast.",
    title: "Paint Correction in Randleman, NC",
    description:
      "Paint correction and machine buffing in Randleman, North Carolina. Two levels. Swirls, scratches, water spots and oxidation cut out of the clear coat for good.",
  },
  town: {
    h1: (c) => `Paint correction for ${c.name} drivers.`,
    lead: (c) =>
      `Swirls, scratches and water spots polished out of the clear coat in our Randleman shop, for ${c.name} owners who want the gloss back before they protect it.`,
    title: (c) => `Paint Correction for ${c.name}, NC`,
    description: (c) =>
      `Paint correction for ${c.name}, NC drivers. Swirls, scratches and oxidation polished out of the clear coat in Randleman. Two levels, and free quotes.`,
  },
  checksHeading: "What a correction includes.",
  checks: [
    {
      title: "Wash and decontamination first",
      body: "Iron, tar and bonded grit come off before a pad ever touches the paint.",
    },
    {
      title: "Level 2, paint enhancement",
      body: "One polishing stage. The gloss comes up and the light defects go, which is what most daily driven paint needs.",
    },
    {
      title: "Level 3, full correction",
      body: "More than one stage. The defect is removed rather than filled or hidden.",
    },
    {
      title: "The least cut that does the job",
      body: "Every pass takes a little clear coat, so we cut only what the damage needs and stop early on thin or resprayed panels.",
    },
    {
      title: "Protect it after",
      body: "The nine year Gtechniq coating starts with this correction. Corrected paint left bare picks up the next round of swirls.",
    },
  ],
  proofHeading: "The test is the edge of a reflection.",
  proofIntro:
    "Swirled paint scatters light and softens every reflection. Corrected paint holds the edge hard. Try it on your own car in direct sun before you call anyone, including us.",
  proofRows: [
    { k: "Level 2", v: "One stage, light to moderate defects" },
    { k: "Level 3", v: "Multi stage, medium to heavy defects" },
    { k: "Will not fix", v: "Scratches through the clear coat, dents, chips" },
    { k: "Pairs with", v: "The nine year Gtechniq coating" },
  ],
  reviewName: "Bill Murphy",
  faqs: [
    {
      q: "Is buffing the same as paint correction?",
      a: "Yes. Buffing, polishing and correction all mean machine polishing the clear coat. The two levels differ in how many stages it takes and how much of the defect comes out.",
    },
    {
      q: "Will it remove a deep scratch?",
      a: "Not one that catches a fingernail. That scratch has gone through the clear coat, and polishing will not bring it back. That panel needs paint.",
    },
    {
      q: "Does correction stop swirls coming back?",
      a: "No. It fixes what is on the car today. A coating and a proper wash routine are what keep the next round off.",
    },
    {
      q: "How do I know which level I need?",
      a: "Send photos taken in direct sun with the year, make and model. We will say which level the paint needs and get back to you fast with a free quote.",
    },
  ],
  townFaq: (c) => ({
    q: `Do you take cars from ${c.name}?`,
    a: `Yes. Correction is done in the Randleman shop, about ${c.minutes} minutes from ${c.name} on ${c.route}, and the car stays with us until the polish is finished.`,
  }),
  quoteKey: "correction",
  ctaLabel: "Get a Free Quote",
  related: ["ceramic-coating", "auto-detailing", "paintless-dent-repair"],
};

const PDR: LandingTrack = {
  id: "paintless-dent-repair",
  slug: "paintless-dent-repair",
  noun: "Paintless dent repair",
  eyebrow: "Paintless dent repair · Factory paint stays on",
  heroPhoto: "detail-mustang-red",
  heroFocus: "58% 52%",
  proofPhoto: null,
  hub: {
    h1: "The dent comes out. The *paint* stays on.",
    lead: "Door dings, hail and parking lot dents worked out from behind the panel in Randleman. Nothing filled, sanded or resprayed. Free quotes from a photo, before the car is here.",
    title: "Paintless Dent Repair in Randleman, NC",
    description:
      "Paintless dent repair in Randleman, North Carolina. Door dings, hail damage and parking lot dents worked out from behind the panel, factory paint left alone.",
  },
  town: {
    h1: (c) => `Paintless dent repair for ${c.name} drivers.`,
    lead: (c) =>
      `Door dings, hail and parking lot dents worked out from behind the panel in our Randleman shop, with the factory paint left on the car, for ${c.name} owners.`,
    title: (c) => `Paintless Dent Repair for ${c.name}, NC`,
    description: (c) =>
      `Paintless dent repair for ${c.name}, NC drivers. Door dings, hail and parking lot dents worked out from behind the panel in Randleman. Factory paint kept.`,
  },
  checksHeading: "What comes out, and what does not.",
  checks: [
    {
      title: "Door dings",
      body: "The dimple left by the car parked too close, usually along the middle of a door.",
    },
    {
      title: "Hail damage",
      body: "A hood or roof full of small round dents with the paint still whole.",
    },
    {
      title: "Parking lot dents",
      body: "Cart hits and knee height dents in a door or a quarter panel.",
    },
    {
      title: "Factory paint stays on",
      body: "The metal is worked back from behind the panel. Nothing is filled, sanded or resprayed.",
    },
    {
      title: "Honest limits",
      body: "Cracked paint, a sharp crease, no access behind the panel, or filler under the paint means a different repair, and we say so first.",
    },
  ],
  proofHeading: "A dent shows up in the reflection.",
  proofIntro:
    "Straight lines give a dent away. Photograph the panel at an angle with a door frame or a light bar reflected across it, and that one photo tells us more than a paragraph.",
  proofRows: [
    { k: "Suits", v: "Door dings, hail, parking lot dents" },
    { k: "Needs", v: "Intact paint and access behind the panel" },
    { k: "Paint", v: "Factory paint stays on the car" },
    { k: "Quoted on", v: "The panel, and how deep the dent is" },
  ],
  reviewName: null,
  faqs: [
    {
      q: "Can every dent be fixed paintless?",
      a: "No. It needs intact paint and a way in behind the panel. Cracked paint, a sharp crease or a dent over a brace becomes a different repair, and we say so before the car is booked.",
    },
    {
      q: "Will the repair be invisible?",
      a: "Soft edged dents with whole paint usually come out clean. A crease stretches the metal. It can come a long way back, but it will not read as untouched.",
    },
    {
      q: "How do I get a quote?",
      a: "Send the year, make and model with a photo of the dent taken at an angle in a reflection. We get back to you fast with a free quote, before the car is here.",
    },
    {
      q: "Does it damage the paint?",
      a: "No. The metal is worked from behind. Nothing touches the finish with sandpaper or filler, so the factory paint stays on the car.",
    },
  ],
  townFaq: (c) => ({
    q: `Do I need to bring the car to Randleman for a price?`,
    a: `Usually not. A reflection photo from ${c.name} is enough to start. The repair itself is done in the shop, about ${c.minutes} minutes away on ${c.route}.`,
  }),
  quoteKey: "pdr",
  ctaLabel: "Tell us about the dent",
  related: ["paint-correction", "auto-detailing", "paint-protection-film"],
};

const DETAILING: LandingTrack = {
  id: "auto-detailing",
  slug: "auto-detailing",
  noun: "Car detailing",
  eyebrow: "Auto detailing · Five levels",
  heroPhoto: "detail-jeep-orange",
  heroFocus: "50% 55%",
  proofPhoto: "wash-f250-foam",
  hub: {
    h1: "Five levels, from a wash to full *correction*.",
    lead: "Auto detailing at 357 Branson Mill Road in Randleman. Five exterior levels, from a maintenance clean to full paint correction, each quoted for the vehicle. Free quotes, fast.",
    title: "Car Detailing in Randleman, NC",
    description:
      "Car detailing in Randleman, North Carolina. Five levels, from a maintenance clean to paint correction, with a Level 1 interior included. Free quotes, fast.",
  },
  town: {
    h1: (c) => `Car detailing for ${c.name} drivers.`,
    lead: (c) =>
      `Five levels of exterior detailing with a Level 1 interior included, done in our Randleman shop for ${c.name} owners who want the whole car done and not only washed.`,
    title: (c) => `Car Detailing for ${c.name}, NC`,
    description: (c) =>
      `Car detailing for ${c.name}, NC drivers. Five levels from a maintenance clean to paint correction, done in Randleman, with free quotes, fast.`,
  },
  checksHeading: "The five levels.",
  checks: [
    {
      title: "Maintenance detail",
      body: "Not a car wash. A full clean for a vehicle already in good condition, door jambs included.",
    },
    {
      title: "Level 1, wash and wax",
      body: "Everything in the maintenance detail plus a wax or sealant for protection.",
    },
    {
      title: "Level 2, paint enhancement",
      body: "Adds a machine polish that pulls the gloss and clarity back. Ceramic coating available on qualifying paint.",
    },
    {
      title: "Level 3, paint correction",
      body: "Permanently removes medium to heavy defects such as water spots, swirls and scratches.",
    },
    {
      title: "The Petty Shine",
      body: "A custom package built around what the paint needs, for the customer who wants the vehicle at its best.",
    },
    {
      title: "Interior included",
      body: "A Level 1 interior comes with every exterior detail. Two deeper interior levels are available.",
    },
  ],
  proofHeading: "Every level starts the same way.",
  proofIntro:
    "A proper wash and decontamination before anything else. What separates the levels is what happens to the paint after that: cleaned and protected, or cut and polished.",
  proofRows: [
    { k: "Levels", v: "Five, each carrying the work below it" },
    { k: "Interior", v: "Level 1 with every exterior detail" },
    { k: "Correction", v: "Level 3 is the same work sold on its own" },
    { k: "Quoted on", v: "Vehicle size and paint condition" },
  ],
  reviewName: "Jacob Freeman",
  faqs: [
    {
      q: "What is the difference between a wash and a detail?",
      a: "A wash takes the dirt off. A maintenance detail cleans everything, door jambs included, and the levels above it protect or correct the paint.",
    },
    {
      q: "Which level does my car need?",
      a: "Pick by what the paint looks like now rather than by name. If you are not sure, say what you see and we will tell you which level it needs.",
    },
    {
      q: "Is the interior included?",
      a: "A Level 1 interior comes with every exterior detail. Deeper interior work, leather conditioning and extraction, is quoted separately.",
    },
    {
      q: "How long does it take?",
      a: "It depends on the level and on the condition of the paint. We give you the drop off and pickup times with the quote.",
    },
  ],
  townFaq: (c) => ({
    q: `Do you detail cars from ${c.name}?`,
    a: `Yes, in the Randleman shop. ${c.name} is about ${c.minutes} minutes away on ${c.route}, and we will tell you the pickup time when we quote the job.`,
  }),
  quoteKey: "detailing",
  ctaLabel: "Get a Free Quote",
  related: ["paint-correction", "ceramic-coating", "paintless-dent-repair"],
};

const TINT: LandingTrack = {
  id: "window-tinting",
  slug: "window-tinting",
  noun: "Window tinting",
  eyebrow: "Window tinting · N.C.G.S. 20-127",
  heroPhoto: "detail-jeep-teal",
  heroFocus: "50% 50%",
  proofPhoto: null,
  hub: {
    h1: "Window tint, installed to the North Carolina *limit*.",
    lead: "Laminate and ceramic film cut and fitted in Randleman, held to the light transmission standard in N.C.G.S. 20-127. The statute is printed on this page. Free quotes, priced on your glass.",
    title: "Window Tinting in Randleman, NC",
    description:
      "Window tinting in Randleman, NC. Laminate and ceramic film installed to the N.C.G.S. 20-127 limit, the statute printed on the page, priced on your vehicle.",
  },
  town: {
    h1: (c) => `Window tinting for ${c.name} drivers.`,
    lead: (c) =>
      `Laminate and ceramic window film cut and fitted in our Randleman shop for ${c.name} drivers, to the standard North Carolina law sets for every window except the windshield.`,
    title: (c) => `Window Tinting for ${c.name}, NC`,
    description: (c) =>
      `Window tinting for ${c.name}, NC drivers. Laminate and ceramic film fitted in Randleman to the N.C.G.S. 20-127 limit, priced on your glass. Free quotes.`,
  },
  checksHeading: "How the glass gets done.",
  checks: [
    {
      title: "Laminate or ceramic film",
      body: "Both are held to the same legal standard. Ceramic handles heat better and costs more. We tell you which is worth it on your vehicle.",
    },
    {
      title: "Glass cleaned first",
      body: "Whatever is left under the film stays under the film, so the glass is cleaned and decontaminated before any film touches it.",
    },
    {
      title: "Back glass heat shaped",
      body: "Curved rear glass is shaped to its curve before the film goes on, because a flat sheet will not lie down on it.",
    },
    {
      title: "Legal on every window",
      body: "35 percent light transmission on every window except the windshield, and no darker allowance for the rear glass.",
    },
    {
      title: "Film and terms confirmed first",
      body: "We name the film and what backs it for your vehicle before work starts. We do not publish a warranty we have not verified.",
    },
  ],
  proofHeading: "What North Carolina actually allows.",
  proofIntro:
    "There is no darker allowance for rear glass in North Carolina. The 35 percent standard applies to every window on a passenger car except the windshield, which takes a top strip only. Every row below cites N.C.G.S. 20-127.",
  proofRows: [
    { k: "Every window but the windshield", v: "At least 35 percent light transmission" },
    { k: "Windshield", v: "Top strip only, five inches or to the AS1 line" },
    { k: "Reflectivity", v: "20 percent or less" },
    { k: "Meter tolerance", v: "Above 32 percent on an approved meter is presumed legal" },
  ],
  reviewName: null,
  faqs: [
    {
      q: "How dark can I go in North Carolina?",
      a: "35 percent light transmission on every window except the windshield. The rear glass gets no darker allowance. The windshield takes a top strip only.",
    },
    {
      q: "Laminate or ceramic?",
      a: "Both meet the same legal standard. Ceramic rejects more heat and costs more. Tell us how the car is used and we will say which is worth the money on yours.",
    },
    {
      q: "What is the warranty?",
      a: "We name the film and its terms for your vehicle before work starts. We do not publish a warranty on this page that we have not verified.",
    },
    {
      q: "What decides the price?",
      a: "How many windows, the shape of the back glass, which film, and whether there is old film to remove. Darkness does not move the number, the statute settles that.",
    },
  ],
  townFaq: (c) => ({
    q: `Is the tint legal to drive home to ${c.name}?`,
    a: `Yes. We do not install darker than N.C.G.S. 20-127 allows, so the car is legal on the drive back to ${c.name} on ${c.route} and anywhere else in the state.`,
  }),
  quoteKey: "tint",
  ctaLabel: "Get a Free Quote",
  related: ["paint-protection-film", "ceramic-coating", "auto-detailing"],
};

export const LANDING_TRACKS: LandingTrack[] = [
  CERAMIC,
  PPF,
  CORRECTION,
  PDR,
  DETAILING,
  TINT,
];

export function trackById(id: string): LandingTrack | undefined {
  return LANDING_TRACKS.find((t) => t.id === id || t.slug === id);
}

export function townHref(t: LandingTrack, c: City): string {
  return `/${t.slug}/${c.slug}/`;
}

export function hubHref(t: LandingTrack): string {
  return `/${t.slug}/`;
}
