import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { getAuthUser } from "@/lib/auth"
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

    const ingredientList = ingredients
      .map(
        (i: { name: string; quantity: number; unit: string }) =>
          `${i.name}: ${i.quantity} ${i.unit}`
      )
      .join("\n")

    const { output } = await generateText({
      model: "openai/gpt-4o",
      output: Output.object({ schema: nutritionSchema }),
      system: `You are a certified nutritionist and food scientist. When given a list of food ingredients with quantities, calculate accurate nutritional values based on standard nutritional databases (USDA/IFCT). The values should be calculated per 100g serving. Also determine if this would meet FSSAI compliance requirements for mandatory labeling fields and acceptable value ranges per FSSAI Schedule I guidelines. Always return valid JSON only. No extra text.`,
      prompt: `Calculate the complete nutritional values per 100g serving for the following recipe (total serving size: ${servingSize || 100}g):\n\n${ingredientList}`,
    })

    return NextResponse.json({ nutrition: output })
  } catch (error) {
    console.error("Nutrition analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze nutrition" },
      { status: 500 }
    )
  }
}
