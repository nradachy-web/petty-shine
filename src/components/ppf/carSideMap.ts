import type { PanelId } from "@/lib/constants";
import type { CoverageMap } from "./types";

/**
 * THE DRAWING.
 *
 * A mid engine two door sports car in side profile, facing left, with every
 * body panel separately addressable. Drawn to scale in a 1200 x 470 space:
 *
 *   ground line          y = 428
 *   axles                (260, 344) and (961, 344), so a 701 wheelbase
 *   tyre radius          84, wheel arch radius 96 centred on the axle
 *   rocker line          y = 388
 *   beltline             y = 222 at the A pillar, falling to 204 at the quarter
 *
 * WHY A COUPE. The first version of this drawing was a four door saloon.
 * Nick's note on 2026-08-18 was that the execution was close but the car was
 * wrong, so the silhouette was reshaped: cabin pushed forward, hood shortened,
 * nose dropped, rear deck lengthened, tail cut off short. Two of the shop's
 * own gallery photographs are a Rapid Blue C8 and one is a C7 Grand Sport, so
 * the diagram now matches the cars actually on the page.
 *
 * A two door car has no rear door, and PanelId still carries `rear-door`
 * because the four coverage packages in constants are keyed to it. On this
 * body it is drawn as the short panel between the door shut line and the
 * quarter, which is where a rear door would be. The caption under the diagram
 * already says the drawing is one car and that coverage is quoted panel by
 * panel on the visitor's own vehicle, which is what makes that honest.
 *
 * THE TECHNIQUE, and it is the whole reason this works:
 * one good body outline is drawn once, used as a clipPath for every panel,
 * then drawn again on top. A panel polygon can run well past the silhouette
 * and it still lands exactly inside the car, so seams meet with no gap and no
 * overlap, and any stroke that would have doubled the body outline is clipped
 * away instead of drawn twice.
 *
 * Seams were checked by rendering the SVG to PNG and looking at it, repeatedly.
 *   python3 scripts/render-svg.py file.svg out.png 1200
 *
 * PANEL ORDER IS NOT DECLARED HERE. It comes from PANEL_ORDER in constants,
 * which is the real installation order, and the component paints in that
 * sequence so the diagram reads as film being laid on a car rather than as a
 * user interface transition.
 */

const OUTLINE =
  "M 58 300 C 58 282, 76 270, 112 262 C 176 250, 246 240, 310 230 " +
  "C 326 226, 338 222, 350 216 C 388 176, 444 132, 506 118 " +
  "C 554 110, 604 110, 648 118 C 706 132, 754 158, 802 172 " +
  "C 884 186, 1002 194, 1094 204 C 1138 210, 1166 228, 1168 276 " +
  "C 1170 332, 1154 380, 1122 386 " +
  "L 1046 388 A 96 96 0 1 0 876 388 L 345 388 A 96 96 0 1 0 175 388 " +
  "L 112 386 C 84 384, 64 374, 60 350 C 57 334, 57 314, 58 300 Z";

