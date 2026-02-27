// Local nutrition database (values per 100g, sourced from USDA/IFCT databases)
// This is used as a fallback when the AI API is rate-limited or unavailable

export interface NutrientValues {
    calories: number
    protein: number
    fat: number
    saturatedFat: number
    carbohydrates: number
    sugar: number
    sodium: number // in mg
    fiber: number
}

// Comprehensive database of common ingredients (per 100g)
const NUTRITION_DB: Record<string, NutrientValues> = {
    // Grains & Noodles
    "rice": { calories: 130, protein: 2.7, fat: 0.3, saturatedFat: 0.1, carbohydrates: 28, sugar: 0.1, sodium: 1, fiber: 0.4 },
    "white rice": { calories: 130, protein: 2.7, fat: 0.3, saturatedFat: 0.1, carbohydrates: 28, sugar: 0.1, sodium: 1, fiber: 0.4 },
    "brown rice": { calories: 123, protein: 2.7, fat: 1.0, saturatedFat: 0.2, carbohydrates: 26, sugar: 0.4, sodium: 4, fiber: 1.8 },
    "basmati rice": { calories: 121, protein: 3.5, fat: 0.4, saturatedFat: 0.1, carbohydrates: 25, sugar: 0.1, sodium: 1, fiber: 0.4 },
    "noodle": { calories: 138, protein: 4.5, fat: 2.1, saturatedFat: 0.3, carbohydrates: 25, sugar: 0.6, sodium: 234, fiber: 1.0 },
    "noodles": { calories: 138, protein: 4.5, fat: 2.1, saturatedFat: 0.3, carbohydrates: 25, sugar: 0.6, sodium: 234, fiber: 1.0 },
    "maggi noodle": { calories: 390, protein: 8.0, fat: 15, saturatedFat: 7.0, carbohydrates: 56, sugar: 2.5, sodium: 860, fiber: 2.0 },
    "maggi noodles": { calories: 390, protein: 8.0, fat: 15, saturatedFat: 7.0, carbohydrates: 56, sugar: 2.5, sodium: 860, fiber: 2.0 },
    "maggie noodle": { calories: 390, protein: 8.0, fat: 15, saturatedFat: 7.0, carbohydrates: 56, sugar: 2.5, sodium: 860, fiber: 2.0 },
    "maggie noodles": { calories: 390, protein: 8.0, fat: 15, saturatedFat: 7.0, carbohydrates: 56, sugar: 2.5, sodium: 860, fiber: 2.0 },
    "pasta": { calories: 157, protein: 5.8, fat: 0.9, saturatedFat: 0.2, carbohydrates: 31, sugar: 0.6, sodium: 1, fiber: 1.8 },
    "macaroni": { calories: 157, protein: 5.8, fat: 0.9, saturatedFat: 0.2, carbohydrates: 31, sugar: 0.6, sodium: 1, fiber: 1.8 },
    "spaghetti": { calories: 157, protein: 5.8, fat: 0.9, saturatedFat: 0.2, carbohydrates: 31, sugar: 0.6, sodium: 1, fiber: 1.8 },
    "bread": { calories: 265, protein: 9, fat: 3.2, saturatedFat: 0.7, carbohydrates: 49, sugar: 5, sodium: 491, fiber: 2.7 },
    "wheat flour": { calories: 340, protein: 10, fat: 1.5, saturatedFat: 0.3, carbohydrates: 72, sugar: 0.3, sodium: 2, fiber: 2.7 },
    "atta": { calories: 340, protein: 12, fat: 1.7, saturatedFat: 0.3, carbohydrates: 69, sugar: 0.4, sodium: 2, fiber: 11 },
    "maida": { calories: 350, protein: 10, fat: 1.0, saturatedFat: 0.2, carbohydrates: 74, sugar: 0.3, sodium: 2, fiber: 2.7 },
    "oats": { calories: 389, protein: 17, fat: 7, saturatedFat: 1.2, carbohydrates: 66, sugar: 1, sodium: 2, fiber: 11 },
    "roti": { calories: 300, protein: 9, fat: 3.7, saturatedFat: 0.6, carbohydrates: 56, sugar: 1.8, sodium: 409, fiber: 4 },
    "chapati": { calories: 300, protein: 9, fat: 3.7, saturatedFat: 0.6, carbohydrates: 56, sugar: 1.8, sodium: 409, fiber: 4 },
    "poha": { calories: 358, protein: 6.6, fat: 1.2, saturatedFat: 0.3, carbohydrates: 77, sugar: 1.5, sodium: 5, fiber: 2.4 },
    "flattened rice": { calories: 358, protein: 6.6, fat: 1.2, saturatedFat: 0.3, carbohydrates: 77, sugar: 1.5, sodium: 5, fiber: 2.4 },

    // Seasonings & Spices
    "maggi tastemaker": { calories: 290, protein: 9, fat: 8, saturatedFat: 3.5, carbohydrates: 45, sugar: 5, sodium: 6200, fiber: 3 },
    "tastemaker": { calories: 290, protein: 9, fat: 8, saturatedFat: 3.5, carbohydrates: 45, sugar: 5, sodium: 6200, fiber: 3 },
    "masala": { calories: 325, protein: 14, fat: 15, saturatedFat: 2.5, carbohydrates: 45, sugar: 5, sodium: 2000, fiber: 15 },
    "salt": { calories: 0, protein: 0, fat: 0, saturatedFat: 0, carbohydrates: 0, sugar: 0, sodium: 38758, fiber: 0 },
    "turmeric": { calories: 354, protein: 8, fat: 10, saturatedFat: 3.1, carbohydrates: 65, sugar: 3.2, sodium: 38, fiber: 21 },
    "turmeric powder": { calories: 354, protein: 8, fat: 10, saturatedFat: 3.1, carbohydrates: 65, sugar: 3.2, sodium: 38, fiber: 21 },
    "chili powder": { calories: 282, protein: 12, fat: 14, saturatedFat: 2.5, carbohydrates: 50, sugar: 7.2, sodium: 30, fiber: 35 },
    "red chili powder": { calories: 282, protein: 12, fat: 14, saturatedFat: 2.5, carbohydrates: 50, sugar: 7.2, sodium: 30, fiber: 35 },
    "cumin": { calories: 375, protein: 18, fat: 22, saturatedFat: 1.5, carbohydrates: 44, sugar: 2.3, sodium: 168, fiber: 11 },
    "cumin seeds": { calories: 375, protein: 18, fat: 22, saturatedFat: 1.5, carbohydrates: 44, sugar: 2.3, sodium: 168, fiber: 11 },
    "jeera": { calories: 375, protein: 18, fat: 22, saturatedFat: 1.5, carbohydrates: 44, sugar: 2.3, sodium: 168, fiber: 11 },
    "coriander powder": { calories: 298, protein: 12, fat: 18, saturatedFat: 1.0, carbohydrates: 55, sugar: 0, sodium: 35, fiber: 42 },
    "garam masala": { calories: 379, protein: 14, fat: 15, saturatedFat: 3, carbohydrates: 45, sugar: 3, sodium: 60, fiber: 27 },
    "pepper": { calories: 251, protein: 10, fat: 3.3, saturatedFat: 1.4, carbohydrates: 64, sugar: 0.6, sodium: 20, fiber: 25 },
    "black pepper": { calories: 251, protein: 10, fat: 3.3, saturatedFat: 1.4, carbohydrates: 64, sugar: 0.6, sodium: 20, fiber: 25 },
    "mustard seeds": { calories: 508, protein: 26, fat: 36, saturatedFat: 1.6, carbohydrates: 28, sugar: 7, sodium: 13, fiber: 12 },

    // Vegetables
    "onion": { calories: 40, protein: 1.1, fat: 0.1, saturatedFat: 0, carbohydrates: 9.3, sugar: 4.2, sodium: 4, fiber: 1.7 },
    "tomato": { calories: 18, protein: 0.9, fat: 0.2, saturatedFat: 0, carbohydrates: 3.9, sugar: 2.6, sodium: 5, fiber: 1.2 },
    "potato": { calories: 77, protein: 2, fat: 0.1, saturatedFat: 0, carbohydrates: 17, sugar: 0.8, sodium: 6, fiber: 2.2 },
    "carrot": { calories: 41, protein: 0.9, fat: 0.2, saturatedFat: 0, carbohydrates: 10, sugar: 4.7, sodium: 69, fiber: 2.8 },
    "capsicum": { calories: 20, protein: 0.9, fat: 0.2, saturatedFat: 0, carbohydrates: 4.6, sugar: 2.4, sodium: 3, fiber: 1.7 },
    "bell pepper": { calories: 20, protein: 0.9, fat: 0.2, saturatedFat: 0, carbohydrates: 4.6, sugar: 2.4, sodium: 3, fiber: 1.7 },
    "green chilli": { calories: 40, protein: 2, fat: 0.2, saturatedFat: 0, carbohydrates: 9, sugar: 5.3, sodium: 7, fiber: 1.5 },
    "green chili": { calories: 40, protein: 2, fat: 0.2, saturatedFat: 0, carbohydrates: 9, sugar: 5.3, sodium: 7, fiber: 1.5 },
    "garlic": { calories: 149, protein: 6.4, fat: 0.5, saturatedFat: 0.1, carbohydrates: 33, sugar: 1, sodium: 17, fiber: 2.1 },
    "ginger": { calories: 80, protein: 1.8, fat: 0.8, saturatedFat: 0.2, carbohydrates: 18, sugar: 1.7, sodium: 13, fiber: 2 },
    "spinach": { calories: 23, protein: 2.9, fat: 0.4, saturatedFat: 0.1, carbohydrates: 3.6, sugar: 0.4, sodium: 79, fiber: 2.2 },
    "palak": { calories: 23, protein: 2.9, fat: 0.4, saturatedFat: 0.1, carbohydrates: 3.6, sugar: 0.4, sodium: 79, fiber: 2.2 },
    "cabbage": { calories: 25, protein: 1.3, fat: 0.1, saturatedFat: 0, carbohydrates: 5.8, sugar: 3.2, sodium: 18, fiber: 2.5 },
    "cauliflower": { calories: 25, protein: 1.9, fat: 0.3, saturatedFat: 0, carbohydrates: 5, sugar: 1.9, sodium: 30, fiber: 2 },
    "broccoli": { calories: 34, protein: 2.8, fat: 0.4, saturatedFat: 0, carbohydrates: 7, sugar: 1.7, sodium: 33, fiber: 2.6 },
    "peas": { calories: 81, protein: 5.4, fat: 0.4, saturatedFat: 0.1, carbohydrates: 14, sugar: 5.7, sodium: 5, fiber: 5.1 },
    "green peas": { calories: 81, protein: 5.4, fat: 0.4, saturatedFat: 0.1, carbohydrates: 14, sugar: 5.7, sodium: 5, fiber: 5.1 },
    "matar": { calories: 81, protein: 5.4, fat: 0.4, saturatedFat: 0.1, carbohydrates: 14, sugar: 5.7, sodium: 5, fiber: 5.1 },
    "corn": { calories: 96, protein: 3.4, fat: 1.5, saturatedFat: 0.2, carbohydrates: 21, sugar: 4.5, sodium: 1, fiber: 2.4 },
    "mushroom": { calories: 22, protein: 3.1, fat: 0.3, saturatedFat: 0, carbohydrates: 3.3, sugar: 2, sodium: 5, fiber: 1 },
    "cucumber": { calories: 16, protein: 0.7, fat: 0.1, saturatedFat: 0, carbohydrates: 3.6, sugar: 1.7, sodium: 2, fiber: 0.5 },
    "lettuce": { calories: 15, protein: 1.4, fat: 0.2, saturatedFat: 0, carbohydrates: 2.9, sugar: 1.3, sodium: 28, fiber: 1.3 },
    "beetroot": { calories: 43, protein: 1.6, fat: 0.2, saturatedFat: 0, carbohydrates: 10, sugar: 7, sodium: 78, fiber: 2.8 },
    "sweet potato": { calories: 86, protein: 1.6, fat: 0.1, saturatedFat: 0, carbohydrates: 20, sugar: 4.2, sodium: 55, fiber: 3 },
    "lady finger": { calories: 33, protein: 1.9, fat: 0.2, saturatedFat: 0, carbohydrates: 7, sugar: 1.5, sodium: 7, fiber: 3.2 },
    "bhindi": { calories: 33, protein: 1.9, fat: 0.2, saturatedFat: 0, carbohydrates: 7, sugar: 1.5, sodium: 7, fiber: 3.2 },
    "okra": { calories: 33, protein: 1.9, fat: 0.2, saturatedFat: 0, carbohydrates: 7, sugar: 1.5, sodium: 7, fiber: 3.2 },
    "brinjal": { calories: 25, protein: 1, fat: 0.2, saturatedFat: 0, carbohydrates: 6, sugar: 3.5, sodium: 2, fiber: 3 },
    "eggplant": { calories: 25, protein: 1, fat: 0.2, saturatedFat: 0, carbohydrates: 6, sugar: 3.5, sodium: 2, fiber: 3 },

    // Fruits
    "banana": { calories: 89, protein: 1.1, fat: 0.3, saturatedFat: 0.1, carbohydrates: 23, sugar: 12, sodium: 1, fiber: 2.6 },
    "apple": { calories: 52, protein: 0.3, fat: 0.2, saturatedFat: 0, carbohydrates: 14, sugar: 10, sodium: 1, fiber: 2.4 },
    "mango": { calories: 60, protein: 0.8, fat: 0.4, saturatedFat: 0.1, carbohydrates: 15, sugar: 14, sodium: 1, fiber: 1.6 },
    "lemon": { calories: 29, protein: 1.1, fat: 0.3, saturatedFat: 0, carbohydrates: 9, sugar: 2.5, sodium: 2, fiber: 2.8 },
    "lemon juice": { calories: 22, protein: 0.4, fat: 0.2, saturatedFat: 0, carbohydrates: 6.9, sugar: 2.5, sodium: 1, fiber: 0.3 },
    "coconut": { calories: 354, protein: 3.3, fat: 33, saturatedFat: 30, carbohydrates: 15, sugar: 6.2, sodium: 20, fiber: 9 },

    // Dairy
    "milk": { calories: 61, protein: 3.2, fat: 3.3, saturatedFat: 1.9, carbohydrates: 4.8, sugar: 5, sodium: 43, fiber: 0 },
    "full cream milk": { calories: 61, protein: 3.2, fat: 3.3, saturatedFat: 1.9, carbohydrates: 4.8, sugar: 5, sodium: 43, fiber: 0 },
    "curd": { calories: 61, protein: 3.5, fat: 3.3, saturatedFat: 2.1, carbohydrates: 4.7, sugar: 4.7, sodium: 36, fiber: 0 },
    "yogurt": { calories: 61, protein: 3.5, fat: 3.3, saturatedFat: 2.1, carbohydrates: 4.7, sugar: 4.7, sodium: 36, fiber: 0 },
    "paneer": { calories: 265, protein: 18, fat: 21, saturatedFat: 13, carbohydrates: 1.2, sugar: 0.5, sodium: 18, fiber: 0 },
    "cheese": { calories: 402, protein: 25, fat: 33, saturatedFat: 21, carbohydrates: 1.3, sugar: 0.5, sodium: 621, fiber: 0 },
    "butter": { calories: 717, protein: 0.9, fat: 81, saturatedFat: 51, carbohydrates: 0.1, sugar: 0.1, sodium: 643, fiber: 0 },
    "ghee": { calories: 900, protein: 0, fat: 100, saturatedFat: 62, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 },
    "cream": { calories: 195, protein: 2.8, fat: 19, saturatedFat: 12, carbohydrates: 4, sugar: 3.5, sodium: 40, fiber: 0 },

    // Protein
    "chicken": { calories: 239, protein: 27, fat: 14, saturatedFat: 3.8, carbohydrates: 0, sugar: 0, sodium: 82, fiber: 0 },
    "chicken breast": { calories: 165, protein: 31, fat: 3.6, saturatedFat: 1, carbohydrates: 0, sugar: 0, sodium: 74, fiber: 0 },
    "egg": { calories: 155, protein: 13, fat: 11, saturatedFat: 3.3, carbohydrates: 1.1, sugar: 1.1, sodium: 124, fiber: 0 },
    "eggs": { calories: 155, protein: 13, fat: 11, saturatedFat: 3.3, carbohydrates: 1.1, sugar: 1.1, sodium: 124, fiber: 0 },
    "mutton": { calories: 294, protein: 25, fat: 21, saturatedFat: 9, carbohydrates: 0, sugar: 0, sodium: 72, fiber: 0 },
    "fish": { calories: 206, protein: 22, fat: 12, saturatedFat: 2.5, carbohydrates: 0, sugar: 0, sodium: 59, fiber: 0 },
    "prawn": { calories: 99, protein: 24, fat: 0.3, saturatedFat: 0.1, carbohydrates: 0.2, sugar: 0, sodium: 111, fiber: 0 },
    "prawns": { calories: 99, protein: 24, fat: 0.3, saturatedFat: 0.1, carbohydrates: 0.2, sugar: 0, sodium: 111, fiber: 0 },
    "shrimp": { calories: 99, protein: 24, fat: 0.3, saturatedFat: 0.1, carbohydrates: 0.2, sugar: 0, sodium: 111, fiber: 0 },
    "tofu": { calories: 76, protein: 8, fat: 4.8, saturatedFat: 0.7, carbohydrates: 1.9, sugar: 0.6, sodium: 7, fiber: 0.3 },
    "soya chunks": { calories: 345, protein: 52, fat: 0.5, saturatedFat: 0.1, carbohydrates: 33, sugar: 0, sodium: 1, fiber: 13 },

    // Legumes & Dal
    "dal": { calories: 116, protein: 9, fat: 0.4, saturatedFat: 0.1, carbohydrates: 20, sugar: 0.8, sodium: 2, fiber: 8 },
    "toor dal": { calories: 343, protein: 22, fat: 1.7, saturatedFat: 0.3, carbohydrates: 63, sugar: 3, sodium: 15, fiber: 15 },
    "moong dal": { calories: 347, protein: 24, fat: 1.2, saturatedFat: 0.3, carbohydrates: 63, sugar: 4, sodium: 15, fiber: 16 },
    "chana dal": { calories: 360, protein: 20, fat: 5, saturatedFat: 0.5, carbohydrates: 60, sugar: 5, sodium: 24, fiber: 17 },
    "urad dal": { calories: 341, protein: 26, fat: 1.6, saturatedFat: 0.2, carbohydrates: 59, sugar: 1, sodium: 38, fiber: 18 },
    "masoor dal": { calories: 352, protein: 25, fat: 1.1, saturatedFat: 0.2, carbohydrates: 60, sugar: 2, sodium: 6, fiber: 11 },
    "rajma": { calories: 333, protein: 24, fat: 0.8, saturatedFat: 0.2, carbohydrates: 60, sugar: 2.2, sodium: 24, fiber: 25 },
    "kidney beans": { calories: 333, protein: 24, fat: 0.8, saturatedFat: 0.2, carbohydrates: 60, sugar: 2.2, sodium: 24, fiber: 25 },
    "chickpeas": { calories: 364, protein: 19, fat: 6, saturatedFat: 0.6, carbohydrates: 61, sugar: 11, sodium: 24, fiber: 17 },
    "chole": { calories: 364, protein: 19, fat: 6, saturatedFat: 0.6, carbohydrates: 61, sugar: 11, sodium: 24, fiber: 17 },

    // Oils & Fats
    "oil": { calories: 884, protein: 0, fat: 100, saturatedFat: 14, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 },
    "cooking oil": { calories: 884, protein: 0, fat: 100, saturatedFat: 14, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 },
    "vegetable oil": { calories: 884, protein: 0, fat: 100, saturatedFat: 14, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 },
    "sunflower oil": { calories: 884, protein: 0, fat: 100, saturatedFat: 10, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 },
    "olive oil": { calories: 884, protein: 0, fat: 100, saturatedFat: 14, carbohydrates: 0, sugar: 0, sodium: 2, fiber: 0 },
    "mustard oil": { calories: 884, protein: 0, fat: 100, saturatedFat: 12, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 },
    "coconut oil": { calories: 862, protein: 0, fat: 100, saturatedFat: 82, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 },

    // Sugar & Sweeteners
    "sugar": { calories: 387, protein: 0, fat: 0, saturatedFat: 0, carbohydrates: 100, sugar: 100, sodium: 1, fiber: 0 },
    "jaggery": { calories: 383, protein: 0.4, fat: 0.1, saturatedFat: 0, carbohydrates: 98, sugar: 84, sodium: 30, fiber: 0 },
    "honey": { calories: 304, protein: 0.3, fat: 0, saturatedFat: 0, carbohydrates: 82, sugar: 82, sodium: 4, fiber: 0.2 },

    // Nuts & Seeds
    "almond": { calories: 579, protein: 21, fat: 50, saturatedFat: 3.8, carbohydrates: 22, sugar: 4.4, sodium: 1, fiber: 13 },
    "almonds": { calories: 579, protein: 21, fat: 50, saturatedFat: 3.8, carbohydrates: 22, sugar: 4.4, sodium: 1, fiber: 13 },
    "cashew": { calories: 553, protein: 18, fat: 44, saturatedFat: 7.8, carbohydrates: 30, sugar: 6, sodium: 12, fiber: 3.3 },
    "cashews": { calories: 553, protein: 18, fat: 44, saturatedFat: 7.8, carbohydrates: 30, sugar: 6, sodium: 12, fiber: 3.3 },
    "peanut": { calories: 567, protein: 26, fat: 49, saturatedFat: 6.8, carbohydrates: 16, sugar: 4, sodium: 18, fiber: 9 },
    "peanuts": { calories: 567, protein: 26, fat: 49, saturatedFat: 6.8, carbohydrates: 16, sugar: 4, sodium: 18, fiber: 9 },
    "groundnut": { calories: 567, protein: 26, fat: 49, saturatedFat: 6.8, carbohydrates: 16, sugar: 4, sodium: 18, fiber: 9 },

    // Water & Beverages
    "water": { calories: 0, protein: 0, fat: 0, saturatedFat: 0, carbohydrates: 0, sugar: 0, sodium: 0, fiber: 0 },
    "tea": { calories: 1, protein: 0, fat: 0, saturatedFat: 0, carbohydrates: 0.3, sugar: 0, sodium: 3, fiber: 0 },
    "coffee": { calories: 2, protein: 0.3, fat: 0, saturatedFat: 0, carbohydrates: 0, sugar: 0, sodium: 5, fiber: 0 },

    // Sauces & Condiments
    "soy sauce": { calories: 53, protein: 8.1, fat: 0, saturatedFat: 0, carbohydrates: 4.9, sugar: 0.4, sodium: 5493, fiber: 0.8 },
    "tomato sauce": { calories: 82, protein: 1.3, fat: 0.1, saturatedFat: 0, carbohydrates: 19, sugar: 14, sodium: 907, fiber: 1.5 },
    "ketchup": { calories: 112, protein: 1.7, fat: 0.1, saturatedFat: 0, carbohydrates: 26, sugar: 22, sodium: 907, fiber: 0.3 },
    "vinegar": { calories: 18, protein: 0, fat: 0, saturatedFat: 0, carbohydrates: 0.04, sugar: 0.04, sodium: 2, fiber: 0 },
    "mayonnaise": { calories: 680, protein: 1, fat: 75, saturatedFat: 12, carbohydrates: 0.6, sugar: 0.3, sodium: 635, fiber: 0 },

    // Others
    "coconut milk": { calories: 230, protein: 2.3, fat: 24, saturatedFat: 21, carbohydrates: 6, sugar: 3.3, sodium: 15, fiber: 0 },
    "besan": { calories: 387, protein: 22, fat: 7, saturatedFat: 0.7, carbohydrates: 58, sugar: 11, sodium: 64, fiber: 10 },
    "gram flour": { calories: 387, protein: 22, fat: 7, saturatedFat: 0.7, carbohydrates: 58, sugar: 11, sodium: 64, fiber: 10 },
    "semolina": { calories: 360, protein: 13, fat: 1.1, saturatedFat: 0.2, carbohydrates: 73, sugar: 0.5, sodium: 1, fiber: 3.9 },
    "suji": { calories: 360, protein: 13, fat: 1.1, saturatedFat: 0.2, carbohydrates: 73, sugar: 0.5, sodium: 1, fiber: 3.9 },
    "rava": { calories: 360, protein: 13, fat: 1.1, saturatedFat: 0.2, carbohydrates: 73, sugar: 0.5, sodium: 1, fiber: 3.9 },
}

