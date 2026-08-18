# HD Auto Studio — build handoff

Built 2026-08-11. 31 pages, static export.

**Preview: https://nradachy-web.github.io/hd-auto-studio/**
Repo: https://github.com/nradachy-web/hd-auto-studio

The preview is `noindex` and robots-disallowed on purpose, so it can be shared
freely without competing with the real site later. Canonical tags already point
at www.hdautodetailing.com. Going live is two repository-variable changes plus
DNS — see the table in README.md. The three launch gates below still apply.

---

## 1. What was built

**Service spine (the #1 local-organic factor is a dedicated page per service):**

| Page | Purpose | Ad group it should receive |
|---|---|---|
| `/` | Brand + instant price above the fold | none — never point ads at the homepage |
| `/window-tinting/` | Head + "near me" tint terms | tint near me, car window tinting |
| `/ceramic-window-tint/` | Ceramic/heat/IR intent, full CTX spec table | ceramic tint |
| `/llumar-window-film/` | Brand + ATC vs CTX comparison | LLumar brand |
| `/paint-protection-film/` | PPF, clear bra, GeoShield | ppf near me, ppf cost, GeoShield |
| `/ceramic-coating/` | System X tiers, honest warranty terms | ceramic coating near me, System X |
| `/paint-correction/` | Swirl/scratch removal | paint correction |
| `/auto-detailing/` | Interior/exterior | none at launch (excluded from ads) |
| `/residential-window-film/` | Home film | separate campaign, own budget |
| `/commercial-window-film/` | Office/storefront film | separate campaign, own budget |
| `/pricing/` | Cost intent across all services, anchored | tint/ppf/coating "cost" and "price" terms |
| `/warranties/` | Trust differentiator | none |
| `/gallery/` `/reviews/` `/about/` `/contact/` `/faq/` `/services/` `/areas/` | Trust and navigation | none |
| `/quote/` → `/thank-you/` | Lead capture + conversion trigger | none (destination) |
| `/window-tinting/{city}/` × 7 | Ann Arbor, Brighton, South Lyon, Pinckney, Hamburg, Dexter, Whitmore Lake | city-modified tint terms |

**The two things no competitor in this market has:**

1. **An instant price engine.** Year → make → model → real number, in about
   eight seconds, from the shop's published rate sheet. Every competitor
   answers "how much is tint?" with a contact form. Google's own "people also
   search for" block on the money keyword is full of price intent that nobody
   local answers.
2. **An interactive shade selector.** Drag through the LLumar lineup and the
   glass darkens over a real job photo while Eastman's measured numbers (heat,
   IR, glare) update beside it. The toy doubles as the spec sheet.

NOTE 8/11: the Michigan tint law page and every on-site mention of tint law
were REMOVED at Nick's direction (customers aren't there for it). The research
and page content live in git history (commit ceecf67) if it's ever wanted as a
blog post or a lead magnet. The legal question about front-window/windshield
SKUs below still stands for the Ads build even though the site no longer
discusses it.

**Also worth knowing:**
- Every photo on the site is a real HD Auto Studio job, pulled from the old
  site and re-encoded (AVIF + WebP, four widths each). No stock photography.
- Reviews are transcribed verbatim from the Google profile, typos included.
- The wordmark is set in type rather than shipped as a PNG, so it stays crisp
  and costs nothing.

---

## 2. Launch gates (blocking)

1. **Web3Forms access key** for justin@hdautodetailing.com. Without it the
   quote form routes to the conversion page but the lead only hits the browser
   console. This is the single item that would silently lose leads.
2. **Google tag + Ads conversion labels** in `GADS` (`src/lib/constants.ts`).
   Needed before spend starts, not before launch.
3. **DNS cutover** to GitHub Pages, and a decision on the Wix site (below).

---

## 3. Decisions Justin needs to make

**Front-window tint and windshield tint — the important one.**
The current live site advertises "Front 2 windows from $125" and "Full
windshield $150–$225". Under MCL 257.709 Michigan prohibits aftermarket film
on the windshield and front side windows except a strip along the top edge —
and the statute names non-reflective film explicitly, so darkness is
irrelevant. The only lawful routes are a physician/optometrist letter carried
in the vehicle, or a vehicle registered outside Michigan.

