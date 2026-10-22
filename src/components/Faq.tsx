import { faqs } from "@/data/site";
import { Chevron } from "./icons";

// Section 09b — a wide heading, questions indented beneath it. Native <details> keeps it
// working without JavaScript and announces state to assistive tech.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="pt-32 lg:pt-48">
      <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-6">
        <h2 id="faq-title" data-reveal className="t-h2 lg:col-span-12">
          Before you drive.
        </h2>
        <div className="flex flex-col gap-2 lg:col-span-8 lg:col-start-5">
          {faqs.map((f, i) => (
            <details key={f.q} data-reveal style={{ ["--i" as string]: i }} className="group -mx-[var(--margin)] px-[var(--margin)] transition-colors duration-[280ms] open:bg-grey lg:mx-0 lg:-ml-6 lg:px-6">
              <summary className="t-h3 flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Chevron className="size-6 shrink-0 transition-transform duration-[280ms] ease-[var(--ease-out)] group-open:rotate-180" />
              </summary>
              <p className="max-w-[56ch] pb-6">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
