"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecipeInput, type Ingredient } from "@/components/recipe-input"
import { NutritionLabel } from "@/components/nutrition-label"
import { NutritionInsights } from "@/components/nutrition-insights"
import { toast } from "sonner"

interface NutritionResult {
  calories: number
  protein: number
  fat: number
  saturatedFat: number
  carbohydrates: number
  sugar: number
  sodium: number
  fiber: number
  fssaiCompliant: boolean
  fssaiNotes: string
}

interface InsightsData {
  quality: "Good" | "Moderate" | "Poor"
  positiveAspects: string[]
  concerns: string[]
  improvements: string[]
}

export default function ManufacturerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<NutritionResult | null>(null)
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [recipeData, setRecipeData] = useState<{
    name: string
    servingSize: number
    ingredients: Ingredient[]
  } | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    } else if (!isLoading && user && user.role !== "manufacturer") {
      router.push("/dashboard/user")
    }
  }, [isLoading, user, router])

  if (isLoading || !user || user.role !== "manufacturer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleAnalyze = async (data: {
    name: string
    servingSize: number
    ingredients: Ingredient[]
  }) => {
    setAnalyzing(true)
    setRecipeData(data)
    setResult(null)
    setInsights(null)

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: data.ingredients,
          servingSize: data.servingSize,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Analysis failed")
      }

      const { nutrition } = await res.json()
      setResult(nutrition)
      toast.success("Nutrition analysis complete!")

      // Auto-save to history
      try {
        await fetch("/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            servingSize: data.servingSize,
            ingredients: data.ingredients,
            nutrition: {
              calories: nutrition.calories,
              protein: nutrition.protein,
              fat: nutrition.fat,
              saturatedFat: nutrition.saturatedFat,
              carbohydrates: nutrition.carbohydrates,
              sugar: nutrition.sugar,
              sodium: nutrition.sodium,
              fiber: nutrition.fiber,
            },
            fssaiCompliant: nutrition.fssaiCompliant,
          }),
        })
      } catch {
        // Silent fail
      }

      // Fetch Nutrition Insights
      setLoadingInsights(true)
      try {
        const insightsRes = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nutrition: {
              calories: nutrition.calories,
              protein: nutrition.protein,
              fat: nutrition.fat,
              saturatedFat: nutrition.saturatedFat,
              carbohydrates: nutrition.carbohydrates,
              sugar: nutrition.sugar,
              sodium: nutrition.sodium,
              fiber: nutrition.fiber,
            },
            servingSize: data.servingSize,
          }),
        })

        if (insightsRes.ok) {
          const { insights: insightsData } = await insightsRes.json()
          setInsights(insightsData)
        }
      } catch {
        // Insights are optional — don't block
      } finally {
        setLoadingInsights(false)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Manufacturer Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Enter your recipe ingredients to generate an FSSAI-compliant nutrition label.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Recipe Details
              </h2>
              <RecipeInput onSubmit={handleAnalyze} loading={analyzing} />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Nutrition Label
              </h2>

              {analyzing && (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">Analyzing your recipe...</p>
                </div>
              )}

              {!analyzing && !result && (
                <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
                  <p className="text-sm">Enter ingredients and click &quot;Analyze Recipe&quot; to generate a nutrition label.</p>
                </div>
              )}

              {!analyzing && result && recipeData && (
                <NutritionLabel
                  recipeName={recipeData.name}
                  servingSize={recipeData.servingSize}
                  nutrition={result}
                  fssaiCompliant={result.fssaiCompliant}
                  fssaiNotes={result.fssaiNotes}
                />
              )}
            </div>
          </div>
        </div>

        {/* Nutrition Insights Section — shown after analysis */}
        {(loadingInsights || insights) && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              📊 Nutrition Insights
            </h2>
            <NutritionInsights insights={insights} loading={loadingInsights} />
          </div>
        )}
      </main>
    </div>
  )
}
