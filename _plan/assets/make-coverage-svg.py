#!/usr/bin/env python3
"""
Generates the Coverage Plan car diagram.

One source of truth for the geometry. Emits:
  car-side-panels.svg          every panel lit, for eyeballing the seams
  car-side-<package>.svg       one per Petty Shine PPF package
and prints the TypeScript panel map body for src/components/ppf/panelMaps.ts

Technique (see README.md): draw ONE body outline, clip every panel polygon
against it, then draw the outline again on top.

    python3 make-coverage-svg.py && python3 ../../scripts/render-svg.py car-side-panels.svg out.png 1200
"""
import os

VIEWBOX = "0 0 1200 470"

# ---------------------------------------------------------------- geometry
# Facing left. Ground y=428. Axles (272,344) and (964,344), tire r=84,
# wheel arch r=96 centred on the axle, rocker line y=388, beltline y~200.

BODY = (
    "M 76 252 "
    "C 112 240, 190 224, 300 212 "
    "C 372 204, 418 200, 452 196 "
    "C 496 172, 560 120, 622 96 "
    "C 700 88, 782 88, 854 100 "
    "C 906 116, 958 154, 1004 186 "
    "C 1050 194, 1100 200, 1140 206 "
    "C 1166 214, 1181 244, 1176 302 "
    "C 1174 348, 1166 378, 1132 386 "
    "L 1049 388 "
    "A 96 96 0 1 0 879 388 "
    "L 357 388 "
    "A 96 96 0 1 0 187 388 "
    "L 116 384 "
    "C 88 380, 75 368, 74 340 "
    "C 73 300, 73 272, 76 252 Z"
)

GLASS = (
    "M 478 204 "
    "C 516 178, 570 138, 634 126 "
    "C 704 120, 780 120, 844 132 "
    "C 888 152, 934 176, 966 192 Z"
)

BPILLAR = "M 686 199 L 700 124"

HANDLES = [
    "M 606 248 L 650 246 A 5 5 0 0 1 650 256 L 606 258 A 5 5 0 0 1 606 248 Z",
    "M 792 245 L 834 243 A 5 5 0 0 1 834 253 L 792 255 A 5 5 0 0 1 792 245 Z",
]

WHEELS = [(272, 344), (964, 344)]
TIRE_R, RIM_R, HUB_R = 84, 50, 9

# Panels. "body" panels are clipped and drawn in PANEL_ORDER.
# "detail" panels draw on top of the body panels so they stay readable.
# "free" panels are not clipped (the mirror sits proud of the silhouette).
PANELS = [
    ("front-bumper", "body", "transparent",
     "M 40 296 L 66 288 L 150 268 L 202 260 L 210 300 L 204 392 L 40 392 Z"),
    ("hood", "body", "transparent",
     "M 40 226 L 470 148 L 475 226 L 400 232 L 300 244 L 202 260 L 150 268 L 66 288 Z"),
    ("headlight", "detail", "body",
     "M 62 330 L 70 292 L 198 264 L 220 272 L 214 294 L 92 326 Z"),
    ("fog-light", "detail", "body",
     "M 92 336 L 134 332 A 7 7 0 0 1 140 339 L 140 352 A 7 7 0 0 1 134 359 "
     "L 92 364 A 7 7 0 0 1 85 357 L 85 343 A 7 7 0 0 1 92 336 Z"),
    ("mirror", "free", "body",
     "M 478 198 L 481 182 C 481 175, 472 172, 463 176 L 437 189 "
     "C 429 193, 431 202, 440 203 L 476 202 Z"),
    ("front-fender", "body", "transparent",
     "M 202 260 L 300 244 L 400 232 L 475 226 L 478 198 L 468 358 "
     "L 300 358 L 300 392 L 204 392 L 210 300 Z"),
    ("rocker", "body", "transparent",
     "M 330 358 L 890 358 L 890 394 L 330 394 Z"),
    ("lower-door", "body", "transparent",
     "M 471 314 L 860 310 L 858 358 L 468 358 Z"),
    ("rear-impact", "body", "transparent",
     "M 866 189 L 924 188 L 918 394 L 856 394 Z"),
    ("front-door", "body", "transparent",
     "M 478 198 L 686 193 L 678 358 L 468 358 Z"),
    ("rear-door", "body", "transparent",
     "M 686 193 L 866 189 L 858 358 L 678 358 Z"),
    ("roof", "body", "transparent",
     "M 446 202 C 492 166, 558 114, 622 90 C 700 82, 784 82, 856 94 "
     "C 908 110, 964 152, 1012 188 Z"),
    ("rear-fender", "body", "transparent",
     "M 866 189 L 970 184 L 1012 140 L 1008 220 L 1100 234 L 1174 250 "
     "L 1180 266 L 1122 286 L 1082 318 L 1062 360 L 1056 394 L 856 394 Z"),
    ("trunk", "body", "transparent",
     "M 1008 120 L 1230 200 L 1174 250 L 1100 234 L 1008 220 L 1012 140 Z"),
    ("rear-bumper", "body", "transparent",
     "M 1174 250 L 1240 262 L 1240 420 L 1030 420 L 1056 394 L 1062 360 "
     "L 1082 318 L 1122 286 L 1180 266 Z"),
]

PANEL_ORDER = [
    "front-bumper", "hood", "headlight", "fog-light", "mirror", "front-fender",
    "rocker", "lower-door", "rear-impact", "front-door", "rear-door", "roof",
    "rear-fender", "trunk", "rear-bumper",
]

