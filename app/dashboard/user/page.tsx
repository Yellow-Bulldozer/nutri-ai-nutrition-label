"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User as UserIcon, Weight, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { GoalSelector } from "@/components/goal-selector"
import { RecipeInput, type Ingredient } from "@/components/recipe-input"
import { NutritionLabel } from "@/components/nutrition-label"
import { NutritionCharts } from "@/components/nutrition-charts"
import { GoalAnalysisDisplay } from "@/components/goal-analysis-display"
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

interface GoalAnalysis {
  suitable: boolean
  reason: string
  improvements: string[]
}

interface ImprovedRecipe {
  ingredients: { name: string; quantity: number; unit: string; isChanged: boolean; changeNote: string | null }[]
  changes: string[]
  recommendedFoods: { name: string; reason: string }[]
}

export default function UserDashboard() {
  const router = useRouter()
  const { user, isLoading, updateProfile } = useAuth()

  const [analyzing, setAnalyzing] = useState(false)
  const [checkingGoal, setCheckingGoal] = useState(false)
  const [improving, setImproving] = useState(false)
  const [saving, setSaving] = useState(false)

  const [nutrition, setNutrition] = useState<NutritionResult | null>(null)
  const [goalAnalysis, setGoalAnalysis] = useState<GoalAnalysis | null>(null)
  const [improvedRecipe, setImprovedRecipe] = useState<ImprovedRecipe | null>(null)
  const [recipeData, setRecipeData] = useState<{
    name: string
    servingSize: number
    ingredients: Ingredient[]
  } | null>(null)

  const currentGoal = user?.profile?.goal || "normal"

  const handleGoalChange = useCallback(
    async (goal: "gym" | "weight_loss" | "weight_gain" | "normal") => {
      try {
        await updateProfile({ goal })
        toast.success("Goal updated!")
        setGoalAnalysis(null)
        setImprovedRecipe(null)
      } catch {
        toast.error("Failed to update goal")
      }
    },
    [updateProfile]
  )

  const handleAnalyze = async (data: {
    name: string
    servingSize: number
    ingredients: Ingredient[]
  }) => {
    setAnalyzing(true)
    setRecipeData(data)
    setNutrition(null)
    setGoalAnalysis(null)
    setImprovedRecipe(null)

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: data.ingredients,
          servingSize: data.servingSize,
        }),
      })

      if (!res.ok) throw new Error("Analysis failed")
      const { nutrition: nutritionData } = await res.json()
      setNutrition(nutritionData)
      toast.success("Nutrition analysis complete!")

      setCheckingGoal(true)
      const goalRes = await fetch("/api/ai/goal-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nutrition: nutritionData,
          goal: currentGoal,
          age: user?.profile?.age,
          weight: user?.profile?.weight,
        }),
      })

      if (!goalRes.ok) throw new Error("Goal analysis failed")
      const { goalAnalysis: analysis } = await goalRes.json()
      setGoalAnalysis(analysis)

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
              calories: nutritionData.calories,
              protein: nutritionData.protein,
              fat: nutritionData.fat,
              saturatedFat: nutritionData.saturatedFat,
              carbohydrates: nutritionData.carbohydrates,
              sugar: nutritionData.sugar,
              sodium: nutritionData.sodium,
              fiber: nutritionData.fiber,
            },
            fssaiCompliant: nutritionData.fssaiCompliant,
            goalAnalysis: analysis
              ? {
                goal: currentGoal,
                suitable: analysis.suitable,
                aiComment: analysis.reason,
              }
              : null,
          }),
        })
      } catch {
        // Silent fail
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setAnalyzing(false)
      setCheckingGoal(false)
    }
  }

  const handleImprove = async () => {
    if (!recipeData || !nutrition) return
    setImproving(true)

    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: recipeData.ingredients,
          nutrition,
          goal: currentGoal,
        }),
      })

      if (!res.ok) throw new Error("Failed to generate improvements")
      const { improvedRecipe: improved } = await res.json()
      setImprovedRecipe(improved)
      toast.success("Recipe improved!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to improve recipe")
    } finally {
      setImproving(false)
    }
  }

  const handleSave = async () => {
    if (!recipeData || !nutrition) return
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
          goalAnalysis: goalAnalysis
            ? {
              goal: currentGoal,
              suitable: goalAnalysis.suitable,
              aiComment: goalAnalysis.reason,
            }
            : null,
          improvedRecipe: improvedRecipe
            ? {
              ingredients: improvedRecipe.ingredients.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                unit: i.unit,
              })),
              changes: improvedRecipe.changes,
              recommendedFoods: improvedRecipe.recommendedFoods,
            }
            : null,
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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    } else if (!isLoading && user && user.role !== "user") {
      router.push("/dashboard/manufacturer")
    } else if (!isLoading && user && (!user.profile?.age || !user.profile?.weight)) {
      router.push("/setup-profile")
    }
  }, [isLoading, user, router])

  if (isLoading || !user || user.role !== "user" || !user.profile?.age || !user.profile?.weight) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className="text-3xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Analyze recipes and get personalized dietary guidance.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Age: {user.profile.age}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Weight className="h-3.5 w-3.5" />
              <span>{user.profile.weight} kg</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <UserIcon className="h-3.5 w-3.5" />
              <span className="capitalize">{currentGoal.replace("_", " ")}</span>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Your Goal
          </h2>
          <GoalSelector selected={currentGoal} onSelect={handleGoalChange} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Recipe Details
              </h2>
              <RecipeInput onSubmit={handleAnalyze} loading={analyzing} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {(analyzing || nutrition) && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Nutrition Analysis
                </h2>

                {analyzing && !nutrition && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Analyzing nutrition...</p>
                  </div>
                )}

                {nutrition && recipeData && (
                  <NutritionLabel
                    recipeName={recipeData.name}
                    servingSize={recipeData.servingSize}
                    nutrition={nutrition}
                    fssaiCompliant={nutrition.fssaiCompliant}
                    fssaiNotes={nutrition.fssaiNotes}
                  />
                )}
              </div>
            )}

            {nutrition && recipeData && (
              <NutritionCharts
                nutrition={nutrition}
                servingSize={recipeData.servingSize}
              />
            )}

            {(checkingGoal || goalAnalysis) && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Goal Compatibility
                </h2>

                {checkingGoal && !goalAnalysis && (
                  <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-sm">Checking goal compatibility...</p>
                  </div>
                )}

                {goalAnalysis && (
                  <GoalAnalysisDisplay
                    analysis={goalAnalysis}
                    improvedRecipe={improvedRecipe}
                    onImprove={handleImprove}
                    improving={improving}
                  />
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
