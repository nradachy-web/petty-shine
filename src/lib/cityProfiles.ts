/**
 * TOWN PROFILES
 *
 * One honest sentence or two of geography per measured town, used by the
 * service-by-town pages so that Greensboro's page and Liberty's page differ
 * in substance and not only in the noun.
 *
 * RULES
 *   1. Only things a road map or the Census would confirm: which county,
 *      which side of which road, what it sits between, roughly how big it
 *      is relative to the others, which direction the drive to Randleman
 *      runs. No landmarks, no neighbourhoods, no weather, no claims about
 *      the town's cars or its people.
 *   2. Do NOT restate the measured miles, minutes or route. The template
 *      already prints those from CITIES.
 *   3. Nothing from FORBIDDEN_CLAIMS in src/lib/constants.ts. In particular
 *      never name Level Cross, a racing family, or Petty's Garage.
 *   4. No em or en dashes. Short sentences.
 *
 * `angle` opens the town section. `approach` is how the drive to the shop
 * reads in plain words, and it must agree with the route in CITIES.
 */

export interface CityProfile {
  slug: string;
  /** Where the town sits. One or two sentences. */
  angle: string;
  /** How the drive to the shop goes, in plain words. One sentence. */
  approach: string;
}

export const CITY_PROFILES: CityProfile[] = [
  {
    slug: "randleman-nc",
    angle:
      "Randleman is the shop's own town, on the Deep River in northern Randolph County, just south of the Guilford County line.",
    approach:
      "The shop is on Branson Mill Road off US 220 Business, a few minutes from anywhere in town.",
  },
  {
    slug: "climax-nc",
    angle:
      "Climax is an unincorporated community in southern Guilford County on NC 62, just across the county line from Randleman.",
    approach:
      "Randleman Road runs straight down from Climax into town, with NC 62 carrying the first part of the drive.",
  },
  {
    slug: "sophia-nc",
    angle:
      "Sophia is an unincorporated community in Randolph County, a few miles west of Randleman on the High Point side.",
    approach:
      "Old High Point Street ties into US 220 Business and brings the drive in on the shop's side of town.",
  },
  {
    slug: "julian-nc",
    angle:
      "Julian is an unincorporated community on NC 62 east of Climax, where Guilford and Randolph counties meet.",
    approach:
      "The drive comes west on NC 62 and then down Davis Mill Road into Randleman, surface road the whole way.",
  },
  {
    slug: "archdale-nc",
    angle:
      "Archdale is a city in northern Randolph County on the Guilford County line, directly next to High Point.",
    approach:
      "NC 62 links Archdale to the I-73 and US 220 corridor, which runs south to the shop's exit.",
  },
  {
    slug: "asheboro-nc",
    angle:
      "Asheboro is the county seat of Randolph County, south of Randleman on the same US 220 corridor the shop sits beside.",
    approach:
      "The drive is north up I-73 and US 220 the whole way, one road from Asheboro to the shop's exit.",
  },
  {
    slug: "greensboro-nc",
    angle:
      "Greensboro is the largest city in the Triad and the seat of Guilford County, north of Randleman.",
    approach:
      "Freeman Mill Road feeds the I-73 and US 220 corridor south out of the city, and the shop is just off that corridor.",
  },
  {
    slug: "high-point-nc",
    angle:
      "High Point sits mostly in Guilford County, northwest of Randleman, and is the third of the Triad's three cities.",
    approach:
      "The measured drive uses NC 610 and NC 62, surface roads rather than the interstate.",
  },
  {
    slug: "trinity-nc",
    angle:
      "Trinity is a city in northwestern Randolph County, north of Archdale and beside I-85.",
    approach:
      "The measured drive uses NC 62 with a stretch of I-85, and stays inside Randolph County.",
  },
  {
    slug: "liberty-nc",
    angle:
      "Liberty is a small town in northeastern Randolph County where US 421 crosses NC 49.",
    approach:
      "US 421 and NC 62 carry the drive west across the county into Randleman.",
  },
  {
    slug: "jamestown-nc",
    angle:
      "Jamestown is a town in Guilford County between Greensboro and High Point.",
    approach:
      "The measured drive uses US 29 and Vickrey Chapel Road, surface roads down into Randolph County.",
  },
  {
    slug: "thomasville-nc",
    angle:
      "Thomasville is a city in Davidson County, southwest of High Point along I-85.",
    approach:
      "NC 109 and I-85 carry the drive east toward Randleman.",
  },
  {
    slug: "kernersville-nc",
    angle:
      "Kernersville is a town on the Forsyth and Guilford county line, between Greensboro and Winston-Salem.",
    approach:
      "US 421 and I-73 carry the drive south to the shop's exit.",
  },
  {
    slug: "burlington-nc",
    angle:
      "Burlington is the largest city in Alamance County, east of Greensboro on I-40 and I-85.",
    approach:
      "The drive leaves I-85 for NC 62 and comes down through southern Guilford County into Randleman.",
  },
  {
    slug: "lexington-nc",
    angle:
      "Lexington is the county seat of Davidson County, on I-85 to the west of Randleman.",
    approach:
      "The measured drive uses I-85 and US 64.",
  },
  {
    slug: "winston-salem-nc",
    angle:
      "Winston-Salem is the seat of Forsyth County and the westernmost of the Triad's three cities.",
    approach:
      "US 421 east out of the city, then I-73 south to the shop's exit.",
  },
];

export function profileFor(slug: string): CityProfile | undefined {
  return CITY_PROFILES.find((p) => p.slug === slug);
}
