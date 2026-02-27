import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"
import User from "@/models/User"

export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const { age, weight, goal } = await req.json()

    const updateData: Record<string, unknown> = {}
    if (age !== undefined) updateData["profile.age"] = age
    if (weight !== undefined) updateData["profile.weight"] = weight
    if (goal !== undefined) updateData["profile.goal"] = goal

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
