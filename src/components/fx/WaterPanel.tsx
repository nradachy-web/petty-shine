"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import "./fx.css";

/* ============================================================================
   WATER ON BARE PAINT AGAINST WATER ON COATED PAINT. Added 2026-10-15.

   Ported from the Refresh My Ride build (Water.astro), which ported Jake's
   canvas panel. A small particle model of one behaviour: how water sits on
   the panel.
     Coated  water pulls into tight round beads. Once a bead gathers enough
             water it lets go, rolls down the panel and takes the beads in its
             path with it. The panel ends up nearly dry.
     Bare    water flattens into wide patches that join into sheets, creep down
             slowly and leave a wet film behind that takes its time drying.

   The panel rinses itself once when it scrolls into view and again whenever
   the visitor switches surface, presses the button, or drags across it. It
   is an illustration and the caption says so. It names no product: the
   coatings and their guarantees are in the tiers band on the hub.

   Nothing is drawn or computed until the panel is near the screen.
   ========================================================================== */

type Mode = "bare" | "coated";

const SURFACES: { mode: Mode; label: string; note: string }[] = [
  {
    mode: "bare",
    label: "Bare paint",
    note: "On bare paint, water lies flat, joins into sheets and clings. It creeps off slowly and dries where it sits.",
  },
  {
    mode: "coated",
    label: "Coated",
    note: "On a coated panel, water pulls into tight beads. Once a bead is heavy enough it rolls away and takes the ones in its path with it.",
  },
];
const START = 1;

const aria = (i: number) =>
  `Illustration of water on a dark paint panel. Surface shown: ${SURFACES[i].label.toLowerCase()}. ${SURFACES[i].note}`;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One bead, drawn once at a large size and scaled for every drop.
function beadSprite(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const m = size / 2;
  const r = size * 0.36;
  // Contact shadow, down and to the right of the light.
  const sh = g.createRadialGradient(m + r * 0.16, m + r * 0.24, r * 0.5, m + r * 0.16, m + r * 0.24, r * 1.28);
  sh.addColorStop(0, "rgba(0,0,0,0.6)");
  sh.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = sh;
  g.fillRect(0, 0, size, size);
  // Body: clear water over dark paint, darker toward the rim.
  const body = g.createRadialGradient(m - r * 0.3, m - r * 0.36, r * 0.05, m, m, r);
  body.addColorStop(0, "rgba(160,214,236,0.5)");
  body.addColorStop(0.5, "rgba(34,92,118,0.55)");
  body.addColorStop(0.9, "rgba(5,20,28,0.9)");
  body.addColorStop(1, "rgba(190,230,246,0.55)");
  g.fillStyle = body;
  g.beginPath();
  g.arc(m, m, r, 0, Math.PI * 2);
  g.fill();
  // Light gathered on the far side of the bead.
  g.save();
  g.translate(m + r * 0.3, m + r * 0.36);
  g.rotate(-0.7);
  const ca = g.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
  ca.addColorStop(0, "rgba(196,236,250,0.75)");
  ca.addColorStop(1, "rgba(120,200,236,0)");
  g.fillStyle = ca;
  g.scale(1, 0.55);
  g.beginPath();
  g.arc(0, 0, r * 0.5, 0, Math.PI * 2);
  g.fill();
  g.restore();
  // The lamp, reflected.
  g.save();
  g.translate(m - r * 0.36, m - r * 0.42);
  g.rotate(-0.6);
  g.scale(1, 0.62);
  g.fillStyle = "rgba(255,255,255,0.96)";
  g.beginPath();
  g.arc(0, 0, r * 0.24, 0, Math.PI * 2);
  g.fill();
  g.restore();
  return c;
}

// A soft dot, used to stamp water into the film layer on bare paint.
function dotSprite(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const m = size / 2;
  const fill = g.createRadialGradient(m, m, 0, m, m, m);
  fill.addColorStop(0, "rgba(255,255,255,1)");
  fill.addColorStop(0.55, "rgba(255,255,255,0.8)");
  fill.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = fill;
  g.fillRect(0, 0, size, size);
  return c;
}

interface Drop {
  x: number;
  y: number;
  r: number;
  vy: number;
  ph: number;
  flat: number;
  grip: number;
  sq: number;
  left: number;
}