This build keeps both prices (they're real, and the work is real) but labels
them as subject to the front-glass rule and links to the law page, which
explains the exemptions plainly. Three options, Justin's call:
  - **(a) leave as built** — priced, with the legal framing attached;
  - **(b) exemption-gated** — sell only with a documented exemption on file;
  - **(c) remove the SKUs** from the site entirely.
Note the Google Ads angle too: the advertiser is responsible for legal
compliance in the locations ads run, so a "windshield tint" ad group pointed
at an unqualified offer is worth avoiding regardless of which option he picks.

**Warranty claims that could not be verified.** These are already handled
conservatively on the site, but Justin should confirm and send paperwork:
  - The old site claimed a "nationwide LLumar warranty valid at any LLumar
    dealer." No LLumar source states nationwide honoring — that claim is **not
    on this site**. It says "manufacturer's lifetime limited warranty*" with
    LLumar's own asterisk.
  - "Transferable" applies to LLumar FormulaOne (SelectPro dealers only), not
    ATC/CTX. Not claimed anywhere here.
  - System X tiers: the manufacturer's warranty terms are Crystal+ 2-year,
    Pro+ 6-year, Max G+ lifetime, while the *effectiveness* ratings are 3 / 6 /
    10+ years. The site shows both, labelled correctly. Confirm Justin is an
    Element 119 Approved Applicator and what he charges for the mandatory
    annual inspection.
  - GeoShield transferability is not publicly documented — the site says so
    rather than guessing.

**Hours conflict.** Google Business Profile says Sat/Sun closed; the website
says "by appointment only," and two reviewers praise weekend service. This
build uses "weekends by appointment." Two competitors are closed weekends —
this is a capability currently written as a limitation. Fix the GBP.

**Geography.** The brief said a 13–15 mile radius but named Howell (19.6 mi)
and Novi (23.7 mi). Measured road distances are in `CITIES`. City pages were
built only for towns actually inside the radius; Howell and Novi are mentioned
on `/areas/` without pretending to be local. Decide whether to widen the ad
radius to ~20 miles or hold it tight.

**Domain.** The brand is HD Auto Studio; the domain is hdautodetailing.com.
Google requires the ad's display URL to match the final URL, so ads will read
hdautodetailing.com either way. A brand-matched domain with a 301 is the clean
fix if Justin wants to spend on it — not required for launch.

**Old Wix site.** Nothing here touches it. When DNS moves, the Wix site stops
serving. If any old URLs have inbound links worth keeping, set up redirects at
cutover: `/auto-tinting` → `/window-tinting/`, `/ceramic-coatings-whitmore-lake`
→ `/ceramic-coating/`, `/detailing-services` → `/auto-detailing/`,
`/home-and-business-tinting` → `/residential-window-film/`,
`/about-hd-automotive-detailing-whitmore-lake` → `/about/`,
`/auto-detailing-faq` → `/faq/`,
`/detailing-window-tint-ceramic-coating-gallery` → `/gallery/`.

**Booking.** The Wix scheduler is not carried over. Primary CTA is the quote
builder plus call/text. If Justin wants an online scheduler, drop the embed on
a `/book/` page and add it to the nav.

---

## 4. Deliberate SEO/technical choices

- **No `aggregateRating` schema.** Google treats self-serving ratings on a
  business's own LocalBusiness markup as ineligible for star results. The 5.0
  from 105 reviews is shown as visible content with a date instead.
- **No `FAQPage` schema.** FAQ rich results were deprecated in May 2026. The
  Q&A content stays because that's what AI Overviews extract — the markup
  earns nothing.
- **`AutomotiveBusiness` + `Service` + `BreadcrumbList`.** Breadcrumb is one of
  the few types in this vertical that still renders a live rich result.
- **City pages are destinations, not doorways.** Each has measured drive
  distance, its own route, its own angle, its own FAQ, its own photo, and its
  own conversion path — the distinction Google's doorway policy actually draws.
  Seven pages, not thirty.
- **Images pre-optimised at build-prep.** Static export disables the Next image
  optimizer, and large paint/gloss photos are the #1 LCP risk. Only one image
  per page carries `priority`.
- **Realistic expectation:** the Ann Arbor *local pack* is not winnable from
  Whitmore Lake — proximity and address-in-city are the #2 and #4 pack factors.
  The winnable surface for Ann Arbor, Brighton, and Howell is classic organic,
  AI Overviews, and paid. The pack is winnable for Whitmore Lake, Northfield,
  Green Oak, and the Hamburg corridor.

---

## 5. Cheap wins outside this repo

- The one-star Google review (July 2026, "took four and a half hours") is
  unanswered. It's a duration complaint on a windshield install, and it's the
  only sub-five-star review in two years. A calm owner reply neutralises it.
- GBP primary category is "Window tinting service" — correct. Do **not** add
  service areas: this is a storefront business and de-emphasising the address
  hurts the one pack factor it does own.
- Manufacturer dealer locators (LLumar, GeoShield, System X) are the best
  link/citation opportunity in this vertical and are currently unclaimed.
- Off-Google listings (Yelp, Yahoo, Nextdoor ×2) still carry the old name.
  Sweep them after the GBP rename.
