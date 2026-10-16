"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { DETAIL_PACKAGES } from "@/lib/constants";
import "./fx.css";

/* ============================================================================
   PAINT UNDER AN INSPECTION LIGHT. Added 2026-10-15.

   Ported from the Refresh My Ride build (Swirl.astro), which ported Jake's
   canvas panel. Swirl marks are thousands of fine curved scratches. Each one
   only shows where it runs square to the line back to the light, which is
   why they appear as rings around a lamp and follow it. The canvas draws
   exactly that, so moving the pointer (or a finger) moves the light and the
   rings with it.

   The stages are the two levels Judson sells (DETAIL_PACKAGES level-2 and
   level-3), worded from their own blurbs: Level 2 is a machine polish that
   pulls back gloss and clarity, Level 3 permanently removes medium to heavy
   defects. It is an illustration and the caption says so.

   Nothing is drawn or computed until the panel is near the screen.
   ========================================================================== */

const L2 = DETAIL_PACKAGES.find((p) => p.id === "level-2")!;
const L3 = DETAIL_PACKAGES.find((p) => p.id === "level-3")!;

const STAGES = [
  {
    label: "Before",
    name: "before correction",
    level: 0,
    note: "Years of washing leave fine scratches in the clear coat. Under a light they show as rings, and the reflection goes hazy.",
  },
  {
    label: "Level 2",
    name: `after a ${L2.name}`,
    level: 0.62,
    note: `${L2.name}, ${"subtitle" in L2 ? L2.subtitle.toLowerCase() : "paint enhancement"}. A machine polish pulls back gloss and clarity and softens the light marks. The deeper ones are still there.`,
  },
  {
    label: "Level 3",
    name: `after a ${L3.name}`,
    level: 1,
    note: `${L3.name}, ${"subtitle" in L3 ? L3.subtitle.toLowerCase() : "paint correction"}. True correction goes after the medium to heavy defects too. On paint that can take it, the light comes back as a clean point.`,
  },
] as const;

const aria = (i: number) =>
  `Illustration of dark paint under an inspection light. Shown: ${STAGES[i].name}. ${STAGES[i].note}`;

/* The same scratches on every visit. */
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

