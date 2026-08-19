# Third pass, the polish, 2026-08-19

Nick's verdict on the second pass: good parts, but "not as clean as Midwest Tint
or Top Choice, maybe 50% of the way there." This file records what that turned
out to mean and what changed. Where it disagrees with DESIGN.md or DIRECTION-V2,
this one is right.

## The diagnosis

The system was good and the composition was monotone. After the hero, every band
on every page rendered the same texture: a mono label over ruled key and value
rows. The nine services were nine identical text lines whose right column
repeated "Quoted on your vehicle" nine times. The reference sites put a shape in
front of the scanning eye every viewport: a stat row with real numerals, photo
cards, compared tiers, a process strip. This site had one shape, forty times,
and 29 real job photos of McLarens and Corvettes that the argument sections
never used.

The hero made it worse: a flat 0.66 scrim held AA everywhere and turned the
whole photograph the same murky grey. The type sat on the busiest part of the
banner and the car never glowed through.

## What changed

**The scrim is directional now.** Heavy where the copy sits, light where the car
sits, heavy again at the base. This is the standard photographic treatment both
reference sites run. It is a tonal ramp on a photograph, not a decorative
gradient: the DIRECTION-V2 bans on blobs, arcs, glows and gradient washes on
flat ground all still stand. `.hero__scrim` and `.hero-scrim` in globals.css,
one definition for every hero.

**The hero moves.** The photograph opens a breath too large and settles home
over six seconds; the copy rises in sequence on load. CSS animation only,
transform and opacity only, killed under prefers-reduced-motion, running with
JavaScript off. One emphasised word per hero h1 in cyan-300 (`.hero__hl`).

**New section vocabulary**, all in `src/components/sections/` +
`src/components/ppf/CoverageLadder.tsx`, all reading the same constants and
plane variables as everything else:

- `StatBand`: four derived numbers at display size. 4.9 rating, longest
  guarantee, credential count, photo count. Nothing in it is typed; every cell
  is a checkable count of something the site already shows.
- `ServiceCards`: the service index on his own photography. Cards on desktop,
  sideways thumbnail rows under 640px. The two services with no honest photo
  render a typographic slot; the rule is real photos or none.
- `CoverageLadder`: the four film packages as rungs with real panel counts
  (3/4/7/15 of 15). The home page glance; the full matrix stays on the film
  page.
- `CoatingTiers`: the three coatings side by side instead of stacked half a
  screen apart. The nine year tier carries the accent stroke.
- `TownChips`: the measured towns as chip links with minutes riding on each.
  The full miles-and-routes table stays on /areas/ and the town pages.

**KV rows are for records, not for everything.** Inside a card-width column the
two column row stacks key over value, left aligned (`.tier .kv`). Sentence
values get `mono={false}`. Sixteen row tables came off the home page.

**Coverage matrix**: label column capped at 13rem, and under 700px the area
names ride sticky on the left while the packages scroll, with a slide hint.

**RevealGroup grew an `as` prop** so a semantic list can be the stagger group.
The stat band, service cards, ladder and tiers all enter staggered on scroll,
through the same safe pattern (visible at rest, hidden state added by JS before
paint, nothing under reduced motion).

**iCloud guard.** ~/Desktop is the iCloud Desktop on this machine. `.next`,
`node_modules` and `out` are now `*.nosync` dirs behind symlinks so iCloud
stops syncing build churn; this machine has frozen twice before over exactly
this. Do not undo it. tsconfig excludes the nosync names.

## The interior sweep

Every interior page was audited against six defect classes (monotony,
mobile-risk, conversion, photo-waste, seo-a11y, system-violation), 54 findings,
then fixed page by page: town-link mesh and review pull-quotes on the money
pages that lacked them, TrustBar on /quote/ /faq/ /contact/ /areas/, ServiceCards
replacing the nine-identical-links wall on the town template, the 404 and
/services/, CoatingTiers on /pricing/ and /faq/, per-service quote labels where
one label repeated six times, `mono={false}` on sentence values, honest photo
additions from the registry, and "leads with a negative" copy inverted so the
promise comes first everywhere.

## What did not change

- Two planes, the datum rule, Archivo + IBM Plex Mono, the cyan discipline,
  hard edges between planes, no card shadows, no invented facts, no em or en
  dashes, PRICING_MODE private, the FORBIDDEN_CLAIMS audit.
- The racing connection stays off the site pending Judson's own wording.
- Every number still traces to constants.ts.