export const CAR_SIDE_MAP: CoverageMap<PanelId> = {
  id: "car-side",
  viewBox: "0 0 1200 470",
  subject: "a two door sports car in side profile, front to the left",
  outline: OUTLINE,

  wheels: [
    { cx: 260, cy: 344, tire: 84, rim: 50, hub: 9 },
    { cx: 961, cy: 344, tire: 84, rim: 50, hub: 9 },
  ],

  /* Glass never carries film, so the greenhouse is a filled cutout drawn over
     the panels. The side intake ahead of the rear wheel, the shut line behind
     the door and the single door handle are hairlines that make the thing read
     as a car rather than as a diagram. */
  decor: [
    {
      kind: "glass",
      d:
        "M 374 214 C 412 178, 462 146, 514 134 C 560 128, 604 128, 644 134 " +
        "C 696 148, 740 172, 784 188 Z",
    },
    /* the shut line at the back of the door */
    { kind: "line", d: "M 700 210 L 698 356" },
    /* the side intake, the one feature that says mid engine */
    {
      kind: "line",
      d:
        "M 806 246 L 884 238 C 895 237, 900 246, 894 254 L 862 296 " +
        "C 857 303, 849 306, 841 305 L 800 300 Z",
    },
    /* one door handle, because there is one door */
    {
      kind: "line",
      d: "M 612 252 L 656 250 A 5 5 0 0 1 656 260 L 612 262 A 5 5 0 0 1 612 252 Z",
    },
  ],

  /* Fifteen panels, one per id in the PanelId union. Adjacent panels share
     their seam coordinates exactly, so nothing can drift apart:
       hood and front bumper share    (55,302) (112,264) (200,248)
       hood and front fender share    (200,248) (240,240) (356,222)
       fender and front door share    (372,222) down to (368,360)
       front door and rear door share (700,210) down to (698,358)
       rear door and quarter share    (800,204) down to (798,356)
       quarter and trunk share        (800,204) (890,200) (990,200) (1084,208)
       quarter and rear bumper share  (1084,208) (1076,300) (1060,360) (1052,394)
     Panels that overlap on purpose (the lower door strip under the door skin,
     the rear impact band under the quarter) are painted in installation order
     with an OPAQUE covered fill, so an overlap can never read darker or
     lighter than a single panel. */
  panels: [
    {
      id: "front-bumper",
      layer: "body",
      d: "M 30 300 L 55 302 L 112 264 L 200 248 L 208 300 L 202 394 L 30 394 Z",
    },
    {
      id: "hood",
      layer: "body",
      d:
        "M 30 214 L 360 188 L 356 222 L 240 240 L 200 248 L 112 264 " +
        "L 55 302 L 30 300 Z",
    },
    {
      id: "headlight",
      layer: "detail",
      solid: true,
      d: "M 74 300 L 92 272 L 196 254 L 214 262 L 208 284 L 100 306 Z",
    },
    {
      id: "fog-light",
      layer: "detail",
      solid: true,
      d:
        "M 96 330 L 138 326 A 7 7 0 0 1 145 333 L 145 346 A 7 7 0 0 1 138 353 " +
        "L 96 358 A 7 7 0 0 1 89 351 L 89 337 A 7 7 0 0 1 96 330 Z",
    },
    {
      id: "mirror",
      layer: "free",
      solid: true,
      d:
        "M 372 214 L 375 198 C 375 191, 366 188, 357 192 L 331 205 " +
        "C 323 209, 325 218, 334 219 L 370 218 Z",
    },
    {
      id: "front-fender",
      layer: "body",
      d:
        "M 200 248 L 240 240 L 356 222 L 372 222 L 368 360 L 300 360 " +
        "L 300 394 L 202 394 L 208 300 Z",
    },
    {
      id: "rocker",
      layer: "body",
      d:
        "M 336 366 C 380 356, 470 352, 600 351 C 720 350, 830 352, 886 360 " +
        "L 890 394 L 332 394 Z",
    },
    {
      id: "lower-door",
      layer: "body",
      d:
        "M 370 322 C 470 314, 620 309, 799 306 L 798 356 " +
        "C 620 353, 470 356, 368 360 Z",
    },
    {
      id: "rear-impact",
      layer: "body",
      d:
        "M 800 204 L 858 202 C 866 250, 866 310, 856 394 L 794 394 " +
        "C 800 300, 802 250, 800 204 Z",
    },
    {
      id: "front-door",
      layer: "body",
      d: "M 372 222 L 700 210 L 698 358 L 368 360 Z",
    },
    {
      id: "rear-door",
      layer: "body",
      d: "M 700 210 L 800 204 L 798 356 L 698 358 Z",
    },
    {
      /* The roof film runs the whole greenhouse surround, pillars included,
         because the glass cutout is drawn over it and leaves exactly the roof
         skin and the two pillars showing. */
      id: "roof",
      layer: "body",
      d:
        "M 340 226 C 386 178, 444 130, 506 114 C 556 106, 606 106, 650 114 " +
        "C 710 130, 762 160, 816 178 Z",
    },
    {
      id: "rear-fender",
      layer: "body",
      d:
        "M 800 204 L 890 200 L 990 200 L 1084 208 L 1076 300 L 1060 360 " +
        "L 1052 394 L 794 394 Z",
    },
    {
      id: "trunk",
      layer: "body",
      d: "M 780 118 L 1140 176 L 1084 208 L 990 200 L 890 200 L 800 204 Z",
    },
    {
      id: "rear-bumper",
      layer: "body",
      d:
        "M 1084 208 L 1210 218 L 1210 420 L 1020 420 L 1052 394 L 1060 360 " +
        "L 1076 300 Z",
    },
  ],
};

export default CAR_SIDE_MAP;
