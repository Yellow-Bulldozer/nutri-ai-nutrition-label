"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Loader2, Dumbbell, TrendingDown, TrendingUp, Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

const goals = [
  {
    value: "gym" as const,
    label: "Gym / Fitness",
    description: "High protein, moderate carbs",
    icon: Dumbbell,
  },
  {
    value: "weight_loss" as const,
    label: "Weight Loss",
    description: "Low calorie, high fiber",
    icon: TrendingDown,
  },
  {
    value: "weight_gain" as const,
    label: "Weight Gain",
    description: "High calorie, high carb + protein",
    icon: TrendingUp,
  },
  {
    value: "normal" as const,
    label: "Normal Health",
    description: "Balanced macros",
    icon: Heart,
  },
]

export default function SetupProfilePage() {
  const router = useRouter()
  const { updateProfile, user, isLoading: authLoading } = useAuth()
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [goal, setGoal] = useState<"gym" | "weight_loss" | "weight_gain" | "normal" | "">("")
  const [loading, setLoading] = useState(false)

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!age || !weight || !goal) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await updateProfile({
        age: parseInt(age),
        weight: parseFloat(weight),
        goal,
      })
      toast.success("Profile set up!")
      router.push("/dashboard/user")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          NutriAI
        </span>
      </div>

      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Set up your profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about yourself so we can personalize your nutrition guidance.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="age" className="text-sm font-medium text-card-foreground">
                Age
              </label>
              <input
                id="age"
                type="number"
                required
                min={1}
                max={150}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="weight" className="text-sm font-medium text-card-foreground">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                required
                min={1}
                max={500}
                step={0.1}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-card-foreground">
              Your Goal
            </label>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-all ${
                    goal === g.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <g.icon className={`h-4 w-4 ${goal === g.value ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${goal === g.value ? "text-primary" : "text-card-foreground"}`}>
                      {g.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{g.description}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}
