import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Product } from "@/components/landing/product";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Agents } from "@/components/landing/agents";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Product />
        <Features />
        <HowItWorks />
        <Agents />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
