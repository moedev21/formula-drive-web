import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { business } from "@/data/site";
import { cars, formatAED } from "@/data/fleet";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const title = "Formula Drive Rent a Car Dubai | Supercar, Sports & SUV Rental in Dubai Marina";
const description =
  "Rent a Ferrari, Lamborghini, Porsche, Mercedes-AMG and more directly from the owner in Dubai Marina. 15 self-owned cars from AED 170 a day, 0% commission, delivery available. Enquire on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: business.name,
    title,
    description,
    locale: "en_AE",
    images: [{ url: "/fleet/lamborghini-evo-spider/01.webp", width: 1915, height: 1200, alt: "Lamborghini Huracán EVO Spyder from the Formula Drive fleet" }],
  },
  twitter: { card: "summary_large_image", title, description },
  icons: {
    icon: [{ url: "/brand/formula-drive-icon-black-red.svg", type: "image/svg+xml" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoRental",
      "@id": `${business.url}/#business`,
      name: business.name,
      url: business.url,
      logo: `${business.url}/brand/formula-drive-logo-red-black.svg`,
      image: `${business.url}/fleet/lamborghini-evo-spider/01.webp`,
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
      contactPoint: [
        { "@type": "ContactPoint", telephone: `+${business.whatsapp.e164}`, contactType: "reservations", availableLanguage: ["English"] },
      ],
      sameAs: business.social.map((s) => s.href),
    },
    {
      "@type": "ItemList",
      name: "Formula Drive rental fleet",
      itemListElement: cars.map((car, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: car.name,
          brand: { "@type": "Brand", name: car.brand },
          image: `${business.url}${car.images[0].src}`,
          url: car.liveUrl,
          ...(car.pricePerDayAED
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: "AED",
                  price: car.pricePerDayAED,
                  description: `${formatAED(car.pricePerDayAED)} per day, ${car.vatLabel}`,
                  seller: { "@id": `${business.url}/#business` },
                },
              }
            : {}),
        },
      })),
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Marks the page as scripted before paint so reveal styles never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
