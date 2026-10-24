import type { MetadataRoute } from "next";
import { business } from "@/data/site";
import { carPath, cars, fleetCapturedAt } from "@/data/fleet";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(fleetCapturedAt);
  return [
    { url: `${business.url}/`, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    ...cars.map((car) => ({
      url: `${business.url}${carPath(car)}`,
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: car.images.map((img) => `${business.url}${img.src}`),
    })),
  ];
}
