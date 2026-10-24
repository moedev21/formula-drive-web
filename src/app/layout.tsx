import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { business } from "@/data/site";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const title = "Luxury & Supercar Rental Dubai | Formula Drive Rent a Car";
const description =
  "Rent a Ferrari, Lamborghini, Porsche or G63 direct from the owner in Dubai Marina. 15 cars from AED 170 a day, delivery across Dubai. Book on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: { default: title, template: "%s | Formula Drive Dubai" },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Marks the page as scripted before paint so reveal styles never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
