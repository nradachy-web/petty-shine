# The Coverage Plan diagram

The flagship asset. A side profile of a four door car where every body panel is separately
addressable and lights up when a paint protection film package covers it.

**The shipped geometry lives in `src/components/ppf/carSideMap.ts`.** Everything in this folder is
the workshop that produced it, kept so the next person can change the drawing without reverse
engineering path data out of a React component.

## Files

| File | What it is |
|---|---|
| `make-coverage-svg.py` | The generator. One source of truth for the geometry. |
| `car-side-panels.svg` | Every panel covered. The one to look at when checking seams. |
| `car-side-partial-front.svg` | Partial Front End, 3 of 15 panels. |
| `car-side-full-front.svg` | Full Front End, 4 of 15. The default tier on the site. |
| `car-side-full-front-trackback.svg` | Full Front End with Trackback, 7 of 15. |
| `car-side-full-vehicle.svg` | Full Vehicle, 15 of 15. |
| `car-side-impact.svg` | Full Front End with the highway speed stipple switched on. |

```
python3 make-coverage-svg.py
python3 ../../scripts/render-svg.py car-side-panels.svg out.png 1400
```

Then open `out.png` and actually look at it. The first draft of this asset had crude rectangular
panels with visible gaps, a hood that did not meet the nose, and floating headlight boxes. It took
fourteen render and look cycles to get to a car. Budget the same.

If you change the geometry here, port the same numbers into `carSideMap.ts`. The two are checked
against each other by eye, not by a script.

## The technique

Draw ONE good body outline. Use it three ways:

```svg
<defs><clipPath id="bodyClip"><path d="…the outline…"/></clipPath></defs>
<path d="…the outline…" fill="#121410"/>                     <!-- the shell underneath -->
<g clip-path="url(#bodyClip)">
  <path data-panel="hood" d="…"/>                            <!-- panels, clipped -->
</g>
<path d="…the outline…" fill="none" stroke="#9BA7AE"/>       <!-- the edge, drawn last -->
```

A panel polygon can then run well past the silhouette and still land exactly inside it. That is what
lets seams meet with no gap, and it means a panel edge that would have doubled the body outline is
clipped away instead of drawn twice.

## The drawing, to scale

1200 by 470, facing left.

```
ground line     y = 428
axles           (272, 344) and (964, 344), a 692 wheelbase
tyre radius     84, wheel arch radius 96 centred on the axle
rocker line     y = 388
beltline        y = 204 at the A pillar, rising to 192 at the C
```

Adjacent panels share their seam coordinates exactly, so nothing can drift apart:

```
hood / front bumper       (66,288) (150,268) (202,260)
hood / front fender       (202,260) (300,244) (400,232) (475,226)
fender / front door       (478,198) down to (468,358)
front door / rear door    (686,193) down to (678,358)
rear door / quarter       (866,189) down to (858,358)
quarter / trunk           (1008,220) (1100,234) (1174,250)
quarter / rear bumper     (1174,250) through (1082,318) to (1056,394)
```

Three panels sit on a `detail` or `free` layer so they stay readable: the headlight and fog light
draw over the bumper, and the mirror is not clipped at all because it sits proud of the silhouette.
All three are opaque when uncovered, which is the whole point of them. Partial Front End genuinely
leaves the headlights bare, and the diagram has to show that as a hole in the film rather than as
nothing at all.

The roof panel deliberately runs the entire greenhouse surround, pillars included. The glass cutout
is drawn over it and leaves exactly the roof skin and the two pillars showing, which is both what a
full wrap covers and what stops the A and C pillars reading as unexplained dark wedges.

## Colours

Every colour is a design token. The covered fill is **opaque**, not a translucent tint: the lower
door strip sits under the door skins and the rear impact band sits under the quarter, and with alpha
those overlaps composited into a third, brighter shade that read as a panel of its own.

```
ground   shop-000   #0A0B09
shell    shop-060   #121410
seam     rule-dark  #2C302A
edge     pewter     #9BA7AE
covered             #41423C   = 22% spec-000 over shop-060
stroke   cyan-500   #00C1F3   (cyan-ink on the paper plane)
stipple  pewter     #9BA7AE
```

In the component these are all `var(--ps-*)` reads, so the same drawing works on either plane. The
generator hardcodes the shop plane values because that is what the flagship ships on.
