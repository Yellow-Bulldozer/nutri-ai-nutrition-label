import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
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

    const ingredientList = ingredients
      .map(
        (i: { name: string; quantity: number; unit: string }) =>
          `${i.name}: ${i.quantity} ${i.unit}`
      )
      .join("\n")

    const { output } = await generateText({
      model: "openai/gpt-4o",
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
  } catch (error) {
    console.error("Improve recipe error:", error)
    return NextResponse.json(
      { error: "Failed to generate improved recipe" },
      { status: 500 }
    )
  }
}
