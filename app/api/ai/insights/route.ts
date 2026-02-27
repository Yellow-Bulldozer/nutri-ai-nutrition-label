import { NextRequest, NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { google } from "@ai-sdk/google"
import { getAuthUser } from "@/lib/auth"
import { z } from "zod"

const insightsSchema = z.object({
    quality: z.enum(["Good", "Moderate", "Poor"]).describe("Overall nutrition quality rating"),
    positiveAspects: z.array(z.string()).describe("List of positive nutritional aspects"),
    concerns: z.array(z.string()).describe("List of potential nutritional concerns"),
    improvements: z.array(z.string()).describe("2-3 suggestions to improve the recipe nutritionally"),
})

// Local fallback for nutrition insights
function localInsights(nutrition: {
    calories: number
    protein: number
    fat: number
    carbohydrates: number
    sugar: number
    sodium: number
    fiber: number
    saturatedFat?: number
}, servingSize: number) {
    const positiveAspects: string[] = []
    const concerns: string[] = []
    const improvements: string[] = []

    // Analyze protein
    if (nutrition.protein >= 15) positiveAspects.push("High protein content supports muscle development and satiety")
    else if (nutrition.protein >= 8) positiveAspects.push("Moderate protein content contributes to daily protein needs")
    else concerns.push("Low protein content — consider adding protein-rich ingredients like legumes, dairy, or lean meats")

    // Analyze fiber
    if (nutrition.fiber >= 5) positiveAspects.push("Excellent fiber content supports digestive health and blood sugar control")
    else if (nutrition.fiber >= 3) positiveAspects.push("Good fiber content aids digestion")
    else {
        concerns.push("Low dietary fiber — may not support optimal digestive health")
        improvements.push("Add whole grains, vegetables, or legumes to increase fiber content")
    }

    // Analyze fat
    if (nutrition.fat <= 10) positiveAspects.push("Low fat content makes this suitable for calorie-conscious consumers")
    else if (nutrition.fat > 25) {
        concerns.push("High total fat content per 100g serving")
        improvements.push("Reduce oil/butter quantities or switch to healthier cooking methods like grilling or baking")
    }

    // Analyze saturated fat
    if ((nutrition.saturatedFat || 0) > 10) {
        concerns.push("High saturated fat content may impact cardiovascular health")
        improvements.push("Replace saturated fats with unsaturated alternatives like olive oil or nut-based oils")
    } else if ((nutrition.saturatedFat || 0) <= 3) {
        positiveAspects.push("Low saturated fat content is heart-friendly")
    }

    // Analyze sugar
    if (nutrition.sugar <= 5) positiveAspects.push("Low sugar content aligns with healthy eating guidelines")
    else if (nutrition.sugar > 15) {
        concerns.push("High sugar content may not meet health-conscious consumer expectations")
        improvements.push("Reduce added sugars or use natural sweeteners like stevia or monk fruit")
    }

    // Analyze sodium
    if (nutrition.sodium <= 300) positiveAspects.push("Low sodium content supports cardiovascular health")
    else if (nutrition.sodium > 800) {
        concerns.push("High sodium levels — exceeds recommended limits per serving for many consumers")
        improvements.push("Reduce salt and high-sodium seasonings; use herbs and spices for flavor instead")
    }

    // Analyze calories
    if (nutrition.calories <= 150) positiveAspects.push("Low calorie density makes this appealing for weight management")
    else if (nutrition.calories > 400) {
        concerns.push("High calorie density per 100g — may need portion size guidance on labeling")
    }

    // Ensure we have at least some content
    if (positiveAspects.length === 0) positiveAspects.push("Provides essential macronutrients as part of a balanced diet")
    if (concerns.length === 0) concerns.push("No major nutritional concerns identified")
    if (improvements.length === 0) improvements.push("Consider fortifying with additional vitamins or minerals for added label appeal")

    // Determine quality
    let quality: "Good" | "Moderate" | "Poor" = "Moderate"
    const issueCount = concerns.filter(c => !c.startsWith("No major")).length
    const positiveCount = positiveAspects.length

    if (issueCount === 0 && positiveCount >= 3) quality = "Good"
    else if (issueCount <= 1 && positiveCount >= 2) quality = "Good"
    else if (issueCount >= 3) quality = "Poor"

    return { quality, positiveAspects, concerns, improvements }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await getAuthUser()
        if (!auth) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const { nutrition, servingSize } = await req.json()

        if (!nutrition) {
            return NextResponse.json({ error: "Nutrition data is required" }, { status: 400 })
        }

        // Try AI first
        try {
            const { output } = await generateText({
                model: google("gemini-2.0-flash"),
                maxRetries: 3,
                output: Output.object({ schema: insightsSchema }),
                system: `You are a food nutrition expert advising food manufacturers. Analyze recipe nutrition data and provide actionable insights. Be professional, specific, and concise.`,
                prompt: `Analyze the following recipe nutrition information and provide a nutritional assessment for food manufacturers.

Recipe Nutrition Data (per 100g):
- Calories: ${nutrition.calories} kcal
- Protein: ${nutrition.protein} g
- Fat: ${nutrition.fat} g
- Saturated Fat: ${nutrition.saturatedFat || 0} g
- Carbohydrates: ${nutrition.carbohydrates} g
- Sugar: ${nutrition.sugar} g
- Sodium: ${nutrition.sodium} mg
- Fiber: ${nutrition.fiber} g
- Serving Size: ${servingSize || 100}g

Tasks:
1. Give a Nutrition Quality rating: Good / Moderate / Poor
2. Identify 2-4 positive nutritional aspects
3. Identify 2-3 potential nutritional concerns
4. Suggest 2-3 improvements to make the recipe nutritionally better without drastically changing it`,
            })

            return NextResponse.json({ insights: output })
        } catch (aiError) {
            console.warn("AI insights failed, using local analysis:", aiError)
            const insights = localInsights(nutrition, servingSize || 100)
            return NextResponse.json({ insights })
        }
    } catch (error) {
        console.error("Nutrition insights error:", error)
        return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
    }
}
