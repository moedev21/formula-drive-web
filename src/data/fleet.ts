import data from "./fleet.json";

export type CategoryId = "supercars" | "sports" | "suvs" | "convertibles" | "economy";

export type CarImage = { src: string; width: number; height: number; sourceUrl: string };

export type Car = {
  id: number;
  slug: string;
  name: string;
  liveTitle: string;
  brand: string;
  model: string;
  tagline: string;
  categories: CategoryId[];
  pricePerDayAED: number | null;
  priceStatus: "verified" | "conflict";
  vatLabel: string;
  specs: { label: string; value: string }[];
  specsSource: string;
  conditions: string[];
  summary: string;
  images: CarImage[];
  liveUrl: string;
  liveModified: string;
};

export const categories: { id: CategoryId | "all"; label: string; singular: string }[] = [
  { id: "all", label: "All cars", singular: "car" },
  { id: "supercars", label: "Supercars", singular: "Supercar" },
  { id: "sports", label: "Sports", singular: "Sports" },
  { id: "suvs", label: "SUVs", singular: "SUV" },
  { id: "convertibles", label: "Convertibles", singular: "Convertible" },
  { id: "economy", label: "Economy", singular: "Economy" },
];

export const cars = data.cars as Car[];
export const generalConditions: string[] = data.generalConditions;
export const fleetCapturedAt: string = data.capturedAt;

export function carBySlug(slug: string) {
  return cars.find((c) => c.slug === slug);
}

export function categoryLabel(car: Car) {
  if (!car.categories.length) return "Sedan";
  return car.categories
    .map((id) => categories.find((c) => c.id === id)?.singular)
    .filter(Boolean)
    .join(" · ");
}

const aed = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });
// Text form, for metadata and structured data (which cannot show the Dirham symbol).
export function formatAED(n: number) {
  return `AED ${formatAmount(n)}`;
}

// The number alone, shown on the page after the <Dirham /> symbol.
export function formatAmount(n: number) {
  return aed.format(n);
}

// Cars shown in the home page banner, in order: each with its photo and its own video clip
// (the client's footage in public/video, desktop only).
export const heroSeries = [
  { slug: "lamborghini-evo-spider", image: 0, video: "/video/lamborghini-evo-spider", detail: "rear diffuser and exhaust" },
  { slug: "ferrari-f8-spider", image: 2, video: "/video/ferrari-f8-headlight", detail: "headlight and bonnet" },
  { slug: "bmw-4-series-convertible", image: 0, video: "/video/bmw-4-series-convertible", detail: "badge, grille and the Dubai Marina skyline" },
  { slug: "porsche-718-boxster-convertible", image: 0, video: "/video/porsche-718-boxster", detail: "cockpit and steering wheel" },
].map(({ slug, image, video, detail }) => {
  const car = carBySlug(slug)!;
  return { car, img: car.images[image], video, videoLabel: `Close-up of the Formula Drive ${car.name}: ${detail}` };
});
