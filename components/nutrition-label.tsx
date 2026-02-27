"use client"

import { useRef } from "react"
import { Shield, ShieldAlert, Download } from "lucide-react"

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

interface NutritionLabelProps {
  recipeName: string
  servingSize: number
  nutrition: NutritionData
  fssaiCompliant?: boolean | null
  fssaiNotes?: string
}

export function NutritionLabel({
  recipeName,
  servingSize,
  nutrition,
  fssaiCompliant,
  fssaiNotes,
}: NutritionLabelProps) {
  const labelRef = useRef<HTMLDivElement>(null)

  const perServing = (val: number) => {
    return Math.round((val * servingSize) / 100 * 10) / 10
  }

  const handleExport = async () => {
    if (!labelRef.current) return

    try {
      const { default: html2canvas } = await import("html2canvas-pro")
      const canvas = await html2canvas(labelRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })
      const link = document.createElement("a")
      link.download = `${recipeName.replace(/\s+/g, "-").toLowerCase()}-nutrition-label.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch {
      const printWindow = window.open("", "_blank")
      if (printWindow && labelRef.current) {
        printWindow.document.write(`
          <html><head><title>${recipeName} - Nutrition Label</title>
          <style>body{font-family:Arial,sans-serif;padding:20px;}</style></head>
          <body>${labelRef.current.innerHTML}</body></html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {fssaiCompliant === true && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Shield className="h-3.5 w-3.5" />
              FSSAI Compliant
            </div>
          )}
          {fssaiCompliant === false && (
            <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
              <ShieldAlert className="h-3.5 w-3.5" />
              Non-Compliant
            </div>
          )}
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Download className="h-3.5 w-3.5" />
          Export PNG
        </button>
      </div>

      {fssaiNotes && (
        <p className="text-xs text-muted-foreground rounded-lg bg-muted/50 p-3">
          {fssaiNotes}
        </p>
      )}

      <div
        ref={labelRef}
        className="mx-auto w-full max-w-sm rounded-lg border-2 border-foreground bg-card p-5"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <h3 className="text-2xl font-black tracking-tight text-card-foreground border-b border-foreground pb-1">
          Nutrition Facts
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{recipeName}</p>

        <div className="mt-2 border-b-8 border-foreground pb-1">
          <div className="flex justify-between text-xs text-card-foreground">
            <span className="font-bold">Serving Size</span>
            <span>{servingSize}g</span>
          </div>
        </div>

        <div className="border-b-4 border-foreground py-1">
          <p className="text-xs text-card-foreground font-bold">Amount Per Serving</p>
        </div>

        <div className="border-b border-foreground py-1 flex justify-between items-center">
          <span className="text-sm font-bold text-card-foreground">Calories</span>
          <span className="text-2xl font-black text-card-foreground">{perServing(nutrition.calories)}</span>
        </div>

        <div className="border-b border-foreground py-0.5 text-right">
          <span className="text-[10px] font-bold text-card-foreground">% Daily Value*</span>
        </div>

        <table className="w-full text-xs text-card-foreground">
          <tbody>
            <NutrientRow label="Total Fat" value={`${perServing(nutrition.fat)}g`} per100={`${nutrition.fat}g`} bold />
            {nutrition.saturatedFat !== undefined && (
              <NutrientRow label="Saturated Fat" value={`${perServing(nutrition.saturatedFat)}g`} per100={`${nutrition.saturatedFat}g`} indent />
            )}
            <NutrientRow label="Sodium" value={`${perServing(nutrition.sodium)}mg`} per100={`${nutrition.sodium}mg`} bold />
            <NutrientRow label="Total Carbohydrate" value={`${perServing(nutrition.carbohydrates)}g`} per100={`${nutrition.carbohydrates}g`} bold />
            <NutrientRow label="Dietary Fiber" value={`${perServing(nutrition.fiber)}g`} per100={`${nutrition.fiber}g`} indent />
            <NutrientRow label="Total Sugars" value={`${perServing(nutrition.sugar)}g`} per100={`${nutrition.sugar}g`} indent />
            <NutrientRow label="Protein" value={`${perServing(nutrition.protein)}g`} per100={`${nutrition.protein}g`} bold last />
          </tbody>
        </table>

        <div className="mt-2 border-t-4 border-foreground pt-2">
          <table className="w-full text-[10px] text-muted-foreground">
            <thead>
              <tr>
                <th className="text-left font-normal"></th>
                <th className="text-right font-bold text-card-foreground">Per Serving</th>
                <th className="text-right font-bold text-card-foreground">Per 100g</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Energy</td>
                <td className="text-right">{perServing(nutrition.calories)} kcal</td>
                <td className="text-right">{nutrition.calories} kcal</td>
              </tr>
              <tr>
                <td>Protein</td>
                <td className="text-right">{perServing(nutrition.protein)}g</td>
                <td className="text-right">{nutrition.protein}g</td>
              </tr>
              <tr>
                <td>Total Fat</td>
                <td className="text-right">{perServing(nutrition.fat)}g</td>
                <td className="text-right">{nutrition.fat}g</td>
              </tr>
              <tr>
                <td>Carbohydrates</td>
                <td className="text-right">{perServing(nutrition.carbohydrates)}g</td>
                <td className="text-right">{nutrition.carbohydrates}g</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[9px] text-muted-foreground leading-tight">
          * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
        </p>

        {/* Best Before / Expiry Section */}
        {(() => {
          // Estimate shelf life based on nutrition profile
          let shelfDays = 180 // default: 6 months for packaged food

          // High moisture content (lots of water-heavy ingredients) = shorter shelf life
          if (nutrition.calories < 100 && nutrition.protein < 5) shelfDays = 5 // fresh salads, juices
          else if (nutrition.protein > 15 && nutrition.fat < 5) shelfDays = 3 // lean fresh meat/fish
          else if (nutrition.protein > 15) shelfDays = 7 // cooked protein dishes
          else if (nutrition.calories < 200 && nutrition.fiber > 3) shelfDays = 7 // fresh veggie dishes

          // High sugar = preservative effect
          if (nutrition.sugar > 40) shelfDays = Math.max(shelfDays, 365) // jams, sweets
          // High sodium = preservative effect
          if (nutrition.sodium > 1500) shelfDays = Math.max(shelfDays, 270) // pickles, cured foods
          // Dry goods
          if (nutrition.calories > 350 && nutrition.fat < 5 && nutrition.protein < 15) shelfDays = Math.max(shelfDays, 365) // cereals, grains

          const today = new Date()
          const expiryDate = new Date(today.getTime() + shelfDays * 24 * 60 * 60 * 1000)
          const expiryFormatted = expiryDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })

          let shelfLabel = ""
          if (shelfDays <= 3) shelfLabel = `Best Before ${shelfDays} days from manufacturing`
          else if (shelfDays <= 7) shelfLabel = `Best Before ${shelfDays} days from manufacturing`
          else if (shelfDays <= 30) shelfLabel = `Best Before ${shelfDays} days from manufacturing`
          else if (shelfDays <= 90) shelfLabel = `Best Before ${Math.round(shelfDays / 30)} months from manufacturing`
          else if (shelfDays <= 365) shelfLabel = `Best Before ${Math.round(shelfDays / 30)} months from manufacturing`
          else shelfLabel = `Best Before ${Math.round(shelfDays / 365)} year(s) from manufacturing`

          let storageNote = ""
          if (shelfDays <= 7) storageNote = "Store in refrigerator at 4°C or below."
          else if (shelfDays <= 30) storageNote = "Store in a cool, dry place. Refrigerate after opening."
          else storageNote = "Store in a cool, dry place away from direct sunlight."

          return (
            <div className="mt-3 border-t-2 border-foreground pt-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-card-foreground uppercase tracking-wider">
                  📅 Shelf Life & Storage
                </span>
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                <div className="flex justify-between">
                  <span className="font-semibold text-card-foreground">{shelfLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mfg. Date (indicative):</span>
                  <span className="font-medium text-card-foreground">
                    {today.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expiry Date (indicative):</span>
                  <span className="font-medium text-card-foreground">{expiryFormatted}</span>
                </div>
                <p className="mt-1 text-[9px] italic text-muted-foreground">
                  {storageNote}
                </p>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

function NutrientRow({
  label,
  value,
  per100,
  bold,
  indent,
  last,
}: {
  label: string
  value: string
  per100: string
  bold?: boolean
  indent?: boolean
  last?: boolean
}) {
  return (
    <tr className={last ? "" : "border-b border-foreground/20"}>
      <td className={`py-0.5 ${indent ? "pl-4" : ""} ${bold ? "font-bold" : ""}`}>
        {label}
      </td>
      <td className="py-0.5 text-right">{value}</td>
      <td className="py-0.5 text-right text-muted-foreground">{per100}</td>
    </tr>
  )
}
