import Image from "next/image";
import { reasons } from "@/data/site";

// Section 08 — four reasons dealt onto the table like cards (desktop: an overlapping fan that
// never covers another card's words; phone: an upright swipe row).
const tilt = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3"];
const grounds = ["bg-white", "bg-grey", "bg-white", "bg-grey"];

export function WhyUs() {
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
          tabIndex={0}
          aria-label="Four reasons to book with Formula Drive"
          className="no-scrollbar -mx-[var(--margin)] mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--margin)] pb-4 lg:mx-auto lg:mt-24 lg:w-[1090px] lg:max-w-full lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
          {reasons.map((r, i) => (
            <li
              key={r.title}
              data-reveal
              style={{ ["--i" as string]: i + 1 }}
              className={`relative w-[82%] shrink-0 snap-start text-charcoal sm:w-[340px] lg:-ml-[90px] lg:first:ml-0 lg:transition-transform lg:duration-[280ms] lg:ease-[var(--ease-out)] lg:hover:z-10 lg:hover:-translate-y-2 lg:hover:rotate-0 ${tilt[i]} max-lg:rotate-0 ${grounds[i]}`}
            >
              <div className="flex h-[420px] flex-col p-7 lg:w-[250px]">
                <h3 className="t-h3 font-bold uppercase [font-variation-settings:'wdth'_112]">{r.title}</h3>
                <div className="relative mt-auto aspect-[4/3] w-full overflow-hidden">
                  <Image src={r.image.src} alt={r.image.alt} fill sizes="250px" className="object-cover" />
                </div>
                <p className="mt-5 leading-[1.45]">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
