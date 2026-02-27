"use client"

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"

interface NutritionData {
    calories: number
    protein: number
    fat: number
    saturatedFat?: number
    carbohydrates: number
    sugar: number
    sodium: number
    fiber: number
}

interface NutritionChartsProps {
    nutrition: NutritionData
    servingSize: number
}

const MACRO_COLORS = ["#6366f1", "#f59e0b", "#10b981"]
const BAR_COLOR = "#6366f1"

// Recommended Daily Values (based on 2000 kcal diet)
const DAILY_VALUES: Record<string, { value: number; unit: string }> = {
    calories: { value: 2000, unit: "kcal" },
    protein: { value: 50, unit: "g" },
    fat: { value: 65, unit: "g" },
    carbohydrates: { value: 300, unit: "g" },
    sugar: { value: 50, unit: "g" },
    sodium: { value: 2300, unit: "mg" },
    fiber: { value: 28, unit: "g" },
    saturatedFat: { value: 20, unit: "g" },
}

function calculateHealthScore(nutrition: NutritionData): number {
    let score = 50

    // Protein bonus (higher is better)
    if (nutrition.protein > 15) score += 12
    else if (nutrition.protein > 10) score += 8
    else if (nutrition.protein > 5) score += 4

    // Fiber bonus
    if (nutrition.fiber > 5) score += 12
    else if (nutrition.fiber > 3) score += 8
    else if (nutrition.fiber > 1) score += 4

    // Low sugar bonus
    if (nutrition.sugar < 5) score += 10
    else if (nutrition.sugar < 10) score += 5
    else if (nutrition.sugar > 20) score -= 10

    // Low sodium bonus
    if (nutrition.sodium < 400) score += 8
    else if (nutrition.sodium < 600) score += 4
    else if (nutrition.sodium > 1000) score -= 8

    // Moderate fat
    if (nutrition.fat < 10) score += 6
    else if (nutrition.fat < 20) score += 3
    else if (nutrition.fat > 30) score -= 6

    // Saturated fat penalty
    if (nutrition.saturatedFat) {
        if (nutrition.saturatedFat > 10) score -= 10
        else if (nutrition.saturatedFat > 5) score -= 5
        else score += 5
    }

    // Moderate calories
    if (nutrition.calories > 100 && nutrition.calories < 250) score += 5
    else if (nutrition.calories > 400) score -= 8

    return Math.max(0, Math.min(100, score))
}

function getScoreColor(score: number): string {
    if (score >= 75) return "#10b981"
    if (score >= 50) return "#f59e0b"
    return "#ef4444"
}

function getScoreLabel(score: number): string {
    if (score >= 80) return "Excellent"
    if (score >= 65) return "Good"
    if (score >= 50) return "Average"
    if (score >= 35) return "Below Average"
    return "Poor"
}

