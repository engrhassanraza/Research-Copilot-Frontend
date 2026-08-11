import { Navbar } from "@/components/landing/navbar";
import { AboutHero } from "@/components/landing/about-hero";
import { AboutTeam } from "@/components/landing/about-team";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "About | Research Copilot",
  description:
    "Meet the team behind Research Copilot and our approach to grounded, verifiable AI research.",
};

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutTeam />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
