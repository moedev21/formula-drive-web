import type { NextConfig } from "next";

// Old WordPress URLs with no page of their own on the new site, sent to the closest match
// (see the SEO audit). The 15 current cars keep their original /autos/<slug>/ URLs.
const legacy: [string, string][] = [
  // Duplicate or renamed listings of current cars
  ["/autos/audi-q2-2025-white", "/autos/audi-q2/"],
  ["/autos/bmw-4-series-convertible-2025", "/autos/bmw-4-series-convertible/"],
  ["/autos/bmw-x2-2025-black", "/autos/bmw-x2/"],
  ["/autos/bmw-x2-2025-white", "/autos/bmw-x2/"],
  ["/autos/ford-mustang", "/autos/ford-mustang-gt-v8-5-0l/"],
  ["/autos/gmc-yukon-elevation-2025-black", "/autos/gmc-yukon-elevation/"],
  ["/autos/gmc-yukon-elevation-2025", "/autos/gmc-yukon-elevation/"],
  ["/autos/mercedes-c-class-2025-white", "/autos/mercedes-c-class/"],
  ["/autos/mg-zs-lux-2025-2", "/autos/mg-zs-lux-2025/"],
  ["/autos/porsche-718-boxster-convertible-2024-2", "/autos/porsche-718-boxster-convertible/"],
  ["/autos/porsche-911-gts-spider-2024", "/autos/porsche-911-gts-spider/"],
  ["/autos/porsche-cayenne-coupe-2024", "/autos/porsche-cayenne-coupe/"],
  ["/autos/rent-lamborghini-urus-dubai", "/autos/rent-lamborghini-urus/"],
  // Brands with a single car in the fleet go to that car
  ["/car-make/rent-ferrari-dubai", "/autos/ferrari-f8-spider/"],
  ["/car-make/rent-audi-dubai", "/autos/audi-q2/"],
];

// Everything else from the old site goes to the home page.
const toHome = [
  "/car-make/:brand",
  "/car-body/:type",
  "/auto-body/:type",
  "/cars/:car",
  "/autos",
  "/luxury-car-rental-dubai",
  "/blog/:path*",
  "/contact-3",
  "/author/:name",
  "/cart",
  "/checkout",
  "/my-account",
];

const nextConfig: NextConfig = {
  devIndicators: false,
  // The old site's URLs end in a slash; keep that so they resolve in a single hop.
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920, 2560],
  },
  async redirects() {
    return [
      ...legacy.map(([source, destination]) => ({ source, destination, permanent: true })),
      ...toHome.map((source) => ({ source, destination: "/", permanent: true })),
      // Old WordPress media and feeds
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
