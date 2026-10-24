import { business, faqs } from "@/data/site";
import { carPath, cars, formatAED, type Car } from "@/data/fleet";

// Structured data (JSON-LD). Absolute URLs use the canonical www host.
const abs = (path: string) => `${business.url}${path}`;
export const businessId = abs("/#business");

export const businessLd = {
  "@type": "AutoRental",
  "@id": businessId,
  name: business.name,
  url: abs("/"),
  logo: abs("/brand/formula-drive-logo-red-black.svg"),
  image: abs("/fleet/lamborghini-evo-spider/01.webp"),
  telephone: business.landline.tel,
  email: business.email,
  priceRange: "AED 170–3,000 per day",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit-06, Ground Floor, Princess Tower",
    addressLocality: "Dubai Marina, Dubai",
    addressCountry: "AE",
  },
  geo: { "@type": "GeoCoordinates", latitude: 25.088821, longitude: 55.146889 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  contactPoint: [
    { "@type": "ContactPoint", telephone: `+${business.whatsapp.e164}`, contactType: "reservations", availableLanguage: ["English"] },
  ],
  sameAs: business.social.map((s) => s.href),
};

export function productLd(car: Car) {
  return {
    "@type": "Product",
    "@id": abs(`${carPath(car)}#car`),
    name: car.name,
    description: car.summary || car.tagline,
    brand: { "@type": "Brand", name: car.brand },
    image: car.images.map((img) => abs(img.src)),
    url: abs(carPath(car)),
    ...(car.pricePerDayAED
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "AED",
            price: car.pricePerDayAED,
            description: `${formatAED(car.pricePerDayAED)} per day, ${car.vatLabel}`,
            availability: "https://schema.org/InStock",
            url: abs(carPath(car)),
            seller: { "@id": businessId },
          },
        }
      : {}),
  };
}

export const homeLd = {
  "@context": "https://schema.org",
  "@graph": [
    businessLd,
    {
      "@type": "ItemList",
      name: "Formula Drive rental fleet",
      itemListElement: cars.map((car, i) => ({ "@type": "ListItem", position: i + 1, url: abs(carPath(car)), name: car.name })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export function carLd(car: Car) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      businessLd,
      productLd(car),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          { "@type": "ListItem", position: 2, name: "Fleet", item: abs("/#fleet") },
          { "@type": "ListItem", position: 3, name: car.name, item: abs(carPath(car)) },
        ],
      },
    ],
  };
}
