"use client";

import { useEffect, useRef } from "react";

// A short brand-red streak that follows the mouse and fades out ("swish").
// Mouse and trackpad only, off for reduced motion, never intercepts clicks, and the
// animation loop runs only while the trail is visible.
const LIFE = 260; // ms a point stays on screen
const WIDTH = 4; // px at the newest point

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

    const color = getComputedStyle(document.documentElement).getPropertyValue("--color-red").trim() || "#cc1919";
    const points: { x: number; y: number; t: number }[] = [];
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const now = performance.now();
      while (points.length && now - points[0].t > LIFE) points.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const life = 1 - (now - b.t) / LIFE; // 1 = newest, 0 = gone
        ctx.globalAlpha = life * 0.9;
        ctx.lineWidth = Math.max(0.5, WIDTH * life);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      frame = points.length > 1 ? requestAnimationFrame(draw) : 0;
      if (!frame) ctx.clearRect(0, 0, innerWidth, innerHeight);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => (points.length = 0);

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
