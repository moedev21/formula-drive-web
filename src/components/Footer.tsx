import { Logo } from "./Logo";
import { business, locations, nav, photoCredits } from "@/data/site";

// Section 11 — charcoal close: logo, anchors, both locations, contact, social, legal.
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-charcoal text-white">
      <div className="frame grid gap-12 py-16 lg:grid-cols-12 lg:gap-6 lg:py-24">
        <div className="lg:col-span-3">
          <Logo tone="light" className="w-[220px] lg:w-[280px]" />
          <nav aria-label="Footer" className="mt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="inline-flex min-h-11 items-center link">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {locations.map((loc) => (
          <div key={loc.id} className="lg:col-span-3">
            <h2 className="font-semibold">{loc.name}</h2>
            <p className="t-small mt-1 text-white/70">{loc.detail}</p>
            <address className="mt-3 not-italic text-white/85">
              {loc.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <p className="mt-2 text-white/85">Open {loc.hours}</p>
            {loc.phone.label === "Counter" && (
              <a href={`tel:${loc.phone.tel}`} className="inline-flex min-h-11 items-center link text-white/85">
                {loc.phone.display}
              </a>
            )}
          </div>
        ))}

        <div className="lg:col-span-3">
          <h2 className="font-semibold">Contact</h2>
          <ul className="mt-3 flex flex-col text-white/85">
            <li>
              <a href={`https://wa.me/${business.whatsapp.e164}`} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center link">
                WhatsApp {business.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={`tel:${business.landline.tel}`} className="inline-flex min-h-11 items-center link">
                {business.landline.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="inline-flex min-h-11 items-center link break-all">
                {business.email}
              </a>
            </li>
            <li className="mt-2 text-white/70">24/7 roadside assistance: {business.roadside.display}</li>
          </ul>
        </div>
      </div>

      <div className="bg-black/25">
      <div className="frame flex flex-col gap-4 py-8 text-[14px] text-white/70 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-x-6">
          {business.social.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener" className="inline-flex min-h-11 min-w-11 items-center justify-center link text-white">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap items-center gap-x-6">
          <span>© {year} Formula Drive Rent a Car. Prices in AED per day, excluding 5% VAT.</span>
          <span>
            Location photos:{" "}
            {photoCredits.map((c, i) => (
              <span key={c.source}>
                {i > 0 && "; "}
                <a href={c.source} target="_blank" rel="noopener" className="link">
                  {c.author}
                </a>
                ,{" "}
                <a href={c.licenseUrl} target="_blank" rel="noopener" className="link">
                  {c.license}
                </a>
              </span>
            ))}
            , via Wikimedia Commons.
          </span>
        </p>
      </div>
      </div>
    </footer>
  );
}
