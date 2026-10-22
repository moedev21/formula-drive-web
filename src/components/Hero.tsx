"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroSeries, formatAmount } from "@/data/fleet";
import { Dirham } from "./Dirham";
import { generalEnquiry } from "@/lib/whatsapp";
import { ArrowRight, WhatsAppIcon } from "./icons";
import { LoopVideo } from "./LoopVideo";

// Each car after the first holds the stage for this much scroll (in svh).
const STEP_SVH = 55;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [step, setStep] = useState(0);

  // Pin only when motion is welcome; without JS or with reduced motion the hero is a still poster.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setPinned(!mq.matches);
      if (mq.matches) setStep(0);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const travel = el.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / Math.max(1, travel)));
        setStep(Math.min(heroSeries.length - 1, Math.floor(progress * heroSeries.length)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned]);

  const current = heroSeries[step];

  const scrollToStep = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (travel * (i + 0.5)) / heroSeries.length, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative"
      style={pinned ? { height: `calc(100svh + ${(heroSeries.length - 1) * STEP_SVH}svh)` } : undefined}
    >
      <div
        className={`${pinned ? "sticky top-[var(--header-h)]" : ""} frame @container flex flex-col pb-6 pt-4 lg:pb-10 lg:pt-6 ${
          pinned ? "h-[calc(100svh-var(--header-h))]" : "min-h-[calc(100svh-var(--header-h))]"
        }`}
      >
        <h1 id="hero-title" className="t-display relative z-10 text-charcoal" aria-label="Drive the extraordinary.">
          <span className="block overflow-hidden pb-[0.04em] md:inline-block">
            <span className="hero-word" style={{ ["--i" as string]: 0 }}>Drive</span>{" "}
            <span className="hero-word" style={{ ["--i" as string]: 1 }}>the</span>
          </span>{" "}
          <span className="block overflow-hidden pb-[0.04em] md:inline-block">
            <span className="hero-word" style={{ ["--i" as string]: 2 }}>extraordinary.</span>
          </span>
        </h1>

        <p className="hero-fade t-body mt-4 max-w-[40ch] lg:mt-6 lg:max-w-[52ch]" style={{ ["--i" as string]: 0 }}>
          Supercar, sports car and SUV rental in Dubai Marina, booked direct with the owner. Ferrari, Lamborghini, Porsche
          and more, from <Dirham />
          170 a day.
        </p>

        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-x-6 gap-y-5 lg:mt-8 lg:grid lg:grid-cols-12">
          {/* The fleet, changing under the pinned headline */}
          <div className="hero-media relative min-h-[240px] flex-1 overflow-hidden bg-grey lg:order-2 lg:col-span-6 lg:col-start-4">
            {heroSeries.map(({ car, img }, i) => (
              <Image
                key={car.slug}
                src={img.src}
                alt={`${car.name} from the Formula Drive fleet`}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 66vw, 100vw"
                className={`object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out)] ${
                  i === step ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
                aria-hidden={i !== step}
              />
            ))}
          </div>

          {/* Desktop only: the current car's own portrait clip beside its photograph. Keyed by car,
              so it swaps to the next clip as the banner moves on. */}
          <LoopVideo
            key={current.car.slug}
            src={current.video}
            size={1280}
            sizes="25vw"
            label={current.videoLabel}
            className="hero-media hidden lg:order-3 lg:col-span-3 lg:block"
          />

          <div className="flex flex-col gap-5 lg:order-1 lg:col-span-3 lg:gap-6">
            {pinned && (
              <ol aria-label="Cars in this showcase" className="mb-auto hidden flex-col lg:flex">
                {heroSeries.map(({ car }, i) => (
                  <li key={car.slug}>
                    <button
                      type="button"
                      onClick={() => scrollToStep(i)}
                      aria-current={i === step ? "true" : undefined}
                      className={`hero-fade flex min-h-11 items-center text-left transition-colors duration-[280ms] ${
                        i === step ? "font-semibold text-charcoal" : "text-muted hover:text-charcoal"
                      }`}
                      style={{ ["--i" as string]: i }}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-[2px] bg-red transition-[width,margin] duration-[280ms] ease-[var(--ease-out)] ${i === step ? "mr-3 w-6" : "mr-0 w-0"}`}
                      />
                      {car.name}
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <p aria-live="polite" className="hero-fade flex flex-col" style={{ ["--i" as string]: 0 }}>
              <span className="t-h3">{current.car.name}</span>
              {current.car.pricePerDayAED && (
                <span className="t-small num text-muted">
                  <Dirham />
                  {formatAmount(current.car.pricePerDayAED)} / day, {current.car.vatLabel}
                </span>
              )}
            </p>
            <div className="hero-fade grid gap-3 sm:flex sm:flex-wrap lg:grid" style={{ ["--i" as string]: 2 }}>
              <a href="#fleet" className="btn btn-dark">
                Explore fleet <ArrowRight />
              </a>
              <a href={generalEnquiry} target="_blank" rel="noopener" className="btn btn-red">
                <WhatsAppIcon /> Book your drive
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
