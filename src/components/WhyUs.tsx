"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { reasons } from "@/data/site";
import { withDirham } from "./Dirham";

// Section 08 — four reasons as tall photo cards. They rise in one after another as the section
// enters (shared reveal), and on devices with a mouse the card under the cursor tilts toward it on
// a damped spring while its photo shifts the other way and a soft light follows the pointer
// (design-motion-principles: Jhey 3D CSS, Emil spring-follow, Jakub enter recipe).
// Phones get an upright swipe row. Reduced motion: no tilt, cards shown in place.
export function WhyUs() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cleanups: (() => void)[] = [];
    list.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
      let tx = 0, ty = 0, x = 0, y = 0, frame = 0;
      const step = () => {
        // Damped follow: eases toward the target and settles without overshoot.
        x += (tx - x) * 0.12;
        y += (ty - y) * 0.12;
        card.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
        card.style.setProperty("--px", `${(-x * 18).toFixed(1)}px`);
        card.style.setProperty("--py", `${(-y * 18).toFixed(1)}px`);
        frame = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(step) : 0;
      };
      const kick = () => {
        if (!frame) frame = requestAnimationFrame(step);
      };
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--mx", `${(tx + 0.5) * 100}%`);
        card.style.setProperty("--my", `${(ty + 0.5) * 100}%`);
        card.style.setProperty("--light", "1");
        kick();
      };
      const leave = () => {
        tx = 0;
        ty = 0;
        card.style.setProperty("--light", "0");
        kick();
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section id="why" aria-labelledby="why-title" className="on-dark mt-32 overflow-hidden bg-charcoal py-24 text-white lg:mt-48 lg:py-40">
      <div className="frame">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="why-title" data-reveal className="t-h2 lg:col-span-7">
            Why Formula Drive.
          </h2>
          <p data-reveal style={{ ["--i" as string]: 1 }} className="t-body max-w-[46ch] lg:col-span-4 lg:col-start-9">
            A Dubai Marina rental company that owns its fleet, answers its phone and puts the car where you need it.
          </p>
        </div>

        <ul
          ref={listRef}
          tabIndex={0}
          aria-label="Four reasons to book with Formula Drive"
          className="no-scrollbar -mx-[var(--margin)] mt-14 flex snap-x snap-mandatory scroll-px-[var(--margin)] gap-4 overflow-x-auto px-[var(--margin)] pb-4 [perspective:1100px] md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:mt-20 lg:grid-cols-4"
        >
          {reasons.map((r, i) => (
            <li key={r.title} data-reveal style={{ ["--i" as string]: i + 1 }} className="w-[84%] shrink-0 snap-start md:w-auto">
              <article
                data-tilt
                className={`relative flex h-full flex-col text-charcoal [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d] ${
                  i % 2 ? "bg-grey" : "bg-white"
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={r.image.src}
                    alt={r.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 84vw"
                    className="scale-[1.12] object-cover [translate:var(--px,0px)_var(--py,0px)]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6 [transform:translateZ(28px)] lg:p-7">
                  <h3 className="t-h3 font-bold uppercase [font-variation-settings:'wdth'_112]">{r.title}</h3>
                  <p className="leading-[1.45]">{withDirham(r.text)}</p>
                </div>
                <span
                  aria-hidden="true"
                  className={
                    "pointer-events-none absolute inset-0 opacity-[var(--light,0)] mix-blend-soft-light transition-opacity duration-[280ms] [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgb(255_255_255/0.4),transparent_60%)]" /* taste-skill-ignore: pointer light shown only on hover */
                  }
                />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
