import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { getAuthUser } from "@/lib/auth"
import { z } from "zod"

const goalCheckSchema = z.object({
  suitable: z.boolean().describe("Whether the recipe is suitable for the user goal"),
  reason: z.string().describe("2-3 sentence explanation of goal compatibility"),
  improvements: z
    .array(z.string())
    .describe("List of specific improvements to make the recipe more goal-compatible"),
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

    const { nutrition, goal, age, weight } = await req.json()

    if (!nutrition || !goal) {
      return NextResponse.json(
        { error: "Nutrition data and goal are required" },
        { status: 400 }
      )
    }

    const { output } = await generateText({
      model: "openai/gpt-4o",
      output: Output.object({ schema: goalCheckSchema }),
      system: `You are a personalized diet coach. Analyze recipes against user health goals and provide friendly, actionable feedback. Be specific with ingredient suggestions and quantities.`,
      prompt: `User Goal: ${goal} | Age: ${age || "unknown"} | Weight: ${weight || "unknown"}kg

Recipe Nutrition (per 100g):
- Calories: ${nutrition.calories} kcal
- Protein: ${nutrition.protein}g
- Fat: ${nutrition.fat}g
- Carbohydrates: ${nutrition.carbohydrates}g
- Sugar: ${nutrition.sugar}g
- Sodium: ${nutrition.sodium}mg
- Fiber: ${nutrition.fiber}g

Analyze if this recipe is suitable for the user's goal. Provide a clear verdict, explanation, and specific improvements.`,
    })

    return NextResponse.json({ goalAnalysis: output })
  } catch (error) {
    console.error("Goal check error:", error)
    return NextResponse.json(
      { error: "Failed to analyze goal compatibility" },
      { status: 500 }
    )
  }
}
