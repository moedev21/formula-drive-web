import Image from "next/image";
import { business, locations } from "@/data/site";
import { generalEnquiry, whatsappUrl } from "@/lib/whatsapp";
import { ArrowRight, PhoneIcon, WhatsAppIcon } from "./icons";

// Section 07 — two places to collect a car in Dubai Marina.
export function Locations() {
  return (
    <section id="locations" aria-labelledby="locations-title" className="pt-32 lg:pt-48">
      <div className="frame">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="locations-title" data-reveal className="t-h2 lg:col-span-7">
            Collect in Dubai Marina.
          </h2>
          <p data-reveal style={{ ["--i" as string]: 1 }} className="t-body max-w-[46ch] lg:col-span-4 lg:col-start-9">
            Pick up from our office in Princess Tower or the Formula Drive counter at JW Marriott Hotel Marina, or ask us to
            deliver the car to you.
          </p>
        </div>

        <ul className="mt-14 grid gap-14 md:grid-cols-2 md:gap-6 lg:mt-20">
          {locations.map((loc, i) => (
            <li key={loc.id} data-reveal style={{ ["--i" as string]: i }} className="flex flex-col">
              <figure>
                <div className="relative aspect-[3/2] overflow-hidden bg-grey">
                  <Image src={loc.image.src} alt={loc.image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="t-small mt-2 text-muted">
                  {loc.image.caption} · Photo{" "}
                  <a href={loc.image.credit.source} target="_blank" rel="noopener" className="link">
                    {loc.image.credit.author}
                  </a>
                  ,{" "}
                  <a href={loc.image.credit.licenseUrl} target="_blank" rel="noopener" className="link">
                    {loc.image.credit.license}
                  </a>
                </figcaption>
              </figure>
              <h3 className="t-h3 mt-6">{loc.name}</h3>
              <p className="t-small mt-1 text-muted">{loc.detail}</p>
              <address className="mt-4 not-italic">
                {loc.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <p className="mt-3">
                <span className="font-semibold">Open</span> {loc.hours.toLowerCase()}
              </p>
              {loc.note && <p className="mt-3 max-w-[48ch] text-muted">{loc.note}</p>}
              <ul className="mt-5 flex flex-col gap-1">
                <li>
                  <a
                    href={
                      loc.phone.whatsapp
                        ? whatsappUrl(`Hello Formula Drive, I'd like to rent a car from your ${loc.name} counter.`, loc.phone.whatsapp)
                        : generalEnquiry
                    }
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-11 items-center gap-3 link"
                  >
                    <WhatsAppIcon /> WhatsApp {loc.phone.whatsapp ? loc.phone.display : business.whatsapp.display}
                  </a>
                </li>
                <li>
                  <a href={`tel:${loc.phone.tel}`} className="inline-flex min-h-11 items-center gap-3 link">
                    <PhoneIcon /> Call {loc.phone.display}
                  </a>
                </li>
              </ul>
              <a href={loc.directions} target="_blank" rel="noopener" className="btn btn-dark mt-6 self-start">
                Get directions <ArrowRight />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
