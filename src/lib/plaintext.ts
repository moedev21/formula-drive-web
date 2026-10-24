import { business, faqs, locations } from "@/data/site";
import { carPath, cars, categoryLabel, formatAED, generalConditions, pricesChecked } from "@/data/fleet";

// Plain-text versions of the site for AI assistants and agents (/llms.txt, /pricing.md).
// Generated from the same data as the pages, so they never drift from what is shown.
const abs = (path: string) => `${business.url}${path}`;
const price = (n: number | null, vat: string) => (n ? `${formatAED(n)} per day, ${vat}` : "Price on request");

export function llmsTxt() {
  return [
    `# ${business.name}`,
    "",
    `> Owner-operated luxury, sports and SUV car rental in Dubai Marina, UAE. ${cars.length} cars from ${formatAED(
      Math.min(...cars.map((c) => c.pricePerDayAED ?? Infinity)),
    )} to ${formatAED(Math.max(...cars.map((c) => c.pricePerDayAED ?? 0)))} a day, booked directly by WhatsApp, phone or email.`,
    "",
    `- Phone: ${business.landline.display} · WhatsApp: ${business.whatsapp.display} · Email: ${business.email}`,
    `- Roadside assistance (24/7): ${business.roadside.display}`,
    ...locations.map((l) => `- ${l.name} (${l.detail}): ${l.addressLines.join(", ")}. Open ${l.hours.toLowerCase()}. ${l.phone.display}`),
    "- Delivery to hotels, homes and the airport across Dubai.",
    `- Prices last checked ${pricesChecked}.`,
    "",
    "## Fleet",
    "",
    ...cars.map((c) => `- [${c.name}](${abs(carPath(c))}): ${categoryLabel(c)}. ${price(c.pricePerDayAED, c.vatLabel)}.`),
    "",
    "## Rental terms",
    "",
    ...generalConditions.map((t) => `- ${t}`),
    "",
    "## FAQ",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## More",
    "",
    `- [Full price list](${abs("/pricing.md")})`,
    `- [Home page](${abs("/")})`,
    "",
  ].join("\n");
}

export function pricingMd() {
  const rows = [...cars].sort((a, b) => (b.pricePerDayAED ?? 0) - (a.pricePerDayAED ?? 0));
  return [
    `# Prices — ${business.name}, Dubai`,
    "",
    `Daily rental prices in UAE dirhams (AED), excluding 5% VAT. Last checked ${pricesChecked}.`,
    "Insurance and a standard mileage limit are included. Minimum rental 24 hours; weekly and monthly rentals on request.",
    "",
    "| Car | Type | AED per day (excl. VAT) | Page |",
    "|---|---|---|---|",
    ...rows.map((c) => `| ${c.name} | ${categoryLabel(c)} | ${c.pricePerDayAED ? c.pricePerDayAED.toLocaleString("en-US") : "On request"} | ${abs(carPath(c))} |`),
    "",
    "## Terms for every car",
    "",
    ...generalConditions.map((t) => `- ${t}`),
    "",
    ...cars
      .filter((c) => c.conditions.length)
      .flatMap((c) => [`## ${c.name}: extra terms`, "", ...c.conditions.map((t) => `- ${t}`), ""]),
    "## How to book",
    "",
    `WhatsApp ${business.whatsapp.display}, call ${business.landline.display} or email ${business.email} with the car and dates. The total, deposit and documents are confirmed before you commit; nothing is charged online.`,
    "",
  ].join("\n");
}
