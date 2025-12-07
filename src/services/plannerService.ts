export interface PlannerItem {
  id: string;      // Unique ID for the saved item
  recipeId: number | string;
  title: string;
  calories: number;
  dayIndex: number; // 0=Today, 1=Tomorrow...
  slot: 'breakfast' | 'lunch' | 'dinner';
}

const STORAGE_KEY = 'foodex_planner_data';

// Get all planned meals
export const getPlannedMeals = (): PlannerItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Add a new meal to the plan
export const addMealToPlan = (item: PlannerItem) => {
  const meals = getPlannedMeals();
  meals.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
};

// Remove a meal from the plan
export const removeMealFromPlan = (id: string) => {
  const meals = getPlannedMeals();
  const updated = meals.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};