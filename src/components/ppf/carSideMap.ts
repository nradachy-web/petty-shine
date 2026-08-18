import type { PanelId } from "@/lib/constants";
import type { CoverageMap } from "./types";

/**
 * THE DRAWING.
 *
 * A mid engine coupe in side profile, facing left, drawn from a C8
 * Corvette, with every body panel separately addressable. Two of the
 * gallery photos on this site are his own Rapid Blue C8 and one is a C7
 * Grand Sport, so the diagram matches the cars actually on the page.
 *
 * Drawn to the real car in a 1200 x 348 space. A C8 is 182.3 in long on
 * a 107.2 in wheelbase and stands 48.6 in tall, so 1152 px of length is
 * 6.32 px per inch and everything below falls out of that:
 *
 *   ground line          y = 340
 *   front axle           (242, 259)  tyre r 81, rim 60   19 in rim
 *   rear axle            (919, 254)  tyre r 86, rim 63   20 in rim
 *   wheelbase            677 px, which is 107 in
 *   rocker line          y = 306
 *   beltline             y = 156 at the A pillar, 168 at the intake
 *   door shut            x = 706
 *
 * WHAT MAKES IT READ AS A C8 RATHER THAN A GENERIC COUPE
 *   The cabin sits far forward, because the engine is behind it. The
 *   roof peaks at x 560, which is 47 percent of the way along the
 *   wheelbase and therefore ahead of its midpoint at 580. The nose is
 *   low and wedged and the front overhang is short against a rear deck
 *   that runs 386 px from the buttress landing to the tail. The rear
 *   haunch crowns at y 67 over the rear wheel, well above the nose at
 *   y 186. A large side intake sits ahead of the rear wheel. Flying
 *   buttresses fall from the roof to the deck with a gap under them you
 *   can see through, which is the `gap` decor shape. Tyres are big with
 *   short sidewalls, rim over tyre 0.74, inside tight arches.
 *
 * A COUPE HAS NO REAR DOORS. The panel ids are fixed, because the four
 * packages in constants are keyed to them, so `rear-door` is drawn where
 * the car actually divides: the intake pod between the door shut and the
 * rear wheel arch. It costs nothing, because `front-door` and
 * `rear-door` only ever appear together, in Full Vehicle, so the two are
 * always in the same state. All fifteen ids are drawn, which is what
 * keeps the "N of 15 panels" count in the record honest.
 *
 * THE TECHNIQUE, and it is the whole reason this works:
 * one good body outline is drawn once, used as a clipPath for every
 * panel, then drawn again on top. A panel polygon can run well past the
 * silhouette and it still lands exactly inside the car, so seams meet
 * with no gap and no overlap, and any stroke that would have doubled the
 * body outline is clipped away instead of drawn twice. The decor is
 * clipped the same way, so a seam line can never stray onto the ground.
 *
 * Seams were checked by rendering the SVG to PNG and looking at it,
 * repeatedly. The generator that produced these numbers, and the package
 * renders, are in _plan/assets/make-coverage-svg.py.
 *
 * PANEL ORDER IS NOT DECLARED HERE. It comes from PANEL_ORDER in
 * constants, which is the real installation order, and the component
 * paints in that sequence so the diagram reads as film being laid on a
 * car rather than as a user interface transition.
 */

const OUTLINE =
  "M 30 186 C 68 170, 122 154, 178 147 C 232 142, 302 143, 372 145 " +
  "C 406 118, 468 66, 526 41 C 552 32, 584 31, 614 41 " +
  "C 672 58, 732 72, 798 84 C 856 88, 900 76, 952 69 " +
  "C 1032 60, 1102 64, 1146 76 L 1176 92 " +
  "C 1184 132, 1180 190, 1164 228 L 1126 258 " +
  "C 1082 268, 1042 282, 1004 306 A 100 100 0 1 0 834 306 " +
  "L 330 306 A 100 100 0 1 0 154 306 " +
  "C 114 306, 60 300, 34 292 L 14 288 C 8 252, 16 210, 30 186 Z";

