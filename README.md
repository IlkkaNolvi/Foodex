Foodex 🥑

Foodex is a modern mobile application for recipe discovery, meal planning, and calorie tracking. The application was built as a student project using the Ionic React development platform.

📱 Features

The application consists of five main sections:

Authentication (Login & Signup)

User account creation and login (Firebase Auth).

Email-based authentication.

Home (Home / Tab 1)

Greeting & Weather: Fetches current weather based on user location (Open-Meteo API).

Calorie Tracker: Visual ring chart showing daily calorie intake versus goal. Updates in real-time from the Planner.

Recommendations: Carousel of random recipe recommendations.

Recipe Search (Search / Tab 2)

Search: Find recipes by keywords (Spoonacular API).

Filters: Filter results (e.g., Vegan, Quick, Breakfast, Low Calorie).

Recipe Cards: Displays image, preparation time, and servings.

Recipe Details (Recipe Detail)

Detailed view: Ingredients, instructions, and nutritional info.

Add to Plan: Ability to add the recipe directly to the meal planner for a specific day and meal slot (Breakfast/Lunch/Dinner).

Meal Planner (Planner / Tab 3)

Calendar: Dynamic 7-day calendar view.

Meals: Displays meals for the selected day along with calculated calories.

Editing: Ability to remove meals from the plan.

Data persists in local storage (localStorage).

Profile (Profile)

Displays logged-in user information.

Weekly calorie summary (Visualization).

Logout functionality.

🛠️ Technologies

Frontend: Ionic Framework, React, TypeScript

Backend / Auth: Google Firebase (Authentication)

Data API: Spoonacular API (Recipes), Open-Meteo (Weather)

Storage: LocalStorage (Meal plans)

🚀 Installation and Setup

Follow these steps to get the project running on your local machine.

Prerequisites

Node.js installed.

Ionic CLI installed (npm install -g @ionic/cli).

Installation

Clone the repository:

git clone [https://github.com/IlkkaNolvi/Foodex.git](https://github.com/IlkkaNolvi/Foodex.git)
cd Foodex


Install dependencies:

npm install


IMPORTANT: API Keys

The project uses API keys in src/firebaseConfig.ts and src/services/recipeService.ts.

Ensure you have valid keys (Spoonacular API Key & Firebase Config). If they are missing from the repository for security reasons, ask the project maintainer.

Run the application:

ionic serve


The app will open at http://localhost:8100.

📂 Project Structure

src/pages/ - Application views (Login, Signup, Tab1, Tab2, Tab3, RecipeDetail, Profile).

src/services/ - API calls and logic (recipeService, plannerService).

src/interfaces/ - TypeScript data types.

src/theme/ - Global styles and colors.

👥 Contributors

[Tomi Haukka] - UI/UX Design & Frontend

[Ilkka Nolvi] - API Integration & Logic

[Jaakko Teittinen] - Testing & Documentation

This project was created as part of the Introduction to Mobile App Design and Development course in 2025.