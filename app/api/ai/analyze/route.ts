import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { google } from "@ai-sdk/google"
import { calculateNutrition } from "@/lib/nutrition-db"
import { connectToDatabase } from "@/lib/mongodb"
import Ingredient, { IIngredient } from "@/models/Ingredient"
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

// Look up an ingredient in MongoDB (case-insensitive, fuzzy)
async function findIngredientInDB(name: string): Promise<IIngredient | null> {
  const normalized = name.trim()

  // 1. Exact match (case-insensitive)
  let doc = await Ingredient.findOne({
    ingredient_name: { $regex: new RegExp(`^${normalized}$`, "i") },
  })
  if (doc) return doc

  // 2. Partial match — DB name contains input or input contains DB name
  doc = await Ingredient.findOne({
    ingredient_name: { $regex: new RegExp(normalized, "i") },
  })
  if (doc) return doc

  // 3. Try each word from the input
  const words = normalized.split(/\s+/).filter((w) => w.length >= 3)
  for (const word of words) {
    doc = await Ingredient.findOne({
      ingredient_name: { $regex: new RegExp(word, "i") },
    })
    if (doc) return doc
  }

  return null
}

// Calculate nutrition from MongoDB ingredient data
async function calculateFromDB(
  ingredients: { name: string; quantity: number; unit: string }[],
  servingSize: number
): Promise<{
  nutrition: {
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
  allFound: boolean
  unmatchedIngredients: string[]
} | null> {
  await connectToDatabase()

  let totalWeight = 0
  let totalCalories = 0
  let totalProtein = 0
  let totalFat = 0
  let totalSaturatedFat = 0
  let totalCarbs = 0
  let totalSugar = 0
  let totalSodium = 0
  let totalFiber = 0

  const unmatchedIngredients: string[] = []
  let matchedCount = 0

  for (const ingredient of ingredients) {
    // Convert quantity to grams
    let quantityInGrams = ingredient.quantity
    const unit = ingredient.unit.toLowerCase()

    if (unit === "kg") quantityInGrams = ingredient.quantity * 1000
    else if (unit === "ml") quantityInGrams = ingredient.quantity
    else if (unit === "l" || unit === "liter" || unit === "litre") quantityInGrams = ingredient.quantity * 1000
    else if (unit === "tbsp" || unit === "tablespoon") quantityInGrams = ingredient.quantity * 15
    else if (unit === "tsp" || unit === "teaspoon") quantityInGrams = ingredient.quantity * 5
    else if (unit === "cup" || unit === "cups") quantityInGrams = ingredient.quantity * 240
    else if (unit === "piece" || unit === "pieces" || unit === "nos" || unit === "pcs") quantityInGrams = ingredient.quantity * 50

    const dbIngredient = await findIngredientInDB(ingredient.name)
    if (dbIngredient) {
      matchedCount++
      const n = dbIngredient.nutrition_per_100g
      const factor = quantityInGrams / 100
      totalCalories += n.energy_kcal * factor
      totalProtein += n.protein_g * factor
      totalFat += n.total_fat_g * factor
      totalSaturatedFat += n.saturated_fat_g * factor
      totalCarbs += n.carbohydrates_g * factor
      totalSugar += n.total_sugars_g * factor
      totalSodium += n.sodium_mg * factor
      totalFiber += 0 // DB doesn't have fiber, default to 0
    } else {
      unmatchedIngredients.push(ingredient.name)
    }
    totalWeight += quantityInGrams
  }

  if (matchedCount === 0) return null

  // Normalize to per 100g
  const normFactor = totalWeight > 0 ? 100 / totalWeight : 1

  const issues: string[] = []
  const nutrition = {
    calories: Math.round(totalCalories * normFactor * 10) / 10,
    protein: Math.round(totalProtein * normFactor * 10) / 10,
    fat: Math.round(totalFat * normFactor * 10) / 10,
    saturatedFat: Math.round(totalSaturatedFat * normFactor * 10) / 10,
    carbohydrates: Math.round(totalCarbs * normFactor * 10) / 10,
    sugar: Math.round(totalSugar * normFactor * 10) / 10,
    sodium: Math.round(totalSodium * normFactor * 10) / 10,
    fiber: Math.round(totalFiber * normFactor * 10) / 10,
    fssaiCompliant: true,
    fssaiNotes: "",
  }

  // FSSAI compliance checks
  if (nutrition.sodium > 2300) issues.push("High sodium content exceeds recommended limits")
  if (nutrition.sugar > 50) issues.push("High sugar content per 100g")
  if (nutrition.saturatedFat > 20) issues.push("High saturated fat content")
  if (unmatchedIngredients.length > 0) {
    issues.push(`Some ingredients were not found in database: ${unmatchedIngredients.join(", ")}`)
  }

  if (issues.length > 0) {
    nutrition.fssaiCompliant = !issues.some((i) => !i.startsWith("Some"))
    nutrition.fssaiNotes = issues.join(". ") + "."
  } else {
    nutrition.fssaiNotes =
      "All mandatory FSSAI nutrition label fields are present. Values are within acceptable ranges. (Source: Database)"
  }

  return {
    nutrition,
    allFound: unmatchedIngredients.length === 0,
    unmatchedIngredients,
  }
}

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

    // STEP 1: Try fetching from MongoDB database first
    try {
      const dbResult = await calculateFromDB(ingredients, servingSize || 100)

      if (dbResult && dbResult.allFound) {
        // All ingredients found in DB — return directly, no AI needed
        console.log("✅ All ingredients found in database, skipping AI")
        return NextResponse.json({
          nutrition: dbResult.nutrition,
          source: "database",
        })
      }

      // Some ingredients found, some not — log which are missing
      if (dbResult && !dbResult.allFound) {
        console.log(
          `⚠️ Partial DB match. Missing: ${dbResult.unmatchedIngredients.join(", ")}. Trying AI...`
        )
      }
    } catch (dbError) {
      console.warn("Database lookup failed, proceeding to AI:", dbError)
    }

    // STEP 2: Fall back to AI for full analysis
    try {
      const ingredientList = ingredients
        .map(
          (i: { name: string; quantity: number; unit: string }) =>
            `${i.name}: ${i.quantity} ${i.unit}`
        )
        .join("\n")

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

      return NextResponse.json({ nutrition: output, source: "ai" })
    } catch (aiError) {
      // STEP 3: AI also failed — fall back to local hardcoded database
      console.warn("AI failed, using local database:", aiError)
      const nutrition = calculateNutrition(ingredients, servingSize || 100)

      if (!nutrition.validRecipe) {
        return NextResponse.json(
          { error: "No valid food ingredients recognized. Please enter real food items like rice, chicken, tomato, onion, etc." },
          { status: 400 }
        )
      }

      return NextResponse.json({ nutrition, source: "local-fallback" })
    }
  } catch (error) {
    console.error("Nutrition analysis error:", error)

    return NextResponse.json(
      { error: "Failed to analyze nutrition" },
      { status: 500 }
    )
  }
}