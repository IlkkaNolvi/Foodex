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
  const goal = 2000;

  // --- WEATHER ---
  const [weatherTemp, setWeatherTemp] = useState<number | null>(null);
  const [city, setCity] = useState('Locating...');

  // 1. Get calories ALWAYS when the page is displayed (if the user added food)
  useIonViewWillEnter(() => {
    const allMeals = getPlannedMeals();
    // Only retrieve TODAY'S meals (dayIndex 0 = today)
    const todaysMeals = allMeals.filter(m => m.dayIndex === 0);
    const total = todaysMeals.reduce((sum, item) => sum + item.calories, 0);
    setEaten(total);
  });

  // 2. Get weather and recommendations (only once at the beginning)
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
            setCity('Own location'); // The correct city name would require Google Maps API (paid)
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