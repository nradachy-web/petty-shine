# HD Auto Studio

Website for HD Auto Studio (formerly HD Automotive Detailing), 10170 Industrial
Drive, Whitmore Lake, MI. Window tint, paint protection film, ceramic coating,
paint correction, detailing, and architectural window film.

Built by Modern Apex Strategies.

## Stack

- Next.js 16 (App Router) exported statically — `output: "export"`
- Tailwind v4 via `@theme` tokens in `src/app/globals.css`
- Framer Motion for restrained scroll/step animation
- No CMS, no database, no server. The whole site is HTML, CSS, and one API
  call to fueleconomy.gov for the vehicle picker.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export into ./out
```

To preview the real production output: `cd out && python3 -m http.server 4311`.

## Where things live

| Path | What |
|---|---|
| `src/lib/constants.ts` | Single source of truth: prices, warranties, reviews, cities, FAQ, SEO copy. Change a number here and it changes everywhere. |
| `src/lib/photos.ts` | Generated photo registry (dimensions + alt text). Do not hand-edit. |
| `src/lib/vehicle.ts` | Year/make/model lookup and the EPA-class → body-type classifier behind the price engine. |
| `src/lib/work.ts` | Gallery captions. |
| `src/components/quote/PriceEngine.tsx` | The instant tint price tool. |
| `src/components/quote/QuoteForm.tsx` | Four-step lead form → `/thank-you/`. |
| `scripts/process-photos.py` | Regenerates `public/photos` (AVIF + WebP × 4 widths) and `src/lib/photos.ts`. |

## The price engine

Year/make/model come from the free, CORS-open fueleconomy.gov vehicle menu
API. Once a model is picked we fetch that vehicle's EPA `VClass` and map it
onto the seven body types the shop prices by (`BODY_TYPES` in constants).
Model-name heuristics beat EPA class where the class can't tell a Mustang
from a Malibu. The guess is always shown to the visitor and always
overridable — see `classify()` in `src/lib/vehicle.ts`.

If the API is ever unavailable, the selects stay empty and every page still
carries the full printed price table plus phone and text CTAs.

## Before launch

1. **Web3Forms key.** Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (repo variable in
   GitHub Actions, and in `.env.local` for dev). Until it is set the quote form
   still routes to `/thank-you/` but the lead is only logged to the console —
   it does not reach Justin's inbox.
2. **Google tag + Ads conversion labels.** Fill `GADS` in `src/lib/constants.ts`
   (`googleTagId`, `ga4Id`, and the three labels). Every conversion call
   no-ops until a label exists, so nothing breaks in the meantime.
3. **DNS.** `public/CNAME` is set to `www.hdautodetailing.com`. Point the apex
   at GitHub Pages (185.199.108–111.153) and `www` at the Pages host, then
   enable HTTPS.

See `_plan/HANDOFF.md` for the full open-items list, including the questions
Justin needs to answer before certain claims can be published.

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds and publishes `out/` to
GitHub Pages. Which URL it lands on is controlled entirely by two repository
variables — no code change is needed to switch:

| Mode | `NEXT_PUBLIC_BASE_PATH` | `CUSTOM_DOMAIN` | Result |
|---|---|---|---|
| Preview (current) | `/hd-auto-studio` | unset | https://nradachy-web.github.io/hd-auto-studio/ — `noindex`, robots disallowed, no CNAME |
| Production | unset | `www.hdautodetailing.com` | served at the domain root, indexable, CNAME written at build |

To go live: delete the `NEXT_PUBLIC_BASE_PATH` variable, set `CUSTOM_DOMAIN`,
point DNS at GitHub Pages, and re-run the workflow.