IMPACT = ["front-bumper", "hood", "mirror", "headlight", "fog-light", "rocker"]

PARTIAL = ["front-bumper", "hood", "mirror"]
FULL_FRONT = PARTIAL + ["front-fender"]
TRACKBACK = FULL_FRONT + ["rocker", "lower-door", "rear-impact"]
FULL_VEHICLE = TRACKBACK + ["headlight", "fog-light", "front-door", "rear-door",
                            "roof", "rear-fender", "trunk", "rear-bumper"]
PACKAGES = {
    "partial-front": PARTIAL,
    "full-front": FULL_FRONT,
    "full-front-trackback": TRACKBACK,
    "full-vehicle": FULL_VEHICLE,
    "all": [p[0] for p in PANELS],
}

# ---------------------------------------------------------------- colours
GROUND = "#0A0B09"
BODY_FILL = "#121410"
RULE = "#2C302A"
OUTLINE = "#9BA7AE"
GLASS_FILL = "#0A0B09"
LIT_FILL = "#41423C"  # opaque: 22% spec-000 over shop-060, so overlapping panels never compound
LIT_STROKE = "#00C1F3"
TIRE_FILL = "#0E100D"
STIPPLE = "#9BA7AE"


def svg(lit, stipple=False):
    lit = set(lit)
    by_id = {p[0]: p for p in PANELS}
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEWBOX}">']
    out.append('<defs>')
    out.append(f'<clipPath id="bodyClip"><path d="{BODY}"/></clipPath>')
    out.append(
        '<pattern id="stip" width="13" height="13" patternUnits="userSpaceOnUse">'
        f'<circle cx="3" cy="3" r="2" fill="{STIPPLE}" fill-opacity="0.6"/>'
        f'<circle cx="9.5" cy="9.5" r="2" fill="{STIPPLE}" fill-opacity="0.6"/>'
        '</pattern>')
    out.append('</defs>')
    out.append(f'<rect width="1200" height="470" fill="{GROUND}"/>')

    for cx, cy in WHEELS:
        out.append(
            f'<g><circle cx="{cx}" cy="{cy}" r="{TIRE_R}" fill="{TIRE_FILL}" stroke="{RULE}" stroke-width="2"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{RIM_R}" fill="none" stroke="{RULE}" stroke-width="2"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{HUB_R}" fill="none" stroke="{RULE}" stroke-width="2"/></g>')

    out.append(f'<path d="{BODY}" fill="{BODY_FILL}"/>')

    def panel_svg(pid, path, off):
        on = pid in lit
        off_fill = BODY_FILL if off == "body" else "transparent"
        return (f'<path data-panel="{pid}" d="{path}" '
                f'fill="{LIT_FILL if on else off_fill}" '
                f'stroke="{LIT_STROKE if on else RULE}" '
                f'stroke-width="{2.4 if on else 1}" stroke-linejoin="round"/>')

    out.append('<g clip-path="url(#bodyClip)">')
    for pid in PANEL_ORDER:
        kind, off, path = by_id[pid][1], by_id[pid][2], by_id[pid][3]
        if kind == "body":
            out.append(panel_svg(pid, path, off))
    out.append('</g>')

    out.append(f'<path d="{GLASS}" fill="{GLASS_FILL}" stroke="{RULE}" stroke-width="1.5"/>')
    out.append(f'<path d="{BPILLAR}" fill="none" stroke="{RULE}" stroke-width="1.5"/>')

    for h in HANDLES:
        out.append(f'<path d="{h}" fill="none" stroke="{RULE}" stroke-width="1.4"/>')

    out.append('<g clip-path="url(#bodyClip)">')
    for pid in PANEL_ORDER:
        kind, off, path = by_id[pid][1], by_id[pid][2], by_id[pid][3]
        if kind == "detail":
            out.append(panel_svg(pid, path, off))
    out.append('</g>')
    for pid in PANEL_ORDER:
        kind, off, path = by_id[pid][1], by_id[pid][2], by_id[pid][3]
        if kind == "free":
            out.append(panel_svg(pid, path, off))

    if stipple:
        out.append('<g clip-path="url(#bodyClip)">')
        for pid in IMPACT:
            if by_id[pid][1] != "free":
                out.append(f'<path d="{by_id[pid][3]}" fill="url(#stip)" stroke="none"/>')
        out.append('</g>')
        for pid in IMPACT:
            if by_id[pid][1] == "free":
                out.append(f'<path d="{by_id[pid][3]}" fill="url(#stip)" stroke="none"/>')

    out.append(f'<path d="{BODY}" fill="none" stroke="{OUTLINE}" stroke-width="2.4" stroke-linejoin="round"/>')
    out.append(f'<line x1="0" y1="440" x2="1200" y2="440" stroke="{RULE}" stroke-width="1"/>')
    out.append(f'<line x1="0" y1="440" x2="24" y2="440" stroke="{LIT_STROKE}" stroke-width="1"/>')
    out.append('</svg>')
    return "\n".join(out)


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    open(os.path.join(here, "car-side-panels.svg"), "w").write(svg(PACKAGES["all"]))
    open(os.path.join(here, "car-side-impact.svg"), "w").write(
        svg(PACKAGES["full-front"], stipple=True))
    for name in ("partial-front", "full-front", "full-front-trackback", "full-vehicle"):
        open(os.path.join(here, f"car-side-{name}.svg"), "w").write(svg(PACKAGES[name]))
    print("wrote", sorted(f for f in os.listdir(here) if f.endswith(".svg")))