export default function SwirlPanel({ ctaLabel = "Get my paint quoted" }: { ctaLabel?: string }) {
  const [stage, setStage] = useState(0);
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const target = useRef<number>(STAGES[0].level);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    target.current = STAGES[stage].level;
    wake.current();
  }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = root.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !host || !ctx || !("IntersectionObserver" in window)) return;

    const PER_ARC = 6;
    const BUCKETS = 6;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0;
    let H = 0;
    let dpr = 1;
    let seg = new Float32Array(0); // x, y, dx, dy, half length, depth
    let count = 0;
    let flakes: HTMLCanvasElement | null = null;
    let mask: HTMLCanvasElement | null = null;
    const light = { x: 0, y: 0, tx: 0, ty: 0 };
    let cur = 0;
    let pointerOn = false;
    let visible = false;
    let built = false;
    let raf = 0;
    let t0 = performance.now();
    const paths: Path2D[] = [];

    function build() {
      const rect = canvas!.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (built && w === W && h === H) return;
      W = w;
      H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);

      const rand = rng(5861);
      const arcs = Math.round((W * H) / 105);
      count = arcs * PER_ARC;
      seg = new Float32Array(count * 6);
      let k = 0;
      for (let i = 0; i < arcs; i++) {
        // Wash marks are loose circular strokes: random centre, random radius.
        const r = 14 + Math.pow(rand(), 1.7) * Math.min(W, H) * 0.42;
        const cx = -40 + rand() * (W + 80);
        const cy = -40 + rand() * (H + 80);
        const a0 = rand() * Math.PI * 2;
        const sweep = 0.35 + rand() * 0.9;
        // Most scratches are shallow. A few are deep and take the longest to remove.
        const depth = Math.pow(rand(), 0.75);
        const step = sweep / PER_ARC;
        for (let s = 0; s < PER_ARC; s++) {
          const a = a0 + step * (s + 0.5);
          const ca = Math.cos(a);
          const sa = Math.sin(a);
          seg[k++] = cx + r * ca;
          seg[k++] = cy + r * sa;
          seg[k++] = -sa;
          seg[k++] = ca;
          seg[k++] = (r * step) / 2 + 0.6;
          seg[k++] = depth;
        }
      }

      // Metallic flake, drawn once and reused. Cool silver with a trace of cyan.
      flakes = document.createElement("canvas");
      flakes.width = canvas!.width;
      flakes.height = canvas!.height;
      const f = flakes.getContext("2d")!;
      const n = Math.round((W * H) / 26);
      for (let j = 0; j < n; j++) {
        const v = rand();
        f.fillStyle = `rgba(${170 + Math.round(v * 60)},${206 + Math.round(v * 40)},${232 + Math.round(v * 23)},${0.05 + rand() * 0.3})`;
        const size = rand() < 0.08 ? 1.6 * dpr : dpr;
        f.fillRect(rand() * canvas!.width, rand() * canvas!.height, size, size);
      }

      mask = document.createElement("canvas");
      mask.width = mask.height = Math.ceil(Math.min(W, H) * 0.62 * 1.9 * dpr);

      if (!built) {
        light.x = light.tx = W * 0.6;
        light.y = light.ty = H * 0.42;
      }
      built = true;
    }

    function draw() {
      if (!ctx || !mask || !flakes) return;
      const lx = light.x;
      const ly = light.y;
      const clean = cur; // 0 swirled .. 1 corrected
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // Paint: the shop's warm near black, a touch lighter toward the top like a hood under a ceiling light.
      const base = ctx.createLinearGradient(0, 0, 0, H);
      base.addColorStop(0, "#151814");
      base.addColorStop(0.55, "#0a0b09");
      base.addColorStop(1, "#050605");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      const reach = Math.min(W, H) * 0.62;

      // Glow of the lamp in the clear coat. Hazy on worn paint, tight on corrected.
      const bloomR = reach * (1.15 - 0.45 * clean);
      const bloom = ctx.createRadialGradient(lx, ly, 0, lx, ly, bloomR);
      bloom.addColorStop(0, `rgba(176,222,240,${0.28 - 0.11 * clean})`);
      bloom.addColorStop(0.4, `rgba(40,140,180,${0.11 - 0.045 * clean})`);
      bloom.addColorStop(1, "rgba(0,60,90,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      // Corrected paint has depth: a wide pool of colour under the lamp that swirled paint scatters away.
      if (clean > 0.02) {
        const pool = ctx.createRadialGradient(lx, ly, 0, lx, ly, reach * 1.7);
        pool.addColorStop(0, `rgba(0,150,200,${0.26 * clean})`);
        pool.addColorStop(0.35, `rgba(0,96,140,${0.16 * clean})`);
        pool.addColorStop(1, "rgba(0,36,60,0)");
        ctx.fillStyle = pool;
        ctx.fillRect(0, 0, W, H);
      }

      // Flake sparkles near the light: the flake layer, masked to a soft disc.
      const size = mask.width;
      const sx = Math.round(lx * dpr - size / 2);
      const sy = Math.round(ly * dpr - size / 2);
      const m = mask.getContext("2d")!;
      m.globalCompositeOperation = "source-over";
      m.clearRect(0, 0, size, size);
      m.drawImage(flakes, -sx, -sy);
      m.globalCompositeOperation = "destination-in";
      const g = m.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(0.4, "rgba(0,0,0,0.7)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      m.fillStyle = g;
      m.fillRect(0, 0, size, size);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 0.55 + 0.4 * clean;
      ctx.drawImage(mask, sx, sy);
      ctx.globalAlpha = 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scratches. Sorted into brightness buckets so each is one stroke call.
      for (let b = 0; b < BUCKETS; b++) paths[b] = new Path2D();
      const cutoff = clean * 1.06;
      const reach2 = reach * reach;
      for (let i = 0; i < count; i++) {
        const o = i * 6;
        const depth = seg[o + 5];
        const left = depth - cutoff;
        if (left <= 0) continue;
        const vx = seg[o] - lx;
        const vy = seg[o + 1] - ly;
        const d2 = vx * vx + vy * vy;
        if (d2 > reach2 || d2 < 16) continue;
        const dist = Math.sqrt(d2);
        // 1 when the scratch runs square to the line from the light.
        const square = Math.abs(seg[o + 2] * vy - seg[o + 3] * vx) / dist;
        const s2 = square * square;
        const s8 = s2 * s2 * s2 * s2;
        const fall = 1 - dist / reach;
        const power = s8 * s8 * fall * fall * Math.min(1, left * 3.2) * (0.55 + depth * 0.6);
        if (power < 0.035) continue;
        const bk = Math.min(BUCKETS - 1, Math.floor(power * BUCKETS));
        const hl = seg[o + 4];
        const p = paths[bk];
        p.moveTo(seg[o] - seg[o + 2] * hl, seg[o + 1] - seg[o + 3] * hl);
        p.lineTo(seg[o] + seg[o + 2] * hl, seg[o + 1] + seg[o + 3] * hl);
      }
      ctx.lineCap = "round";
      for (let q = 0; q < BUCKETS; q++) {
        const al = (q + 0.6) / BUCKETS;
        ctx.strokeStyle = `rgba(236,234,226,${0.1 + al * 0.62})`;
        ctx.lineWidth = 0.55 + al * 0.55;
        ctx.stroke(paths[q]);
      }

      // The lamp itself, reflected: a soft blob on swirled paint, a hard point when clean.
      // Sized to the panel, so a phone does not get a lamp a quarter of its height.
      const k = Math.max(0.42, Math.min(1.15, Math.min(W, H) / 560));

      if (clean > 0.02) {
        // The lamp's long reflection: only clear paint holds a line this sharp.
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(-0.2);
        const len = reach * 1.5;
        const streak = ctx.createLinearGradient(-len, 0, len, 0);
        streak.addColorStop(0, "rgba(200,232,246,0)");
        streak.addColorStop(0.5, `rgba(240,246,248,${0.55 * clean})`);
        streak.addColorStop(1, "rgba(200,232,246,0)");
        ctx.fillStyle = streak;
        ctx.fillRect(-len, -1.1 * k, len * 2, 2.2 * k);
        const soft = ctx.createLinearGradient(-len * 0.7, 0, len * 0.7, 0);
        soft.addColorStop(0, "rgba(0,180,230,0)");
        soft.addColorStop(0.5, `rgba(0,180,230,${0.14 * clean})`);
        soft.addColorStop(1, "rgba(0,180,230,0)");
        ctx.fillStyle = soft;
        ctx.fillRect(-len * 0.7, -7 * k, len * 1.4, 14 * k);
        ctx.restore();
        // A fine halo ring around the lamp.
        ctx.strokeStyle = `rgba(206,236,248,${0.3 * clean})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(lx, ly, (20 + 22 * clean) * k * 1.9, 0, Math.PI * 2);
        ctx.stroke();
      }

      const coreR = (46 - 26 * clean) * k;
      const core = ctx.createRadialGradient(lx, ly, 0, lx, ly, coreR);
      core.addColorStop(0, "rgba(255,255,255,1)");
      core.addColorStop(0.18 + 0.52 * clean, `rgba(240,246,248,${0.75 + 0.25 * clean})`);
      core.addColorStop(1, "rgba(170,220,240,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(lx, ly, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Edge falloff.
      ctx.globalCompositeOperation = "source-over";
      const vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }

    function frame(now: number) {
      raf = 0;
      if (!pointerOn && !reduce.matches) {
        // Idle: the lamp drifts in a slow figure of eight.
        const t = (now - t0) / 1000;
        light.tx = W * (0.5 + 0.27 * Math.sin(t * 0.42));
        light.ty = H * (0.47 + 0.2 * Math.sin(t * 0.84 + 0.6));
      }
      const ease = reduce.matches ? 1 : 0.11;
      light.x += (light.tx - light.x) * ease;
      light.y += (light.ty - light.y) * ease;
      cur += (target.current - cur) * (reduce.matches ? 1 : 0.07);
      draw();
      const settled =
        Math.abs(light.tx - light.x) < 0.3 && Math.abs(light.ty - light.y) < 0.3 && Math.abs(target.current - cur) < 0.002;
      // Keep running while on screen, unless reduced motion has nothing left to settle.
      if (visible && !(reduce.matches && settled)) raf = requestAnimationFrame(frame);
    }
    function start() {
      if (!raf && visible && built) raf = requestAnimationFrame(frame);
    }
    wake.current = start;

    function move(e: PointerEvent) {
      if (!built) return;
      const rect = canvas!.getBoundingClientRect();
      pointerOn = true;
      light.tx = Math.max(0, Math.min(W, e.clientX - rect.left));
      light.ty = Math.max(0, Math.min(H, e.clientY - rect.top));
      host!.setAttribute("data-touched", "");
      start();
    }
    function leave() {
      pointerOn = false;
      t0 = performance.now() - 2000;
      start();
    }
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointercancel", leave);

    let resize: ResizeObserver | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (!visible) return;
        if (!built) {
          build();
          draw();
          if ("ResizeObserver" in window) {
            resize = new ResizeObserver(() => {
              build();
              draw();
            });
            resize.observe(canvas);
          }
        }
        start();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(canvas);

    return () => {
      io.disconnect();
      resize?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      wake.current = () => {};
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointercancel", leave);
    };
  }, []);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (stage + step + STAGES.length) % STAGES.length;
    setStage(next);
    buttons.current[next]?.focus();
  }

  return (
    <figure ref={root} className="fx-sw">
      <div className="fx-canvas fx-canvas--swirl">
        <canvas ref={canvasRef} role="img" aria-label={aria(stage)} />
        <p className="fx-hint" aria-hidden="true">
          Move the light
        </p>
        <span className="fx-tag" aria-hidden="true">
          Illustration
        </span>
      </div>
      <div className="fx-bar fx-bar--swirl">
        <div
          className="fx-seg"
          role="group"
          aria-label="Stage of correction"
          style={{ "--n": STAGES.length, "--i": stage } as CSSProperties}
          onKeyDown={onKey}
        >
          <span className="fx-seg__thumb" aria-hidden="true" />
          {STAGES.map((s, i) => (
            <button
              key={s.label}
              ref={(b) => {
                buttons.current[i] = b;
              }}
              type="button"
              aria-pressed={i === stage}
              onClick={() => setStage(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="fx-bar__note" aria-live="polite">
          {STAGES[stage].note}
        </p>
        <a className="ps-btn ps-btn--cyan ps-btn--sm fx-cta" href="#quote" data-cta="swirl-quote">
          {ctaLabel}
        </a>
      </div>
      <figcaption className="fx-note">
        <span className="fx-note__k">Illustration</span>
        How swirl marks show under an inspection light, not a photo of a customer&apos;s car and not a promise for your paint. How far a scratch comes out depends on how deep it goes. Move your pointer or finger across the panel to move the light.
      </figcaption>
    </figure>
  );
}
