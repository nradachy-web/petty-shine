"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";

import { asset } from "@/lib/asset";
import "./fx.css";

/* ============================================================================
   THE TINT SHADE PREVIEW. Added 2026-10-15.

   Ported from the Refresh My Ride build (Shades.astro), which was itself
   rebuilt to the Midwest Tint bar. One studio illustration of a generic
   graphite sedan in front of a light wall, so the glass reads, and one
   transparent layer holding the same glass at its darkest. The shade you
   pick sets how much of that layer shows, so every step lines up to the
   pixel. Both pictures were made for this site with the Gemini image model
   (masters in scripts/source/art, gitignored; renditions in public/art).

   NO PERCENTAGES. Tint law and VLT figures came off this site on 2026-09-23
   at Nick's call, so the shades are named, never numbered. No film brand
   and no warranty either: none is backed in constants.ts.

   It works with script off: the shades are radio buttons and the picture,
   the readout and the card follow them in CSS (:has). Script adds the
   slider, which scrubs smoothly between shades and settles on the nearest.
   ========================================================================== */

interface Stop {
  id: string;
  name: string;
  label: string;
  title: string;
  body: string;
  privacy: string;
  privacyLevel: number;
  seeingOut: string;
  seeingLevel: number;
  /** how much of the dark layer shows */
  film: number;
}

const STOPS: Stop[] = [
  {
    id: "clear",
    name: "Clear",
    label: "No film",
    title: "Factory glass",
    body: "Untinted glass. Start here, then step through the shades to see the difference.",
    privacy: "None",
    privacyLevel: 0,
    seeingOut: "Full",
    seeingLevel: 5,
    film: 0,
  },
  {
    id: "light",
    name: "Light",
    label: "Subtle",
    title: "A light smoke",
    body: "Takes the edge off glare and sun while keeping a near factory look.",
    privacy: "Low",
    privacyLevel: 2,
    seeingOut: "High",
    seeingLevel: 4,
    film: 0.3,
  },
  {
    id: "medium",
    name: "Medium",
    label: "Balanced",
    title: "The all rounder",
    body: "Clearly tinted from the outside and still easy to see out of.",
    privacy: "Medium",
    privacyLevel: 3,
    seeingOut: "Good",
    seeingLevel: 3,
    film: 0.55,
  },
  {
    id: "dark",
    name: "Dark",
    label: "Private",
    title: "Dark and clean",
    body: "A deep, even shade that hides the cabin and gives the car a sharper look.",
    privacy: "High",
    privacyLevel: 4,
    seeingOut: "Reduced",
    seeingLevel: 2,
    film: 0.8,
  },
  {
    id: "limo",
    name: "Limo",
    label: "Darkest",
    title: "Limo",
    body: "The glass reads black from the outside. The most privacy and the sleekest look.",
    privacy: "Max",
    privacyLevel: 5,
    seeingOut: "Low",
    seeingLevel: 1,
    film: 1,
  },
];

const START = STOPS.findIndex((s) => s.id === "dark");

const WIDTHS = [640, 960, 1280, 1600, 2000] as const;
const SIZES = "(min-width: 1280px) 76rem, 100vw";

function srcSet(name: string, ext: "avif" | "webp") {
  return WIDTHS.map((w) => `${asset(`/art/${name}-${w}.${ext}`)} ${w}w`).join(", ");
}

function Meter({ level }: { level: number }) {
  return <span className="fx-meter" style={{ "--v": level } as CSSProperties} aria-hidden="true" />;
}

