import { Navbar, HeroSection, RoleCards, FeaturesSection, Footer } from "@/components/home-sections"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <RoleCards />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
