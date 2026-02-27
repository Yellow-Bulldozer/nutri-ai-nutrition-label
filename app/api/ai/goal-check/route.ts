import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { google } from "@ai-sdk/google"
import { getAuthUser } from "@/lib/auth"
import { z } from "zod"

const goalCheckSchema = z.object({
  suitable: z.boolean().describe("Whether the recipe is suitable for the user goal"),
  reason: z.string().describe("2-3 sentence explanation of goal compatibility"),
  improvements: z
    .array(z.string())
    .describe("List of specific improvements to make the recipe more goal-compatible"),
})

// Local fallback for goal analysis when AI is unavailable
function localGoalCheck(nutrition: Record<string, number>, goal: string) {
  const { calories, protein, fat, carbohydrates, sugar, fiber, sodium } = nutrition

  const improvements: string[] = []
  let suitable = false
  let reason = ""

  switch (goal) {
    case "gym":
      suitable = protein > 15 && calories > 150
      reason = suitable
        ? `This recipe provides ${protein}g protein per 100g which is great for muscle building. With ${calories} kcal, it offers adequate energy for workouts.`
        : `This recipe has ${protein}g protein per 100g which may not be sufficient for gym goals. Aim for at least 15-20g protein per 100g serving.`
      if (protein < 15) improvements.push("Add protein-rich ingredients like chicken breast, eggs, paneer, or soya chunks")
      if (calories < 150) improvements.push("Increase caloric content with complex carbs like brown rice or oats")
      if (fat > 20) improvements.push("Reduce fat content — swap fried items for grilled or baked alternatives")
      if (fiber < 3) improvements.push("Add fiber-rich vegetables like broccoli, spinach, or peas")
      break

    case "weight_loss":
      suitable = calories < 200 && fat < 10 && sugar < 8
      reason = suitable
        ? `This recipe is well-suited for weight loss with only ${calories} kcal and ${fat}g fat per 100g. The moderate sugar level of ${sugar}g is acceptable.`
        : `This recipe may not be ideal for weight loss. It has ${calories} kcal, ${fat}g fat, and ${sugar}g sugar per 100g. Consider lighter alternatives.`
      if (calories > 200) improvements.push("Reduce portion size or replace calorie-dense ingredients with vegetables")
      if (fat > 10) improvements.push("Use less oil/ghee — try air frying, steaming, or grilling instead")
      if (sugar > 8) improvements.push("Reduce sugar — use natural sweetness from fruits instead")
      if (fiber < 3) improvements.push("Add more fiber-rich ingredients to increase satiety (spinach, oats, beans)")
      if (sodium > 800) improvements.push("Reduce salt and processed seasonings to prevent water retention")
      break

    case "weight_gain":
      suitable = calories > 250 && protein > 10
      reason = suitable
        ? `This recipe provides ${calories} kcal and ${protein}g protein per 100g, making it suitable for healthy weight gain.`
        : `This recipe has only ${calories} kcal per 100g. For weight gain, you need calorie-dense foods with good protein content.`
      if (calories < 250) improvements.push("Add calorie-dense ingredients like nuts, ghee, cheese, or dried fruits")
      if (protein < 10) improvements.push("Boost protein with paneer, eggs, chicken, or lentils")
      if (carbohydrates < 30) improvements.push("Add complex carbs like rice, oats, sweet potato, or whole wheat bread")
      break

    default: // "normal"
      suitable = calories < 300 && sodium < 1000 && sugar < 15
      reason = `This recipe provides a balanced nutritional profile with ${calories} kcal, ${protein}g protein, ${fat}g fat, and ${carbohydrates}g carbs per 100g. ${suitable ? "It fits well within a normal balanced diet." : "Some adjustments could make it healthier."}`
      if (sodium > 1000) improvements.push("Reduce sodium — use less salt and processed seasonings")
      if (sugar > 15) improvements.push("Reduce sugar content for better health")
      if (fat > 25) improvements.push("Reduce fat — opt for cooking methods that use less oil")
      if (fiber < 2) improvements.push("Include more fiber-rich vegetables or whole grains")
      if (protein < 5) improvements.push("Increase protein with dal, eggs, or legumes")
      break
  }

  if (improvements.length === 0) {
    improvements.push("This recipe is already well-optimized for your goal")
  }

  return { suitable, reason, improvements }
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

    const { nutrition, goal, age, weight } = await req.json()

    if (!nutrition || !goal) {
      return NextResponse.json(
        { error: "Nutrition data and goal are required" },
        { status: 400 }
      )
    }

    // Try AI-based goal check first
    try {
      const { output } = await generateText({
        model: google("gemini-2.0-flash"),
        maxRetries: 3,
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
    } catch (aiError) {
      console.warn("AI goal check failed, using local analysis:", aiError)
      const goalAnalysis = localGoalCheck(nutrition, goal)
      return NextResponse.json({ goalAnalysis })
    }
  } catch (error) {
    console.error("Goal check error:", error)
    return NextResponse.json(
      { error: "Failed to analyze goal compatibility" },
      { status: 500 }
    )
  }
}
