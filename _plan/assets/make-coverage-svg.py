#!/usr/bin/env python3
"""
Generates the Coverage Plan car diagram.

THE CAR IS A MID ENGINE COUPE, drawn from a C8 Corvette. Two of his own
gallery photos are a Rapid Blue C8 and one is a C7 Grand Sport, so the
diagram matches the cars actually on the page.

One source of truth for the geometry. Emits:
  car-side-panels.svg          every panel lit, for eyeballing the seams
  car-side-<package>.svg       one per Petty Shine PPF package
  car-side-bare.svg            nothing lit, which is the contrast check

Technique (see README.md): draw ONE body outline, clip every panel polygon
against it, then draw the outline again on top.

    python3 make-coverage-svg.py && python3 ../../scripts/render-svg.py car-side-panels.svg out.png 1200

If you change anything here, port the same numbers into
src/components/ppf/carSideMap.ts. The two are checked by eye, not by a script.
"""
import os

VIEWBOX = "0 0 1200 348"

BODY = (
    "M 30 186 "
    "C 68 170, 122 154, 178 147 "
    "C 232 142, 302 143, 372 145 "
    "C 406 118, 468 66, 526 41 "
    "C 552 32, 584 31, 614 41 "
    "C 672 58, 732 72, 798 84 "
    "C 856 88, 900 76, 952 69 "
    "C 1032 60, 1102 64, 1146 76 "
    "L 1176 92 "
    "C 1184 132, 1180 190, 1164 228 "
    "L 1126 258 "
    "C 1082 268, 1042 282, 1004 306 "
    "A 100 100 0 1 0 834 306 "
    "L 330 306 "
    "A 100 100 0 1 0 154 306 "
    "C 114 306, 60 300, 34 292 "
    "L 14 288 "
    "C 8 252, 16 210, 30 186 Z"
)

GLASS = (
    "M 382 150 C 416 122, 474 76, 530 52 C 552 47, 578 46, 602 53 "
    "L 652 152 L 400 158 C 392 157, 388 155, 388 152 Z"
)

GAP = "M 668 92 C 720 106, 780 118, 850 126 L 852 158 L 680 138 Z"

INTAKE = (
    "M 764 188 L 820 168 C 828 166, 834 173, 832 182 L 824 244 "
    "C 822 252, 816 258, 808 258 L 766 254 C 758 254, 752 248, 752 240 "
    "L 752 200 C 752 193, 757 190, 764 188 Z"
)

LINES = [
    "M 630 190 L 666 188 A 5 5 0 0 1 666 198 L 630 200 A 5 5 0 0 1 630 190 Z",
    "M 1136 74 L 1176 88",
    "M 1052 274 L 1112 250",
    "M 856 116 L 1064 108",
    "M 858 170 C 940 160, 1010 152, 1058 150",
    "M 1086 122 L 1172 130 L 1170 158 L 1084 154 Z",
]

WHEELS = [(242, 259, 81, 60, 10), (919, 254, 86, 63, 10)]

