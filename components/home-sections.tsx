"use client"

import Link from "next/link"
import { Leaf, Factory, User, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-4 pt-32 pb-20">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
        <Zap className="h-3.5 w-3.5 text-accent" />
        <span>Powered by AI Nutrition Analysis</span>
      </div>

      <h1 className="text-center text-5xl font-bold tracking-tight text-foreground md:text-7xl max-w-4xl text-balance" style={{ fontFamily: "var(--font-heading)" }}>
        Smart Nutrition,{" "}
        <span className="text-primary">Simplified</span>
      </h1>

      <p className="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-relaxed">
        Automate FSSAI-compliant nutrition label generation for food manufacturers, or get personalized dietary guidance powered by AI.
      </p>

      <div className="mt-16 grid w-full max-w-3xl gap-6 md:grid-cols-2">
        <Link href="/auth?role=manufacturer" className="group">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Factory className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Manufacturer
            </h2>
            <p className="text-center text-sm text-muted-foreground leading-relaxed">
              Generate FSSAI-compliant nutrition labels for your food products with AI-powered analysis.
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link href="/auth?role=user" className="group">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <User className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Personal User
            </h2>
            <p className="text-center text-sm text-muted-foreground leading-relaxed">
              Track your meals, set health goals, and get AI-powered recipe suggestions tailored for you.
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Instant nutritional breakdown of any recipe using advanced language models and USDA/IFCT databases.",
    },
    {
      icon: Shield,
      title: "FSSAI Compliant",
      description: "Auto-generated nutrition labels that meet FSSAI Schedule I guidelines for food packaging.",
    },
    {
      icon: BarChart3,
      title: "Goal-Based Guidance",
      description: "Personalized recipe analysis and improvements based on your fitness or weight goals.",
    },
  ]

  return (
    <section className="border-t border-border bg-muted/50 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
          Why NutriAI?
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          Everything you need for accurate nutrition analysis in one place.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-start rounded-xl bg-card p-6 border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            NutriAI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/auth?mode=login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/auth?mode=register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Leaf className="h-4 w-4 text-primary" />
          <span>NutriAI</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Built for the Food Industry
        </p>
      </div>
    </footer>
  )
}
