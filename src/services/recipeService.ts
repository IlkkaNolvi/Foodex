import { Recipe } from '../interfaces/recipe';

// --- DEFINE TYPES FOR API RESPONSES ---

// Represents a single search result item in Spoonacular's "results" list
interface ApiSearchResultItem {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

// Represents a single ingredient in Spoonacular's response
interface ApiIngredientItem {
  id: number;
  original: string;
  name: string;
  amount: number;
  unit: string;
}

// ----------------------------------------------

// 🔴 REPLACE THIS WITH YOUR OWN SPOONACULAR API KEY 🔴
const API_KEY = '09fb77be046441b79f278844e40a436a'; 
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Search Function
export const searchRecipes = async (query: string, filter?: string): Promise<Recipe[]> => {
  if (!query && !filter) return [];

  // 1. Build dynamic URL
  let apiUrl = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&number=10&addRecipeInformation=true`;
  
  if (query) apiUrl += `&query=${query}`;
  
  // Add filters to URL
  if (filter === 'Vegan') apiUrl += '&diet=vegan';
  if (filter === 'Quick (< 30m)') apiUrl += '&maxReadyTime=30';
  if (filter === 'Low Calorie') apiUrl += '&maxCalories=400';
  if (filter === 'Breakfast') apiUrl += '&type=breakfast';

  try {
    // 2. FIXED: Use only the apiUrl variable
    const response = await fetch(apiUrl);
    
    const data = await response.json();

    if (!data.results) return [];

    return data.results.map((item: ApiSearchResultItem) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      readyInMinutes: item.readyInMinutes,
      servings: item.servings,
      sourceName: 'Spoonacular'
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

// Get Single Recipe Details
export const getRecipeById = async (id: string): Promise<Recipe | undefined> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=false`
    );
    const item = await response.json();

    if (!item) return undefined;

    return {
      id: item.id,
      title: item.title,
      image: item.image,
      readyInMinutes: item.readyInMinutes,
      servings: item.servings,
      sourceName: item.sourceName,
      summary: item.summary,
      instructions: item.instructions, 
      // FIX: Define 'ing' type as ApiIngredientItem
      extendedIngredients: item.extendedIngredients.map((ing: ApiIngredientItem) => ({
        id: ing.id,
        original: ing.original,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit
      }))
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return undefined;
  }
};