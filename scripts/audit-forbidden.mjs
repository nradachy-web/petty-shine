#!/usr/bin/env node
/**
 * Fails the build if the site says something it must not say.
 *
 * Every rule here traces to a primary-source check recorded in _plan/RECON.md.
 * These are not style preferences. They are verified factual and legal exposures
 * on a live site belonging to a real business.
 *
 *     node scripts/audit-forbidden.mjs         # audits ./out after a build
 *     node scripts/audit-forbidden.mjs src     # audits source instead
 *
 * It also enforces the pricing gate. PRICING_MODE in src/lib/constants.ts is
 * read out of the source, and while it says "private" a dollar figure in the
 * rendered HTML fails the build. See THE PRICING GATE below.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";

const TARGET = process.argv[2] || "out";
const SOURCE_MODE = TARGET !== "out";

/**
 * pattern: regex tested against the rendered text
 * why: what breaks if this ships
 * allow: substrings that legitimately contain the pattern
 */
const RULES = [
  {
    id: "xpel",
    pattern: /\bXPEL\b/i,
    why: "He is not an XPEL installer. XPEL's own installer sitemap has 2,953 entries and zero hits for Randleman, Petty or Asheboro. STEK's directory does list him. His old site promised an XPEL warranty under a STEK heading.",
  },
  {
    id: "lifetime-warranty",
    pattern: /lifetime\s+(limited\s+)?warrant(y|ies)/i,
    why: "Neither STEK nor XPEL publishes a lifetime PPF warranty, and the old tint page promised lifetime warranties on films it never named. An unnamed lifetime warranty is unenforceable.",
  },
  {
    id: "racing-heritage",
    pattern:
      /\b(Richard Petty|NASCAR|Petty Enterprises|Petty'?s Garage|Petty GMS|Legacy Motor ?Club|racing heritage|racing country|racing is in our blood)\b/i,
    why: "ON HOLD pending Judson's own wording, not prohibited. He has told Nick directly that he is Richard Petty's grandson. It stays off the site until he states the relationship himself, because no Judson appears among the publicly documented grandchildren and the degree may be a generation off, which is the one error locals would catch instantly. Lift this rule only when his wording is in constants.ts. See the FORBIDDEN_CLAIMS entry there for the full reasoning.",
  },
  {
    id: "level-cross",
    pattern: /\bLevel Cross\b/i,
    why: "Factually the shop sits in Level Cross township, but Level Cross is the historic home of Petty Enterprises, so any narrative built on it reads as the heritage claim. Use the Randleman address only.",
  },
  {
    id: "since-year",
    pattern: /\b(since\s+(19|20)\d{2}|family[\s-]owned|for generations|our legacy)\b/i,
    why: "2017-03-06 is the LLC formation date, not proof of when he started taking customers. And in this context every family and heritage phrase reads as a coded reference to the racing family.",
  },
  {
    id: "bbb-accredited",
    pattern: /BBB[\s-]?accredited/i,
    why: "His BBB profile shows an A+ rating and states explicitly that the business is NOT BBB accredited.",
  },
  {
    id: "stek-black-label",
    pattern: /black\s+label/i,
    why: "STEK's directory shows his tier as Authorized. Black Label is a separate program he does not hold.",
  },
  {
    id: "absolute-protection",
    pattern:
      /(never\s+(chips?|yellows?|fades?)|prevents?\s+all\s+(rock\s+)?chips?|permanent\s+UV|scratches?\s+disappear)/i,
    why: "Both film manufacturers frame PPF as a sacrificial layer and exclude impact damage from warranty. STEK specifically excludes environmental yellowing, and its own FAQ says a scratch through the topcoat will not self heal.",
  },
  {
    id: "michigan-leak",
    pattern: /\b(Michigan|Grand Blanc|Whitmore Lake)\b/i,
    why: "The old site's ceramic page describes a process in the Holly and Grand Blanc, Michigan area. This rule also catches anything left over from the HD Auto Studio codebase this site was built from.",
  },
  {
    id: "previous-client",
    pattern: /\bHD Auto(motive)?\b|hdautodetailing|LLumar|System ?X|GeoShield/i,
    why: "Leftovers from the previous client's site. Petty Shine uses Gtechniq and STEK.",
  },
  {
    id: "dashes",
    pattern: /[—–]/,
    why: "Nick's standing rule: no em dashes and no en dashes in any output, anywhere.",
  },
  {
    id: "hidden-resting-state",
    pattern: /style="[^"]*opacity:\s*0[^"]*"/i,
    htmlOnly: true,
    why: "A pre-hidden element in static HTML depends on one IntersectionObserver callback firing to ever be visible. This exact bug hid a full page of coating prices on the previous site.",
  },
  {
    id: "placeholder-left-in",
    pattern: /(REPLACE_WITH_|YOUR_[A-Z_]+_KEY|lorem ipsum|TODO:|REBUILD ME)/i,
    why: "A placeholder reached the rendered output.",
  },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules" || name === ".git" || name === "_next") continue;
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * PLAIN TEXT FILES THAT ARE STILL THE SITE TALKING.
 *
 * /llms.txt is prose about the business, its prices, its credentials and
 * its family, published at a public URL and written to be lifted whole by
 * an assistant. It is exactly where the next leak goes, and until this it
 * was the one published file no rule in here ever read.
 *
 * It is named rather than matched on ".txt" on purpose. A static export
 * drops the RSC flight payload into out/ as index.txt and __next._*.txt,
 * and those legitimately contain "$1", "$2" and so on as row ids, which
 * the dollar figure test would read as prices. See the note about the
 * flight payload under THE PRICING GATE below. Add a basename here when
 * another real text file ships, never a bare extension.
 */
const PLAIN_TEXT = new Set(["llms.txt"]);

const exts = SOURCE_MODE ? [".tsx", ".ts", ".css"] : [".html"];
let files;
try {
  files = walk(TARGET).filter(
    (f) =>
      exts.includes(extname(f)) ||
      (!SOURCE_MODE && PLAIN_TEXT.has(basename(f))),
  );
} catch {
  console.error(`audit-forbidden: cannot read ${TARGET}. Run a build first.`);
  process.exit(1);
}

if (files.length === 0) {
  console.error(`audit-forbidden: no ${exts.join("/")} files under ${TARGET}.`);
  process.exit(1);
}

/** Strip tags so we test what a reader sees, but keep inline style attributes. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

/* ============================================================
   THE PRICING GATE

   PRICING_MODE in src/lib/constants.ts decides whether this site is
   allowed to print a dollar figure. It defaults to "private", because
   Judson does not publish his prices. This rule is what makes that a
   guarantee instead of a habit: if the flag says "private" and a
   dollar figure reached the rendered HTML, the build fails.

   The flag is read out of the source rather than assumed, so the two
   can never disagree. Flip the constant and this rule turns itself
   off with it.

   Three places a price can escape, and all three are checked:
     1. the text a reader sees
     2. a meta description, which a page can write by hand
     3. a JSON-LD block, where a price is a number and not a $ sign

   It is deliberately narrow about what counts. A dollar sign followed
   by a digit is a price. A phone number is not, the word "price" is
   not, "priceCurrency" on its own is not, and "priceRange": "$$" is
   not. The React flight payload inlined in every page uses $ followed
   by a row id, so only the visible text, the meta tags and the
   JSON-LD are read, never the raw file and never the .txt payloads.
   ============================================================ */

/* Resolved off this file, not off the working directory, so the flag is
   found no matter where the script is run from. */
const CONSTANTS_PATH = new URL("../src/lib/constants.ts", import.meta.url);

/** "$700", "$ 1,200". Narrow on purpose: see the note above. */
const DOLLAR_FIGURE = /\$\s?[\d]/;

/** A price in JSON-LD is a bare number, so the $ test does not see it. */
const SCHEMA_PRICE = /"(price|lowPrice|highPrice|minPrice|maxPrice|priceRange)"\s*:\s*"?\s*\d/i;

const PRICING_RULE = {
  id: "price-published",
  why:
    'PRICING_MODE in src/lib/constants.ts is "private", so no dollar figure may reach the rendered site: not the home page, not the service index, not a service page, not schema, not a meta description. ' +
    "Fix the page, not this rule. In a slot, render <PriceOrQuote service={...} value={...} /> from @/components/ui, which prints the quote link instead of the number and never leaves a dead cell. " +
    "In a sentence or a schema field, take the number from publicMoney() in constants.ts, which returns null in private mode, and write the copy so null reads correctly. Drop the `price` prop from <ServiceSchema>. " +
    'If Judson has said the prices go back on the site, flip PRICING_MODE to "public" and this rule turns itself off.',
};

function readPricingMode() {
  let src;
  try {
    src = readFileSync(CONSTANTS_PATH, "utf-8");
  } catch {
    console.error(
      "audit-forbidden: cannot read src/lib/constants.ts, so pricing is treated as private, which is the strict reading.",
    );
    return "private";
  }
  const m = src.match(
    /export\s+const\s+PRICING_MODE\s*(?::\s*\w+\s*)?=\s*["'](public|private)["']/,
  );
  if (!m) {
    console.error(
      "audit-forbidden: no PRICING_MODE found in src/lib/constants.ts, so pricing is treated as private, which is the strict reading.",
    );
    return "private";
  }
  return m[1];
}

const PRICING_MODE = readPricingMode();

function priceHit(file, where, text, pattern) {
  const m = text.match(pattern);
  if (!m) return null;
  const at = text.indexOf(m[0]);
  return {
    file,
    rule: PRICING_RULE,
    match: m[0],
    context:
      `${where}: ` +
      text
        .slice(Math.max(0, at - 70), at + 90)
        .replace(/\s+/g, " ")
        .trim(),
  };
}

/**
 * A NOTICE, NEVER A FAILURE.
 *
 * "Quoted on your vehicle" is only half the job. The other half is the
 * service arriving with it, so the form opens already knowing what the
 * visitor asked about. A quote link with a bare /quote/ href still
 * works and still converts, so this does not fail a build, but it does
 * name the pages that are leaving qualification on the table. The fix
 * is one prop: <PriceOrQuote service={s.quoteKey} ... />.
 */
function unqualifiedQuoteLinks(htmlFiles) {
  const byFile = [];
  for (const file of htmlFiles) {
    const raw = readFileSync(file, "utf-8");
    const anchors = raw.match(/<a\b[^>]*class="[^"]*\bquote-link\b[^"]*"[^>]*>/gi) || [];
    const bare = anchors.filter((a) => /href="\/quote\/"/.test(a)).length;
    if (bare > 0) byFile.push({ file, bare });
  }
  return byFile;
}

/** Every price that reached the rendered output while the flag says private. */
function pricingHits(htmlFiles) {
  const found = [];
  for (const file of htmlFiles) {
    const raw = readFileSync(file, "utf-8");

    const inText = priceHit(file, "visible text", visibleText(raw), DOLLAR_FIGURE);
    if (inText) found.push(inText);

    for (const tag of raw.match(/<meta\b[^>]*>/gi) || []) {
      const inMeta = priceHit(file, "meta tag", tag, DOLLAR_FIGURE);
      if (inMeta) {
        found.push(inMeta);
        break;
      }
    }

    const blocks =
      raw.match(
        /<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
      ) || [];
    for (const block of blocks) {
      const inSchema =
        priceHit(file, "JSON-LD", block, DOLLAR_FIGURE) ||
        priceHit(file, "JSON-LD", block, SCHEMA_PRICE);
      if (inSchema) {
        found.push(inSchema);
        break;
      }
    }
  }
  return found;
}


const hits = [];
for (const file of files) {
  const raw = readFileSync(file, "utf-8");
  for (const rule of RULES) {
    // constants.ts documents the forbidden patterns on purpose, and this script
    // and the plan files quote them. Those are the rulebook, not violations.
    if (SOURCE_MODE && /constants\.ts$/.test(file) && rule.id !== "dashes") continue;

    const haystack = rule.htmlOnly || SOURCE_MODE ? raw : visibleText(raw);
    const m = haystack.match(rule.pattern);
    if (m) {
      const at = haystack.indexOf(m[0]);
      hits.push({
        file,
        rule,
        match: m[0],
        context: haystack.slice(Math.max(0, at - 70), at + 90).replace(/\s+/g, " ").trim(),
      });
    }
  }
}

/* The rendered site may not print a price while the flag says private.
   Source mode is exempt: constants.ts is where the real figures live. */
if (!SOURCE_MODE && PRICING_MODE === "private") {
  hits.push(...pricingHits(files));
}

if (!SOURCE_MODE) {
  const bare = unqualifiedQuoteLinks(files);
  if (bare.length > 0) {
    const total = bare.reduce((n, b) => n + b.bare, 0);
    console.warn(
      `\naudit-forbidden: notice, ${total} quote link(s) in ${bare.length} file(s) open /quote/ with no service preselected.`,
    );
    console.warn(
      "  Pass service={...} to <PriceOrQuote> or <QuoteLink> so the form knows what the visitor asked about. This is a notice, not a failure.",
    );
    for (const b of bare.slice(0, 8)) console.warn(`  ${b.file}  (${b.bare})`);
    if (bare.length > 8) console.warn(`  ...and ${bare.length - 8} more file(s)`);
    console.warn("");
  }
}

if (hits.length === 0) {
  const pricing = SOURCE_MODE
    ? ""
    : PRICING_MODE === "private"
      ? " Pricing is private and no dollar figure reached the output."
      : " Pricing is public, so figures are allowed.";
  console.log(
    `audit-forbidden: clean. ${files.length} files checked in ${TARGET}/.${pricing}`,
  );
  process.exit(0);
}

console.error(`\naudit-forbidden: ${hits.length} violation(s) in ${TARGET}/\n`);
const byRule = new Map();
for (const h of hits) {
  if (!byRule.has(h.rule.id)) byRule.set(h.rule.id, []);
  byRule.get(h.rule.id).push(h);
}
for (const [id, list] of byRule) {
  console.error(`  [${id}] ${list.length} hit(s)`);
  console.error(`    why: ${list[0].rule.why}`);
  for (const h of list.slice(0, 6)) {
    console.error(`    ${h.file}`);
    console.error(`      matched ${JSON.stringify(h.match)} in "...${h.context}..."`);
  }
  if (list.length > 6) console.error(`    ...and ${list.length - 6} more`);
  console.error("");
}
process.exit(1);
