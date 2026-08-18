import {
  BRAND,
  CITIES,
  CREDENTIALS,
  GTECHNIQ_FACTS,
  NC_TINT_LAW,
  NEAREST_EXIT,
  PPF_FILM,
  PRICING_MODE,
  REVIEW_SUMMARY,
  SERVICES,
} from "@/lib/constants";

/**
 * /llms.txt
 *
 * WHAT IT IS FOR. An assistant answering "who does ceramic coating near
 * Randleman" quotes a sentence, not a layout. This file is the shop stated
 * in plain declarative sentences that survive being lifted out of context:
 * the name, the owner, the street, the phone, the hours, the nine services,
 * the two manufacturer credentials with the directory URL that proves each
 * one, the sixteen measured towns, and the things the shop deliberately does
 * not claim.
 *
 * IT IS GENERATED, NOT TYPED. Every fact below is read out of
 * src/lib/constants.ts at build time, which is the same source the pages
 * read. DIRECTION-V2 section 6 requires that nothing in this file
 * contradicts the site, and the only way to guarantee that is to give the
 * two one source. Adding a town to CITIES adds it here. Flipping
 * PRICING_MODE rewrites the pricing paragraph here. Nothing has to be
 * remembered.
 *
 * WHY A ROUTE AND NOT public/llms.txt. A file in public/ is a second copy of
 * the facts, and a second copy of a fact is a fact that goes stale. This
 * route handler is force-static, so `output: "export"` writes it to
 * out/llms.txt as a real flat file with no runtime behind it. Verified in
 * the build output.
 *
 * WHAT MAY NOT GO IN IT. Read FORBIDDEN_CLAIMS in src/lib/constants.ts
 * first. No price while PRICING_MODE is private, no film warranty term, no
 * rating markup, and nothing about the family. This file is prose a model
 * will repeat verbatim, so a wrong sentence here travels further than a
 * wrong sentence on a page.
 */

export const dynamic = "force-static";

const ORIGIN = BRAND.siteUrl;
const url = (path: string) => `${ORIGIN}${path}`;

/** "4.1 miles, 9 minutes by US 220 Business" */
function drive(c: (typeof CITIES)[number]): string {
  return `${c.miles.toFixed(1)} miles, ${c.minutes} minutes by ${c.route}`;
}

/**
 * "Monday to Friday, 8:00 AM to 5:00 PM. Saturday and Sunday closed."
 * BRAND.hours writes the closed days as a time of "Closed", which reads as a
 * label rather than a sentence when it is pasted straight in, and it joins
 * the weekend with an ampersand that does not belong in prose.
 */
function hoursLine(): string {
  return BRAND.hours
    .map((h) => {
      const days = h.days.replace(" & ", " and ");
      return h.time.toLowerCase() === "closed"
        ? `${days} closed`
        : `${days}, ${h.time}`;
    })
    .join(". ");
}

/**
 * The pricing paragraph reads the same switch the pages read. In private
 * mode it says there are no published prices, which is true, and points at
 * the form. If Judson puts the numbers back, this says so instead, and no
 * one has to remember that this file exists.
 */
const pricingBlock =
  PRICING_MODE === "private"
    ? [
        `${BRAND.name} does not publish prices on this website. Every service is quoted on the vehicle it is being done to, because the size of the vehicle and the condition of the paint move the number far more than the name of the service does. The vehicle is looked at first, and the number goes to the customer in writing before any work starts.`,
        ``,
        `To get a number, send the vehicle and the service through ${url("/quote/")}, or call ${BRAND.phoneDisplay}. ${url("/pricing/")} explains what moves the number on each service and what separates one tier from the next.`,
      ].join("\n")
    : [
        `${BRAND.name} publishes a starting price on the services that have one. A starting price is the floor for that work and not the final figure: the vehicle is looked at first, and the number goes to the customer in writing before any work starts. Prices are listed at ${url("/pricing/")}, and a quote on a specific vehicle comes from ${url("/quote/")}.`,
      ].join("\n");

