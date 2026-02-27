"use client"

import { useState } from "react"
import Image from "next/image"
import {
    Star,
    Flame,
    Beef,
    Droplets,
    Wheat,
    ChevronDown,
    ChevronUp,
    Award,
    Heart,
    Zap,
} from "lucide-react"

interface NutritionInfo {
    calories: number
    protein: number
    fat: number
    carbohydrates: number
    sugar: number
    sodium: number
    fiber: number
    saturatedFat: number
}

interface RecommendedRecipe {
    id: string
    name: string
    description: string
    image: string
    servingSize: number
    prepTime: string
    nutrition: NutritionInfo
    ingredients: string[]
    benefits: string[]
    isBestPick: boolean
    goalFitScore: number // 0–100
}

const RECIPES_BY_GOAL: Record<string, RecommendedRecipe[]> = {
    gym: [
        {
            id: "gym-1",
            name: "Grilled Chicken Salad",
            description: "High-protein grilled chicken with quinoa, avocado, and fresh vegetables. Perfect post-workout meal for muscle recovery.",
            image: "/recipes/chicken-salad.png",
            servingSize: 300,
            prepTime: "20 min",
            nutrition: { calories: 285, protein: 32, fat: 12, carbohydrates: 15, sugar: 3, sodium: 380, fiber: 5, saturatedFat: 2.5 },
            ingredients: ["Chicken Breast", "Quinoa", "Avocado", "Cherry Tomatoes", "Spinach", "Olive Oil", "Lemon"],
            benefits: ["High protein for muscle growth", "Complex carbs for sustained energy", "Healthy fats from avocado"],
            isBestPick: true,
            goalFitScore: 95,
        },
        {
            id: "gym-2",
            name: "Egg White Omelette",
            description: "Protein-packed egg white omelette with spinach, mushrooms, and a touch of cheese. Low-fat, high-protein breakfast.",
            image: "/recipes/egg-omelette.png",
            servingSize: 250,
            prepTime: "10 min",
            nutrition: { calories: 180, protein: 26, fat: 5, carbohydrates: 6, sugar: 2, sodium: 320, fiber: 2, saturatedFat: 1.8 },
            ingredients: ["Egg Whites", "Spinach", "Mushrooms", "Low-fat Cheese", "Bell Pepper", "Onion"],
            benefits: ["Very high protein-to-calorie ratio", "Low fat content", "Rich in B vitamins"],
            isBestPick: false,
            goalFitScore: 88,
        },
        {
            id: "gym-3",
            name: "Protein Power Smoothie",
            description: "Creamy banana peanut butter smoothie with whey protein. Quick post-gym fuel for muscle repair.",
            image: "/recipes/protein-smoothie.png",
            servingSize: 400,
            prepTime: "5 min",
            nutrition: { calories: 340, protein: 28, fat: 14, carbohydrates: 32, sugar: 18, sodium: 150, fiber: 4, saturatedFat: 3 },
            ingredients: ["Banana", "Peanut Butter", "Whey Protein", "Milk", "Oats", "Honey"],
            benefits: ["Fast-absorbing protein", "Natural energy from banana", "Healthy fats from peanut butter"],
            isBestPick: false,
            goalFitScore: 82,
        },
        {
            id: "gym-4",
            name: "Paneer Tikka",
            description: "Char-grilled paneer with bell peppers and onions. Excellent vegetarian protein source for muscle building.",
            image: "/recipes/paneer-tikka.png",
            servingSize: 250,
            prepTime: "25 min",
            nutrition: { calories: 310, protein: 22, fat: 20, carbohydrates: 12, sugar: 5, sodium: 420, fiber: 3, saturatedFat: 10 },
            ingredients: ["Paneer", "Bell Peppers", "Onion", "Yogurt", "Spices", "Lemon Juice"],
            benefits: ["Rich vegetarian protein", "Calcium for bone strength", "Anti-inflammatory spices"],
            isBestPick: false,
            goalFitScore: 78,
        },
    ],
    weight_loss: [
        {
            id: "wl-1",
            name: "Fresh Fruit Salad",
            description: "Colorful mix of seasonal fruits — low calorie, high fiber, and packed with vitamins. Perfect guilt-free snack.",
            image: "/recipes/fruit-salad.png",
            servingSize: 250,
            prepTime: "10 min",
            nutrition: { calories: 68, protein: 1, fat: 0.3, carbohydrates: 17, sugar: 12, sodium: 2, fiber: 3, saturatedFat: 0 },
            ingredients: ["Watermelon", "Kiwi", "Strawberries", "Blueberries", "Mint Leaves", "Lemon Juice"],
            benefits: ["Very low calorie", "High in antioxidants", "Natural sweetness with no added sugar"],
            isBestPick: true,
            goalFitScore: 96,
        },
        {
            id: "wl-2",
            name: "Oatmeal Power Bowl",
            description: "Warm oatmeal topped with berries, banana, and a drizzle of honey. High fiber keeps you full for hours.",
            image: "/recipes/oatmeal-bowl.png",
            servingSize: 300,
            prepTime: "10 min",
            nutrition: { calories: 210, protein: 8, fat: 5, carbohydrates: 38, sugar: 12, sodium: 10, fiber: 7, saturatedFat: 1 },
            ingredients: ["Oats", "Banana", "Mixed Berries", "Almonds", "Honey", "Chia Seeds"],
            benefits: ["High fiber for satiety", "Slow-release energy", "Heart-healthy whole grains"],
            isBestPick: false,
            goalFitScore: 90,
        },
        {
            id: "wl-3",
            name: "Dal & Brown Rice",
            description: "Classic Indian comfort food — protein-rich lentils with nutrient-dense brown rice. Balanced and satisfying.",
            image: "/recipes/dal-rice.png",
            servingSize: 350,
            prepTime: "30 min",
            nutrition: { calories: 195, protein: 11, fat: 2.5, carbohydrates: 35, sugar: 2, sodium: 280, fiber: 8, saturatedFat: 0.5 },
            ingredients: ["Toor Dal", "Brown Rice", "Turmeric", "Garlic", "Ghee", "Coriander"],
            benefits: ["Complete protein (dal + rice)", "Very low fat", "High fiber from lentils"],
            isBestPick: false,
            goalFitScore: 85,
        },
        {
            id: "wl-4",
            name: "Grilled Chicken Salad",
            description: "Lean grilled chicken on a bed of fresh greens with light vinaigrette. High protein, low calorie dinner option.",
            image: "/recipes/chicken-salad.png",
            servingSize: 300,
            prepTime: "20 min",
            nutrition: { calories: 185, protein: 28, fat: 6, carbohydrates: 8, sugar: 3, sodium: 350, fiber: 4, saturatedFat: 1.2 },
            ingredients: ["Chicken Breast", "Mixed Greens", "Cucumber", "Cherry Tomatoes", "Olive Oil", "Lemon"],
            benefits: ["High protein keeps you full", "Very low calorie density", "Rich in vitamins from greens"],
            isBestPick: false,
            goalFitScore: 88,
        },
    ],
    weight_gain: [
        {
            id: "wg-1",
            name: "Butter Chicken with Naan",
            description: "Rich and creamy butter chicken with soft naan bread. Calorie-dense meal perfect for healthy weight gain.",
            image: "/recipes/butter-chicken.png",
            servingSize: 400,
            prepTime: "40 min",
            nutrition: { calories: 520, protein: 30, fat: 28, carbohydrates: 38, sugar: 6, sodium: 680, fiber: 3, saturatedFat: 12 },
            ingredients: ["Chicken", "Butter", "Cream", "Tomato Puree", "Naan", "Spices", "Cashews"],
            benefits: ["High calorie for weight gain", "Good protein content", "Satisfying and delicious"],
            isBestPick: true,
            goalFitScore: 92,
        },
        {
            id: "wg-2",
            name: "Protein Power Smoothie",
            description: "Calorie-packed banana peanut butter smoothie with full cream milk. Easy calories for bulking up.",
            image: "/recipes/protein-smoothie.png",
            servingSize: 500,
            prepTime: "5 min",
            nutrition: { calories: 480, protein: 22, fat: 20, carbohydrates: 55, sugar: 32, sodium: 180, fiber: 5, saturatedFat: 5 },
            ingredients: ["Banana", "Peanut Butter", "Full Cream Milk", "Oats", "Honey", "Dates"],
            benefits: ["Easy to consume high calories", "Natural sugars for energy", "Healthy fats and protein"],
            isBestPick: false,
            goalFitScore: 88,
        },
        {
            id: "wg-3",
            name: "Paneer Tikka Platter",
            description: "Generous portion of marinated paneer tikka with mint chutney. Protein and calorie-rich vegetarian option.",
            image: "/recipes/paneer-tikka.png",
            servingSize: 350,
            prepTime: "25 min",
            nutrition: { calories: 420, protein: 28, fat: 30, carbohydrates: 14, sugar: 5, sodium: 450, fiber: 3, saturatedFat: 16 },
            ingredients: ["Paneer", "Bell Peppers", "Onion", "Yogurt", "Cream", "Spices"],
            benefits: ["Calorie-dense vegetarian option", "Rich in calcium", "High-quality protein"],
            isBestPick: false,
            goalFitScore: 84,
        },
        {
            id: "wg-4",
            name: "Oats & Banana Bowl",
            description: "Loaded oatmeal with banana, nuts, dried fruits, and honey. A calorie-rich breakfast to start your day strong.",
            image: "/recipes/oatmeal-bowl.png",
            servingSize: 400,
            prepTime: "10 min",
            nutrition: { calories: 450, protein: 14, fat: 16, carbohydrates: 65, sugar: 28, sodium: 15, fiber: 8, saturatedFat: 3 },
            ingredients: ["Oats", "Banana", "Almonds", "Cashews", "Raisins", "Honey", "Milk"],
            benefits: ["Sustained energy release", "Healthy fats from nuts", "High calorie breakfast"],
            isBestPick: false,
            goalFitScore: 80,
        },
    ],
    normal: [
        {
            id: "n-1",
            name: "Dal & Rice",
            description: "Perfectly balanced Indian staple — protein-rich lentils with steamed rice. A complete, everyday nutritious meal.",
            image: "/recipes/dal-rice.png",
            servingSize: 350,
            prepTime: "30 min",
            nutrition: { calories: 220, protein: 10, fat: 3, carbohydrates: 40, sugar: 2, sodium: 300, fiber: 6, saturatedFat: 0.8 },
            ingredients: ["Toor Dal", "Rice", "Turmeric", "Garlic", "Ghee", "Coriander", "Lemon"],
            benefits: ["Complete protein combination", "Balanced macros", "Rich in fiber and minerals"],
            isBestPick: true,
            goalFitScore: 94,
        },
        {
            id: "n-2",
            name: "Egg Omelette",
            description: "Classic vegetable-loaded omelette. Quick, nutritious, and makes a perfect balanced breakfast or snack.",
            image: "/recipes/egg-omelette.png",
            servingSize: 200,
            prepTime: "10 min",
            nutrition: { calories: 220, protein: 16, fat: 14, carbohydrates: 5, sugar: 2, sodium: 350, fiber: 1.5, saturatedFat: 4 },
            ingredients: ["Eggs", "Onion", "Tomato", "Green Chilli", "Coriander", "Salt", "Oil"],
            benefits: ["Good protein source", "Quick and easy", "Versatile — add any veggies"],
            isBestPick: false,
            goalFitScore: 85,
        },
        {
            id: "n-3",
            name: "Fresh Fruit Bowl",
            description: "A refreshing mix of seasonal fruits. Perfect as a snack or dessert — naturally sweet and full of vitamins.",
            image: "/recipes/fruit-salad.png",
            servingSize: 250,
            prepTime: "10 min",
            nutrition: { calories: 85, protein: 1.2, fat: 0.4, carbohydrates: 21, sugar: 15, sodium: 3, fiber: 3.5, saturatedFat: 0 },
            ingredients: ["Watermelon", "Apple", "Banana", "Pomegranate", "Grapes", "Mint"],
            benefits: ["High in vitamins & antioxidants", "Natural energy boost", "Excellent for digestion"],
            isBestPick: false,
            goalFitScore: 82,
        },
        {
            id: "n-4",
            name: "Paneer Tikka",
            description: "Grilled paneer cubes marinated in yogurt and spices. A delicious and balanced Indian appetizer or main course.",
            image: "/recipes/paneer-tikka.png",
            servingSize: 200,
            prepTime: "25 min",
            nutrition: { calories: 260, protein: 18, fat: 18, carbohydrates: 8, sugar: 4, sodium: 380, fiber: 2, saturatedFat: 9 },
            ingredients: ["Paneer", "Yogurt", "Bell Peppers", "Onion", "Spices", "Lemon"],
            benefits: ["Good protein for vegetarians", "Rich in calcium", "Flavorful yet nutritious"],
            isBestPick: false,
            goalFitScore: 79,
        },
    ],
}

