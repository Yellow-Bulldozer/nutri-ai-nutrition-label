import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
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
        system: `You are a certified nutritionist and food scientist. When given a list of food ingredients with quantities, calculate accurate nutritional values based on standard nutritional databases (USDA/IFCT). The values should be calculated per 100g serving. Also determine if this would meet FSSAI compliance requirements for mandatory labeling fields and acceptable value ranges per FSSAI Schedule I guidelines.

IMPORTANT: If the ingredient names are random gibberish, nonsensical text, or not real food items, you MUST set fssaiCompliant to false and fssaiNotes to "Invalid ingredients detected. Please enter valid food items." with all nutritional values as 0. Only analyze REAL food ingredients.

Always return valid JSON only. No extra text.`,
        prompt: `Calculate the complete nutritional values per 100g serving for the following recipe (total serving size: ${servingSize || 100}g):\n\n${ingredientList}`,
      })

      // Check if AI detected invalid ingredients (all zeros)
      if (
        output &&
        output.calories === 0 &&
        output.protein === 0 &&
        output.fat === 0 &&
        output.carbohydrates === 0 &&
        output.fssaiCompliant === false
      ) {
        return NextResponse.json(
          { error: output.fssaiNotes || "Invalid ingredients detected. Please enter valid food items." },
          { status: 400 }
        )
      }

      return NextResponse.json({ nutrition: output })

    } catch (aiError) {
      console.warn("AI failed, using local database:", aiError)
      const nutrition = calculateNutrition(ingredients, servingSize || 100)

      // If no valid food ingredients were recognized, reject the request
      if (!nutrition.validRecipe) {
        return NextResponse.json(
          { error: "No valid food ingredients recognized. Please enter real food items like rice, chicken, tomato, onion, etc." },
          { status: 400 }
        )
      }

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