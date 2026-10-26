import { faqs } from "@/data/site";
import { Chevron } from "./icons";
import { withDirham } from "./Dirham";
import { LoopVideo } from "./LoopVideo";

// Section 09b — questions on the left, the client's Lamborghini and Ferrari reel on the right
// (sticky on desktop). Native <details> keeps it working without JavaScript and announces state
// to assistive tech; an open question turns red.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="pt-32 lg:pt-48">
      <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-6">
        <h2 id="faq-title" data-reveal className="t-h2 lg:col-span-12">
          Before you <span className="text-red">drive</span>.
        </h2>
        <div className="flex flex-col gap-2 lg:col-span-7">
          {faqs.map((f, i) => (
            <details key={f.q} data-reveal style={{ ["--i" as string]: i }} className="group -mx-[var(--margin)] px-[var(--margin)] transition-colors duration-[280ms] open:bg-grey lg:-ml-6 lg:mr-0 lg:px-6">
              <summary className="t-h3 flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium transition-colors duration-[160ms] group-open:text-red [&::-webkit-details-marker]:hidden">
                {f.q}
                <Chevron className="size-6 shrink-0 transition-transform duration-[280ms] ease-[var(--ease-out)] group-open:rotate-180" />
              </summary>
              <p className="max-w-[56ch] pb-6 text-charcoal">{withDirham(f.a)}</p>
            </details>
          ))}
        </div>
        <div data-reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <LoopVideo
              src="/video/lamborghini-ferrari-reel"
              size={1280}
              sizes="(min-width: 1024px) 40vw, 100vw"
              label="The Formula Drive Lamborghini EVO Spider and Ferrari F8 Spider in Dubai: front, cockpit, grille and headlight"
              className="aspect-[4/5] lg:aspect-auto lg:h-[calc(100svh-var(--header-h)-48px)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
