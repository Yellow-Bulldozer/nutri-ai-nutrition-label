"use client"

import { Dumbbell, TrendingDown, TrendingUp, Heart } from "lucide-react"

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

interface GoalSelectorProps {
  selected: string
  onSelect: (goal: "gym" | "weight_loss" | "weight_gain" | "normal") => void
}

export function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {goals.map((goal) => {
        const isActive = selected === goal.value
        return (
          <button
            key={goal.value}
            onClick={() => onSelect(goal.value)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
              isActive
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <goal.icon className="h-5 w-5" />
            </div>
            <span
              className={`text-sm font-medium ${
                isActive ? "text-primary" : "text-card-foreground"
              }`}
            >
              {goal.label}
            </span>
            <span className="text-xs text-muted-foreground text-center">
              {goal.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