PANELS = [
    ("front-bumper", "body", "transparent",
     "M 0 160 L 30 186 L 172 146 L 184 214 L 178 320 L 0 320 Z"),
    ("hood", "body", "transparent",
     "M 0 120 L 30 186 L 178 147 C 232 142, 302 143, 372 145 L 380 156 "
     "C 320 162, 256 170, 200 178 L 176 182 L 172 146 Z"),
    ("headlight", "detail", "body",
     "M 70 190 L 78 172 L 162 140 L 176 144 L 174 166 L 88 200 Z"),
    ("fog-light", "detail", "body",
     "M 24 256 L 90 246 L 104 264 L 98 288 L 28 296 Z"),
    ("mirror", "free", "body",
     "M 396 170 L 398 150 C 398 143, 389 140, 380 144 L 352 157 "
     "C 344 161, 346 171, 355 172 Z"),
    ("front-fender", "body", "transparent",
     "M 172 146 L 176 182 L 200 178 C 256 170, 320 162, 380 156 "
     "L 388 152 L 392 320 L 176 320 L 184 214 Z"),
    ("rocker", "body", "transparent",
     "M 328 262 L 854 262 L 854 330 L 328 330 Z"),
    ("lower-door", "body", "transparent",
     "M 390 216 L 708 210 L 708 262 L 390 262 Z"),
    ("rear-impact", "body", "transparent",
     "M 706 161 L 750 160 L 754 330 L 700 330 Z"),
    ("front-door", "body", "transparent",
     "M 386 156 L 706 161 L 702 330 L 392 330 Z"),
    ("rear-door", "body", "transparent",
     "M 706 161 L 750 160 L 858 168 L 858 330 L 702 330 Z"),
    ("roof", "body", "transparent",
     "M 368 148 C 406 116, 468 64, 526 39 C 552 30, 584 29, 616 39 "
     "C 672 56, 732 70, 798 82 L 858 92 L 858 168 L 386 156 Z"),
    ("rear-fender", "body", "transparent",
     "M 856 116 L 1064 108 L 1030 300 L 1014 340 L 854 340 Z"),
    ("trunk", "body", "transparent",
     "M 858 76 C 898 70, 928 68, 952 67 C 1032 58, 1102 62, 1146 74 "
     "L 1176 92 L 1182 128 L 1064 108 L 856 116 Z"),
    ("rear-bumper", "body", "transparent",
     "M 1064 108 L 1200 112 L 1200 340 L 1014 340 L 1030 300 Z"),
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
    "bare": [],
}

# ---------------------------------------------------------------- colours
# These are the values the component actually computes at runtime on the
# shop plane, not the raw tokens, so a render here matches the site.
GROUND = "#0A0B09"           # --ps-ground
BODY_FILL = "#282C29"        # --cov-shell, quiet 16% over panel
RULE = "#6B7477"             # --cov-seam, quiet 65% over panel
OUTLINE = "#9BA7AE"          # --cov-edge, pewter
GLASS_FILL = "#0A0B09"       # --cov-glass, the ground
LIT_FILL = "#0D414B"         # --cov-covered, accent 26% over panel. Opaque.
LIT_STROKE = "#00C1F3"       # --cov-on
TIRE_FILL = "#0A0B09"
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
    out.append('<rect width="1200" height="348" fill="%s"/>' % GROUND)

    for cx, cy, tr, rr, hr in WHEELS:
        out.append(
            f'<g><circle cx="{cx}" cy="{cy}" r="{tr}" fill="{TIRE_FILL}" stroke="{RULE}" stroke-width="2"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{rr}" fill="none" stroke="{RULE}" stroke-width="2"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{hr}" fill="none" stroke="{RULE}" stroke-width="2"/></g>')

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

    # Decor is clipped too, so a seam line can never stray onto the ground.
    out.append('<g clip-path="url(#bodyClip)">')
    for d in (GLASS, GAP, INTAKE):
        out.append(f'<path d="{d}" fill="{GLASS_FILL}" stroke="{RULE}" stroke-width="1.5"/>')
    for d in LINES:
        out.append(f'<path d="{d}" fill="none" stroke="{RULE}" stroke-width="1.4"/>')
    out.append('</g>')

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
    out.append(f'<line x1="0" y1="340" x2="1200" y2="340" stroke="{RULE}" stroke-width="1"/>')
    out.append(f'<line x1="0" y1="340" x2="24" y2="340" stroke="{LIT_STROKE}" stroke-width="1"/>')
    out.append('</svg>')
    return "\n".join(out)


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    open(os.path.join(here, "car-side-panels.svg"), "w").write(svg(PACKAGES["all"]))
    open(os.path.join(here, "car-side-bare.svg"), "w").write(svg(PACKAGES["bare"]))
    open(os.path.join(here, "car-side-impact.svg"), "w").write(
        svg(PACKAGES["full-front"], stipple=True))
    for name in ("partial-front", "full-front", "full-front-trackback", "full-vehicle"):
        open(os.path.join(here, f"car-side-{name}.svg"), "w").write(svg(PACKAGES[name]))
    print("wrote", sorted(f for f in os.listdir(here) if f.endswith(".svg")))
