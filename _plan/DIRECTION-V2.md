# Second pass, from Nick's review 2026-08-18

The first pass was called "a good first pass." Six things change. Read this file before
`_plan/DESIGN.md`, because where they disagree this one is right.

## 1. Pricing comes off the site

Nick's read is that Judson does not want his prices published. That kills the first pass's entire
positioning, whose h1 was literally "The prices are on the website."

**Implement it as a switch, not a deletion.** `PRICING_MODE` in `src/lib/constants.ts`, defaulting to
`"private"`. Every price on the site reads through it. Flipping one line puts the numbers back if
Judson says otherwise, and nothing else in the codebase has to change. The real figures stay in
constants either way, because they are still the truth and the quote form still needs them.

In `"private"` mode:
- No dollar figure renders anywhere. Not on the home page, not in the service index, not on a service
  page, not in schema, not in a meta description.
- Every price slot becomes the same tappable "Quoted on your vehicle" link that PPF already uses.
  A missing price must never read as a dead label or an empty cell. This is the single most important
  rule in this document, because in private mode the entire site is now quote-driven.
- `/pricing/` does NOT get deleted. It becomes **"What it costs, and how we quote it"**: what drives
  the number on each service, what the tiers actually differ by in substance rather than in price,
  what happens on a walkthrough, and that the number goes in writing before work starts. That page
  still earns its traffic and it still converts, it just sells the process instead of the number.
  Keep the route so the ad account and any existing link keeps working.

**The new positioning.** Without price, the wedge is the credential, and it is stronger anyway:

> He is a **Gtechniq Accredited Detailer**. Crystal Serum Ultra is professional application only.
> Gtechniq will not honour the guarantee if a shop that is not accredited applies it. So the nine
> year coating is a thing a customer physically cannot buy from most shops in the Triad.
> He is also an **Authorized STEK installer**, verified in STEK's own directory.

That is verifiable, it is rare, and no competitor found in the research holds it. Build the h1 and
the hero around the work and the credential. Do not replace one slogan with another slogan.

## 2. No curves anywhere. Already done, keep it that way.

The plane change arc is removed and `.plane-arc` is a no-op. Planes meet on a hard edge.
**Do not add rounded section tops, blobs, soft gradients, glows or organic shapes.** The bar this
work is held against is Vasso Law and Top Choice, and both are hard edged rectangles throughout.

## 3. The quality bar, concretely

Measured off the reference sites Nick named. What they actually do:

- **Full bleed photographic hero**, real photo, dark tonal overlay, large confident display type, a
  small letterspaced eyebrow above it, and two actions: one solid, one outline.
- **A trust bar immediately under the hero.** Vasso runs a single hairline row: `★★★★★ 4.9 · 116
  GOOGLE REVIEWS | address | LICENSED IN MICHIGAN`. Petty Shine should run the equivalent and it is
  a strong one: `4.9 · 47 GOOGLE REVIEWS | GTECHNIQ ACCREDITED DETAILER | AUTHORIZED STEK INSTALLER |
  RANDLEMAN, NC`. This is the highest value single addition available to the home page.
- **Split panels meeting on a hard vertical edge**, one light one dark, each carrying one idea.
- **Line item lists with a trailing arrow and a hairline rule**, which this site already does well.
- **Generous but disciplined rhythm.** The current site has dead vertical space in several places
  where a section's intro ends well above its content. Tighten it.

## 4. The Coverage Plan has to be flawless, and the car becomes a Corvette

Nick does not like the generic sedan. Draw a **C8 Corvette** in exactly the same wireframe treatment.
It is the right call for more than taste: two of his own gallery photos are a Rapid Blue C8 and one
is a C7 Grand Sport, so the diagram will match the cars actually on the page.

C8 side profile, facing left, the things that make it read as a C8 and not a generic coupe:
- Mid engine, so the cabin sits far forward. Short front overhang, very long rear deck.
- Very low, wedge nose. High rear haunch, higher than the nose by a clear margin.
- Roof peak is ahead of the midpoint of the wheelbase.
- A large side intake ahead of the rear wheel, which is a signature and should be a visible feature.
- Flying buttresses running from the roof down to the rear deck, with a gap you can see through.
- Big wheels, short sidewalls, tight arches.

Panel ids stay exactly as they are in `constants.ts`, because the packages are keyed to them.
A Corvette has no rear doors: map `rear-door` sensibly onto the body or fold it, but do NOT change
the package data, and make sure the panel count still reconciles with what the record prints.

