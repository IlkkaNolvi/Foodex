# Foodex 🥑

Foodex is a modern mobile application for recipe discovery, meal planning, and calorie tracking. The application was built as a student project using the Ionic React development platform.

---

## 📱 Features

The application consists of several main sections and sub-features:

### Authentication (Login & Signup)
- User account creation and login (Firebase Auth).
- Email-based authentication.

### Home (Home / Tab 1)
- **Greeting & Weather:** Fetches current weather based on user location (Open-Meteo API).
- **Calorie Tracker:** Visual ring chart showing daily calorie intake versus goal. Updates in real-time based on the Meal Planner.
- **Recommendations:** Carousel of recipe recommendations fetched from TheMealDB.

### Recipe Search (Search / Tab 2)
- **Search:** Find recipes by keywords (TheMealDB API).
- **Filters:** Filter results by category (e.g., Vegan, Breakfast, Chicken, Pasta).
- **Recipe Cards:** Displays recipe image and estimated preparation time.

### Recipe Details (Recipe Detail)
- Detailed view including ingredients and cooking instructions.
- **Add to Plan:** Interactive modal to add the recipe to a specific day and meal slot (Breakfast/Lunch/Dinner).
- **Find Stores:** Deep link integration to open the user's map application and find nearby grocery stores.
- **Favorites:** One-click save to "My Favorites".

### Meal Planner (Planner / Tab 3)
- **Calendar:** Dynamic 7-day calendar view (Today + next 6 days).
- **Meals:** Displays planned meals for the selected day.
- **Management:** Ability to remove meals from the plan.
- **Persistence:** Data is saved locally (`localStorage`), so plans remain after closing the app.

### Profile & Settings (Profile)
- **User Info:** Displays logged-in user email and display name.
- **Weekly Chart:** Visual bar chart showing calorie progress for the next 7 days.
- **Sub-pages:**
  - **Edit Profile:** Update display name and daily calorie goal.
  - **My Favorites:** List of saved recipes for quick access.
  - **About:** Information about the project and team.
  - **Contact:** Support form simulation.
- **Logout:** Securely signs out from Firebase.

---

## 🛠️ Technologies

- **Frontend:** Ionic Framework, React, TypeScript
- **Backend / Auth:** Google Firebase (Authentication)
- **Data API:** TheMealDB (Recipes), Open-Meteo (Weather)
- **Storage:** LocalStorage (Meal plans & Settings)

---

## 🚀 Installation and Setup

Follow these steps to get the project running on your local machine.

### Prerequisites
- Node.js installed.
- Ionic CLI installed (`npm install -g @ionic/cli`).

### Installation

1. Clone the repository:
   git clone [https://github.com/IlkkaNolvi/Foodex.git](https://github.com/IlkkaNolvi/Foodex.git)
   cd Foodex

2. Install dependencies:
    npm install

3. Configuration:
- The project uses Firebase for authentication. Ensure src/firebaseConfig.ts contains valid credentials.
- TheMealDB and Open-Meteo are free APIs and do not require private keys for this implementation.

4. Run the application:
    ionic serve
The app will open at http://localhost:8100.

---

##📂 Project Structure
src/pages/

- Login/, Signup/ - Authentication

- Tab1/ - Home Dashboard

- Tab2/ - Search Logic

- Tab3/ - Meal Planner

- RecipeDetail/ - Single Recipe View

- Profile/ - Profile Main View

- Favorites/ - Saved Recipes

- EditProfile/ - User Settings

- About/, Contact/ - Info Pages

- src/services/ - recipeService, plannerService, favoritesService

- src/interfaces/ - TypeScript data models

- src/theme/ - Global styles and variables

---

## 👥 Contributors
Tomi Haukka - UI/UX Design & Frontend

Ilkka Nolvi - API Integration & Logic

Jaakko Teittinen - Testing & Documentation

---

_This project was created as part of the Introduction to Mobile App Design and Development course in 2025._