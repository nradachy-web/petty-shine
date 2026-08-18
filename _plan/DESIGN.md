# Petty Shine — the design direction

Three directions were designed independently and scored by three judges: Judson himself, a paid-search
conversion specialist, and a design critic. They split. Aggregate: The Build Sheet 22.5, Bay Light 20.5,
Clearcoat 20.

**The Build Sheet wins and is the spine.** Two things decided it.

The conversion judge scored it 9 because its design thesis and its conversion strategy are the same
sentence. Judson's only structural advantage over every other shop in the Triad is that he can actually
answer the question. Innova, HarCo, Atlantic Tint and Level Up all publish something, but nobody in the
Triad publishes a full ladder from a $75 interior to a $2,000 marine job. Making disclosure the design
does not decorate that advantage, it is that advantage rendered.

The craft judge killed Clearcoat's flagship on a fact: its "Light Box" needed a swirled before photo to
work, and there is no defective-paint photo anywhere in the 29. It would have had to fabricate swirl marks
in CSS. It also asserted 1600px sources throughout when 17 of 29 stop at 1024 and 4 stop at 640.

**What we graft, because Judson scored The Build Sheet a 6 with "smart, not proud, reads like a parts
catalog."** That is the one real risk and it gets fixed on the dark plane:

- Dark tokens run **warm, not cool**. The shop darks sample #1D1E19 and #1C1D18, green-dominant. The
  specular white is #E8E4D8, sampled from the highlights in his own paint, never a cool neutral.
- The hero is **his Huracán photo with his own banner physically in the frame**, not an empty black
  screen with a moving arc. Judson's reaction to a black screen is that it failed to load.
- RESTORE / PROTECT / RESTYLE / MAINTAIN is used as real navigation, not just a tagline, with Auto
  Detailing standing alone at equal weight so his highest-volume term never gets buried in a taxonomy.

## The two planes

**The shop plane** is near-black and warm. His photography lives here, full bleed where the source allows
it. This is where the site is proud.

**The record plane** is cool off-white paper. Every price, product name, coverage line and warranty term
lives here in ruled key-and-value rows with tabular figures. This is where the site is trusted.

You scroll between them: evidence, then specification, then evidence, then specification. The rhythm is
the argument. Never two plane changes inside one screen height. Any section under 400px belongs on the
plane above it.

## The motif: the datum rule

A full-width 1px hairline whose first 24px is solid cyan and the rest is the plane's rule color. It comes
from two places at once: the edge-to-edge white hairline under RESTORE PROTECT RESTYLE MAINTAIN on his
shop banner, and the datum line in an engineering drawing, the reference surface everything is measured
from. It introduces every section and can carry a mono label riding on it like a CAD dimension line.

On section enter it draws in from the left, scaleX 0 to 1 over 500ms. That is the only ornamental
animation on the site.

The logo's arc appears exactly once per plane change: a single very shallow curve, roughly 2000px radius,
clipping the top edge of the record plane so the paper enters under a whisper of the swoosh.

No badges. No icon set. No card shadows. No gradients.

## Type

- **Display and body: Archivo** (variable, weight 100-900, width 62-125, true italics). The width axis is
  why it wins. Pulled to width 82 and italic it nearly matches the condensed italic wordmark on his own
  banner, so the brand voice shows up in the type without ever setting the logo as a headline. At width
  100 upright it is a plain serious workhorse.
- **Data: IBM Plex Mono**, 400 and 500 only. Mono is the sourced-fact voice. It sets prices, coverage
  keys, the address, hours, warranty terms and citations. It never sets a paragraph, a heading, a review
  quote, or the About section. That split is what makes a spec sheet read as a spec sheet.
