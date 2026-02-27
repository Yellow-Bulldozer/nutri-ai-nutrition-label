"use client"

import { CheckCircle2, XCircle, Sparkles, ArrowRight } from "lucide-react"

interface GoalAnalysis {
  suitable: boolean
  reason: string
  improvements: string[]
}

interface ImprovedIngredient {
  name: string
  quantity: number
  unit: string
  isChanged: boolean
  changeNote: string | null
}

interface ImprovedRecipe {
  ingredients: ImprovedIngredient[]
  changes: string[]
  recommendedFoods: { name: string; reason: string }[]
}

interface GoalAnalysisDisplayProps {
  analysis: GoalAnalysis
  improvedRecipe?: ImprovedRecipe | null
  onImprove: () => void
  improving?: boolean
}

export function GoalAnalysisDisplay({
  analysis,
  improvedRecipe,
  onImprove,
  improving,
}: GoalAnalysisDisplayProps) {
  return (
    <div className="flex flex-col gap-5">
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          analysis.suitable
            ? "border-primary/30 bg-primary/5"
            : "border-accent/30 bg-accent/5"
        }`}
      >
        {analysis.suitable ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        )}
        <div className="flex flex-col gap-1">
          <span className={`text-sm font-semibold ${analysis.suitable ? "text-primary" : "text-accent"}`}>
            {analysis.suitable ? "Goal Compatible" : "Not Ideal for Your Goal"}
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.reason}
          </p>
        </div>
      </div>

      {analysis.improvements.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-card-foreground">Suggested Improvements</h4>
          <ul className="flex flex-col gap-1.5">
            {analysis.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!improvedRecipe && (
        <button
          onClick={onImprove}
          disabled={improving}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/20 disabled:opacity-50"
        >
          {improving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
              Generating improved recipe...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Improve My Recipe
            </>
          )}
        </button>
      )}

      {improvedRecipe && (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            <Sparkles className="h-4 w-4 text-accent" />
            AI-Improved Recipe
          </h4>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Changes Made
            </h5>
            <ul className="flex flex-col gap-1">
              {improvedRecipe.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {change}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Updated Ingredients
            </h5>
            <div className="flex flex-col gap-1">
              {improvedRecipe.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${
                    ing.isChanged ? "bg-primary/5 text-primary font-medium" : "text-card-foreground"
                  }`}
                >
                  <span>
                    {ing.name}
                    {ing.changeNote && (
                      <span className="ml-2 text-xs text-primary/70">({ing.changeNote})</span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ing.quantity} {ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Recommended Foods for Your Goal
            </h5>
            <div className="grid gap-2 md:grid-cols-3">
              {improvedRecipe.recommendedFoods.map((food, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-sm font-medium text-card-foreground">{food.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{food.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
