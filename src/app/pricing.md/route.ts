import { pricingMd } from "@/lib/plaintext";

export const dynamic = "force-static";

export function GET() {
  return new Response(pricingMd(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
