import Image from "next/image";
import { experience } from "@/data/site";
import { generalEnquiry } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

// Section 05 — split stage: the photograph holds still while the argument scrolls beside it.
export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="pt-32 lg:pt-48">
      <div className="frame grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-grey lg:aspect-auto lg:h-[calc(100svh-var(--header-h)-48px)]">
            <Image
              src={experience.image.src}
              alt={experience.image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-6 lg:col-start-7 lg:py-[12vh]">
          <h2 id="experience-title" data-reveal className="t-h2">
            {experience.heading}
          </h2>
          <p data-reveal style={{ ["--i" as string]: 1 }} className="t-h3 mt-8 max-w-[44ch] font-normal">
            {experience.body}
          </p>

          <dl className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-20">
            {experience.points.map((p, i) => (
              <div key={p.title} data-reveal style={{ ["--i" as string]: i + 2 }} className="flex flex-col gap-2">
                <dt className="t-h3">{p.title}</dt>
                <dd>{p.text}</dd>
              </div>
            ))}
          </dl>

          <div data-reveal style={{ ["--i" as string]: 6 }} className="mt-14">
            <a href={generalEnquiry} target="_blank" rel="noopener" className="btn btn-red">
              <WhatsAppIcon /> Book your drive
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
