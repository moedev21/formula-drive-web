"use client";

import { useEffect, useRef } from "react";

// A brand-red streak that follows the mouse and fades out ("swish").
// The head eases towards the cursor every frame and the trail is drawn as a curve through the
// midpoints of its samples, so it stays smooth even when mouse events arrive unevenly.
// Mouse and trackpad only, off for reduced motion, never intercepts clicks, and the animation
// loop runs only while the trail is visible.
const LIFE = 700; // ms a sample stays on screen
const WIDTH = 5; // px at the head
const FOLLOW = 0.4; // share of the remaining distance the head covers per 60 fps frame
const MAX_POINTS = 160;

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
    const points: { x: number; y: number; t: number }[] = [];
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

    const draw = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16.7;
      last = now;

      // Ease the head towards the cursor (frame-rate independent).
      const k = 1 - Math.pow(1 - FOLLOW, dt / 16.7);
      head.x += (target.x - head.x) * k;
      head.y += (target.y - head.y) * k;
      const moving = Math.hypot(target.x - head.x, target.y - head.y) > 0.3;
      if (active && moving) points.push({ x: head.x, y: head.y, t: now });
      while (points.length && (now - points[0].t > LIFE || points.length > MAX_POINTS)) points.shift();

      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      // Quadratic curves through the midpoints: each piece starts where the last one ended.
      for (let i = 1; i < points.length - 1; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const life = Math.max(0, 1 - (now - p1.t) / LIFE); // 1 = newest
        const ease = life * life * (3 - 2 * life); // smoothstep, so the tail thins gently
        ctx.globalAlpha = ease;
        ctx.lineWidth = Math.max(0.6, WIDTH * ease);
        ctx.beginPath();
        ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
        ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

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
