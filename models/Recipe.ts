import mongoose, { Schema, Document, Model } from "mongoose"

export interface IIngredient {
  name: string
  quantity: number
  unit: string
}

export interface INutrition {
  calories: number
  protein: number
  fat: number
  carbohydrates: number
  sugar: number
  sodium: number
  fiber: number
  saturatedFat?: number
}

export interface IGoalAnalysis {
  goal: string
  suitable: boolean
  aiComment: string
  improvements?: string[]
}

export interface IImprovedRecipe {
  ingredients: IIngredient[]
  changes: string[]
  recommendedFoods: { name: string; reason: string }[]
}

export interface IRecipe extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  servingSize: number
  ingredients: IIngredient[]
  nutrition: INutrition | null
  fssaiCompliant: boolean | null
  goalAnalysis: IGoalAnalysis | null
  improvedRecipe: IImprovedRecipe | null
  createdAt: Date
}

const RecipeSchema = new Schema<IRecipe>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    servingSize: { type: Number, required: true, default: 100 },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    nutrition: {
      calories: Number,
      protein: Number,
      fat: Number,
      carbohydrates: Number,
      sugar: Number,
      sodium: Number,
      fiber: Number,
      saturatedFat: Number,
    },
    fssaiCompliant: { type: Boolean, default: null },
    goalAnalysis: {
      goal: String,
      suitable: Boolean,
      aiComment: String,
      improvements: [String],
    },
    improvedRecipe: {
      ingredients: [
        {
          name: String,
          quantity: Number,
          unit: String,
        },
      ],
      changes: [String],
      recommendedFoods: [
        {
          name: String,
          reason: String,
        },
      ],
    },
  },
  { timestamps: true }
)

RecipeSchema.index({ userId: 1, createdAt: -1 })

const Recipe: Model<IRecipe> =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema)

export default Recipe
