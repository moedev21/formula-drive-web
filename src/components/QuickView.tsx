"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { categoryLabel, formatAmount, generalConditions, imageAlt, type Car } from "@/data/fleet";
import { Dirham, withDirham } from "./Dirham";
import { carEnquiry } from "@/lib/whatsapp";
import { ArrowLeft, ArrowRight, CloseIcon, WhatsAppIcon } from "./icons";

const pickupOptions = [
  "Dubai Marina — Princess Tower",
  "JW Marriott Hotel Marina counter",
  "Delivery to my hotel or home",
  "Delivery to the airport",
];

// The dialog floats above the page, so it alone gets depth (DESIGN.md §8).
const floating = "shadow-[0_24px_64px_rgb(0_0_0/0.18)]"; // taste-skill-ignore: dialog

function today() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function QuickView({ car, onClose }: { car: Car | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [closing, setClosing] = useState(false);
  const [shown, setShown] = useState<Car | null>(null);
  const [index, setIndex] = useState(0);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pickup, setPickup] = useState(pickupOptions[0]);
  const [driver, setDriver] = useState("");
  const [error, setError] = useState("");

  // Open when a car is chosen; keep the last car rendered while the exit animation plays.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !car) return;
    setShown(car);
    setIndex(0);
    setError("");
    if (!dialog.open) dialog.showModal();
  }, [car]);

  // Move focus to the car's name once it has rendered (showModal focuses the close button first).
  useEffect(() => {
    if (car && shown === car) titleRef.current?.focus();
  }, [car, shown]);

  const close = () => {
    const dialog = ref.current;
    if (!dialog?.open || closing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      dialog.close();
      return;
    }
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      dialog.close();
    }, 200);
  };

  const c = shown;
  const images = c?.images ?? [];
  const go = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  const onGalleryKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!c) return;
    if (from && to && to < from) {
      setError("The return date must be on or after the pick-up date.");
      return;
    }
    setError("");
    window.open(carEnquiry(c.name, { from, to, location: pickup, driver: driver.trim() }), "_blank", "noopener");
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="qv-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      className={`qv m-0 ml-auto h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-white p-0 text-charcoal md:w-[min(680px,92vw)] ${floating} ${
        closing ? "qv-closing" : ""
      }`}
    >
      {c && (
        <div className="flex min-h-full flex-col">
          <div className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-5 md:px-8">
            <p className="t-small text-muted">{categoryLabel(c)}</p>
            <button type="button" onClick={close} className="-mr-3 grid size-12 place-items-center" aria-label="Close and return to the fleet">
              <CloseIcon />
            </button>
          </div>

          {/* Gallery */}
          <div
            role="group"
            aria-roledescription="carousel"
            aria-label={`${c.name} photos`}
            tabIndex={0}
            onKeyDown={onGalleryKey}
            className="relative"
          >
            <div className="relative aspect-[4/3] bg-grey">
              {images.map((img, i) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={imageAlt(c, i)}
                  style={{ objectPosition: img.position }}
                  fill
                  sizes="(min-width: 768px) 680px, 100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`object-cover transition-opacity duration-[280ms] ease-[var(--ease-inout)] ${i === index ? "opacity-100" : "opacity-0"}`}
                  aria-hidden={i !== index}
                />
              ))}
              {images.length > 1 && (
                <div className="absolute bottom-0 right-0 flex">
                  <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="grid size-12 place-items-center bg-white/90 hover:bg-white">
                    <ArrowLeft />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Next photo" className="grid size-12 place-items-center bg-white/90 hover:bg-white">
                    <ArrowRight />
                  </button>
                </div>
              )}
            </div>
            <p className="sr-only" aria-live="polite">
              Photo {index + 1} of {images.length}
            </p>
            <ul className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-2 md:px-8">
              {images.map((img, i) => (
                <li key={img.src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className={`relative block h-14 w-20 overflow-hidden transition-opacity duration-[160ms] ${i === index ? "opacity-100 outline-2 outline-charcoal" : "opacity-60 hover:opacity-100"}`}
                  >
                    <Image src={img.src} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: img.position }} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-10 px-5 pb-10 pt-8 md:px-8">
            <div className="flex flex-col gap-3">
              <h2 id="qv-title" ref={titleRef} tabIndex={-1} className="t-h2 !text-[clamp(32px,4vw,48px)] outline-none">
                {c.name}
              </h2>
              <p className="num t-h3 font-normal">
                {c.pricePerDayAED ? (
                  <>
                    <span className="font-semibold">
                      <Dirham />
                      {formatAmount(c.pricePerDayAED)}
                    </span>{" "}
                    per day{" "}
                    <span className="t-small text-muted">{c.vatLabel}</span>
                  </>
                ) : (
                  "Price on request"
                )}
              </p>
              <p className="t-h3 font-normal text-muted">{c.tagline}</p>
              {c.summary && <p className="t-body max-w-[60ch]">{c.summary}</p>}
            </div>

            {c.specs.length > 0 && (
              <div>
                <h3 className="t-h3">Reference specifications</h3>
                <table className="mt-4 w-full border-collapse">
                  <tbody>
                    {c.specs.map((s) => (
                      <tr key={s.label} className={"border-b border-line align-top" /* taste-skill-ignore: rows of a real table */}>
                        <th scope="row" className="w-2/5 py-3 pr-4 text-left font-medium text-muted">
                          {s.label}
                        </th>
                        <td className="py-3">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="t-small mt-3 text-muted">Model reference figures; the exact car is confirmed when you book.</p>
              </div>
            )}

            <div>
              <h3 className="t-h3">Rental conditions</h3>
              <ul className="mt-4 flex list-disc flex-col gap-2 pl-5">
                {[...c.conditions, ...generalConditions].map((t) => (
                  <li key={t}>{withDirham(t)}</li>
                ))}
              </ul>
            </div>

            <form onSubmit={submit} noValidate className="bg-grey-2 p-5 md:p-6" aria-labelledby="qv-enquiry">
              <h3 id="qv-enquiry" className="t-h3">
                Enquire on WhatsApp
              </h3>
              <p className="t-small mt-2 text-muted">We reply with availability and the total. Nothing is booked or charged here.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="t-small font-semibold">Pick-up date</span>
                  <input type="date" min={today()} value={from} onChange={(e) => setFrom(e.target.value)} className="min-h-[52px] border border-line bg-white px-3" />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="t-small font-semibold">Return date</span>
                  <input
                    type="date"
                    min={from || today()}
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "qv-error" : undefined}
                    className="min-h-[52px] border border-line bg-white px-3"
                  />
                </label>
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="t-small font-semibold">Pick-up</span>
                  <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="min-h-[52px] border border-line bg-white px-3">
                    {pickupOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="t-small font-semibold">
                    Your name <span className="font-normal text-muted">(optional)</span>
                  </span>
                  <input type="text" autoComplete="name" value={driver} onChange={(e) => setDriver(e.target.value)} className="min-h-[52px] border border-line bg-white px-3" />
                </label>
              </div>
              {error && (
                <p id="qv-error" role="alert" className="t-small mt-3 font-semibold text-red">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-red mt-5 w-full">
                <WhatsAppIcon /> Enquire about the {c.model}
              </button>
            </form>

            <div>
              <button type="button" onClick={close} className="btn btn-dark">
                <ArrowLeft /> Back to the fleet
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
