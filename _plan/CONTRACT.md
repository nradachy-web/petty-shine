# Build contract

Every agent building this site codes against this file. If you need a token, a class or a component
that is not listed here, it does not exist yet: build it inside your own owned files rather than
editing someone else's, and say so in your report.

## Stack
Next.js 16 static export (`output: "export"`, `trailingSlash: true`), React 19, Tailwind v4,
framer-motion, TypeScript. No external hosts. Every internal link ends in a trailing slash.
Raw asset URLs (not `<Link>`) go through `asset()` from `src/lib/asset.ts`.

## The two planes

```html
<section class="plane-shop">   <!-- near black, warm. photography lives here -->
<section class="plane-sheet">  <!-- cool off-white paper. every fact lives here -->
```

`.plane-shop` sets the dark ground and light text. `.plane-sheet` sets paper and dark text.
Never two plane changes inside one screen height. Any section under 400px tall belongs on the plane
above it, not on its own.

## Tailwind v4 theme tokens (defined in `globals.css` under `@theme`)

Colors, usable as `bg-shop-000`, `text-spec-000`, `border-rule-dark`, etc:

`shop-000 #0A0B09` · `shop-060 #121410` · `shop-120 #1C1F1A` · `rule-dark #2C302A`
`sheet-000 #F2F4F5` · `sheet-060 #E4E8EA` · `rule-light #C9D0D4`
`spec-000 #E8E4D8` · `ink-300 #9AA5AA` · `ink-900 #0D1113` · `ink-600 #444D52` · `ink-400 #626C71`
`cyan-500 #00C1F3` · `cyan-300 #48C8F5` · `cyan-ink #006B93` · `pewter #9BA7AE`

Fonts: `font-display` and `font-body` both resolve to Archivo. `font-mono` resolves to IBM Plex Mono.

## THE TAILWIND v4 LAYER TRAP, read this before writing any CSS

In Tailwind v4 utilities live in `@layer utilities`, and **any unlayered CSS beats a layered rule no
matter the specificity**. A plain `.price { color: ... }` in globals.css silently overrides
`text-cyan-500` on the element, and `:where()` does not fix it, because the cause is layering.

So: put the **color and alignment defaults** of every custom component class inside
`@layer components`. Keep structural properties (font, padding, border-width) unlayered if you want
them to stick. This bug shipped on the previous site and killed a price accent and every numeric
table header for weeks without anyone noticing.

## NEVER SHIP A HIDDEN RESTING STATE

`initial={{opacity:0}}` + `whileInView` + `viewport={{once:true}}` server-renders
`style="opacity:0"` into the static HTML, so the content depends on one IntersectionObserver
callback firing to ever be visible. On the previous site this hid every coating tier and its price
on the page whose only job was quoting them.

**Render visible.** Have JS *add* the pre-animation state in a `useLayoutEffect` (before paint, so no
flash) and remove it on intersect. Worst case is then visible-without-animation. Use the shared
`<Reveal>` primitive, which does this correctly, rather than hand-rolling motion. Test by loading a
page with JavaScript disabled.

## Mobile overflow guard

A scroll wrapper inside a grid or flex child does not scroll: grid and flex children default to
`min-width: auto`, so the *container* inflates past the viewport instead. With
`body { overflow-x: hidden }` the symptom is invisible in numeric audits while columns are simply
gone off-screen on phones. Put `min-width: 0` on container and grid children. Wide tables get their
own `overflow-x: auto` wrapper.

## Shared primitives (owned by the primitives agent, `src/components/ui/`)

