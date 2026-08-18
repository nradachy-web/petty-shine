# The Coverage Plan diagram

The flagship asset. A side profile of a mid engine coupe, drawn from a C8 Corvette, where every body
panel is separately addressable and lights up when a paint protection film package covers it.

It is a C8 because two of the gallery photos on this site are his own Rapid Blue C8 and one is a C7
Grand Sport, so the diagram matches the cars actually on the page. The first pass drew a generic four
door sedan and it was the one thing Nick named by name.

**The shipped geometry lives in `src/components/ppf/carSideMap.ts`.** Everything in this folder is
the workshop that produced it, kept so the next person can change the drawing without reverse
engineering path data out of a React component.

## Files

| File | What it is |
|---|---|
| `make-coverage-svg.py` | The generator. One source of truth for the geometry. |
| `car-side-panels.svg` | Every panel covered. The one to look at when checking seams. |
| `car-side-bare.svg` | Nothing covered. The contrast check, see Colours below. |
| `car-side-partial-front.svg` | Partial Front End, 3 of 15 panels. |
| `car-side-full-front.svg` | Full Front End, 4 of 15. The default tier on the site. |
| `car-side-full-front-trackback.svg` | Full Front End with Trackback, 7 of 15. |
| `car-side-full-vehicle.svg` | Full Vehicle, 15 of 15. |
| `car-side-impact.svg` | Full Front End with the highway speed stipple switched on. |

```
python3 make-coverage-svg.py
python3 ../../scripts/render-svg.py car-side-panels.svg out.png 1400
```

Then open `out.png` and actually look at it. The sedan took fourteen render and look cycles to become
a car; the C8 took about the same again to stop reading as a generic coupe. Budget it.

If you change the geometry here, port the same numbers into `carSideMap.ts`. The two are checked
against each other by eye, not by a script.

## The technique

Draw ONE good body outline. Use it three ways:

```svg
<defs><clipPath id="bodyClip"><path d="…the outline…"/></clipPath></defs>
<path d="…the outline…" fill="#282C29"/>                     <!-- the shell underneath -->
<g clip-path="url(#bodyClip)">
  <path data-panel="hood" d="…"/>                            <!-- panels, clipped -->
</g>
<path d="…the outline…" fill="none" stroke="#9BA7AE"/>       <!-- the edge, drawn last -->
```

A panel polygon can then run well past the silhouette and still land exactly inside it. That is what
lets seams meet with no gap, and it means a panel edge that would have doubled the body outline is
clipped away instead of drawn twice.

**The decor is clipped the same way**, and that is not optional. A shut line drawn two units long ran
straight off the silhouette and across the front wheel, and the mistake is invisible in the path data.

## The drawing, to scale

1200 by 348, facing left. A real C8 is 182.3 in long on a 107.2 in wheelbase and stands 48.6 in tall,
so 1152 px of length is 6.32 px per inch and every number below falls out of that.

```
ground line     y = 340, which is also the foot of the box
front axle      (242, 259)   tyre r 81, rim 60, 19 in rim on a 25.75 in tyre
rear axle       (919, 254)   tyre r 86, rim 63, 20 in rim on a 27.20 in tyre
wheelbase       677, which is 107 in
wheel arches    r 100 centred on each axle, meeting the rocker at y 306
rocker line     y = 306
beltline        y = 156 at the A pillar, 168 at the intake
door shut       x = 706
```

### What makes it read as a C8 and not a generic coupe

Every one of these is a deliberate number, and losing any of them loses the car:

- **The cabin sits far forward**, because the engine is behind it. The windscreen foot is at x 372,
  only 130 px behind the front axle.
- **The roof peaks at x 560**, which is 47 percent of the way along the wheelbase and therefore ahead
  of its midpoint at 580. That is the single clearest mid engine tell in a side profile.
- **Short front overhang against a very long rear deck.** 228 px in front of the front axle, and the
  deck runs 386 px from where the buttress lands at x 858 to the tail at 1176.
- **A low wedge nose at y 186 and a rear haunch crowning at y 67**, so the tail stands well above the
  nose rather than level with it.
