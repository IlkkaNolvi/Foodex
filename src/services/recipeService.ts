import { Recipe, Ingredient } from '../interfaces/recipe';

// Define interface for TheMealDB API response items used in search
interface ApiMealItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

// KÄYTETÄÄN THEMEALDB APIA (Täysin ilmainen, testiavain '1')
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Apufunktiot satunnaisdatalle (koska API ei tarjoa valmistusaikaa tai annoskokoa)
const getRandomTime = () => [15, 30, 45, 60][Math.floor(Math.random() * 4)];
const getRandomServings = () => [2, 4][Math.floor(Math.random() * 2)];

// Haku-funktio
export const searchRecipes = async (query: string, filter?: string): Promise<Recipe[]> => {
  let url = '';

  if (query) {
      // KORJAUS: TheMealDB ei löydä mitään sanalla "Healthy", joten ohjataan se kategoriaan
      if (query === 'Healthy') {
          url = `${BASE_URL}/filter.php?c=Vegetarian`; // Tai 'Seafood', 'Chicken' jne.
      } else {
          url = `${BASE_URL}/search.php?s=${query}`;
      }
  } else if (filter && filter !== 'All') {
      // Kartoitetaan sovelluksen filtterit TheMealDB:n kategorioihin
      let category = 'Chicken'; 
      if (filter === 'Breakfast') category = 'Breakfast';
      if (filter === 'Vegan') category = 'Vegetarian';
      if (filter === 'Low Calorie') category = 'Seafood'; // Arvio
      if (filter === 'Quick (< 30m)') category = 'Pasta'; // Arvio
      
      url = `${BASE_URL}/filter.php?c=${category}`;
  } else {
      url = `${BASE_URL}/search.php?s=chicken`; 
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.meals) return [];

    // Muunnetaan TheMealDB:n data meidän Recipe-muotoon
    return data.meals.map((item: ApiMealItem) => ({
      id: item.idMeal,
      title: item.strMeal,
      image: item.strMealThumb,
      readyInMinutes: getRandomTime(), // Generoitu tieto
      servings: getRandomServings(),   // Generoitu tieto
      sourceName: 'TheMealDB'
    }));

  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

// Yksittäisen reseptin haku
export const getRecipeById = async (id: string): Promise<Recipe | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) return undefined;

    const item = data.meals[0];

    // TheMealDB palauttaa ainekset erillisinä kenttinä (strIngredient1, strIngredient2...)
    // Kerätään ne siistiksi listaksi
    const ingredients: Ingredient[] = [];
    for (let i = 1; i <= 20; i++) {
        const ingName = item[`strIngredient${i}`];
        const ingMeasure = item[`strMeasure${i}`];
        
        if (ingName && ingName.trim() !== "") {
            ingredients.push({
                original: `${ingMeasure} ${ingName}`,
                name: ingName,
                amount: 1, // Ei tarkkaa määrää datassa helposti saatavilla
                unit: ''
            });
        } else {
            break; // Ei enää aineksia
        }
    }

    return {
      id: item.idMeal,
      title: item.strMeal,
      image: item.strMealThumb,
      readyInMinutes: getRandomTime(),
      servings: getRandomServings(),
      sourceName: 'TheMealDB',
      summary: `Category: ${item.strCategory}, Area: ${item.strArea}`,
      // Muutetaan rivinvaihdot HTML-breakeiksi luettavuuden vuoksi
      instructions: item.strInstructions ? item.strInstructions.replace(/\r\n/g, '<br /><br />') : 'No instructions.',
      extendedIngredients: ingredients
    };

  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return undefined;
  }
};