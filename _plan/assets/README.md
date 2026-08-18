# Flagship asset: the PPF coverage diagram

`car-side-base.svg` is a working side-profile car silhouette.
`car-side-panels-DRAFT.svg` proves the panel technique but the panel edges are still crude
rectangles with visible gaps. It is a starting point, not a finished asset.

## The technique that works
Draw ONE good body outline. Then clip every panel against it:

```svg
<defs><clipPath id="bodyClip"><path d="...the body outline..."/></clipPath></defs>
<g clip-path="url(#bodyClip)">
  <polygon data-panel="hood" points="..." />
</g>
<path d="...the body outline..." fill="none" stroke="..."/>   <!-- outline drawn last, on top -->
```

Panels can then be sloppy rectangles and they still land exactly inside the car. Draw the outline
last so it stays crisp over the fills.

## How to see what you are making
```
python3 scripts/render-svg.py path/to/file.svg out.png 1200
```
That runs headless Chromium and writes a real PNG at the viewBox aspect. Read the PNG, look at it,
fix the numbers, render again. Do NOT ship this asset without looking at it. Budget several rounds.

## Panels the diagram has to be able to light up
Driven by Petty Shine's four published PPF packages:
- Partial Front: front bumper, full hood, mirrors
- Full Front: adds full front fenders
- Full Front with Trackback: adds rocker panels, lower doors, rear impact area
- Full Vehicle: adds rear bumper, trunk, headlights, fog lights, rear fenders, all doors, roof

So the addressable panels are: front-bumper, hood, mirror, front-fender, rocker, lower-door,
rear-impact, rear-bumper, trunk, headlight, fog-light, rear-quarter, front-door, rear-door, roof.

## What good looks like
The panel edges should follow real body seams, not a grid. The hood should meet the front bumper at
the nose. The fender should wrap the wheel arch. The rocker should be a thin strip between the two
arches. No gaps, no overlaps, no floating rectangles.