function body(): string {
  const lines: string[] = [];

  lines.push(`# ${BRAND.name}`);
  lines.push("");
  lines.push(
    `> ${BRAND.name} is an auto detailing shop at ${BRAND.street} in ${BRAND.city}, ${BRAND.stateName}. ${BRAND.owner} owns it. It does auto detailing, paint correction, ceramic coating, paint protection film, window tinting, paintless dent repair, curbed wheel repair and marine detailing, in one building, on one address. It is a ${CREDENTIALS[0].label} and an ${CREDENTIALS[1].label}, and both of those are listed in the manufacturer's own installer directory.`,
  );
  lines.push("");
  lines.push(`Legal name: ${BRAND.legalName}`);
  lines.push(`Owner: ${BRAND.owner}`);
  lines.push(`Address: ${BRAND.addressLine}`);
  lines.push(`County: ${BRAND.county}`);
  lines.push(`Phone: ${BRAND.phoneDisplay}`);
  lines.push(`Hours: ${hoursLine()}.`);
  lines.push(`Website: ${ORIGIN}`);
  lines.push(`Nearest interchange: ${NEAREST_EXIT.label}, ${NEAREST_EXIT.miles} miles from the door`);
  lines.push("");

  /* ---------------------------------------------------------------- */
  lines.push("## Credentials");
  lines.push("");
  lines.push(
    "Both of these are verifiable without taking this site's word for anything, because the directory belongs to the manufacturer and not to the shop.",
  );
  lines.push("");
  for (const c of CREDENTIALS) {
    lines.push(`- **${c.label}.** ${c.body} Listed at ${c.source}`);
  }
  lines.push("");
  lines.push(
    `${GTECHNIQ_FACTS.hardness} A Gtechniq guarantee is issued by Gtechniq and not by the shop that applies it. It has to be registered within 30 days of application and it requires an annual inspection. The full terms are at ${url("/warranties/")} in Gtechniq's own wording.`,
  );
  lines.push("");

  /* ---------------------------------------------------------------- */
  lines.push("## Services");
  lines.push("");
  for (const s of SERVICES) {
    lines.push(`- [${s.name}](${url(s.href)}): ${s.blurb}`);
  }
  lines.push("");

  /* ---------------------------------------------------------------- */
  lines.push("## Pricing");
  lines.push("");
  lines.push(pricingBlock);
  lines.push("");

  /* ---------------------------------------------------------------- */
  lines.push("## Service area");
  lines.push("");
  lines.push(
    `There is one shop and the work is done at it. Vehicles come to ${BRAND.street} in ${BRAND.city}. Every distance below is road distance and every time is drive time, measured along the route people actually take, and none of it is straight line mileage. Each town has its own page with its route and its county.`,
  );
  lines.push("");
  for (const c of CITIES) {
    lines.push(
      `- ${c.name}, ${c.county}. ${drive(c)}. ${url(`/areas/${c.slug}/`)}`,
    );
  }
  lines.push("");

  /* ---------------------------------------------------------------- */
  lines.push("## Reviews");
  lines.push("");
  lines.push(
    `The ${REVIEW_SUMMARY.source} profile showed ${REVIEW_SUMMARY.rating} out of 5 from ${REVIEW_SUMMARY.count} reviews when it was read on ${REVIEW_SUMMARY.checkedOn}. Review counts move, so treat that as a reading on a date rather than a fixed figure. Five of those reviews are quoted in full, with the customer's own spelling, at ${url("/reviews/")}.`,
  );
  lines.push("");
  lines.push(
    "This site publishes no rating markup. A rating a business marks up about itself is not eligible for a search result, so the number above is stated as text and sourced, not as structured data.",
  );
  lines.push("");

  /* ---------------------------------------------------------------- */
  lines.push("## What this shop does not claim");
  lines.push("");
  lines.push(
    `- The film is ${PPF_FILM.brand} ${PPF_FILM.product}. No film warranty term is published here, because ${PPF_FILM.brand}'s own websites publish different numbers for it. The term is confirmed in writing for the vehicle before work begins.`,
  );
  lines.push(
    `- Paint protection film is a sacrificial layer. It takes the chip so the paint does not, and film that has taken a hit is film doing its job. Self healing works on light scratches, and ${PPF_FILM.brand}'s own FAQ says a scratch that goes through the topcoat will not heal.`,
  );
  lines.push(
    "- No warranty is published on window tint, because no film line is published for it.",
  );
  lines.push(
    `- ${NC_TINT_LAW.myth} The statute is ${NC_TINT_LAW.statute} and it is quoted line by line, with a citation on each row, at ${url("/window-tinting/")}.`,
  );
  lines.push(
    "- Paintless dent repair suits some damage and not other damage. Where the paint is already cracked or the metal is stretched, it is the wrong repair.",
  );
  lines.push(
    "- There is no published turnaround time. A job is booked against what the vehicle needs.",
  );
  lines.push("");

  /* ---------------------------------------------------------------- */
  lines.push("## Key pages");
  lines.push("");
  lines.push(`- [Get a quote](${url("/quote/")}): the form, one vehicle at a time.`);
  lines.push(
    `- [What it costs, and how we quote it](${url("/pricing/")}): what moves the number on each service.`,
  );
  lines.push(
    `- [Questions we get asked](${url("/faq/")}): the answers, including the ones that are not in the shop's favor.`,
  );
  lines.push(
    `- [Guarantees](${url("/warranties/")}): what a coating guarantee covers and what invalidates it.`,
  );
  lines.push(
    `- [Service area](${url("/areas/")}): sixteen towns with measured road distance and drive time.`,
  );
  lines.push(
    `- [Our work](${url("/gallery/")}): photographs of vehicles that came through this shop. No stock photography.`,
  );
  lines.push(`- [About](${url("/about/")}): how a job is run.`);
  lines.push(`- [Contact](${url("/contact/")}): address, hours and directions.`);
  lines.push("");
  lines.push(`Sitemap: ${url("/sitemap.xml")}`);
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(body(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