export const CAR_SIDE_MAP: CoverageMap<PanelId> = {
  id: "car-side",
  viewBox: "0 0 1200 348",
  subject: "a two door sports car in side profile, front to the left",
  outline: OUTLINE,
  ground: 340,

  wheels: [
    { cx: 242, cy: 259, tire: 81, rim: 60, hub: 10 },
    { cx: 919, cy: 254, tire: 86, rim: 63, hub: 10 },
  ],

  /* Openings never carry film, so each one is a filled cutout drawn over
     the panels: the windscreen and side glass, the see through gap under
     the flying buttress, and the side intake. The hairlines after them
     are the shut lines and the one door handle that make the thing read
     as a car rather than as a diagram. */
  decor: [
    {
      kind: "glass",
      d:
        "M 382 150 C 416 122, 474 76, 530 52 C 552 47, 578 46, 602 53 " +
        "L 652 152 L 400 158 C 392 157, 388 155, 388 152 Z",
    },
    { kind: "glass", d: "M 668 92 C 720 106, 780 118, 850 126 L 852 158 L 680 138 Z" },
    {
      kind: "glass",
      d:
        "M 764 188 L 820 168 C 828 166, 834 173, 832 182 L 824 244 " +
        "C 822 252, 816 258, 808 258 L 766 254 C 758 254, 752 248, 752 240 " +
        "L 752 200 C 752 193, 757 190, 764 188 Z",
    },
    {
      kind: "line",
      d: "M 630 190 L 666 188 A 5 5 0 0 1 666 198 L 630 200 A 5 5 0 0 1 630 190 Z",
    },
    { kind: "line", d: "M 1136 74 L 1176 88" },
    { kind: "line", d: "M 1052 274 L 1112 250" },
    { kind: "line", d: "M 856 116 L 1064 108" },
    { kind: "line", d: "M 858 170 C 940 160, 1010 152, 1058 150" },
    { kind: "line", d: "M 1086 122 L 1172 130 L 1170 158 L 1084 154 Z" },
  ],

  /* Fifteen panels, one per id in the PanelId union. Adjacent panels
     share their seam coordinates exactly, so nothing can drift apart:
       bumper and hood share          (30,186) (172,146)
       hood and front fender share    (172,146) (200,178) (380,156)
       fender and front door share    (386,156) down to (392,306)
       front door and intake pod      (706,161) down to (702,306)
       intake pod and rear fender     (858,168) down to (854,306)
       rear fender and trunk share    (856,116) (1064,108)
       rear fender and rear bumper    (1064,108) down to (1030,300)
     Panels that overlap on purpose (the lower door strip under the door
     skin, the rear impact band over the intake pod) are painted in
     installation order with an OPAQUE covered fill, so an overlap can
     never read darker or lighter than a single panel. */
  panels: [
    {
      id: "front-bumper",
      layer: "body",
      d: "M 0 160 L 30 186 L 172 146 L 184 214 L 178 320 L 0 320 Z",
    },
    {
      id: "hood",
      layer: "body",
      d:
        "M 0 120 L 30 186 L 178 147 C 232 142, 302 143, 372 145 L 380 156 " +
        "C 320 162, 256 170, 200 178 L 176 182 L 172 146 Z",
    },
    {
      id: "headlight",
      layer: "detail",
      solid: true,
      d: "M 70 190 L 78 172 L 162 140 L 176 144 L 174 166 L 88 200 Z",
    },
    {
      id: "fog-light",
      layer: "detail",
      solid: true,
      d: "M 24 256 L 90 246 L 104 264 L 98 288 L 28 296 Z",
    },
    {
      id: "mirror",
      layer: "free",
      solid: true,
      d:
        "M 396 170 L 398 150 C 398 143, 389 140, 380 144 L 352 157 " +
        "C 344 161, 346 171, 355 172 Z",
    },
    {
      id: "front-fender",
      layer: "body",
      d:
        "M 172 146 L 176 182 L 200 178 C 256 170, 320 162, 380 156 " +
        "L 388 152 L 392 320 L 176 320 L 184 214 Z",
    },
    {
      id: "rocker",
      layer: "body",
      d: "M 328 262 L 854 262 L 854 330 L 328 330 Z",
    },
    {
      id: "lower-door",
      layer: "body",
      d: "M 390 216 L 708 210 L 708 262 L 390 262 Z",
    },
    {
      /* The strip of film that goes on behind the door shut, ahead of
         the intake mouth. On a mid engine car that is exactly where road
         spray off the front tyre lands. */
      id: "rear-impact",
      layer: "body",
      d: "M 706 161 L 750 160 L 754 330 L 700 330 Z",
    },
    {
      id: "front-door",
      layer: "body",
      d: "M 386 156 L 706 161 L 702 330 L 392 330 Z",
    },
    {
      /* The intake pod. See the note at the top of this file about
         rear-door on a two door car. */
      id: "rear-door",
      layer: "body",
      d: "M 706 161 L 750 160 L 858 168 L 858 330 L 702 330 Z",
    },
    {
      /* The roof film runs the whole greenhouse surround, the A pillar
         and both buttresses included, because the glass and the gap are
         drawn over it and leave exactly the roof skin, the pillar and
         the buttress showing. */
      id: "roof",
      layer: "body",
      d:
        "M 368 148 C 406 116, 468 64, 526 39 C 552 30, 584 29, 616 39 " +
        "C 672 56, 732 70, 798 82 L 858 92 L 858 168 L 386 156 Z",
    },
    {
      id: "rear-fender",
      layer: "body",
      d: "M 856 116 L 1064 108 L 1030 300 L 1014 340 L 854 340 Z",
    },
    {
      /* The rear deck. On a mid engine car this is the engine cover and
         the boot lid, and it is the top surface behind the buttresses. */
      id: "trunk",
      layer: "body",
      d:
        "M 858 76 C 898 70, 928 68, 952 67 C 1032 58, 1102 62, 1146 74 " +
        "L 1176 92 L 1182 128 L 1064 108 L 856 116 Z",
    },
    {
      id: "rear-bumper",
      layer: "body",
      d: "M 1064 108 L 1200 112 L 1200 340 L 1014 340 L 1030 300 Z",
    },
  ],
};

export default CAR_SIDE_MAP;
