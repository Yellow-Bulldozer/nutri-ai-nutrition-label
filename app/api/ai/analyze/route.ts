import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { google } from "@ai-sdk/google"
import { getAuthUser } from "@/lib/auth"
import { calculateNutrition } from "@/lib/nutrition-db"
import { z } from "zod"

const nutritionSchema = z.object({
  calories: z.number().describe("Energy in kcal per 100g"),
  protein: z.number().describe("Protein in grams per 100g"),
  fat: z.number().describe("Total fat in grams per 100g"),
  saturatedFat: z.number().describe("Saturated fat in grams per 100g"),
  carbohydrates: z.number().describe("Total carbohydrates in grams per 100g"),
  sugar: z.number().describe("Sugar in grams per 100g"),
  sodium: z.number().describe("Sodium in milligrams per 100g"),
  fiber: z.number().describe("Dietary fiber in grams per 100g"),
  fssaiCompliant: z
    .boolean()
    .describe(
      "Whether all mandatory FSSAI label fields are present and values fall within acceptable ranges"
    ),
  fssaiNotes: z
    .string()
    .describe(
      "Brief notes on FSSAI compliance status and any issues"
    ),
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

    const { ingredients, servingSize } = await req.json()

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: "At least one ingredient is required" },
        { status: 400 }
      )
    }

    // Try AI-based analysis first
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
      // AI failed (rate limit, API key issue, etc.) — use local nutrition database
      console.warn("AI analysis failed, using local nutrition database:", aiError)
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
