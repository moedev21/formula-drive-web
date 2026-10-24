"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { carPath, cars, categories, formatAmount, type Car, type CategoryId } from "@/data/fleet";
import { business } from "@/data/site";
import { Dirham } from "./Dirham";
import { carEnquiry } from "@/lib/whatsapp";
import { QuickView } from "./QuickView";
import { ArrowRight, PhoneIcon, WhatsAppIcon } from "./icons";

type Filter = CategoryId | "all";
type Sort = "featured" | "price-asc" | "price-desc" | "name";

const sorts: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name: A to Z" },
];

function withTransition(update: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!reduce && doc.startViewTransition) doc.startViewTransition(() => flushSync(update));
  else update();
}

export function Fleet() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [open, setOpen] = useState<Car | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: cars.length };
    for (const car of cars) for (const id of car.categories) c[id] = (c[id] ?? 0) + 1;
    return c;
  }, []);

  const visible = useMemo(() => {
    const list = filter === "all" ? [...cars] : cars.filter((c) => c.categories.includes(filter));
    const price = (c: Car) => c.pricePerDayAED ?? Infinity;
    if (sort === "price-asc") list.sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") list.sort((a, b) => price(b) - price(a));
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [filter, sort]);

  const activeLabel = categories.find((c) => c.id === filter)!.label.toLowerCase();

  return (
    <section id="fleet" aria-labelledby="fleet-title" className="pt-24 lg:pt-40">
      <div className="frame">
        {/* Section 03 — vehicle discovery */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="fleet-title" data-reveal className="t-h2 lg:col-span-7">
            Luxury car rental in Dubai Marina.
          </h2>
          <p data-reveal style={{ ["--i" as string]: 1 }} className="t-body max-w-[46ch] lg:col-span-4 lg:col-start-9">
            Supercars, sports cars, SUVs and convertibles, all priced per day. Open any car for specifications and rental
            terms, then call us or send a WhatsApp to book.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 lg:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by category" className="-ml-3 flex flex-wrap lg:ml-0">
            {categories.map((c) => {
              const pressed = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => withTransition(() => setFilter(c.id))}
                  className={`group relative min-h-12 shrink-0 px-3 transition-colors duration-[160ms] lg:px-4 lg:first:pl-0 ${
                    pressed ? "font-semibold text-charcoal" : "text-muted hover:text-charcoal"
                  }`}
                >
                  {c.label} <span className="num t-small align-super text-muted">{counts[c.id] ?? 0}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-1 left-3 right-3 h-[2px] origin-left bg-red transition-transform duration-[280ms] ease-[var(--ease-out)] lg:left-4 lg:right-4 lg:group-first:left-0 ${
                      pressed ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-3 t-small">
            <span className="text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => {
                // Read now: the deferred transition callback runs after React restores the controlled value.
                const next = e.target.value as Sort;
                withTransition(() => setSort(next));
              }}
              className="min-h-12 border border-line bg-white px-3 pr-8 text-charcoal"
            >
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p aria-live="polite" className="sr-only">
          Showing {visible.length} {filter === "all" ? "cars" : activeLabel}
        </p>

        {/* Section 04 — the fleet */}
        <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:mt-10 lg:grid-cols-3 2xl:grid-cols-4">
          {visible.map((car) => (
            <li key={car.slug} style={{ viewTransitionName: `car-${car.id}` }} className="group relative">
              {/* The whole card opens Quick View; without JavaScript it is a link to the car's own page. */}
              <a
                href={carPath(car)}
                onClick={(e) => {
                  e.preventDefault();
                  triggerRef.current = e.currentTarget;
                  setOpen(car);
                }}
                aria-haspopup="dialog"
                className="block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-grey">
                  <Image
                    src={car.images[0].src}
                    alt={`${car.name}, exterior`}
                    fill
                    sizes="(min-width: 1920px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5 flex flex-col gap-1">
                  <h3 className="t-h3 decoration-1 underline-offset-[6px] group-hover:underline">{car.name}</h3>
                  <p className="t-small text-muted">{car.tagline}</p>
                  <p className="num mt-2">
                    {car.pricePerDayAED ? (
                      <>
                        <span className="font-semibold">
                          <Dirham />
                          {formatAmount(car.pricePerDayAED)}
                        </span>{" "}
                        / day{" "}
                        <span className="t-small text-muted">{car.vatLabel}</span>
                      </>
                    ) : (
                      "Price on request"
                    )}
                  </p>
                  <span className="t-small mt-2 inline-flex items-center gap-2 font-semibold">
                    Quick view <ArrowRight className="size-4 transition-transform duration-[160ms] group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
              {/* Siblings of the card link, not inside it. */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${business.landline.tel}`}
                  aria-label={`Call now about the ${car.name}`}
                  className="btn btn-dark px-3"
                >
                  <PhoneIcon /> Call now
                </a>
                <a
                  href={carEnquiry(car.name)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Enquire about the ${car.name} on WhatsApp`}
                  className="btn btn-red px-3"
                >
                  <WhatsAppIcon /> WhatsApp
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <QuickView
        car={open}
        onClose={() => {
          setOpen(null);
          triggerRef.current?.focus();
        }}
      />
    </section>
  );
}
