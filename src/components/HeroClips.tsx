"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroSeries } from "@/data/fleet";

// The banner's clips, one per car, stacked in a single panel that stays mounted. Changing car
// cross-fades to the next clip (in time with the photographs) instead of rebuilding the player,
// so the panel never jumps, flashes or waits for a fresh download. Only the visible clip plays;
// the next one is preloaded. Muted, plays only while on screen, never automatically for
// reduced-motion users, and always has a pause button (WCAG 2.2.2).
export function HeroClips({ step, className = "" }: { step: number; className?: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [onScreen, setOnScreen] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [started, setStarted] = useState<boolean[]>(() => heroSeries.map(() => false));
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setUserPaused(true);
    const el = panel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play the visible clip from the start; pause the rest.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === step && onScreen && !userPaused) {
        v.play().catch(() => {});
      } else {
        v.pause();
        if (i !== step) v.currentTime = 0;
      }
    });
  }, [step, onScreen, userPaused]);

  const toggle = () => setUserPaused((p) => !p);

  return (
    <div ref={panel} className={`relative overflow-hidden bg-charcoal ${className}`}>
      {heroSeries.map(({ car, video, videoLabel }, i) => {
        const active = i === step;
        return (
          <div
            key={car.slug}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)] ${active ? "opacity-100" : "opacity-0"}`}
          >
            <Image src={`${video}-poster.jpg`} alt="" fill sizes="(min-width: 1024px) 25vw, 40vw" className="object-cover" />
            <video
              ref={(el) => {
                videos.current[i] = el;
              }}
              muted
              loop
              playsInline
              // The visible clip and the next one load; the others wait their turn.
              preload={i === step || i === (step + 1) % heroSeries.length ? "auto" : "none"}
              aria-label={videoLabel}
              onPlaying={() => {
                if (!started[i]) setStarted((s) => s.map((v, j) => (j === i ? true : v)));
                if (i === step) setPlaying(true);
              }}
              onPause={() => {
                if (i === step) setPlaying(false);
              }}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-[280ms] ${started[i] ? "opacity-100" : "opacity-0"}`}
            >
              <source src={`${video}-1280.webm`} type="video/webm" />
              <source src={`${video}-1280.mp4`} type="video/mp4" />
            </video>
          </div>
        );
      })}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="on-dark absolute bottom-0 left-0 z-10 grid size-12 place-items-center bg-charcoal/80 text-white transition-colors duration-[160ms] hover:bg-charcoal"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
            <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