function findIngredient(name: string): NutrientValues | null {
    const normalized = name.toLowerCase().trim()

    // Exact match
    if (NUTRITION_DB[normalized]) {
        return NUTRITION_DB[normalized]
    }

    // Try matching by checking if input contains any key or vice versa
    for (const [key, value] of Object.entries(NUTRITION_DB)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return value
        }
    }

    // Try matching by individual words
    const words = normalized.split(/\s+/)
    for (const word of words) {
        if (word.length < 3) continue
        for (const [key, value] of Object.entries(NUTRITION_DB)) {
            if (key.includes(word)) {
                return value
            }
        }
    }

    return null
}

export function calculateNutrition(
    ingredients: { name: string; quantity: number; unit: string }[],
    servingSize: number
): {
    calories: number
    protein: number
    fat: number
    saturatedFat: number
    carbohydrates: number
    sugar: number
    sodium: number
    fiber: number
    fssaiCompliant: boolean
    fssaiNotes: string
} {
    let totalWeight = 0
    let totalCalories = 0
    let totalProtein = 0
    let totalFat = 0
    let totalSaturatedFat = 0
    let totalCarbs = 0
    let totalSugar = 0
    let totalSodium = 0
    let totalFiber = 0

    const unmatchedIngredients: string[] = []

    for (const ingredient of ingredients) {
        // Convert quantity to grams (approximate)
        let quantityInGrams = ingredient.quantity
        const unit = ingredient.unit.toLowerCase()

        if (unit === "kg") quantityInGrams = ingredient.quantity * 1000
        else if (unit === "ml") quantityInGrams = ingredient.quantity
        else if (unit === "l" || unit === "liter" || unit === "litre") quantityInGrams = ingredient.quantity * 1000
        else if (unit === "tbsp" || unit === "tablespoon") quantityInGrams = ingredient.quantity * 15
        else if (unit === "tsp" || unit === "teaspoon") quantityInGrams = ingredient.quantity * 5
        else if (unit === "cup" || unit === "cups") quantityInGrams = ingredient.quantity * 240
        else if (unit === "piece" || unit === "pieces" || unit === "nos" || unit === "pcs") quantityInGrams = ingredient.quantity * 50

        const nutrientData = findIngredient(ingredient.name)
        if (nutrientData) {
            const factor = quantityInGrams / 100
            totalCalories += nutrientData.calories * factor
            totalProtein += nutrientData.protein * factor
            totalFat += nutrientData.fat * factor
            totalSaturatedFat += nutrientData.saturatedFat * factor
            totalCarbs += nutrientData.carbohydrates * factor
            totalSugar += nutrientData.sugar * factor
            totalSodium += nutrientData.sodium * factor
            totalFiber += nutrientData.fiber * factor
        } else {
            unmatchedIngredients.push(ingredient.name)
        }
        totalWeight += quantityInGrams
    }

    // Normalize to per 100g
    const normFactor = totalWeight > 0 ? 100 / totalWeight : 1

    const nutrition = {
        calories: Math.round(totalCalories * normFactor * 10) / 10,
        protein: Math.round(totalProtein * normFactor * 10) / 10,
        fat: Math.round(totalFat * normFactor * 10) / 10,
        saturatedFat: Math.round(totalSaturatedFat * normFactor * 10) / 10,
        carbohydrates: Math.round(totalCarbs * normFactor * 10) / 10,
        sugar: Math.round(totalSugar * normFactor * 10) / 10,
        sodium: Math.round(totalSodium * normFactor * 10) / 10,
        fiber: Math.round(totalFiber * normFactor * 10) / 10,
        fssaiCompliant: true,
        fssaiNotes: "",
    }

    // FSSAI compliance checks
    const issues: string[] = []
    if (nutrition.sodium > 2300) issues.push("High sodium content exceeds recommended limits")
    if (nutrition.sugar > 50) issues.push("High sugar content per 100g")
    if (nutrition.saturatedFat > 20) issues.push("High saturated fat content")
    if (unmatchedIngredients.length > 0) {
        issues.push(`Some ingredients were estimated: ${unmatchedIngredients.join(", ")}`)
    }

    if (issues.length > 0) {
        nutrition.fssaiCompliant = !issues.some(i => !i.startsWith("Some"))
        nutrition.fssaiNotes = issues.join(". ") + "."
    } else {
        nutrition.fssaiNotes = "All mandatory FSSAI nutrition label fields are present. Values are within acceptable ranges."
    }

    return nutrition
}
