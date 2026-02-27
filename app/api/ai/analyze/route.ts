import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { calculateNutrition } from "@/lib/nutrition-db"
import { z } from "zod"

const nutritionSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  fat: z.number(),
  saturatedFat: z.number(),
  carbohydrates: z.number(),
  sugar: z.number(),
  sodium: z.number(),
  fiber: z.number(),
  fssaiCompliant: z.boolean(),
  fssaiNotes: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ingredients, servingSize } = body
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: "At least one ingredient is required" },
        { status: 400 }
      )
    }

    try {
      const ingredientList = ingredients
        .map(
          (i: { name: string; quantity: number; unit: string }) =>
            `${i.name}: ${i.quantity} ${i.unit}`
        )
        .join("\n")

      // AI-based nutrition calculation
      const { output } = await generateText({
        model: google("gemini-2.0-flash"),
        maxRetries: 2,
        output: Output.object({ schema: nutritionSchema }),
        system: `
You are a certified nutritionist and food scientist.
Calculate accurate nutrition values per 100g serving.
Return ONLY valid JSON.
`,
        prompt: `
Calculate nutrition per 100g serving for:

${ingredientList}
`,
      })

      return NextResponse.json({ nutrition: output })

    } catch (aiError) {
      console.warn("AI failed, using local database:", aiError)
      const nutrition = calculateNutrition(ingredients, servingSize || 100)
      return NextResponse.json({ nutrition })
    }
  } catch (error) {
    console.error("Nutrition analysis error:", error)

    return NextResponse.json(
      { error: "Failed to analyze nutrition" },
      { status: 500 }
    )
  }
}