- **A large side intake ahead of the rear wheel**, x 752 to 832. It is a signature, so it is drawn as
  a real opening filled with the ground rather than as a panel line.
- **Flying buttresses with a gap you can see through.** The `gap` decor shape is the void under the
  buttress. It is what stops the rear reading as one flat slab.
- **Big wheels, short sidewalls, tight arches.** Rim over tyre is 0.74, which is what a 19 and 20 inch
  wheel pair actually measures.

### Panels

Adjacent panels share their seam coordinates exactly, so nothing can drift apart:

```
bumper / hood             (30,186) (172,146)
hood / front fender       (172,146) (200,178) (380,156)
fender / front door       (386,156) down to (392,306)
front door / intake pod   (706,161) down to (702,306)
intake pod / rear fender  (858,168) down to (854,306)
rear fender / trunk       (856,116) (1064,108)
rear fender / rear bumper (1064,108) down to (1030,300)
```

Three panels sit on a `detail` or `free` layer so they stay readable: the headlight and the lower
intake draw over the bumper, and the mirror is not clipped at all because it sits proud of the
silhouette. All three are opaque when uncovered, which is the whole point of them. Partial Front End
genuinely leaves the headlights bare, and the diagram has to show that as a hole in the film rather
than as nothing at all.

The roof panel deliberately runs the entire greenhouse surround, the A pillar and both buttresses
included. The glass and the buttress gap are drawn over it and leave exactly the roof skin, the
pillar and the buttress showing, which is both what a full wrap covers and what stops the pillars
reading as unexplained dark wedges.

**A coupe has no rear doors.** The panel ids are fixed, because the four packages in
`src/lib/constants.ts` are keyed to them, so `rear-door` is drawn where the car actually divides: the
intake pod between the door shut and the rear wheel arch. It costs nothing, because `front-door` and
`rear-door` only ever appear together, in Full Vehicle, so the two are always in the same state. All
fifteen ids are drawn, which is what keeps the "N of 15 panels" count in the record honest.

## Colours

Every colour is a design token. The generator hardcodes the values the component actually computes at
runtime on the shop plane, not the raw tokens, so a render here matches the site.

```
ground   --ps-ground   #0A0B09
shell    --cov-shell   #282C29   = 16% pewter over shop-060
seam     --cov-seam    #6B7477   = 65% pewter over shop-060
edge     --cov-edge    #9BA7AE   pewter
covered  --cov-covered #0D414B   = 26% cyan-500 over shop-060. OPAQUE.
stroke   --cov-on      #00C1F3   (cyan-ink on the paper plane)
stipple  --cov-mark    #9BA7AE
```

The covered fill is **opaque**, not a translucent tint: the lower door strip sits under the door skin
and the rear impact band sits over the intake pod, and with alpha those overlaps composited into a
third, brighter shade that read as a panel of its own.

**The shell used to be `--ps-panel`,** the same near black the section behind it is built from, which
measured 1.06 to 1 against the ground. The covered panels were tuned against it and read fine; the
thing they were being compared against did not read at all, so the diagram said "some cyan shapes"
rather than "this much of the car". It is now a small fraction of the quiet tone, which clears about
1.4 to 1 against the ground while staying clearly under the covered fill. Render `car-side-bare.svg`
and look at it before touching this: if the bare car does not read, nothing else in the component
matters.

In the component all of these are `var(--cov-*)` reads, so the same drawing works on either plane.

## The layout the drawing sits in

Three bands, and the middle one is the drawing at full width. The first pass ran the diagram down a
sticky left column beside a fifteen row record; the record is about twice the height of anything that
can sit on the left, so it opened with a column of dead space and only a real scroll rescued it. The
record cannot be made shorter, because naming all fifteen panels, covered and bare alike, is the
point of the component.

```
[ COVERAGE LEVEL   chip chip chip chip ]              full width
[ ============ the drawing ========== ]              full width, 3.4 : 1
[ hairline legend and the one car note ]
[ tier, impact block, button ] [ the record, 8 rows + 7 rows ]
```

Below 80rem the last band stacks instead, and the record still runs in two columns because it has the
full width to do it in. The static no-JS and reduced motion stack uses the identical three bands, so
the fallback and the real thing look like the same component and balance for the same reason.
