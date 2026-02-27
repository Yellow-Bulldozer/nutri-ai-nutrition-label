import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Ingredient from "@/models/Ingredient"

const SEED_DATA = [
    { ingredient_name: "Egg", nutrition_per_100g: { energy_kcal: 155, protein_g: 13, carbohydrates_g: 1.1, total_sugars_g: 1.1, added_sugars_g: 0, total_fat_g: 11, saturated_fat_g: 3.3, trans_fat_g: 0, cholesterol_mg: 373, sodium_mg: 124 } },
    { ingredient_name: "Rice", nutrition_per_100g: { energy_kcal: 130, protein_g: 2.7, carbohydrates_g: 28, total_sugars_g: 0.1, added_sugars_g: 0, total_fat_g: 0.3, saturated_fat_g: 0.1, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 1 } },
    { ingredient_name: "Wheat Flour", nutrition_per_100g: { energy_kcal: 364, protein_g: 10, carbohydrates_g: 76, total_sugars_g: 0.3, added_sugars_g: 0, total_fat_g: 1, saturated_fat_g: 0.2, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 2 } },
    { ingredient_name: "Potato", nutrition_per_100g: { energy_kcal: 77, protein_g: 2, carbohydrates_g: 17, total_sugars_g: 0.8, added_sugars_g: 0, total_fat_g: 0.1, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 6 } },
    { ingredient_name: "Onion", nutrition_per_100g: { energy_kcal: 40, protein_g: 1.1, carbohydrates_g: 9.3, total_sugars_g: 4.2, added_sugars_g: 0, total_fat_g: 0.1, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 4 } },
    { ingredient_name: "Tomato", nutrition_per_100g: { energy_kcal: 18, protein_g: 0.9, carbohydrates_g: 3.9, total_sugars_g: 2.6, added_sugars_g: 0, total_fat_g: 0.2, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 5 } },
    { ingredient_name: "Milk", nutrition_per_100g: { energy_kcal: 42, protein_g: 3.4, carbohydrates_g: 5, total_sugars_g: 5, added_sugars_g: 0, total_fat_g: 1, saturated_fat_g: 0.6, trans_fat_g: 0, cholesterol_mg: 5, sodium_mg: 44 } },
    { ingredient_name: "Butter", nutrition_per_100g: { energy_kcal: 717, protein_g: 0.9, carbohydrates_g: 0.1, total_sugars_g: 0.1, added_sugars_g: 0, total_fat_g: 81, saturated_fat_g: 51, trans_fat_g: 3, cholesterol_mg: 215, sodium_mg: 11 } },
    { ingredient_name: "Cheese", nutrition_per_100g: { energy_kcal: 402, protein_g: 25, carbohydrates_g: 1.3, total_sugars_g: 0.5, added_sugars_g: 0, total_fat_g: 33, saturated_fat_g: 21, trans_fat_g: 1, cholesterol_mg: 105, sodium_mg: 621 } },
    { ingredient_name: "Chicken", nutrition_per_100g: { energy_kcal: 239, protein_g: 27, carbohydrates_g: 0, total_sugars_g: 0, added_sugars_g: 0, total_fat_g: 14, saturated_fat_g: 3.8, trans_fat_g: 0, cholesterol_mg: 88, sodium_mg: 82 } },
    { ingredient_name: "Cooking Oil", nutrition_per_100g: { energy_kcal: 884, protein_g: 0, carbohydrates_g: 0, total_sugars_g: 0, added_sugars_g: 0, total_fat_g: 100, saturated_fat_g: 14, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 0 } },
    { ingredient_name: "Sugar", nutrition_per_100g: { energy_kcal: 387, protein_g: 0, carbohydrates_g: 100, total_sugars_g: 100, added_sugars_g: 100, total_fat_g: 0, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 1 } },
    { ingredient_name: "Salt", nutrition_per_100g: { energy_kcal: 0, protein_g: 0, carbohydrates_g: 0, total_sugars_g: 0, added_sugars_g: 0, total_fat_g: 0, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 38758 } },
    { ingredient_name: "Garlic", nutrition_per_100g: { energy_kcal: 149, protein_g: 6.4, carbohydrates_g: 33, total_sugars_g: 1, added_sugars_g: 0, total_fat_g: 0.5, saturated_fat_g: 0.1, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 17 } },
    { ingredient_name: "Ginger", nutrition_per_100g: { energy_kcal: 80, protein_g: 1.8, carbohydrates_g: 18, total_sugars_g: 1.7, added_sugars_g: 0, total_fat_g: 0.8, saturated_fat_g: 0.2, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 13 } },
    { ingredient_name: "Carrot", nutrition_per_100g: { energy_kcal: 41, protein_g: 0.9, carbohydrates_g: 10, total_sugars_g: 4.7, added_sugars_g: 0, total_fat_g: 0.2, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 69 } },
    { ingredient_name: "Cabbage", nutrition_per_100g: { energy_kcal: 25, protein_g: 1.3, carbohydrates_g: 6, total_sugars_g: 3.2, added_sugars_g: 0, total_fat_g: 0.1, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 18 } },
    { ingredient_name: "Spinach", nutrition_per_100g: { energy_kcal: 23, protein_g: 2.9, carbohydrates_g: 3.6, total_sugars_g: 0.4, added_sugars_g: 0, total_fat_g: 0.4, saturated_fat_g: 0.1, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 79 } },
    { ingredient_name: "Paneer", nutrition_per_100g: { energy_kcal: 265, protein_g: 18, carbohydrates_g: 1.2, total_sugars_g: 1, added_sugars_g: 0, total_fat_g: 20, saturated_fat_g: 13, trans_fat_g: 0, cholesterol_mg: 56, sodium_mg: 22 } },
    { ingredient_name: "Yogurt", nutrition_per_100g: { energy_kcal: 59, protein_g: 3.5, carbohydrates_g: 4.7, total_sugars_g: 4.7, added_sugars_g: 0, total_fat_g: 3.3, saturated_fat_g: 2.1, trans_fat_g: 0, cholesterol_mg: 13, sodium_mg: 46 } },
    { ingredient_name: "Green Peas", nutrition_per_100g: { energy_kcal: 81, protein_g: 5.4, carbohydrates_g: 14, total_sugars_g: 5.7, added_sugars_g: 0, total_fat_g: 0.4, saturated_fat_g: 0.1, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 5 } },
    { ingredient_name: "Capsicum", nutrition_per_100g: { energy_kcal: 20, protein_g: 0.9, carbohydrates_g: 4.6, total_sugars_g: 2.4, added_sugars_g: 0, total_fat_g: 0.2, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 3 } },
    { ingredient_name: "Banana", nutrition_per_100g: { energy_kcal: 89, protein_g: 1.1, carbohydrates_g: 23, total_sugars_g: 12, added_sugars_g: 0, total_fat_g: 0.3, saturated_fat_g: 0.1, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 1 } },
    { ingredient_name: "Apple", nutrition_per_100g: { energy_kcal: 52, protein_g: 0.3, carbohydrates_g: 14, total_sugars_g: 10, added_sugars_g: 0, total_fat_g: 0.2, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 1 } },
    { ingredient_name: "Honey", nutrition_per_100g: { energy_kcal: 304, protein_g: 0.3, carbohydrates_g: 82, total_sugars_g: 82, added_sugars_g: 82, total_fat_g: 0, saturated_fat_g: 0, trans_fat_g: 0, cholesterol_mg: 0, sodium_mg: 4 } },
]

export async function POST() {
    try {
        await connectToDatabase()

        let inserted = 0
        let updated = 0

        for (const item of SEED_DATA) {
            const existing = await Ingredient.findOne({
                ingredient_name: { $regex: new RegExp(`^${item.ingredient_name}$`, "i") },
            })

            if (existing) {
                await Ingredient.updateOne(
                    { _id: existing._id },
                    { $set: { nutrition_per_100g: item.nutrition_per_100g } }
                )
                updated++
            } else {
                await Ingredient.create(item)
                inserted++
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ingredients database: ${inserted} inserted, ${updated} updated`,
            total: SEED_DATA.length,
        })
    } catch (error) {
        console.error("Seed error:", error)
        return NextResponse.json(
            { error: "Failed to seed database" },
            { status: 500 }
        )
    }
}
