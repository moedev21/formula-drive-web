import { business } from "@/data/site";

export function whatsappUrl(message: string, number: string = business.whatsapp.e164) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const generalEnquiry = whatsappUrl(
  "Hello Formula Drive, I'd like to rent a car. Could you share availability?",
);

export function carEnquiry(name: string, opts: { from?: string; to?: string; location?: string; driver?: string } = {}) {
  const lines = [`Hello Formula Drive, I'm interested in the ${name}.`];
  if (opts.from && opts.to) lines.push(`Dates: ${opts.from} to ${opts.to}`);
  else if (opts.from) lines.push(`From: ${opts.from}`);
  if (opts.location) lines.push(`Pick-up: ${opts.location}`);
  if (opts.driver) lines.push(`Name: ${opts.driver}`);
  lines.push("Is it available?");
  return whatsappUrl(lines.join("\n"));
}
