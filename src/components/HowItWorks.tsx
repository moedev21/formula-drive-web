import Image from "next/image";
import { steps } from "@/data/site";

// Section 06 — one verb at a time: three full-bleed panels, each carrying one word of the sequence.
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="mt-32 lg:mt-48">
      <h2 id="how-title" className="sr-only">
        How it works
      </h2>
      <ol>
        {steps.map((s, i) => (
          <li key={s.verb} className="@container relative h-[80svh] overflow-clip bg-charcoal text-white lg:h-[100svh]">
            <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" className="object-cover brightness-[0.55]" />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <p
                aria-hidden="true"
                data-reveal
                className="text-center text-[min(300px,calc((100cqi-2*var(--margin))/6.4))] font-bold uppercase leading-none tracking-[-0.03em] [font-variation-settings:'wdth'_125]"
              >
                {s.verb}
              </p>
            </div>
            <div className="frame absolute inset-x-0 bottom-0 pb-8 lg:pb-12">
              <h3 className="sr-only">
                Step {i + 1}: {s.verb}
              </h3>
              <p className="max-w-[40ch]">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
