'use client';

import { Navbar, HeroSection, FeaturesSection, Footer } from "@/components/home-sections"
import { BackgroundPaths } from "@/components/ui/background-paths"

export default function HomePage() {
  const handleDiscoverClick = () => {
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <BackgroundPaths title="NutriAI" onDiscoverClick={handleDiscoverClick} />
      <div className="flex min-h-screen flex-col bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <Navbar />
        <main className="flex-1 relative z-10">
          <HeroSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
