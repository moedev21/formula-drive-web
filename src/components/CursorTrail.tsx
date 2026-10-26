"use client";

import { useEffect, useRef } from "react";

// A brand-red streak that follows the mouse and fades out ("swish").
// The head eases towards the cursor every frame; the samples are smoothed (Chaikin) and the
// trail is filled as one tapered ribbon, so there are no visible joins between segments.
// Mouse and trackpad only, off for reduced motion, never intercepts clicks, and the animation
// loop runs only while the trail is visible.
const LIFE = 700; // ms a sample stays on screen
const WIDTH = 3; // px at the head
const FOLLOW = 0.3; // share of the remaining distance the head covers per 60 fps frame
const MIN_STEP = 1.5; // px between samples; smaller moves are skipped to avoid jitter
const MAX_POINTS = 140;

type P = { x: number; y: number; t: number };

// One pass of Chaikin corner-cutting: rounds the polyline while keeping its ends.
function chaikin(pts: P[]): P[] {
  if (pts.length < 3) return pts;
  const out: P[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    out.push(
      { x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25, t: a.t * 0.75 + b.t * 0.25 },
      { x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75, t: a.t * 0.25 + b.t * 0.75 },
    );
  }
  out.push(pts[pts.length - 1]);
  return out;
}

export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The logo red (#CC1919), read from the design token.
    const color = getComputedStyle(document.documentElement).getPropertyValue("--color-red").trim() || "#cc1919";
    const points: P[] = [];
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    let active = false; // the pointer is over the page
    let frame = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawRibbon = (now: number) => {
      const pts = chaikin(chaikin(points));
      if (pts.length < 2) return;
      const left: [number, number][] = [];
      const right: [number, number][] = [];
      for (let i = 0; i < pts.length; i++) {
        const prev = pts[Math.max(0, i - 1)];
        const next = pts[Math.min(pts.length - 1, i + 1)];
        let nx = -(next.y - prev.y);
        let ny = next.x - prev.x;
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        const life = Math.max(0, 1 - (now - pts[i].t) / LIFE); // 1 = newest
        const half = (WIDTH / 2) * life * life * (3 - 2 * life); // smoothstep taper to a point
        left.push([pts[i].x + nx * half, pts[i].y + ny * half]);
        right.push([pts[i].x - nx * half, pts[i].y - ny * half]);
      }
      ctx.beginPath();
      ctx.moveTo(left[0][0], left[0][1]);
      for (let i = 1; i < left.length; i++) ctx.lineTo(left[i][0], left[i][1]);
      for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
      ctx.closePath();
      ctx.fill();
      // Round off the head.
      const h = pts[pts.length - 1];
      const hl = Math.max(0, 1 - (now - h.t) / LIFE);
      ctx.beginPath();
      ctx.arc(h.x, h.y, (WIDTH / 2) * hl * hl * (3 - 2 * hl), 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16.7;
      last = now;

      // Ease the head towards the cursor (frame-rate independent).
      const k = 1 - Math.pow(1 - FOLLOW, dt / 16.7);
      head.x += (target.x - head.x) * k;
      head.y += (target.y - head.y) * k;
      const moving = Math.hypot(target.x - head.x, target.y - head.y) > 0.3;
      const tail = points[points.length - 1];
      if (active && moving && (!tail || Math.hypot(head.x - tail.x, head.y - tail.y) >= MIN_STEP)) {
        points.push({ x: head.x, y: head.y, t: now });
      }
      while (points.length && (now - points[0].t > LIFE || points.length > MAX_POINTS)) points.shift();

      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.fillStyle = color;
      drawRibbon(now);

      if (points.length > 1 || (active && moving)) {
        frame = requestAnimationFrame(draw);
      } else {
        frame = 0;
        last = 0;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!active) {
        // Start the head at the cursor so the trail doesn't sweep in from the last exit point.
        head.x = target.x;
        head.y = target.y;
        active = true;
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => {
      active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
}
