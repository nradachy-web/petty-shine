import type { PanelId } from "@/lib/constants";
import type { CoverageMap } from "./types";

/**
 * THE DRAWING.
 *
 * A side profile of a four door car, facing left, with every body panel
 * separately addressable. Drawn to scale in a 1200 x 470 space:
 *
 *   ground line          y = 428
 *   axles                (272, 344) and (964, 344), so a 692 wheelbase
 *   tyre radius          84, wheel arch radius 96 centred on the axle
 *   rocker line          y = 388
 *   beltline             y = 204 at the A pillar, rising to 192 at the C
 *
 * THE TECHNIQUE, and it is the whole reason this works:
 * one good body outline is drawn once, used as a clipPath for every
 * panel, then drawn again on top. A panel polygon can run well past the
 * silhouette and it still lands exactly inside the car, so seams meet
 * with no gap and no overlap, and any stroke that would have doubled the
 * body outline is clipped away instead of drawn twice.
 *
 * Seams were checked by rendering the SVG to PNG and looking at it,
 * repeatedly. The generator that produced these numbers, and the four
 * package renders, are in _plan/assets/make-coverage-svg.py.
 *
 * PANEL ORDER IS NOT DECLARED HERE. It comes from PANEL_ORDER in
 * constants, which is the real installation order, and the component
 * paints in that sequence so the diagram reads as film being laid on a
 * car rather than as a user interface transition.
 */

const OUTLINE =
  "M 76 252 C 112 240, 190 224, 300 212 C 372 204, 418 200, 452 196 " +
  "C 496 172, 560 120, 622 96 C 700 88, 782 88, 854 100 " +
  "C 906 116, 958 154, 1004 186 C 1050 194, 1100 200, 1140 206 " +
  "C 1166 214, 1181 244, 1176 302 C 1174 348, 1166 378, 1132 386 " +
  "L 1049 388 A 96 96 0 1 0 879 388 L 357 388 A 96 96 0 1 0 187 388 " +
  "L 116 384 C 88 380, 75 368, 74 340 C 73 300, 73 272, 76 252 Z";

export const CAR_SIDE_MAP: CoverageMap<PanelId> = {
  id: "car-side",
  viewBox: "0 0 1200 470",
  subject: "a four door car in side profile, front to the left",
  outline: OUTLINE,

  wheels: [
    { cx: 272, cy: 344, tire: 84, rim: 50, hub: 9 },
    { cx: 964, cy: 344, tire: 84, rim: 50, hub: 9 },
  ],

  /* Glass never carries film, so the greenhouse is a filled cutout drawn
     over the panels. The B pillar and the two door handles are hairlines
     that make the thing read as a car rather than as a diagram. */
  decor: [
    {
      kind: "glass",
      d:
        "M 478 204 C 516 178, 570 138, 634 126 C 704 120, 780 120, 844 132 " +
        "C 888 152, 934 176, 966 192 Z",
    },
    { kind: "line", d: "M 686 199 L 700 124" },
    {
      kind: "line",
      d: "M 606 248 L 650 246 A 5 5 0 0 1 650 256 L 606 258 A 5 5 0 0 1 606 248 Z",
    },
    {
      kind: "line",
      d: "M 792 245 L 834 243 A 5 5 0 0 1 834 253 L 792 255 A 5 5 0 0 1 792 245 Z",
    },
  ],

  /* Fifteen panels, one per id in the PanelId union. Adjacent panels share
     their seam coordinates exactly, so nothing can drift apart:
       hood and front bumper share    (66,288) (150,268) (202,260)
       hood and front fender share    (202,260) (300,244) (400,232) (475,226)
       fender and front door share    (478,198) down to (468,358)
       front and rear door share      (686,193) down to (678,358)
       rear door and quarter share    (866,189) down to (858,358)
       quarter and trunk share        (1008,220) (1100,234) (1174,250)
       quarter and rear bumper share  (1174,250) ... (1056,394)
     Panels that overlap on purpose (the lower door strip under the door
     skins, the rear impact band under the quarter) are painted in
     installation order with an OPAQUE covered fill, so an overlap can
     never read darker or lighter than a single panel. */
  panels: [
    {
      id: "front-bumper",
      layer: "body",
      d: "M 40 296 L 66 288 L 150 268 L 202 260 L 210 300 L 204 392 L 40 392 Z",
    },
    {
      id: "hood",
      layer: "body",
      d:
        "M 40 226 L 470 148 L 475 226 L 400 232 L 300 244 L 202 260 " +
        "L 150 268 L 66 288 Z",
    },
    {
      id: "headlight",
      layer: "detail",
      solid: true,
      d: "M 62 330 L 70 292 L 198 264 L 220 272 L 214 294 L 92 326 Z",
    },
    {
      id: "fog-light",
      layer: "detail",
      solid: true,
      d:
        "M 92 336 L 134 332 A 7 7 0 0 1 140 339 L 140 352 A 7 7 0 0 1 134 359 " +
        "L 92 364 A 7 7 0 0 1 85 357 L 85 343 A 7 7 0 0 1 92 336 Z",
    },
    {
      id: "mirror",
      layer: "free",
      solid: true,
      d:
        "M 478 198 L 481 182 C 481 175, 472 172, 463 176 L 437 189 " +
        "C 429 193, 431 202, 440 203 L 476 202 Z",
    },
    {
      id: "front-fender",
      layer: "body",
      d:
        "M 202 260 L 300 244 L 400 232 L 475 226 L 478 198 L 468 358 " +
        "L 300 358 L 300 392 L 204 392 L 210 300 Z",
    },
    {
      id: "rocker",
      layer: "body",
      d: "M 330 358 L 890 358 L 890 394 L 330 394 Z",
    },
    {
      id: "lower-door",
      layer: "body",
      d: "M 471 314 L 860 310 L 858 358 L 468 358 Z",
    },
    {
      id: "rear-impact",
      layer: "body",
      d: "M 866 189 L 924 188 L 918 394 L 856 394 Z",
    },
    {
      id: "front-door",
      layer: "body",
      d: "M 478 198 L 686 193 L 678 358 L 468 358 Z",
    },
    {
      id: "rear-door",
      layer: "body",
      d: "M 686 193 L 866 189 L 858 358 L 678 358 Z",
    },
    {
      /* The roof film runs the whole greenhouse surround, pillars
         included, because the glass cutout is drawn over it and leaves
         exactly the roof skin and the two pillars showing. */
      id: "roof",
      layer: "body",
      d:
        "M 446 202 C 492 166, 558 114, 622 90 C 700 82, 784 82, 856 94 " +
        "C 908 110, 964 152, 1012 188 Z",
    },
    {
      id: "rear-fender",
      layer: "body",
      d:
        "M 866 189 L 970 184 L 1012 140 L 1008 220 L 1100 234 L 1174 250 " +
        "L 1180 266 L 1122 286 L 1082 318 L 1062 360 L 1056 394 L 856 394 Z",
    },
    {
      id: "trunk",
      layer: "body",
      d: "M 1008 120 L 1230 200 L 1174 250 L 1100 234 L 1008 220 L 1012 140 Z",
    },
    {
      id: "rear-bumper",
      layer: "body",
      d:
        "M 1174 250 L 1240 262 L 1240 420 L 1030 420 L 1056 394 L 1062 360 " +
        "L 1082 318 L 1122 286 L 1180 266 Z",
    },
  ],
};

export default CAR_SIDE_MAP;