```tsx
<DatumRule label?: string />
// The motif. Full-width 1px hairline, first 24px solid cyan, remainder the plane's rule color.
// Optional mono uppercase label rides on it like a CAD dimension line.
// Animates scaleX 0 to 1 over 500ms on enter. The only ornamental animation on the site.

<KeyValueRow k={string} v={ReactNode} mono?: boolean tone?: "default" | "pewter" | "cyan" />
// One ruled row: key left, value right. Values use tabular figures. THE primitive for every
// price table, coverage list, spec table and warranty term on the site.

<Plate id={PhotoId} priority?: boolean bleed?: boolean caption?: string />
// The image primitive. Emits <picture> with AVIF + WebP srcset from src/lib/photos.ts, correct
// width/height so nothing shifts, and lazy loading unless priority.
// ENFORCE THE FULL BLEED POLICY IN THE COMPONENT: if bleed is true and the id is not in
// BLEED_CLEARED, fall back to framed and console.warn in dev. Cleared ids:
// coating-corvette-c8, coating-g-wagon, coating-huracan, detail-f250-black, detail-jeep-orange,
// detail-jeep-teal, detail-mustang-red, wheels-mustang.
// Everything else caps at 720 CSS px inside a hairline frame.

<Section plane="shop" | "sheet" label?: string>   // vertical rhythm + plane + optional DatumRule
<Reveal delay?: number>                            // safe scroll reveal, see the resting state rule
<PriceFigure value={number} from?: boolean />      // mono, tabular figures, renders "from $700"
<QuoteLink service={string} package?: string>      // the "Quoted on your vehicle" link
```

## Type rules

- Mono means a sourced fact. IBM Plex Mono sets prices, coverage keys, spec values, the address,
  hours, warranty terms and citations. It **never** sets a paragraph, a heading, a review quote, or
  the About section.
- Headings are Archivo. The condensed italic voice (width ~82, italic) is used for display headings
  only, never for body.

## The cyan rule, absolute

`cyan-500` appears only as a 1px rule, a stroke, a chip border, a small mark, and **exactly one
solid button per screen**. Never a background wash. Never a gradient. Never body text.
On the paper plane, links use `cyan-ink` because `cyan-500` is 2.2:1 on the sheet and fails outright.

## Conversion rules

- Every page has exactly one primary action. The quote form is **inline on the page**, never only a
  link to a form page.
- Every service with no published price renders a tappable `<QuoteLink>` reading
  "Quoted on your vehicle" into `/quote/?service=X`. **Never a dead grey label.**
- The sticky mobile call rail is 56px, appears after ~400px of scroll, reserves the last 88px of page
  content so it never covers a submit button, and respects `env(safe-area-inset-bottom)`.
- Phone links are `tel:` and fire the click-to-call conversion. Form submit fires the form
  conversion. Both go through `src/lib/gtag.ts` and no-op safely while `GADS` ids are empty.

## Writing rules

1. **No em dashes and no en dashes. Not one.** Use commas, periods, or restructure.
2. Every number comes from `src/lib/constants.ts`. Never type a price, a distance, a review or a
   warranty term into a page.
3. Read `FORBIDDEN_CLAIMS` in constants before writing copy. It is not stylistic. Every entry is a
   verified factual or legal exposure, especially the racing-heritage one.
4. Write like the man who owns the shop, not like a marketing agency. Short sentences. Concrete
   nouns. No "unleash", no "elevate", no "pinnacle", no "unparalleled", no "state of the art", no
   "cutting edge". Those are all on his current site and they are why it reads as a template.
5. Avoid the tell-tale rhythms of generated copy: no rule-of-three lists in body prose, no
   "it's not just X, it's Y", no sentence that opens with "Whether you".

---

# As built

Everything above this line is the plan. Everything below it is what is actually in the repo, verified
against a passing `npm run build` on 2026-08-18. Where the two differ, this section is right.

## Build status

`npm run build` succeeds. 44 routes, 43 HTML files in `out/`. `npx tsc --noEmit` is clean, and
`typescript.ignoreBuildErrors` is now **false** in `next.config.ts`, so a type error fails the build.
Do not turn it back on.

```
npm run build          # static export into out/
npm run audit          # forbidden claims, reads out/ , fails on a hit
npx tsc --noEmit       # must stay clean
grep -rl "REBUILD ME" src/app     # every page still a placeholder
```

Verified in a real headless browser at 390 and 1280: zero horizontal overflow, zero
`style="opacity:0"` on any content (the only `opacity:0` in the HTML is the noscript backstop
selector in the layout head), the string "HD Auto" appears nowhere, no em or en dash anywhere in
`out/`, every internal link resolves to a real file and ends in a trailing slash, and every page
carries its own canonical.

