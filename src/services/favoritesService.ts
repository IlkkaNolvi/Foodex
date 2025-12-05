import { Recipe } from '../interfaces/recipe';

const STORAGE_KEY = 'foodex_favorites';

// Get all favorites
export const getFavorites = (): Recipe[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Check if a recipe is already favorited
export const isFavorite = (id: string | number): boolean => {
  const favorites = getFavorites();
  return favorites.some(r => r.id.toString() === id.toString());
};

// Add to favorites
export const addFavorite = (recipe: Recipe) => {
  const favorites = getFavorites();
  // Prevent duplicates
  if (!favorites.some(r => r.id === recipe.id)) {
    favorites.push(recipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
};

// Remove from favorites
export const removeFavorite = (id: string | number) => {
  const favorites = getFavorites();
  const updated = favorites.filter(r => r.id.toString() !== id.toString());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};