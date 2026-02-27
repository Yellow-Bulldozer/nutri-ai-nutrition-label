import mongoose, { Schema, Document, Model } from "mongoose"

export interface IIngredient extends Document {
    ingredient_name: string
    nutrition_per_100g: {
        energy_kcal: number
        protein_g: number
        carbohydrates_g: number
        total_sugars_g: number
        added_sugars_g: number
        total_fat_g: number
        saturated_fat_g: number
        trans_fat_g: number
        cholesterol_mg: number
        sodium_mg: number
    }
}

const IngredientSchema = new Schema<IIngredient>(
    {
        ingredient_name: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        nutrition_per_100g: {
            energy_kcal: { type: Number, required: true },
            protein_g: { type: Number, required: true },
            carbohydrates_g: { type: Number, required: true },
            total_sugars_g: { type: Number, required: true },
            added_sugars_g: { type: Number, required: true },
            total_fat_g: { type: Number, required: true },
            saturated_fat_g: { type: Number, required: true },
            trans_fat_g: { type: Number, required: true },
            cholesterol_mg: { type: Number, required: true },
            sodium_mg: { type: Number, required: true },
        },
    },
    { timestamps: true }
)

// Text index for fuzzy searching
IngredientSchema.index({ ingredient_name: "text" })

const Ingredient: Model<IIngredient> =
    mongoose.models.Ingredient || mongoose.model<IIngredient>("Ingredient", IngredientSchema)

export default Ingredient