export default function TintPreview({ ctaLabel = "Get this look" }: { ctaLabel?: string }) {
  const name = useId();
  const root = useRef<HTMLDivElement>(null);

  /* The slider. Kept out of React state on purpose: dragging writes one
     opacity per frame and nothing else on the page needs to re-render. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const range = el.querySelector<HTMLInputElement>(".fx-tv__range");
    const film = el.querySelector<HTMLElement>(".fx-tv__film");
    const radios = Array.from(el.querySelectorAll<HTMLInputElement>("input[type=radio]"));
    if (!range || !film || !radios.length) return;
    const amounts = STOPS.map((s) => s.film);
    const at = () => Math.max(0, radios.findIndex((r) => r.checked));

    range.hidden = false;
    range.value = String(at());

    // Dragging scrubs smoothly between shades. Letting go settles on the nearest one.
    const onInput = () => {
      const v = Number(range.value);
      const i = Math.min(radios.length - 2, Math.floor(v));
      film.style.transition = "none";
      film.style.opacity = String(amounts[i] + (amounts[i + 1] - amounts[i]) * (v - i));
      radios[Math.round(v)].checked = true;
    };
    const settle = () => {
      range.value = String(Math.round(Number(range.value)));
      film.style.transition = "";
      film.style.opacity = "";
    };
    const onPick = () => {
      range.value = String(at());
      film.style.transition = "";
      film.style.opacity = "";
    };
    range.addEventListener("input", onInput);
    range.addEventListener("change", settle);
    radios.forEach((r) => r.addEventListener("change", onPick));
    return () => {
      range.removeEventListener("input", onInput);
      range.removeEventListener("change", settle);
      radios.forEach((r) => r.removeEventListener("change", onPick));
    };
  }, []);

  return (
    <div ref={root} className="fx-tv" style={{ "--n": STOPS.length } as CSSProperties}>
      <div className="fx-frame">
        <div className="fx-tv__stage">
          <picture>
            <source type="image/avif" srcSet={srcSet("tint-clear", "avif")} sizes={SIZES} />
            <source type="image/webp" srcSet={srcSet("tint-clear", "webp")} sizes={SIZES} />
            <img
              src={asset("/art/tint-clear-960.webp")}
              width={2000}
              height={1053}
              alt="Illustration of a graphite sedan in a studio, seen from the side, with the window glass shown at the shade you pick"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <picture className="fx-tv__film">
            <source type="image/avif" srcSet={srcSet("tint-film", "avif")} sizes={SIZES} />
            <source type="image/webp" srcSet={srcSet("tint-film", "webp")} sizes={SIZES} />
            <img src={asset("/art/tint-film-960.webp")} width={2000} height={1053} alt="" loading="lazy" decoding="async" />
          </picture>
          <p className="fx-tv__read" aria-hidden="true">
            <span className="fx-tv__viewing">Viewing</span>
            {STOPS.map((s) => (
              <strong key={s.id} data-stop={s.id}>
                {s.name}
              </strong>
            ))}
          </p>
          <span className="fx-tag" aria-hidden="true">
            Illustration
          </span>
        </div>

        <div className="fx-tv__controls">
          <input
            className="fx-tv__range"
            type="range"
            min={0}
            max={STOPS.length - 1}
            step={0.01}
            defaultValue={START}
            aria-hidden="true"
            tabIndex={-1}
            hidden
          />
          <fieldset className="fx-tv__picker">
            <legend className="sr-only">Choose a tint shade to preview</legend>
            {STOPS.map((s, i) => (
              <label key={s.id} className="fx-tv__opt">
                <input type="radio" name={name} value={s.id} defaultChecked={i === START} />
                <span className="fx-tv__name">{s.name}</span>
                <span className="fx-tv__lab">{s.label}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="fx-tv__foot">
          <div className="fx-tv__info">
            {STOPS.map((s) => (
              <div key={s.id} className="fx-tv__card" data-stop={s.id}>
                <h3 className="fx-tv__title">{s.id === "clear" ? `Clear: ${s.title}` : s.title}</h3>
                <p className="fx-tv__body">{s.body}</p>
                <dl className="fx-tv__meta">
                  <div>
                    <dt>Privacy</dt>
                    <dd>
                      <Meter level={s.privacyLevel} />
                      {s.privacy}
                    </dd>
                  </div>
                  <div>
                    <dt>Seeing out</dt>
                    <dd>
                      <Meter level={s.seeingLevel} />
                      {s.seeingOut}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <a className="ps-btn ps-btn--cyan ps-btn--sm fx-cta" href="#quote" data-cta="tint-look">
            {ctaLabel}
          </a>
        </div>
      </div>
      <p className="fx-note">
        <span className="fx-note__k">Simulated preview</span>
        An illustration, not a photo of a customer&apos;s car. On screen shades are an approximation and every screen shows them a little differently. Tell us the look you want with your free quote and we will help you pick the right film for each window.
      </p>
    </div>
  );
}
