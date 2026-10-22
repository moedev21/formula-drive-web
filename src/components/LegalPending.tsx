import Link from "next/link";
import { Logo } from "./Logo";
import { business } from "@/data/site";

// Placeholder for legal documents the client has not supplied yet (see HANDOVER.md).
export function LegalPending({ title }: { title: string }) {
  return (
    <main id="main" className="frame flex min-h-svh flex-col gap-10 py-10">
      <Link href="/" aria-label="Formula Drive Rent a Car, home">
        <Logo />
      </Link>
      <div className="max-w-[60ch]">
        <h1 className="t-h2">{title}</h1>
        <p className="t-body mt-6">
          This document is being prepared. For rental terms or privacy questions, contact Formula Drive on WhatsApp{" "}
          {business.whatsapp.display}, call {business.landline.display} or email{" "}
          <a className="link" href={`mailto:${business.email}`}>
            {business.email}
          </a>
          .
        </p>
        <Link href="/" className="btn btn-dark mt-10">
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