## One vocabulary, not two

`globals.css` and `src/components/ui/primitives.css` both define a design system. They do not
collide, but only one is what you write:

- **Write components, not classes.** `<Section>`, `<KeyValueRow>`, `<Button>`, `<Plate>` and the rest
  carry the `ps-*` classes from `primitives.css` themselves. You should almost never type one.
- **From `globals.css` you use the tokens and three classes:** the colour utilities
  (`bg-shop-000`, `text-ink-900`, `border-rule-light` and so on), `plane-arc` on a section that sits
  directly under a plane of the other colour, `link-inline` for an inline link, and `.field`,
  `.field-label`, `.field-hint` if you ever build another form.
- `globals.css` also carries `.section`, `.container-site`, `.datum-rule`, `.kv-row`, `.price`,
  `.btn` and friends. Those are a parallel vocabulary for the same jobs. Nothing in the repo uses
  them except the layout chrome. **Do not start.**

## Components, with their real props

Import everything from the barrel: `import { Section, KeyValueRow, ... } from "@/components/ui";`
Every primitive also has a default export, so a deep import works too.

```tsx
<Section plane="shop" | "sheet"            // REQUIRED
         label?={string}                   // renders the opening datum rule for you
         width?="tight" | "site" | "wide" | "full"
         rhythm?="default" | "snug" | "flush"
         id? className? innerClassName? ariaLabel? ariaLabelledBy? />

<SectionHead title={ReactNode} intro?={ReactNode}
             size?="xl" | "lg" | "md" align?="stack" | "split" id? className? />
// renders an h2. A page's h1 is written by hand as <h1 className="ps-display ps-display-lg">.

<Prose>            // body copy wrapper, class .ps-prose
<PlanePanel plane="shop" | "sheet">   // flips the plane inside a section

<KeyValueRow k={ReactNode} v={ReactNode}
             mono?={boolean}          // DEFAULTS TO TRUE. pass false for a sentence.
             tone?="default" | "pewter" | "cyan"
             layout?="figure" | "prose"
             note?={string}           // small mono line under the key, built for citations
             strong?={boolean} className? id? />
<KeyValueList capped?={boolean} label?={string} className? id?>  // wraps a run of rows

<Plate id={PhotoId} priority? bleed? caption? alt? ratio? sizes?
       className? frameClassName? imgClassName? />
// bleed is honoured only for the eight ids in BLEED_CLEARED, exported from Plate.tsx.
// Anything else renders framed at 720px and warns in dev. For true edge to edge put the
// Plate inside <Section width="full">. Set priority on exactly one photo per page.

<DatumRule label? delay? labelTone?="default"|"strong"|"quiet"|"accent" className? id? />
<RuleLabel tone?="default" | "strong" | "quiet" | "accent">     // the bare mono caps label
<PriceFigure value={number} from? size?="sm"|"md"|"lg" />       // value is a raw number
<QuoteLink service={string} package?={string}>label?</QuoteLink>
<Button href? tone?="cyan" | "ghost" block? size?="md"|"sm" type? disabled? onClick? />
<Breadcrumbs trail={[{label, href}]} plane? className? />       // prepends Home, emits JSON-LD
<Reveal delay?>  <RevealGroup>  <RevealItem>
```

Sections, forms and chrome:

```tsx
<CTABand variant?="band" | "line" plane? label? title? body? ctaLabel? service? package? />
<QuoteForm service? package? lockService? heading? intro? source? id? className? />
<PhoneLink placement={string} className? aria-label?>text</PhoneLink>
<CallLink placement={string} className? aria-label?>text</CallLink>   // same thing, layout's copy
<Wordmark size?="sm"|"md"|"lg"|"xl" plane?="shop"|"sheet" decorative? className? />
<ServiceSchema name description url price? serviceType? />            // areaServed comes from CITIES
<LegalPage title updated intro blocks crumb />                        // privacy and terms only
```

The flagship:

```tsx
import { PpfCoveragePlan, SpecificationPending } from "@/components/ppf";
<PpfCoveragePlan className? />        // no other props. Everything comes from constants.
<SpecificationPending className? id? />
```

