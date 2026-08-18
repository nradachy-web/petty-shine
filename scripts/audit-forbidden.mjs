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
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

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

const exts = SOURCE_MODE ? [".tsx", ".ts", ".css"] : [".html"];
let files;
try {
  files = walk(TARGET).filter((f) => exts.includes(extname(f)));
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

if (hits.length === 0) {
  console.log(`audit-forbidden: clean. ${files.length} files checked in ${TARGET}/.`);
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