const GOAL_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    gym: { label: "Gym & Muscle Building", icon: <Zap className="h-4 w-4" />, color: "#6366f1" },
    weight_loss: { label: "Weight Loss", icon: <Heart className="h-4 w-4" />, color: "#10b981" },
    weight_gain: { label: "Weight Gain", icon: <Flame className="h-4 w-4" />, color: "#f59e0b" },
    normal: { label: "Balanced Diet", icon: <Star className="h-4 w-4" />, color: "#6366f1" },
}

interface RecommendedRecipesProps {
    goal: string
}

export function RecommendedRecipes({ goal }: RecommendedRecipesProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const recipes = RECIPES_BY_GOAL[goal] || RECIPES_BY_GOAL.normal
    const goalInfo = GOAL_LABELS[goal] || GOAL_LABELS.normal

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2
                        className="text-lg font-semibold text-card-foreground"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        🍽️ Recommended for You
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Curated recipes for your{" "}
                        <span className="font-medium" style={{ color: goalInfo.color }}>
                            {goalInfo.label}
                        </span>{" "}
                        goal
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {recipes.map((recipe) => {
                    const isExpanded = expandedId === recipe.id
                    return (
                        <div
                            key={recipe.id}
                            className={`relative flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-300 ${recipe.isBestPick
                                    ? "border-primary/40 shadow-[0_0_20px_-5px] shadow-primary/20"
                                    : "border-border hover:border-primary/20"
                                }`}
                        >
                            {/* Best Pick Badge */}
                            {recipe.isBestPick && (
                                <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
                                    <Award className="h-3.5 w-3.5" />
                                    Best Recommended
                                </div>
                            )}

                            {/* Recipe Image */}
                            <div className="relative h-44 w-full overflow-hidden">
                                <Image
                                    src={recipe.image}
                                    alt={recipe.name}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                {/* Score badge */}
                                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {recipe.goalFitScore}% match
                                </div>
                                <div className="absolute bottom-3 left-3 text-xs text-white/80">
                                    ⏱ {recipe.prepTime} · {recipe.servingSize}g
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-4">
                                <h3 className="text-base font-bold text-card-foreground">{recipe.name}</h3>
                                <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                    {recipe.description}
                                </p>

                                {/* Quick Macros */}
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Flame className="h-3.5 w-3.5 text-orange-400" />
                                        <span>{recipe.nutrition.calories}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Beef className="h-3.5 w-3.5 text-red-400" />
                                        <span>{recipe.nutrition.protein}g</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Droplets className="h-3.5 w-3.5 text-yellow-400" />
                                        <span>{recipe.nutrition.fat}g</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Wheat className="h-3.5 w-3.5 text-green-400" />
                                        <span>{recipe.nutrition.carbohydrates}g</span>
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {recipe.benefits.map((benefit, i) => (
                                        <span
                                            key={i}
                                            className="rounded-full bg-primary/8 px-2.5 py-0.5 text-[10px] font-medium text-primary"
                                        >
                                            {benefit}
                                        </span>
                                    ))}
                                </div>

                                {/* Expand Toggle */}
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                                    className="mt-3 flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                                >
                                    {isExpanded ? (
                                        <>
                                            Hide Details <ChevronUp className="h-3.5 w-3.5" />
                                        </>
                                    ) : (
                                        <>
                                            View Full Nutrition <ChevronDown className="h-3.5 w-3.5" />
                                        </>
                                    )}
                                </button>

                                {/* Expanded Nutrition Details */}
                                {isExpanded && (
                                    <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {/* Ingredients */}
                                        <div>
                                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Ingredients
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {recipe.ingredients.map((ing, i) => (
                                                    <span
                                                        key={i}
                                                        className="rounded-md border border-border bg-muted/30 px-2 py-1 text-[11px] text-card-foreground"
                                                    >
                                                        {ing}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Full Nutrition Table */}
                                        <div>
                                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Nutrition per {recipe.servingSize}g serving
                                            </h4>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Calories</span>
                                                    <span className="font-medium text-card-foreground">{recipe.nutrition.calories} kcal</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Protein</span>
                                                    <span className="font-medium text-card-foreground">{recipe.nutrition.protein}g</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Total Fat</span>
                                                    <span className="font-medium text-card-foreground">{recipe.nutrition.fat}g</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Saturated Fat</span>
                                                    <span className="font-medium text-card-foreground">{recipe.nutrition.saturatedFat}g</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Carbohydrates</span>
                                                    <span className="font-medium text-card-foreground">{recipe.nutrition.carbohydrates}g</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Sugar</span>
                                                    <span className="font-medium text-card-foreground">{recipe.nutrition.sugar}g</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Fiber</span>
                                                    <span className="font-medium text-card-foreground">{recipe.nutrition.fiber}g</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Sodium</span>
                                                    <span className="font-medium text-card-foreground">{recipe.nutrition.sodium}mg</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Macro Split Bar */}
                                        <div>
                                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Macro Split
                                            </h4>
                                            {(() => {
                                                const pCal = recipe.nutrition.protein * 4
                                                const fCal = recipe.nutrition.fat * 9
                                                const cCal = recipe.nutrition.carbohydrates * 4
                                                const total = pCal + fCal + cCal
                                                const pPct = Math.round((pCal / total) * 100)
                                                const fPct = Math.round((fCal / total) * 100)
                                                const cPct = 100 - pPct - fPct
                                                return (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex h-3 w-full overflow-hidden rounded-full">
                                                            <div
                                                                className="h-full transition-all duration-500"
                                                                style={{ width: `${pPct}%`, backgroundColor: "#6366f1" }}
                                                            />
                                                            <div
                                                                className="h-full transition-all duration-500"
                                                                style={{ width: `${fPct}%`, backgroundColor: "#f59e0b" }}
                                                            />
                                                            <div
                                                                className="h-full transition-all duration-500"
                                                                style={{ width: `${cPct}%`, backgroundColor: "#10b981" }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-[10px] text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#6366f1" }} />
                                                                Protein {pPct}%
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                                                                Fat {fPct}%
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#10b981" }} />
                                                                Carbs {cPct}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
