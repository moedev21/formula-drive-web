"use client";

import { useRef } from "react";
import { business, reviews } from "@/data/site";
import { ArrowLeft, ArrowRight } from "./icons";

// Section 09a — renters' own words, quoted verbatim from Google reviews.
export function Reviews() {
  const track = useRef<HTMLUListElement>(null);
  const page = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="pt-32 lg:pt-48">
      <div className="frame">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="reviews-title" data-reveal className="t-h2">
              Renters, in their own words.
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
            <button type="button" onClick={() => page(-1)} aria-label="Previous reviews" className="grid size-12 place-items-center bg-grey transition-colors duration-[160ms] hover:bg-line">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => page(1)} aria-label="Next reviews" className="grid size-12 place-items-center bg-grey transition-colors duration-[160ms] hover:bg-line">
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={track}
        tabIndex={0}
        aria-label="Google reviews"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-[var(--margin)] gap-6 overflow-x-auto px-[var(--margin)] lg:mt-16"
      >
        {reviews.map((r, i) => (
          <li key={i} data-reveal style={{ ["--i" as string]: i }} className="w-[86%] shrink-0 snap-start sm:w-[520px] lg:w-[560px]">
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