**Layout defects to fix at the same time:**
- On desktop there is a large dead gap under the diagram and the action bar, because the left column
  is much shorter than the fifteen row record beside it. The frame is `position: sticky` so it
  behaves on a real scroll, but it still looks wrong on first paint and in any screenshot. Balance
  the two columns.
- The static no-JS and reduced motion stack reuses the same grid and has the same gap with no sticky
  to save it.
- The bare, unfilmed body of the car measures roughly 1.6:1 against the ground. The covered panels
  read well now, but the thing they are being compared against barely reads at all.

Render it and LOOK at it. `python3 scripts/render-svg.py file.svg out.png 1200`, then Read the png.
Do not ship this without looking at it many times.

## 5. Sales psychology

Applied honestly, which for this shop means using real evidence rather than manufactured urgency.
No countdown timers, no fake scarcity, no "only 3 slots left", no exit popups. Nick's own standing
rule is restraint.

What to actually use:
- **Authority**: the two manufacturer credentials, stated with the fact that they are checkable in
  the manufacturer's own directory, plus a link to it.
- **Social proof**: 4.9 from 47 Google reviews, verbatim and attributed, near the decision point
  rather than parked on a reviews page.
- **Loss aversion, truthfully**: PPF is a sacrificial layer, so the honest frame is what the panel
  looks like after 30,000 miles without it. The "show what gets hit at highway speed" overlay is
  already exactly this and it should be more prominent.
- **Reducing perceived risk**: the number goes in writing before work starts, and the site says what
  it cannot price and why. In private pricing mode this matters more, not less, because the visitor
  has lost the price anchor and needs to know they will not be ambushed.
- **Commitment ladder**: the easiest next step on any page should be smaller than "book a job".
  Asking for a vehicle and a service is a small ask. Make that the primary action everywhere.
- **Specificity beats adjectives**: "Crystal Serum Ultra, 10h over a 7h base, nine year guarantee,
  registered in your name within 30 days" outsells "premium ceramic coating" every time.

## 6. Google visibility, AI visibility, SEO

Three related but distinct jobs.

**Classic SEO**
- One h1 per page, correct heading order, descriptive titles under 60 characters, descriptions
  150 to 160.
- Real internal linking between service pages and the 16 town pages, with descriptive anchors.
- `LocalBusiness` / `AutomotiveBusiness` schema with address, geo, hours, sameAs. Keep
  `aggregateRating` OFF, self serving markup is ineligible.
- `Service` schema per service page with `areaServed` from CITIES, and `provider` pointing at the
  business node so the graph connects instead of repeating itself.
- `BreadcrumbList` on every page. No `FAQPage`, deprecated May 2026.
- Image alt text is already real, keep it that way.
- Clean canonicals, and the preview build stays noindex until cutover.

**AI visibility**, meaning being quotable by an assistant answering "who does ceramic coating near
Randleman":
- Answer questions in plain declarative sentences that survive being lifted out of context. A model
  quotes a sentence, not a layout.
- Put the who, what, where in the first hundred words of every page, in text, not in an image.
- Facts should appear as text near their heading, not only inside a table cell or a diagram.
- Entity clarity: the business name, the address and the two credentials should be unambiguous and
  repeated consistently in the same form across pages.
- Ship `/llms.txt` describing the business, the services, the service area and the credentials in
  plain markdown, and link it. Keep it factual and short. Nothing in it may contradict the site.
- No content that only exists in JavaScript. Everything is server rendered already, keep it so.

**Google visibility specifically**
- The four ad landing pages are the priority: `/paint-protection-film/`, `/ceramic-coating/`,
  `/paintless-dent-repair/`, `/paint-correction/`.
- His highest volume real search term is "car detailing near me", which `/auto-detailing/` must own.
- Town pages must differ in substance, not in a swapped name. They already carry measured drive
  times and real routes, lean on that.

## What does not change

- No em dashes, no en dashes.
- Every fact traces to `src/lib/constants.ts` with a source.
- `FORBIDDEN_CLAIMS` still applies. The racing connection is still on hold pending Judson's own
  wording, and the audit still fails the build on it.
- The two planes, the datum rule, Archivo and IBM Plex Mono, and the cyan discipline all stand.
- His real logo file ships as the wordmark. Do not redraw it.
