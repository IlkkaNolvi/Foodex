import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonIcon,
  IonCard,
  useIonViewWillEnter 
} from '@ionic/react';
import { cloudyOutline, sunnyOutline } from 'ionicons/icons';
import { searchRecipes } from '../services/recipeService';
import { getPlannedMeals } from '../services/plannerService';
import { Recipe } from '../interfaces/recipe';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- CALORIES ---
  const [eaten, setEaten] = useState(0);
  
  // MUUTOS 1: Tavoite on nyt state-muuttuja, ei vakio
  const [goal, setGoal] = useState(2000);

  // --- WEATHER ---
  const [weatherTemp, setWeatherTemp] = useState<number | null>(null);
  const [city, setCity] = useState('Locating...');

  // 1. Päivitetään kalorit ja tavoite AINA kun sivu tulee näkyviin
  useIonViewWillEnter(() => {
    // A. Haetaan syödyt kalorit
    const allMeals = getPlannedMeals();
    const todaysMeals = allMeals.filter(m => m.dayIndex === 0); // 0 = tänään
    const total = todaysMeals.reduce((sum, item) => sum + item.calories, 0);
    setEaten(total);

    // B. MUUTOS 2: Haetaan tavoite muistista
    const savedGoal = localStorage.getItem('foodex_calorie_goal');
    if (savedGoal) {
      setGoal(parseInt(savedGoal, 10));
    } else {
      setGoal(2000); // Oletus jos ei ole tallennettu
    }
  });

  // 2. Haetaan sää ja suositukset (vain kerran alussa)
  useEffect(() => {
    const initData = async () => {
      // Recommendations
      const recs = await searchRecipes('Healthy'); 
      setRecommendations(recs);
      setLoading(false);

      // Weather (Open-Meteo API - free)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await res.json();
            setWeatherTemp(Math.round(data.current_weather.temperature));
            setCity('Own location'); 
          } catch (e) {
            console.error("Weather error", e);
            setCity('Helsinki'); 
            setWeatherTemp(12);
          }
        }, () => {
          setCity('Helsinki'); // If location is not allowed
          setWeatherTemp(12);
        });
      }
    };
    initData();
  }, []);

  const percentage = Math.min((eaten / goal) * 100, 100);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <div className="home-header">
          <div className="greeting">Good morning!</div>
          
          <div className="weather-widget">
            <IonIcon icon={weatherTemp && weatherTemp > 15 ? sunnyOutline : cloudyOutline} color="primary" />
            <span>{weatherTemp !== null ? `${weatherTemp > 0 ? '+' : ''}${weatherTemp}°C` : '--'} {city}</span>
          </div>
        </div>
      </IonHeader>

      <IonContent fullscreen>
        <div className="ion-padding-horizontal">
          <div className="calorie-card">
            <div className="calorie-title">Today's Calories</div>
            <div 
              className="progress-ring" 
              style={{ '--progress': `${percentage * 3.6}deg` } as React.CSSProperties}
            >
              <div className="progress-inner">
                <span className="kcal-number">{eaten}</span>
                <span className="kcal-label">kcal</span>
              </div>
            </div>
            <div className="calorie-stats">
              <div className="stat-box"><strong>{eaten}</strong><span>Eaten</span></div>
              {/* Tavoite päivittyy nyt dynaamisesti */}
              <div className="stat-box"><strong>{goal}</strong><span>Goal</span></div>
            </div>
          </div>
        </div>

        <h2 className="section-title">Recommended for you</h2>
        <div className="recommendations-container">
          {!loading && recommendations.map(recipe => (
            <IonCard key={recipe.id} className="recommendation-card" routerLink={`/recipe/${recipe.id}`}>
              <img src={recipe.image} alt={recipe.title} className="rec-image" />
              <div className="rec-content">
                <h4 className="rec-title">{recipe.title}</h4>
                <span style={{fontSize: '12px', color: '#666'}}>{recipe.readyInMinutes} min</span>
              </div>
            </IonCard>
          ))}
        </div>
        <div style={{height: '40px'}}></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;