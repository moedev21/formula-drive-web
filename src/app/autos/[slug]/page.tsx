import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FinalCta } from "@/components/FinalCta";
import { Reveal } from "@/components/Reveal";
import { Dirham, withDirham } from "@/components/Dirham";
import { ArrowLeft, ArrowRight, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { carBySlug, carPath, cars, categoryLabel, formatAED, formatAmount, generalConditions, imageAlt, pricesChecked } from "@/data/fleet";
import { business } from "@/data/site";
import { carEnquiry } from "@/lib/whatsapp";
import { carLd } from "@/lib/schema";

// One page per car, at the URL the old WordPress site used, so indexed links keep working.
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = carBySlug((await params).slug);
  if (!car) return {};
  const title = `Rent ${car.name} in Dubai`;
  const price = car.pricePerDayAED ? ` from ${formatAED(car.pricePerDayAED)} a day (${car.vatLabel})` : "";
  const description = `${car.tagline}. Rent the ${car.name} in Dubai Marina${price}. Delivery across Dubai. Call or WhatsApp to book.`;
  const image = car.images[0];
  return {
    title,
    description,
    alternates: { canonical: carPath(car) },
    openGraph: {
      type: "website",
      url: carPath(car),
      siteName: business.name,
      title: `${title} | Formula Drive Dubai`,
      description,
      locale: "en_AE",
      images: [{ url: image.src, width: image.width, height: image.height, alt: `${car.name} from the Formula Drive fleet` }],
    },
    twitter: { card: "summary_large_image", title: `${title} | Formula Drive Dubai`, description },
  };
}

export default async function CarPage({ params }: Props) {
  const car = carBySlug((await params).slug);
  if (!car) notFound();

  const [lead, ...rest] = car.images;
  const related = cars
    .filter((c) => c.slug !== car.slug && c.categories.some((id) => car.categories.includes(id)))
    .slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(carLd(car)) }} />
      <Header />
      <main id="main">
        <article className="frame pt-6 lg:pt-10">
          <nav aria-label="Breadcrumb" className="t-small text-muted">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/" className="link">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#fleet" className="link">
                  Fleet
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-charcoal">
                {car.name}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden bg-grey">
                <Image
                  src={lead.src}
                  alt={imageAlt(car, 0)}
                  style={{ objectPosition: lead.position }}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5 lg:pl-6">
              <p className="t-small text-muted">{categoryLabel(car)}</p>
              <h1 className="t-h2">
                {car.name} <span className="block text-muted">rental in Dubai</span>
              </h1>
              <p className="t-h3 font-normal">{car.tagline}</p>
              <p className="num t-h3 font-normal">
                {car.pricePerDayAED ? (
                  <>
                    <span className="font-semibold">
                      <Dirham />
                      {formatAmount(car.pricePerDayAED)}
                    </span>{" "}
                    per day <span className="t-small text-muted">{car.vatLabel}</span>
                  </>
                ) : (
                  "Price on request"
                )}
                <span className="t-small mt-1 block text-muted">Price last checked {pricesChecked}.</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <a href={`tel:${business.landline.tel}`} className="btn btn-dark">
                  <PhoneIcon /> Call now
                </a>
                <a href={carEnquiry(car.name)} target="_blank" rel="noopener" className="btn btn-red">
                  <WhatsAppIcon /> WhatsApp
                </a>
              </div>
              {car.summary && <p className="t-body max-w-[60ch]">{car.summary}</p>}
            </div>
          </div>

          {rest.length > 0 && (
            <ul aria-label={`More photos of the ${car.name}`} className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {rest.map((img, i) => (
                <li key={img.src} className="relative aspect-[4/3] overflow-hidden bg-grey">
                  <Image
                    src={img.src}
                    alt={imageAlt(car, i + 1)}
                    style={{ objectPosition: img.position }}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-6">
            {car.specs.length > 0 && (
              <section aria-labelledby="specs-title" className="lg:col-span-6">
                <h2 id="specs-title" className="t-h3">
                  Reference specifications
                </h2>
                <table className="mt-4 w-full border-collapse">
                  <tbody>
                    {car.specs.map((s) => (
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
              </section>
            )}
            <section aria-labelledby="terms-title" className={car.specs.length > 0 ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-8"}>
              <h2 id="terms-title" className="t-h3">
                Rental conditions
              </h2>
              <ul className="mt-4 flex list-disc flex-col gap-2 pl-5">
                {[...car.conditions, ...generalConditions].map((t) => (
                  <li key={t}>{withDirham(t)}</li>
                ))}
              </ul>
            </section>
          </div>

          {related.length > 0 && (
            <section aria-labelledby="related-title" className="mt-24 lg:mt-36">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="related-title" className="t-h2">
                  You might also like
                </h2>
                <Link href="/#fleet" className="btn btn-light -mx-7">
                  <ArrowLeft /> Back to the fleet
                </Link>
              </div>
              <ul className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <a href={carPath(r)} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-grey">
                        <Image
                          src={r.images[0].src}
                          alt={imageAlt(r, 0)}
                          style={{ objectPosition: r.images[0].position }}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                        />
                      </div>
                      <h3 className="t-h3 mt-5 decoration-1 underline-offset-[6px] group-hover:underline">{r.name}</h3>
                      <p className="num mt-1">
                        {r.pricePerDayAED ? (
                          <>
                            <span className="font-semibold">
                              <Dirham />
                              {formatAmount(r.pricePerDayAED)}
                            </span>{" "}
                            / day
                          </>
                        ) : (
                          "Price on request"
                        )}
                      </p>
                      <span className="t-small mt-2 inline-flex items-center gap-2 font-semibold">
                        View car <ArrowRight className="size-4 transition-transform duration-[160ms] group-hover:translate-x-1" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
        <FinalCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
