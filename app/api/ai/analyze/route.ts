import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
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

  const { object } = await generateObject({
    model: google("gemini-2.0-flash"),
    schema: nutritionSchema,
    prompt: `Calculate nutrition per 100g`,
  })

  return NextResponse.json({ nutrition: object })
}