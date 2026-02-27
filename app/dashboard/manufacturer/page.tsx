"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecipeInput, type Ingredient } from "@/components/recipe-input"
import { NutritionLabel } from "@/components/nutrition-label"
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

export default function ManufacturerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<NutritionResult | null>(null)
  const [recipeData, setRecipeData] = useState<{
    name: string
    servingSize: number
    ingredients: Ingredient[]
  } | null>(null)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  if (user.role !== "manufacturer") {
    router.push("/dashboard/user")
    return null
  }

  const handleAnalyze = async (data: {
    name: string
    servingSize: number
    ingredients: Ingredient[]
  }) => {
    setAnalyzing(true)
    setRecipeData(data)
    setResult(null)

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSave = async () => {
    if (!recipeData || !result) return
    setSaving(true)

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipeData.name,
          servingSize: recipeData.servingSize,
          ingredients: recipeData.ingredients,
          nutrition: {
            calories: result.calories,
            protein: result.protein,
            fat: result.fat,
            saturatedFat: result.saturatedFat,
            carbohydrates: result.carbohydrates,
            sugar: result.sugar,
            sodium: result.sodium,
            fiber: result.fiber,
          },
          fssaiCompliant: result.fssaiCompliant,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")
      toast.success("Recipe saved!")
    } catch {
      toast.error("Failed to save recipe")
    } finally {
      setSaving(false)
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
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Recipe Details
            </h2>
            <RecipeInput onSubmit={handleAnalyze} loading={analyzing} />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Nutrition Label
            </h2>

            {analyzing && (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Analyzing your recipe with AI...</p>
              </div>
            )}

            {!analyzing && !result && (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
                <p className="text-sm">Enter ingredients and click &quot;Analyze Recipe&quot; to generate a nutrition label.</p>
              </div>
            )}

            {!analyzing && result && recipeData && (
              <div className="flex flex-col gap-4">
                <NutritionLabel
                  recipeName={recipeData.name}
                  servingSize={recipeData.servingSize}
                  nutrition={result}
                  fssaiCompliant={result.fssaiCompliant}
                  fssaiNotes={result.fssaiNotes}
                />

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Recipe"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
