import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"
import Recipe from "@/models/Recipe"

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const body = await req.json()

    const recipe = await Recipe.create({
      userId: auth.userId,
      name: body.name,
      servingSize: body.servingSize || 100,
      ingredients: body.ingredients,
      nutrition: body.nutrition || null,
      fssaiCompliant: body.fssaiCompliant ?? null,
      goalAnalysis: body.goalAnalysis || null,
      improvedRecipe: body.improvedRecipe || null,
    })

    return NextResponse.json({ recipe }, { status: 201 })
  } catch (error) {
    console.error("Save recipe error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const auth = await getAuthUser()
    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const recipes = await Recipe.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ recipes })
  } catch (error) {
    console.error("Get recipes error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
