import Image from "next/image";
import { business } from "@/data/site";
import { generalEnquiry } from "@/lib/whatsapp";
import { PhoneIcon, WhatsAppIcon } from "./icons";

// Section 10 — the last photograph, the words beside it, butting into the footer.
export function FinalCta() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark mt-32 bg-charcoal text-white lg:mt-48">
      <div className="grid lg:min-h-[90svh] lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:aspect-auto">
          <Image
            src="/fleet/jeep-wrangler-rubicon-392-hemi-v8-6-4l/03.webp"
            alt="Formula Drive's Jeep Wrangler Rubicon 392 with the Dubai skyline behind it"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-end gap-8 px-[var(--margin)] py-16 lg:px-16 lg:py-24 xl:px-24">
          <h2 id="contact-title" data-reveal className="t-h2">
            Your car is waiting.
          </h2>
          <p data-reveal style={{ ["--i" as string]: 1 }} className="t-body max-w-[44ch]">
            Tell us the car and your dates and we will have it ready in Dubai Marina, or bring it to you. We confirm
            availability, the deposit and the documents you need in the same chat.
          </p>
          <div data-reveal style={{ ["--i" as string]: 2 }} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={generalEnquiry} target="_blank" rel="noopener" className="btn btn-red max-sm:px-4">
              <WhatsAppIcon /> WhatsApp {business.whatsapp.display}
            </a>
            <a href={`tel:${business.phone.tel}`} className="btn btn-light max-sm:px-4">
              <PhoneIcon /> Call {business.phone.display}
            </a>
          </div>
          <a data-reveal style={{ ["--i" as string]: 3 }} href={`mailto:${business.email}`} className="link inline-flex min-h-11 items-center self-start">
            {business.email}
          </a>
        </div>
      </div>
    </section>
  );
}
