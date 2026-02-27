"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { GoalSelector } from "@/components/goal-selector"
import { RecommendedRecipes } from "@/components/recommended-recipes"

export default function RecommendedPage() {
    const router = useRouter()
    const { user, isLoading, updateProfile } = useAuth()

    const currentGoal = user?.profile?.goal || "normal"

    const handleGoalChange = async (goal: "gym" | "weight_loss" | "weight_gain" | "normal") => {
        try {
            await updateProfile({ goal })
        } catch {
            // silently fail
        }
    }

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth")
        } else if (!isLoading && user && user.role !== "user") {
            router.push("/dashboard/manufacturer")
        }
    }, [isLoading, user, router])

    if (isLoading || !user || user.role !== "user") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <h1
                        className="text-3xl font-bold text-foreground"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Recommended for You
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Curated recipes tailored to your health goal. Change your goal to see different recommendations.
                    </p>
                </div>

                <div className="mb-8 rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                        Your Goal
                    </h2>
                    <GoalSelector selected={currentGoal} onSelect={handleGoalChange} />
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <RecommendedRecipes goal={currentGoal} />
                </div>
            </main>
        </div>
    )
}
