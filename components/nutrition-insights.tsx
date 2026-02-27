"use client"

import {
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    Shield,
    TrendingUp,
    TrendingDown,
    Loader2,
} from "lucide-react"

interface InsightsData {
    quality: "Good" | "Moderate" | "Poor"
    positiveAspects: string[]
    concerns: string[]
    improvements: string[]
}

interface NutritionInsightsProps {
    insights: InsightsData | null
    loading: boolean
}

const qualityConfig = {
    Good: {
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.08)",
        border: "rgba(16, 185, 129, 0.25)",
        icon: TrendingUp,
        label: "Good",
        description: "This recipe meets high nutritional standards",
    },
    Moderate: {
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.08)",
        border: "rgba(245, 158, 11, 0.25)",
        icon: Shield,
        label: "Moderate",
        description: "This recipe has room for nutritional improvement",
    },
    Poor: {
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.08)",
        border: "rgba(239, 68, 68, 0.25)",
        icon: TrendingDown,
        label: "Poor",
        description: "This recipe needs significant nutritional improvement",
    },
}

export function NutritionInsights({ insights, loading }: NutritionInsightsProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <p className="text-sm">Generating nutrition insights...</p>
            </div>
        )
    }

    if (!insights) return null

    const config = qualityConfig[insights.quality]
    const QualityIcon = config.icon

    return (
        <div className="flex flex-col gap-5">
            {/* Quality Rating Banner */}
            <div
                className="flex items-center gap-4 rounded-xl border p-5 transition-all"
                style={{
                    backgroundColor: config.bg,
                    borderColor: config.border,
                }}
            >
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${config.color}15` }}
                >
                    <QualityIcon className="h-7 w-7" style={{ color: config.color }} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Nutrition Quality
                        </span>
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: config.color }}>
                        {config.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                </div>
            </div>

            {/* Positive Aspects */}
            <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-card-foreground">Positive Aspects</h4>
                </div>
                <ul className="flex flex-col gap-2">
                    {insights.positiveAspects.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Concerns */}
            <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-card-foreground">Concerns</h4>
                </div>
                <ul className="flex flex-col gap-2">
                    {insights.concerns.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Suggested Improvements */}
            <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-card-foreground">Suggested Improvements</h4>
                </div>
                <ul className="flex flex-col gap-2">
                    {insights.improvements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
