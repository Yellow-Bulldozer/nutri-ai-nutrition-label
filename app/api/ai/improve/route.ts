import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { google } from "@ai-sdk/google"
import { getAuthUser } from "@/lib/auth"
import { z } from "zod"

const improvedRecipeSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      isChanged: z.boolean().describe("Whether this ingredient was modified or added"),
      changeNote: z
        .string()
        .nullable()
        .describe("Description of what changed, e.g. 'Replaced white rice'"),
    })
  ),
  changes: z
    .array(z.string())
    .describe("Summary of all changes made to the recipe"),
  recommendedFoods: z
    .array(
      z.object({
        name: z.string(),
        reason: z.string().describe("Brief reason why this food helps the goal"),
      })
    )
    .describe("3 recommended food items the user should include more of"),
})

// Local fallback for recipe improvement
function localImproveRecipe(
  ingredients: { name: string; quantity: number; unit: string }[],
  nutrition: Record<string, number>,
  goal: string
) {
  const changes: string[] = []
  const improved = ingredients.map((ing) => ({
    name: ing.name,
    quantity: ing.quantity,
    unit: ing.unit,
    isChanged: false,
    changeNote: null as string | null,
  }))

  const goalRecommendations: Record<string, { name: string; reason: string }[]> = {
    gym: [
      { name: "Chicken Breast", reason: "High-quality protein (31g per 100g) for muscle repair and growth" },
      { name: "Greek Yogurt", reason: "Rich in protein and probiotics, great as a post-workout snack" },
      { name: "Eggs", reason: "Complete protein with all essential amino acids for muscle building" },
    ],
    weight_loss: [
      { name: "Oats", reason: "High fiber (11g per 100g) keeps you full longer and aids digestion" },
      { name: "Spinach", reason: "Very low calorie (23 kcal per 100g) but packed with iron and vitamins" },
      { name: "Green Tea", reason: "Boosts metabolism and aids in fat burning with zero calories" },
    ],
    weight_gain: [
      { name: "Peanut Butter", reason: "Calorie-dense (598 kcal per 100g) with healthy fats and protein" },
      { name: "Banana", reason: "Great source of energy (89 kcal per 100g) with potassium for recovery" },
      { name: "Full Cream Milk", reason: "Provides calories, protein, and calcium in every glass" },
    ],
    normal: [
      { name: "Mixed Dal", reason: "Balanced protein source with fiber, ideal for daily nutrition" },
      { name: "Seasonal Vegetables", reason: "Provide essential vitamins and minerals with minimal calories" },
      { name: "Brown Rice", reason: "Complex carbs with fiber for sustained energy throughout the day" },
    ],
  }

  // Adjust based on goal
  if (goal === "weight_loss") {
    // Reduce oil
    improved.forEach((ing, i) => {
      const name = ing.name.toLowerCase()
      if (name.includes("oil") || name.includes("ghee") || name.includes("butter")) {
        const newQty = Math.max(Math.round(ing.quantity * 0.5), 1)
        if (newQty !== ing.quantity) {
          changes.push(`Reduced ${ing.name} from ${ing.quantity}${ing.unit} to ${newQty}${ing.unit}`)
          improved[i] = { ...ing, quantity: newQty, isChanged: true, changeNote: "Reduced quantity for lower calories" }
        }
      }
      if (name.includes("sugar")) {
        changes.push(`Removed or minimized ${ing.name}`)
        improved[i] = { ...ing, quantity: Math.round(ing.quantity * 0.3), isChanged: true, changeNote: "Minimized sugar" }
      }
    })
    if (changes.length === 0) changes.push("Consider using steaming or grilling instead of frying")
  } else if (goal === "gym") {
    // Boost protein
    changes.push("Added egg whites for extra protein boost")
    improved.push({ name: "Egg Whites", quantity: 100, unit: "g", isChanged: true, changeNote: "Added for protein" })

    improved.forEach((ing, i) => {
      const name = ing.name.toLowerCase()
      if (name.includes("sugar")) {
        changes.push(`Reduced ${ing.name} for cleaner nutrition`)
        improved[i] = { ...ing, quantity: Math.round(ing.quantity * 0.5), isChanged: true, changeNote: "Reduced sugar" }
      }
    })
  } else if (goal === "weight_gain") {
    // Add calorie-dense ingredients
    improved.forEach((ing, i) => {
      const name = ing.name.toLowerCase()
      if (name.includes("milk")) {
        changes.push(`Use full-cream milk instead of regular for extra calories`)
        improved[i] = { ...ing, isChanged: true, changeNote: "Switch to full-cream" }
      }
    })
    changes.push("Added a handful of mixed nuts for healthy fats and calories")
    improved.push({ name: "Mixed Nuts", quantity: 30, unit: "g", isChanged: true, changeNote: "Added for calories & healthy fats" })
  }

  if (changes.length === 0) {
    changes.push("Your recipe is already well-balanced for your goal")
  }

  return {
    ingredients: improved,
    changes,
    recommendedFoods: goalRecommendations[goal] || goalRecommendations.normal,
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { ingredients, nutrition, goal } = await req.json()

    if (!ingredients || !nutrition || !goal) {
      return NextResponse.json(
        { error: "Ingredients, nutrition, and goal are required" },
        { status: 400 }
      )
    }

    // Try AI-based improvement first
    try {
      const ingredientList = ingredients
        .map(
          (i: { name: string; quantity: number; unit: string }) =>
            `${i.name}: ${i.quantity} ${i.unit}`
        )
        .join("\n")

      const { output } = await generateText({
        model: google("gemini-2.0-flash"),
        maxRetries: 3,
        output: Output.object({ schema: improvedRecipeSchema }),
        system: `You are a personalized diet coach and recipe optimizer. When asked to improve a recipe for a specific health goal, suggest specific ingredient swaps, quantity adjustments, and additions. Always recommend 3 additional food items the user should eat more of.`,
        prompt: `The user wants to achieve: ${goal}

Current recipe ingredients:
${ingredientList}

Current nutrition (per 100g):
- Calories: ${nutrition.calories} kcal
- Protein: ${nutrition.protein}g
- Fat: ${nutrition.fat}g
- Carbohydrates: ${nutrition.carbohydrates}g
- Sugar: ${nutrition.sugar}g
- Fiber: ${nutrition.fiber}g

Suggest specific modifications: ingredient swaps, quantity adjustments, and additions to better align this recipe with the user's ${goal} goal. Also recommend 3 food items they should include more of for their goal.`,
      })

      return NextResponse.json({ improvedRecipe: output })
    } catch (aiError) {
      console.warn("AI recipe improvement failed, using local suggestions:", aiError)
      const improvedRecipe = localImproveRecipe(ingredients, nutrition, goal)
      return NextResponse.json({ improvedRecipe })
    }
  } catch (error) {
    console.error("Improve recipe error:", error)
    return NextResponse.json(
      { error: "Failed to generate improved recipe" },
      { status: 500 }
    )
  }
}
