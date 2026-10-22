import type { Metadata } from "next";
import { LegalPending } from "@/components/LegalPending";

export const metadata: Metadata = { title: "Terms | Formula Drive Rent a Car", robots: { index: false } };

export default function Terms() {
  return <LegalPending title="Terms and conditions" />;
}
