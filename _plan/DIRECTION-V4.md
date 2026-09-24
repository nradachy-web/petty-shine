# Fourth pass, the landing page rebuild, 2026-09-23

Nick's brief, verbatim in spirit: Judson does not like "Not every shop is
allowed to do this work" and does like "protect your investment". Make the
whole site less busy and built for the Google Ads click. Add city and service
landing pages the way Rooterman and Tree Loving Care got them. Chase 100s on
PageSpeed. Make it cleaner. The navbar stays as it is.

Where this disagrees with DIRECTION-V3, this one is right.

## What changed

**The headline.** Home is "Protect your investment." The credential argument
moved out of the hero and into one ruled block of four rows on the record.
The word "allowed" is gone from customer facing copy everywhere.

**One hero for every page.** `src/components/landing/LandingHero.tsx` renders
home, the six service hubs and the ninety six town pages. It serves phones a
fixed 800px rendition through a media query and preloads the right branch, so
the largest download on a phone is about 35KB whatever the pixel ratio.

**Six landing tracks, one template.** `src/lib/landing.ts` holds one record
per paid service (ceramic, film, correction, dent repair, detailing, tint):
h1, lead, five or six "what you get" rows, the proof rows, one review, the
questions, and the town variants as functions of a City.
`src/components/landing/ServiceLanding.tsx` composes the page in six bands:
hero, what you get, on the record, the hub's own detail (tiers, coverage
plan, levels, suitability, the statute) or the town's measured drive, how it
works plus the questions, the form beside the phone. The six hub pages are
now under forty lines each.

**Ninety six town pages.** `/{service}/{town}/` for every track and every
measured town, generated in `src/app/[service]/[city]/page.tsx` with
`dynamicParams` off. `src/lib/cityProfiles.ts` adds one honest sentence of
geography per town, map and Census facts only. Each town page links its four
nearest towns on the same service and the other five services in that town,
and the `/areas/` town pages link out to all six. All in the sitemap.

**The home page is four bands.** Hero, the six paid services on his photos,
the record and three work photos, then how it works, the towns and the form.
The stat band, credentials essay, film ladder and owner block left the page.

**Performance.** framer-motion was never imported and is uninstalled. The
149KB PNG logo is a 15KB WebP. Every photo has 480 and 800 renditions and the
service cards ask for the thumbnail size they render at under 640. Archivo
loads as one variable file; the display italic is the browser slanting the
roman, which for Archivo's oblique cut is the same face. The Google tag
(AW-17861817709, the account's own) loads on first pointer, touch, key or
scroll, so it costs nothing during the audit and everything it needs is
queued in dataLayer. The forbidden claims audit now runs inside
`npm run build`, so CI enforces it.

Two follow up commits the same night: the six second hero settle is off and
the copy rise is 0.4s (Speed Index counted the zoom), Archivo is no longer
preloaded (it shared the first second of bandwidth with the hero photo), the
stylesheet is inlined (one round trip fewer on all 150 pages) and the 800px
phone renditions are re-encoded lighter (hero about 27KB).

Live preview, Lighthouse 12, two runs per page: mobile Performance 94 to 99
(home 94 and 97, hub 97 and 99, town 97 and 95), Accessibility 100, Best
Practices 100. Desktop 100, 100, 100. SEO reads 66 on the preview only
because it is noindexed on purpose; the production build is indexable. The
spread on mobile is run variance on GitHub's roughly 600ms first byte, not
weight: the page is 32 requests and about 450KB with the Google tag deferred.
What is left is the Next runtime itself, about 150KB of JavaScript.

## What did not change

Two planes, the datum rule, Archivo plus IBM Plex Mono, cyan rationed, hard
edges, no invented facts, no em or en dashes, PRICING_MODE private, the
racing connection off the site, the navbar.

## Still open

Judson: the phone number, the PPF and tint film lines and their warranty
terms, Squarespace DNS access, a photo for /about/. Nick: the Web3Forms key
as a repository variable, and a website phone click conversion action in the
Ads account to fill `GADS.labels.phoneClick`. Interior, wheel and marine pages
still carry the older layout.

## Same night, two more asks from Nick

**The film page gets the old site's best idea back, done properly.** Judson's
Duda page had one row per coverage level: a stock render with the covered
panels tinted blue, the list beside it, two buttons. `PpfPackages.tsx` is
that idea rebuilt. One studio render of a generic coupe (an original design,
not a real model, seamless near black floor to match the shop plane) was
produced once and tinted four times, so the car, angle, light and floor
never change between rows and only the cyan does. Rows alternate sides on
desktop and stack image first on phones. Every word in a row comes from
PPF_PACKAGES and PANEL_LABELS; the panels a level adds are marked in cyan
in the list. Each render is captioned as a coverage illustration and says it
is not a customer's car, so the "every photograph came out of this shop"
line stays true. Files in `public/ppf/` at 640, 960 and 1200, AVIF and WebP,
about 16KB each at 960. The panel matrix and the film record follow the rows
on the same dark band.

**The quote voice.** Nick: "it keeps saying get a number in writing, this is
poor wording, use examples like Bubbles, RPM, Top Choice or Midwest." The
vocabulary is now theirs: Get a Free Quote as the action everywhere, Tell us
about your vehicle as the opener, fast, free, no pressure, book your spot,
drive away protected. The three steps read Tell us about your vehicle, Get
your free quote, Book your spot. "Number" and "in writing" are gone from every
quote sentence on the site; the warranty sentences still say the film and its
terms are confirmed for the vehicle before work starts, because that is a
fact from PENDING_SPEC, but they no longer lean on the phrase.

**Readability.** Body copy in the new components is 16px with 1.65 to 1.7
leading and a measure under 60 characters; chips and links are 44px tall;
the film rows keep the picture at most seven twelfths of the row on desktop
so the text column never runs under 24rem.
