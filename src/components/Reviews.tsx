"use client";

import { useEffect, useRef, useState } from "react";
import { business, reviews } from "@/data/site";
import { ArrowLeft, ArrowRight } from "./icons";

// Section 09a — renters' own words, quoted verbatim from Google reviews.
// The track scrolls natively (touch, trackpad, keyboard); with a mouse it can also be dragged.
// The arrows move by whole cards and dim at each end.
export function Reviews() {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Keep the arrows in step with the scroll position.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Drag to scroll with a mouse. Snapping is paused while dragging and restored on release,
  // so the track settles on the nearest card. A drag never counts as a click.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) {
        moved = true;
        el.setPointerCapture(e.pointerId);
        el.style.scrollSnapType = "none";
        el.style.scrollBehavior = "auto";
        el.dataset.dragging = "";
      }
      el.scrollLeft = startLeft - dx;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      delete el.dataset.dragging;
      el.style.scrollBehavior = "";
      el.style.scrollSnapType = "";
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, []);

  // Move by as many whole cards as fit in the view (at least one).
  const page = (dir: number) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const css = getComputedStyle(el);
    const step = card.offsetWidth + (parseFloat(css.columnGap) || 0);
    const perView = Math.max(1, Math.floor((el.clientWidth - (parseFloat(css.paddingLeft) || 0)) / step));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step * perView, behavior: reduce ? "auto" : "smooth" });
  };

  // aria-disabled rather than disabled, so keyboard focus stays on the arrow at either end.
  const arrow = "grid size-12 place-items-center bg-grey transition-[background-color,opacity] duration-[160ms] hover:bg-line aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:bg-grey";

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="pt-32 lg:pt-48">
      <div className="frame">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="reviews-title" data-reveal className="t-h2">
              <span className="text-red">Renters</span>, in their own words.
            </h2>
            <p data-reveal style={{ ["--i" as string]: 1 }} className="t-body mt-6">
              From our{" "}
              <a href={business.googleReviews.href} target="_blank" rel="noopener" className="link">
                {business.googleReviews.count} Google reviews
              </a>
              .
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => !atStart && page(-1)} aria-disabled={atStart} aria-label="Previous reviews" className={arrow}>
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => !atEnd && page(1)} aria-disabled={atEnd} aria-label="Next reviews" className={arrow}>
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* The track reveals as one block, so cards beyond the right edge are never left invisible. */}
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Google reviews"
        data-reveal
        style={{ ["--i" as string]: 2 }}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-[var(--margin)] gap-6 overflow-x-auto px-[var(--margin)] select-none [@media(pointer:fine)]:cursor-grab data-[dragging]:cursor-grabbing lg:mt-16"
      >
        {reviews.map((r, i) => (
          <li key={i} className="w-[86%] shrink-0 snap-start sm:w-[520px] lg:w-[560px]">
            <figure className="flex h-full flex-col bg-grey-2 p-7 lg:p-10">
              <blockquote className="t-h3 font-medium leading-[1.3]">
                <p>“{r.quote}”</p>
              </blockquote>
              <figcaption className="mt-auto flex flex-col pt-8">
                <span className="font-semibold">{r.author}</span>
                <span className="t-small text-muted">
                  Rented a {r.car} · Posted on Google
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