export default function WaterPanel({ ctaLabel = "Get my coating quote" }: { ctaLabel?: string }) {
  const [at, setAt] = useState(START);
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const mode = useRef<Mode>(SURFACES[START].mode);
  const api = useRef({ rinse: () => {}, reset: () => {} });

  useEffect(() => {
    const next = SURFACES[at].mode;
    if (next === mode.current) return;
    mode.current = next;
    api.current.reset();
    api.current.rinse();
  }, [at]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = root.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !host || !ctx || !("IntersectionObserver" in window)) return;

    const CAP = 760;
    // The film layer runs below the panel's size: it is read back every frame to
    // find the edge of the water, and it is meant to look soft.
    const FILM = 1.5;
    const WET = 112; // wetness above which the paint shows as wet

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rand = rng(321);
    const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
    let W = 1;
    let H = 1;
    let dpr = 1;
    let scale = 1; // drop sizes follow the panel width a little
    let drops: Drop[] = [];
    let film: HTMLCanvasElement | null = null; // where water is right now (alpha only)
    let sheet: HTMLCanvasElement | null = null; // the wet film, drawn as water
    let wet = new Float32Array(0); // how wet each film pixel is, 0..255. It dries over time.
    let fw = 1;
    let fh = 1;
    let bead: HTMLCanvasElement | null = null;
    let dot: HTMLCanvasElement | null = null;
    let sprayFrom = 0;
    let sprayTo = 0;
    let clock = 0; // simulation time, seconds
    const pointer = { x: 0, y: 0, on: false };
    let visible = false;
    let seen = false;
    let built = false;
    let raf = 0;
    let last = 0;

    function size() {
      const rect = canvas!.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (built && w === W && h === H) return false;
      W = w;
      H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      scale = Math.max(0.6, Math.min(1.35, W / 900));
      fw = Math.max(1, Math.round(W / FILM));
      fh = Math.max(1, Math.round(H / FILM));
      film = document.createElement("canvas");
      sheet = document.createElement("canvas");
      film.width = sheet.width = fw;
      film.height = sheet.height = fh;
      wet = new Float32Array(fw * fh);
      bead = beadSprite(Math.round(112 * dpr));
      dot = dotSprite(64);
      built = true;
      return true;
    }

    const shown = (d: Drop, coated: boolean) => (coated ? d.r : d.r * (1 + 0.95 * d.flat));
    // Beads differ: most let go early, some cling until they are large. That is
    // what leaves a mix of sizes sitting on the panel after a rinse.
    const fresh = (x: number, y: number, r: number): Drop => ({
      x,
      y,
      r,
      vy: 0,
      ph: rand() * 6.283,
      flat: 0,
      grip: 0.8 + Math.pow(rand(), 2.2) * 1.5,
      sq: 0.92 + rand() * 0.16,
      left: 0,
    });

    function addWater(x: number, y: number, r: number, coated: boolean) {
      const cap = (coated ? 22 : 30) * scale;
      for (const d of drops) {
        const reach = shown(d, coated) * 0.92;
        const dx = d.x - x;
        const dy = d.y - y;
        if (dx * dx + dy * dy < reach * reach) {
          d.r = Math.min(cap, Math.sqrt(d.r * d.r + r * r));
          return;
        }
      }
      if (drops.length < CAP) drops.push(fresh(x, y, r));
    }

    function step(dt: number) {
      clock += dt;
      const coated = mode.current === "coated";
      const letGo = (coated ? 7.6 : 12) * scale; // size at which a drop starts to move
      const cap = (coated ? 22 : 30) * scale;

      if (clock < sprayTo) {
        const p = (clock - sprayFrom) / (sprayTo - sprayFrom);
        const sx = W * (-0.06 + 1.12 * p);
        const n = coated ? 10 : 4;
        for (let k = 0; k < n; k++) {
          const r = (coated ? 3 + rand() * 4.4 : 3.4 + rand() * 4.6) * scale;
          addWater(sx + gauss() * W * 0.075, H * (0.03 + rand() * 0.9), r, coated);
        }
      }
      if (pointer.on) {
        for (let k = 0; k < 2; k++) {
          const r = (coated ? 2.8 + rand() * 4.2 : 3.6 + rand() * 4.6) * scale;
          addWater(pointer.x + gauss() * 30 * scale, pointer.y + gauss() * 30 * scale, r, coated);
        }
      }

      for (const d of drops) {
        if (!coated) d.flat = Math.min(1, d.flat + dt * 1.7);
        if (d.r > letGo * (coated ? d.grip : 1)) {
          if (coated) {
            d.vy += (620 + d.r * 70) * dt;
            d.vy *= 0.993;
            // A rolling bead sheds small droplets behind it now and then.
            d.left += d.vy * dt;
            if (d.left > (46 + d.ph * 9) * scale && drops.length < CAP) {
              d.left = 0;
              const rr = (1.4 + rand() * 2.4) * scale;
              const kid = fresh(d.x + gauss() * d.r * 0.5, d.y - d.r - rr - 2, rr);
              kid.grip = 9; // it stays where it was left
              drops.push(kid);
            }
          } else {
            const goal = 12 + (d.r - letGo) * 3;
            d.vy += (goal - d.vy) * Math.min(1, dt * 2.2);
          }
          d.y += d.vy * dt;
          d.x += Math.sin(d.ph + d.y * 0.045) * (coated ? 0.55 : 0.2);
        } else {
          d.vy = 0;
        }
      }

      // Drops that touch join. On a coating, beads that are sitting still keep to themselves.
      for (let i = 0; i < drops.length; i++) {
        const a = drops[i];
        if (a.r <= 0) continue;
        const aMoving = a.r > letGo * (coated ? a.grip : 1);
        const ra = shown(a, coated);
        for (let j = i + 1; j < drops.length; j++) {
          const b = drops[j];
          if (b.r <= 0) continue;
          if (coated && !aMoving && b.r <= letGo * b.grip) continue;
          const reach = (ra + shown(b, coated)) * (coated ? 0.84 : 0.7);
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy > reach * reach) continue;
          const big = a.r >= b.r ? a : b;
          const small = big === a ? b : a;
          const total = Math.sqrt(a.r * a.r + b.r * b.r);
          big.vy = Math.max(a.vy, b.vy);
          big.r = Math.min(cap, total);
          big.grip = Math.min(big.grip, 2.3); // a shed droplet that grows can roll again
          small.r = 0;
          if (small === a) break;
        }
      }
      drops = drops.filter((q) => q.r > 0 && q.y - shown(q, coated) < H + 4);
    }

    // Bare paint only. Wherever water sits or passes, the panel is wet, and a
    // wet patch dries slowly from its thin edges inward.
    function soak(dt: number) {
      if (mode.current === "coated" || !film || !dot) return;
      const f = film.getContext("2d", { willReadFrequently: true })!;
      f.clearRect(0, 0, fw, fh);
      for (const d of drops) {
        const R = (shown(d, false) * 1.32) / FILM;
        f.drawImage(dot, d.x / FILM - R, d.y / FILM - R * 1.08, R * 2, R * 2.16);
      }
      const now = f.getImageData(0, 0, fw, fh).data;
      const dry = dt * 21;
      for (let n = 0, p = 3; n < wet.length; n++, p += 4) {
        const v = wet[n] - dry;
        const here = now[p];
        wet[n] = here > v ? here : v > 0 ? v : 0;
      }
    }

    function draw() {
      if (!ctx) return;
      const coated = mode.current === "coated";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      const base = ctx.createLinearGradient(0, 0, 0, H);
      base.addColorStop(0, "#161915");
      base.addColorStop(0.55, "#0b0c0a");
      base.addColorStop(1, "#050605");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      // A soft light across the panel. Sharper on the coated surface.
      ctx.save();
      ctx.translate(W * 0.26, -H * 0.1);
      ctx.rotate(0.42);
      const band = ctx.createLinearGradient(0, 0, W * 0.34, 0);
      const peak = coated ? 0.16 : 0.085;
      band.addColorStop(0, "rgba(140,206,232,0)");
      band.addColorStop(coated ? 0.42 : 0.3, `rgba(140,206,232,${peak * 0.5})`);
      band.addColorStop(0.5, `rgba(214,238,246,${peak})`);
      band.addColorStop(coated ? 0.58 : 0.7, `rgba(140,206,232,${peak * 0.5})`);
      band.addColorStop(1, "rgba(140,206,232,0)");
      ctx.fillStyle = band;
      ctx.fillRect(0, -H, W * 0.34, H * 3);
      ctx.restore();

      if (!coated && sheet) {
        // Draw the wet film as water: a faint body and a brighter line where it ends.
        const o = sheet.getContext("2d")!;
        const out = o.createImageData(fw, fh);
        const w = out.data;
        const off = fw * 2 + 2; // two film pixels down and to the right
        const end = wet.length - 1;
        for (let i = 0, p = 0; i < wet.length; i++, p += 4) {
          const v = wet[i];
          if (v <= WET - 22) continue;
          const t = v >= WET + 22 ? 1 : (v - (WET - 22)) / 44;
          const body = t * t * (3 - 2 * t);
          // The lamp is up and to the left. Where the film's edge faces it the
          // edge catches light; on the far side it throws a thin shadow.
          const toward = wet[i - off < 0 ? 0 : i - off];
          const away = wet[i + off > end ? end : i + off];
          let lit = ((away - toward) / 255) * 2.6;
          lit = lit > 1 ? 1 : lit < -1 ? -1 : lit;
          if (lit > 0.04) {
            w[p] = 226;
            w[p + 1] = 242;
            w[p + 2] = 248;
            w[p + 3] = body * (30 + lit * 150);
          } else if (lit < -0.04) {
            w[p] = 3;
            w[p + 1] = 16;
            w[p + 2] = 24;
            w[p + 3] = body * (30 - lit * 120);
          } else {
            w[p] = 150;
            w[p + 1] = 210;
            w[p + 2] = 236;
            w[p + 3] = body * 30;
          }
        }
        o.putImageData(out, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(sheet, 0, 0, W, H);
      }

      if (coated && bead) {
        for (const d of drops) {
          const s = d.r / 0.36; // the bead is 36% of its sprite, as a radius
          // A rolling bead stretches a little along its path.
          const stretch = (1 + Math.min(0.35, d.vy / 1400)) / d.sq;
          const wide = s * d.sq;
          ctx.drawImage(bead, d.x - wide / 2, d.y - (s * stretch) / 2, wide, s * stretch);
        }
      }

      const vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.4, W / 2, H / 2, Math.max(W, H) * 0.78);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }

    const busy = () => clock < sprayTo + 0.2 || pointer.on || drops.some((d) => d.vy > 0.5);

    function frame(now: number) {
      raf = 0;
      const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
      last = now;
      step(dt);
      soak(dt);
      draw();
      // Keep going while water is moving. On bare paint the film keeps drying for a while after.
      const drying = mode.current === "bare" && clock < sprayTo + 14;
      if (visible && (busy() || drying)) raf = requestAnimationFrame(frame);
    }
    function start() {
      if (raf || !visible || !built) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function rinse() {
      if (!built) return;
      sprayFrom = clock;
      sprayTo = clock + 1.7;
      if (reduce.matches) {
        // No animation: work the rinse through and show where the water ends up.
        for (let i = 0; i < 60 * 5; i++) step(1 / 60);
        soak(0);
        draw();
        return;
      }
      start();
    }
    function reset() {
      if (!built) return;
      drops = [];
      wet.fill(0);
      draw();
    }
    api.current = { rinse, reset };

    function local(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }
    function down(e: PointerEvent) {
      if (reduce.matches || !built) return;
      pointer.on = true;
      local(e);
      host!.setAttribute("data-touched", "");
      start();
    }
    function move(e: PointerEvent) {
      // A mouse sprays while it moves over the panel; touch sprays while pressed.
      if (!pointer.on && e.pointerType !== "mouse") return;
      down(e);
    }
    function up() {
      pointer.on = false;
    }
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", up);
    canvas.addEventListener("pointercancel", up);

    // Sizes and draws a little before the panel arrives; rinses once a third of it shows.
    let resize: ResizeObserver | null = null;
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || built) return;
        size();
        draw();
        if ("ResizeObserver" in window) {
          resize = new ResizeObserver(() => {
            if (!size()) return;
            drops = [];
            draw();
            if (seen) rinse();
          });
          resize.observe(canvas);
        }
      },
      { rootMargin: "300px 0px" }
    );
    near.observe(canvas);
    const onScreen = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (!visible) return;
        if (!built) {
          size();
          draw();
        }
        if (!seen) {
          seen = true;
          rinse();
        } else {
          start();
        }
      },
      { threshold: 0.35 }
    );
    onScreen.observe(canvas);

    return () => {
      near.disconnect();
      onScreen.disconnect();
      resize?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      api.current = { rinse: () => {}, reset: () => {} };
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerleave", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (at + step + SURFACES.length) % SURFACES.length;
    setAt(next);
    buttons.current[next]?.focus();
  }

  return (
    <figure ref={root} className="fx-wa">
      <div className="fx-canvas fx-canvas--water">
        <canvas ref={canvasRef} role="img" aria-label={aria(at)} />
        <p className="fx-hint" aria-hidden="true">
          Drag to spray
        </p>
        <span className="fx-tag" aria-hidden="true">
          Illustration
        </span>
      </div>
      <div className="fx-bar fx-bar--water">
        <div
          className="fx-seg"
          role="group"
          aria-label="Paint surface"
          style={{ "--n": SURFACES.length, "--i": at } as CSSProperties}
          onKeyDown={onKey}
        >
          <span className="fx-seg__thumb" aria-hidden="true" />
          {SURFACES.map((s, i) => (
            <button
              key={s.mode}
              ref={(b) => {
                buttons.current[i] = b;
              }}
              type="button"
              aria-pressed={i === at}
              onClick={() => setAt(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="ps-btn ps-btn--ghost ps-btn--sm fx-rinse"
          aria-label="Rinse it again"
          onClick={() => api.current.rinse()}
        >
          <span className="fx-rinse__long">Rinse it again</span>
          <span className="fx-rinse__short">Rinse</span>
        </button>
        <p className="fx-bar__note" aria-live="polite">
          {SURFACES[at].note}
        </p>
        <a className="ps-btn ps-btn--cyan ps-btn--sm fx-cta" href="#quote" data-cta="water-quote">
          {ctaLabel}
        </a>
      </div>
      <figcaption className="fx-note">
        <span className="fx-note__k">Illustration</span>
        How water behaves on bare and coated paint. Not a photo, and not a test of a specific coating. Drag across the panel to spray it.
      </figcaption>
    </figure>
  );
}