It is mounted and working on `/paint-protection-film/`. Build the rest of that page around it rather
than replacing it.

## Rules the build enforces, learned the hard way

1. **The quote form marks itself.** `QuoteForm` renders `data-quote-form` on its own `<form>`, and
   `StickyCallBar` hides the whole rail while that element is on screen. Verified: on `/quote/` at
   700px of scroll the rail is translated off and `visibility: hidden`; on a page with no form it is
   visible at the bottom. If you build another form, do not re-add the attribute to a wrapper.
2. **The layer trap has two more costumes.** `.plane-shop` and `.plane-sheet` set `position: relative`
   unlayered, so they beat `sticky` and `fixed` utilities. `.btn` and `.ps-btn` set `display`
   unlayered, so `hidden` and `lg:inline-flex` on a button do nothing. Put positioning and responsive
   display on a wrapper.
3. **A key column is sized before its value.** `.kv` was `minmax(0, 1fr) auto`, which gave the value
   its max-content width and crushed the key. Because `body` carries `overflow-wrap: break-word`, a
   crushed key came apart one letter per line, and it shipped that way in the SPECIFICATION PENDING
   block on the PPF page. It is now `fit-content(45%) minmax(0, 1fr)`. Do not revert it.
4. **Never render a primitive outside a plane element.** `globals.css` publishes the shop plane on
   `:root` and `primitives.css` publishes the sheet plane on `:root`, so a `KeyValueRow` with no
   `.plane-*` ancestor gets paper colours on a dark ground. Nothing does this today and `PlaneGuard`
   warns in dev. Chrome that cannot carry a plane class, the navbar and the call rail, uses
   `bg-shop-000 text-spec-000` directly.
5. **One conversion path.** Everything goes through `trackPhoneClick` and `trackQuoteSubmit` in
   `src/lib/gtag.ts`. `components/layout/callTracking.ts` is now a one line alias for it, and
   `<CtaClickTracking />` is mounted in the root layout as the delegated safety net. The 1.5 second
   repeat guard in `gtag.ts` is what makes the per link handler and the delegated listener safe to
   run together. Never call `gtag` directly from a page.
6. **Every page exports its own `alternates.canonical`.** The layout's canonical is the home page's
   and Next hands it down.

## Placeholder routes, all noindex, all marked REBUILD ME

Twenty page files are placeholders, and one of them generates the sixteen city pages. Each renders a real h1, real facts
from `constants.ts` and a working path to the quote form, and each carries
`robots: { index: false, follow: false }` plus a REBUILD ME comment naming what to delete.

```
/                          /about/                /areas/
/auto-detailing/           /ceramic-coating/      /ceramic-window-tint/
/faq/                      /gallery/              /interior-detailing/
/marine-detailing/         /paint-correction/     /paint-protection-film/   (partly built)
/paintless-dent-repair/    /pricing/              /reviews/
/services/                 /warranties/           /wheel-repair/
/window-tinting/           /window-tinting/<city> (16 pages, one per CITIES entry)
```

Finished and not to be touched without reason: `/quote/`, `/contact/`, `/thank-you/`,
`/privacy-policy/`, `/terms/`, `404`.

Four routes are new, created because `SERVICES` and the footer link to them and they did not exist:
`/interior-detailing/`, `/paintless-dent-repair/`, `/wheel-repair/`, `/marine-detailing/`.

**`sitemap.ts` lists only finished pages.** Every placeholder is commented out in the `PENDING` array
there. Uncomment the line in the same commit that deletes the placeholder and its noindex, or the
sitemap will advertise a noindex page.

## Two decisions the next phase has to make

- **The city layer.** `/window-tinting/<city>/` generates sixteen pages that differ only by a town
  name, which is a doorway page pattern. Either give each one something real that only applies to
  that town, or delete the directory. It is noindex and out of the sitemap until then.
- **A second solid cyan on the PPF page.** The Coverage Plan's action bar is a solid cyan button and
  the sticky call rail is solid cyan, so on a scrolled phone both are on screen. The rail already
  knows how to hide itself for a quote form. If the same should apply to the plan, put
  `data-quote-form` logic behind a shared attribute rather than inventing a second mechanism.
