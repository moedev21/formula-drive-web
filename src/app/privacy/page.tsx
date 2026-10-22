import type { Metadata } from "next";
import { LegalPending } from "@/components/LegalPending";

export const metadata: Metadata = { title: "Privacy | Formula Drive Rent a Car", robots: { index: false } };

export default function Privacy() {
  return <LegalPending title="Privacy policy" />;
}
