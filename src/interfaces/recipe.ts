export interface Ingredient {
  id?: number | string;
  original: string; // Full description, e.g., "2 eggs"
  name: string;
  amount?: number;
  unit?: string;
}

export interface Recipe {
  id: number | string;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  sourceName?: string;
  
  // Fields for the Recipe Detail view:
  summary?: string; 
  extendedIngredients?: Ingredient[]; // List of ingredients
  instructions?: string; // Cooking instructions (HTML or plain text)
  analyzedInstructions?: { steps: { step: string }[] }[]; // Step-by-step list
}