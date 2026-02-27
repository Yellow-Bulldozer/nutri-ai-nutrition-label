"use client"

import Link from "next/link"
import { Leaf, Factory, User, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react"
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button"

export function HeroSection() {
  return (
    <section id="hero-section" className="flex flex-col items-center justify-center px-4 pt-32 pb-20 bg-linear-to-b from-slate-950 to-slate-900">
      <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 mb-8 backdrop-blur">
        <Zap className="h-3.5 w-3.5 text-emerald-400" />
        <span>Powered by AI Nutrition Analysis</span>
      </div>

      <h1 className="text-center text-5xl font-bold tracking-tight text-white md:text-7xl max-w-4xl text-balance" style={{ fontFamily: "var(--font-heading)" }}>
        <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Smart Nutrition,</span>{" "}
        <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Simplified</span>
      </h1>

      <p className="mt-6 max-w-2xl text-center text-lg text-gray-300 leading-relaxed">
        Automate FSSAI-compliant nutrition label generation for food manufacturers, or get personalized dietary guidance powered by AI.
      </p>

      <div className="mt-16 grid w-full max-w-3xl gap-6 md:grid-cols-2">
        <Link href="/auth?role=manufacturer" className="group">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-linear-to-br from-slate-800 via-slate-800 to-emerald-900/20 p-8 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
              <Factory className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Manufacturer
            </h2>
            <p className="text-center text-sm text-gray-300 leading-relaxed">
              Generate FSSAI-compliant nutrition labels for your food products with AI-powered analysis.
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link href="/auth?role=user" className="group">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-blue-500/20 bg-linear-to-br from-slate-800 via-slate-800 to-blue-900/20 p-8 transition-all duration-300 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
              <User className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Personal User
            </h2>
            <p className="text-center text-sm text-gray-300 leading-relaxed">
              Track your meals, set health goals, and get AI-powered recipe suggestions tailored for you.
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
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
    <section className="border-t border-emerald-500/20 bg-linear-to-b from-slate-900 to-slate-950 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
          Why NutriAI?
        </h2>
        <p className="mt-4 text-center text-gray-300">
          Everything you need for accurate nutrition analysis in one place.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const colors = [
              { icon: "from-purple-500 to-pink-500", border: "border-purple-500/30", shadow: "shadow-purple-500/20", text: "text-purple-400" },
              { icon: "from-blue-500 to-cyan-500", border: "border-blue-500/30", shadow: "shadow-blue-500/20", text: "text-blue-400" },
              { icon: "from-emerald-500 to-teal-500", border: "border-emerald-500/30", shadow: "shadow-emerald-500/20", text: "text-emerald-400" },
            ];
            const color = colors[index % colors.length];
            return (
              <div key={feature.title} className={`flex flex-col items-start rounded-2xl bg-linear-to-br from-slate-800 to-slate-800/50 p-6 border ${color.border} hover:shadow-2xl ${color.shadow} transition-all duration-300 backdrop-blur-sm`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${color.icon} text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-linear-to-r from-slate-950/90 via-slate-950/95 to-slate-900/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 transform group-hover:scale-110">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-400 transition-all" style={{ fontFamily: "var(--font-heading)" }}>
            NutriAI
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LiquidGlassButton
            asChild
            variant="default"
            size="sm"
          >
            <Link href="/auth?mode=login">
              Log in
            </Link>
          </LiquidGlassButton>
          <LiquidGlassButton
            asChild
            variant="primary"
            size="sm"
          >
            <Link href="/auth?mode=register">
              Sign up
            </Link>
          </LiquidGlassButton>
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