export function NutritionCharts({ nutrition, servingSize }: NutritionChartsProps) {
    const perServing = (val: number) => Math.round((val * servingSize) / 100 * 10) / 10

    // Macro pie chart data
    const proteinCal = nutrition.protein * 4
    const fatCal = nutrition.fat * 9
    const carbCal = nutrition.carbohydrates * 4
    const totalMacroCal = proteinCal + fatCal + carbCal

    const macroData = [
        {
            name: "Protein",
            value: Math.round((proteinCal / totalMacroCal) * 100) || 0,
            grams: nutrition.protein,
            color: MACRO_COLORS[0],
        },
        {
            name: "Fat",
            value: Math.round((fatCal / totalMacroCal) * 100) || 0,
            grams: nutrition.fat,
            color: MACRO_COLORS[1],
        },
        {
            name: "Carbs",
            value: Math.round((carbCal / totalMacroCal) * 100) || 0,
            grams: nutrition.carbohydrates,
            color: MACRO_COLORS[2],
        },
    ]

    // Nutrient bar chart data — % of daily value
    const barData = [
        { name: "Calories", pct: Math.round((perServing(nutrition.calories) / DAILY_VALUES.calories.value) * 100) },
        { name: "Protein", pct: Math.round((perServing(nutrition.protein) / DAILY_VALUES.protein.value) * 100) },
        { name: "Fat", pct: Math.round((perServing(nutrition.fat) / DAILY_VALUES.fat.value) * 100) },
        { name: "Carbs", pct: Math.round((perServing(nutrition.carbohydrates) / DAILY_VALUES.carbohydrates.value) * 100) },
        { name: "Sugar", pct: Math.round((perServing(nutrition.sugar) / DAILY_VALUES.sugar.value) * 100) },
        { name: "Fiber", pct: Math.round((perServing(nutrition.fiber) / DAILY_VALUES.fiber.value) * 100) },
        { name: "Sodium", pct: Math.round((perServing(nutrition.sodium) / DAILY_VALUES.sodium.value) * 100) },
    ]

    const healthScore = calculateHealthScore(nutrition)
    const scoreColor = getScoreColor(healthScore)
    const scoreLabel = getScoreLabel(healthScore)

    // Daily value progress data
    const dvData = [
        { label: "Calories", value: perServing(nutrition.calories), dv: DAILY_VALUES.calories.value, unit: "kcal" },
        { label: "Protein", value: perServing(nutrition.protein), dv: DAILY_VALUES.protein.value, unit: "g" },
        { label: "Total Fat", value: perServing(nutrition.fat), dv: DAILY_VALUES.fat.value, unit: "g" },
        { label: "Carbs", value: perServing(nutrition.carbohydrates), dv: DAILY_VALUES.carbohydrates.value, unit: "g" },
        { label: "Sugar", value: perServing(nutrition.sugar), dv: DAILY_VALUES.sugar.value, unit: "g" },
        { label: "Fiber", value: perServing(nutrition.fiber), dv: DAILY_VALUES.fiber.value, unit: "g" },
        { label: "Sodium", value: perServing(nutrition.sodium), dv: DAILY_VALUES.sodium.value, unit: "mg" },
    ]

    // SVG gauge arc for health score
    const radius = 58
    const circumference = Math.PI * radius // semi-circle
    const offset = circumference - (healthScore / 100) * circumference

    return (
        <div className="flex flex-col gap-6">
            {/* Health Score Gauge */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Health Score
                </h3>
                <div className="flex flex-col items-center gap-2">
                    <div className="relative" style={{ width: 160, height: 90 }}>
                        <svg width="160" height="90" viewBox="0 0 160 90">
                            {/* Background arc */}
                            <path
                                d="M 10 80 A 70 70 0 0 1 150 80"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="12"
                                strokeLinecap="round"
                                className="text-muted/30"
                            />
                            {/* Score arc */}
                            <path
                                d="M 10 80 A 70 70 0 0 1 150 80"
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={`${circumference}`}
                                strokeDashoffset={`${offset}`}
                                style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
                            <span className="text-3xl font-black text-card-foreground">{healthScore}</span>
                        </div>
                    </div>
                    <span
                        className="text-sm font-semibold"
                        style={{ color: scoreColor }}
                    >
                        {scoreLabel}
                    </span>
                    <p className="text-center text-xs text-muted-foreground">
                        Based on nutrient balance per 100g
                    </p>
                </div>
            </div>

            {/* Macro Split Pie Chart */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Macro Breakdown
                </h3>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={macroData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {macroData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number, name: string) => [`${value}%`, name]}
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "hsl(var(--card-foreground))",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-3">
                        {macroData.map((macro) => (
                            <div key={macro.name} className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: macro.color }} />
                                <div>
                                    <p className="text-sm font-medium text-card-foreground">
                                        {macro.name} — {macro.value}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">{macro.grams}g per 100g</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nutrient Bar Chart — % Daily Value */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    % Daily Value per Serving
                </h3>
                <p className="mb-4 text-xs text-muted-foreground">
                    Based on {servingSize}g serving &amp; 2,000 kcal diet
                </p>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                        <XAxis
                            type="number"
                            domain={[0, "auto"]}
                            tickFormatter={(v) => `${v}%`}
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={60}
                            tick={{ fontSize: 12, fill: "hsl(var(--card-foreground))" }}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value}%`, "% Daily Value"]}
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                fontSize: "12px",
                                color: "hsl(var(--card-foreground))",
                            }}
                        />
                        <Bar dataKey="pct" fill={BAR_COLOR} radius={[0, 6, 6, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Daily Value Progress Bars */}
            <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Daily Value Breakdown
                </h3>
                <p className="mb-5 text-xs text-muted-foreground">
                    Per serving ({servingSize}g) vs recommended daily intake
                </p>
                <div className="flex flex-col gap-4">
                    {dvData.map((item) => {
                        const pct = Math.min(Math.round((item.value / item.dv) * 100), 100)
                        const barColor =
                            pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#10b981"

                        return (
                            <div key={item.label}>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm font-medium text-card-foreground">
                                        {item.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.value} / {item.dv} {item.unit} ({pct}%)
                                    </span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-muted/50">
                                    <div
                                        className="h-2.5 rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: barColor,
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
