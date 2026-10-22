"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Base path without size/extension, e.g. "/video/ferrari-f8-headlight". */
  src: string;
  /** Encoded height to use: 1280 (narrow panes) or 1920 (large panes). */
  size: 1280 | 1920;
  label: string;
  className?: string;
  /** Rendered width of the pane, for the poster image's srcset. */
  sizes: string;
};

// A muted, looping clip that plays only while on screen, never for reduced-motion users unless they
// press play, and always offers a pause button (WCAG 2.2.2). The poster is a lazy, optimised image
// rather than the video's poster attribute, which would download eagerly and compete with the hero.
export function LoopVideo({ src, size, label, sizes, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setUserPaused(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [userPaused]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  return (
    <div className={`relative overflow-hidden bg-charcoal ${className}`}>
      <Image src={`${src}-poster.jpg`} alt="" fill sizes={sizes} className="object-cover" />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPlaying={() => setStarted(true)}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-[280ms] ${started ? "opacity-100" : "opacity-0"}`}
      >
        <source src={`${src}-${size}.webm`} type="video/webm" />
        <source src={`${src}-${size}.mp4`} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="on-dark absolute bottom-0 left-0 grid size-12 place-items-center bg-charcoal/80 text-white transition-colors duration-[160ms] hover:bg-charcoal"
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
