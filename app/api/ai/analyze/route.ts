import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { google } from "@ai-sdk/google"
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
  const body = await req.json()
  const { ingredientList, servingSize } = body

  try {
    const { text: output } = await generateText({
      model: google("gemini-2.0-flash"),
      maxRetries: 2,
      output: Output.object({ schema: nutritionSchema }),
      system: `You are a certified nutritionist and food scientist. When given a list of food ingredients with quantities, calculate accurate nutritional values based on standard nutritional databases (USDA/IFCT). The values should be calculated per 100g serving. Also determine if this would meet FSSAI compliance requirements for mandatory labeling fields and acceptable value ranges per FSSAI Schedule I guidelines.

IMPORTANT: If the ingredient names are random gibberish, nonsensical text, or not real food items, you MUST set fssaiCompliant to false and fssaiNotes to "Invalid ingredients detected. Please enter valid food items." with all nutritional values as 0. Only analyze REAL food ingredients.

Always return valid JSON only. No extra text.`,
      prompt: `Calculate the complete nutritional values per 100g serving for the following recipe (total serving size: ${servingSize || 100}g):\n\n${ingredientList}`,
    })

    // Parse the output
    const nutrition = typeof output === "string" ? JSON.parse(output) : output

    // Check if AI detected invalid ingredients (all zeros)
    if (
      nutrition &&
      nutrition.calories === 0 &&
      nutrition.protein === 0 &&
      nutrition.fat === 0 &&
      nutrition.carbohydrates === 0 &&
      nutrition.fssaiCompliant === false
    ) {
      return NextResponse.json(
        { error: nutrition.fssaiNotes || "Invalid ingredients detected. Please enter valid food items." },
        { status: 400 }
      )
    }

    return NextResponse.json({ nutrition })
  } catch (error) {
    console.error("Nutrition analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze nutrition" },
      { status: 500 }
    )
  }
}