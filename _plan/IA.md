# Petty Shine — information architecture

Every route below exists for a reason that traces back to either a funded Google Ads ad group,
a real search term his account already pays for, or a conversion job. Nothing is here for symmetry.

## Money pages (these have ad spend pointed at them today)

| Route | Ad group | 90-day evidence | The job |
|---|---|---|---|
| `/paint-protection-film/` | Paint Protection Film | $1,239 spent, 170 clicks, **1.0 conversion** | His worst page and his biggest spend. Show exactly what each package covers, on a car, and give a price signal. This is the highest-value fix on the site. |
| `/ceramic-coating/` | Ceramic Coating | $607 spent, 212 clicks, 3.5 conv | His best page and his signature product. Three real tiers at $700 / $1,200 / $1,500, named chemistry, honest guarantee terms. |
| `/paint-correction/` | Paint Correction | "car buffing service" 59 clicks | The service that makes every other service work. Sell the before/after. |
| `/paintless-dent-repair/` | Dent Repair | 164 clicks, 1.5 conv | Competitor-name traffic lands here (Dents Unlimited, Dent Works, Dent Wizard). Must answer "can you fix mine and what does it cost". |

## Volume pages (real demand his site barely serves)

| Route | Evidence |
|---|---|
| `/auto-detailing/` | "car detailing near me" is his single highest-click search term (31 clicks). Also "auto detailing near me", "detailing near me", "detail shops near me". |
| `/detailing-packages/` | Five real published tiers from $100 to $800. Nobody local publishes this. |
| `/interior-detailing/` | "interior car detailing near me" appears in his paid terms. Three real tiers from $75. |
| `/window-tinting/` | Advertised on his old site, never priced, never sourced. |
| `/marine-detailing/` | Real published pricing, real boat photo, essentially zero local competition. |
| `/wheel-repair/` | Curbed wheel repair plus wheel and brake caliper refinishing. |

## Conversion and trust

| Route | The job |
|---|---|
| `/pricing/` | The wedge. Every competitor in the Triad hides behind "call for a quote". He has real numbers for detailing, interior, marine and coatings. Publishing them is the differentiator. |
| `/quote/` | The primary conversion. Must fire a real Google Ads conversion, which the current site does not have at all. |
| `/gallery/` | 29 photos of McLarens, Lamborghinis, Corvettes and Hellcats. His strongest asset, currently buried. |
| `/reviews/` | Verbatim, attributed, no invented aggregate rating. |
| `/about/` | Judson. Reviews name him personally four times out of five. |
| `/contact/`, `/thank-you/` | |
| `/areas/` + `/areas/[city]/` | Randleman, Asheboro, Archdale, Trinity, High Point, Thomasville, Greensboro, Lexington, Kernersville, Winston-Salem. His paid search terms already carry Greensboro, High Point, Lexington and Asheboro city modifiers. |
| `/privacy-policy/`, `/terms/`, 404 | |

## Redirect map for the DNS cutover

The old site is a Duda build. These are every URL in its live sitemap.

| Old | New | Note |
|---|---|---|
| `/` | `/` | |
| `/auto-detailing` | `/auto-detailing/` | |
| `/ceramic-coating` | `/ceramic-coating/` | |
| `/paint-protection-film` | `/paint-protection-film/` | |
| `/paintless-dent-repair` | `/paintless-dent-repair/` | |
| `/interior-detailing` | `/interior-detailing/` | |
| `/marine-detailing` | `/marine-detailing/` | |
| `/auto-window-tinting` | `/window-tinting/` | slug change |
| `/curbed-wheel-repair` | `/wheel-repair/` | slug change |
| `/detailing-package` | `/detailing-packages/` | slug change |
| `/randleman-nc` | `/areas/randleman-nc/` | |
| `/paint-protection-greensboro-nc` | `/areas/greensboro-nc/` | |
| `/paint-protection-high-point-nc` | `/areas/high-point-nc/` | |
| `/paint-protection-asheboro-nc` | `/areas/asheboro-nc/` | |
| `/paint-protection-archdale-nc` | `/areas/archdale-nc/` | |
| `/contact` | `/contact/` | |
| `/blog` | `/` | one stub post, nothing to preserve |
| `/my-post` | `/` | Duda placeholder |
| `/35468` | `/` | unnamed Duda stub, currently indexable |

GitHub Pages cannot issue 301s. Ship these as client-side redirect stubs at the old paths, each with
a `<link rel="canonical">` to the new URL, so the four Google Ads final URLs and any existing backlinks
keep working on day one. The Ads final URLs must ALSO be updated in the account at cutover.

## Google Ads final URLs to update at cutover

| Ad group | Current final URL | New |
|---|---|---|
| Paint Protection Film | `https://www.pettyshine.com/paint-protection-film` | `/paint-protection-film/` |
| Ceramic Coating | `https://www.pettyshine.com/ceramic-coating` | `/ceramic-coating/` |
| Dent Repair | `https://www.pettyshine.com/paintless-dent-repair` | `/paintless-dent-repair/` |
| Paint Correction | `https://www.pettyshine.com/auto-detailing` | `/paint-correction/` |
