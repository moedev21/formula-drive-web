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
export function formatAED(n: number) {
  return `AED ${aed.format(n)}`;
}

// Cars pinned under the hero headline, in order, with the photo used for each.
export const heroSeries = [
  { slug: "lamborghini-evo-spider", image: 0 },
  { slug: "ferrari-f8-spider", image: 2 },
  { slug: "rent-lamborghini-urus", image: 1 },
  { slug: "mercedes-benz-g63", image: 1 },
].map(({ slug, image }) => {
  const car = carBySlug(slug)!;
  return { car, img: car.images[image] };
});
