import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Fleet } from "@/components/Fleet";
import { Experience } from "@/components/Experience";
import { HowItWorks } from "@/components/HowItWorks";
import { Locations } from "@/components/Locations";
import { WhyUs } from "@/components/WhyUs";
import { Reviews } from "@/components/Reviews";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { homeLd } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeLd) }} />
      <Header />
      <main id="main">
        <Hero />
        <Fleet />
        <Experience />
        <HowItWorks />
        <Locations />
        <WhyUs />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