- Rejected: Inter, because it reads as a template default. No serif, this is an industrial shop.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--shop-000` | `#0A0B09` | Page ground, shop plane. Warm, green-dominant, matches his unlit corners. |
| `--shop-060` | `#121410` | Raised panel on dark. |
| `--shop-120` | `#1C1F1A` | Table row stripe and chip fill on dark. |
| `--rule-dark` | `#2C302A` | 1px hairline on dark. |
| `--sheet-000` | `#F2F4F5` | The paper. Cool off-white from his polished concrete floor. Never #FFFFFF. |
| `--sheet-060` | `#E4E8EA` | Banded row and inset on paper. |
| `--rule-light` | `#C9D0D4` | 1px hairline on paper. |
| `--spec-000` | `#E8E4D8` | Warm specular white. Primary text on dark. Sampled from highlights in his paint. |
| `--ink-300` | `#9AA5AA` | Secondary text and captions on dark. |
| `--ink-900` | `#0D1113` | Headings on paper. |
| `--ink-600` | `#444D52` | Body copy on paper. |
| `--ink-400` | `#626C71` | Mono keys and metadata on paper. |
| `--cyan-500` | `#00C1F3` | Brand core. **1px rules, strokes, chip borders, 14px marks, and exactly one solid button per screen.** Never a background wash. Never a gradient. Never body text. |
| `--cyan-300` | `#48C8F5` | Links and active labels on dark. |
| `--cyan-ink` | `#006B93` | Links on paper. Required: #00C1F3 is 2.2:1 on the sheet and fails outright. |
| `--pewter` | `#9BA7AE` | The silver arc nested inside the swoosh on his banner. Carries every honest negative: not included, quoted on your vehicle, confirmed at consultation. Never red, never warning yellow. |

**The cyan rule is absolute.** The moment anyone proposes a cyan panel or a cyan-to-blue gradient, the
direction is dead. Cyan at real surface area turns into a car wash chain instantly.

## The flagship: The Coverage Plan

PPF is his biggest ad spend and converts 170 clicks into 1 lead, because his page lists four package names
in prose, prices none, shows no coverage, and contradicts itself on film brand. The Coverage Plan answers
"what do I actually get" visually and exactly.

- Inline SVG, so it is razor sharp on any phone and sidesteps the source resolution cap entirely.
- Four packages ladder up. Each is a **strict superset** of the one below, so panels never un-light.
  Only newly added panels animate.
- Panels fill in **real installation order**: bumper, hood, mirrors, front fenders, rockers, lower doors,
  rear impact, doors, roof, trunk, rear bumper. It should read as film being laid on a car, not as a UI
  transition.
- Coverage is signalled by **three independent channels**: fill, stroke, and the text record. Never by
  color alone.
- **Defaults to Full Front End**, not Partial. It is the most common real sale and it anchors the ladder
  up instead of down.
- Optional overlay: "show what gets hit at highway speed", a pewter stipple over bumper, hood leading
  edge, mirrors, headlights, fog lights and lower rockers, so the customer can see for themselves what
  Partial Front leaves exposed.
- The coverage record is wrapped in `aria-live="polite"` and the panel count is derived from array length,
  never hardcoded, so the text equivalent can never drift from the diagram.
- **Chips are a first-class control, always present, always equal in status to any scroll behavior.**
  Under `prefers-reduced-motion` and with JavaScript disabled, it degrades to a server-rendered static
  stack of all four fully drawn packages, each with its own coverage list and its own action button.
- The action bar lives inside the sticky frame and carries the active package into
  `/quote/?service=ppf&package=full-front`, so the lead arrives already qualified.

Build it generic over the panel map from day one so the same component can serve the tint page later.

## Rules that are not up for debate

1. **No em dashes, no en dashes.** Anywhere. Not one.
2. **Every number traces to `src/lib/constants.ts`**, and every fact in there carries its source. The
   current site tells North Carolina customers about a process in Holly and Grand Blanc, Michigan. This
   site cannot make that class of mistake because nothing is typed into a page.
3. **Mono means a sourced fact.** If it is set in IBM Plex Mono it is a real published number.
4. **Unpriced is never a dead end.** Every service without a published price gets a tappable
   "Quoted on your vehicle" that links to `/quote/?service=X`, never a grey label.
5. **Full bleed is enforced in the Plate component, not by convention.** Only these eight assets are
   cleared for edge to edge: `coating-corvette-c8`, `coating-g-wagon`, `coating-huracan`,
   `detail-f250-black`, `detail-jeep-orange`, `detail-jeep-teal`, `detail-mustang-red`, `wheels-mustang`.
   Everything else is capped inside a plate frame at 720 CSS pixels. `ppf-mclaren-gt`,
   `coating-corvette-c8-side`, `correction-reflection` and `coating-supra` are 960px sources and are the
   ones this rule exists to protect.
6. **Sticky mobile call rail**: 56px, appears after roughly 400px of scroll, reserves the last 88px of
   page content so it never covers the submit button, respects safe-area inset.
7. The quote form is **inline on the page**, not a link to a form page, with service and package
   pre-filled from wherever the visitor came through.
