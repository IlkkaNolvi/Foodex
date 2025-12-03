import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonIcon,
  IonButton,
  useIonToast,
  useIonViewWillEnter
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { getPlannedMeals, removeMealFromPlan, PlannerItem } from '../services/plannerService';
import './Tab3.css';

const Tab3: React.FC = () => {
  const [presentToast] = useIonToast();
  
  // --- NEW LOGIC: Generate real upcoming days ---
  const generateWeekDays = () => {
    const daysArr = [];
    const today = new Date();
    // English abbreviations for days
    const weekDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      daysArr.push({
        name: weekDays[d.getDay()], // Get day name (e.g., MO, TU)
        num: d.getDate(),           // Get day number (e.g., 12)
        fullDate: d.toDateString(), // Used for exact date comparison if needed
        dayIndex: i                 // 0 = Today, 1 = Tomorrow...
      });
    }
    return daysArr;
  };

  const days = generateWeekDays();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Default to Today (Index 0)
  const [allMeals, setAllMeals] = useState<PlannerItem[]>([]);

  // This hook runs EVERY TIME the user enters this tab
  // Ensures the data is always fresh when switching tabs
  useIonViewWillEnter(() => {
    const meals = getPlannedMeals();
    setAllMeals(meals);
  });

  const handleDelete = (id: string) => {
    removeMealFromPlan(id);
    setAllMeals(getPlannedMeals()); // Refresh list immediately after deletion
    presentToast({ message: 'Meal removed', duration: 1500 });
  };

  // Filter meals for the currently selected day
  const dayMeals = allMeals.filter(m => m.dayIndex === selectedDayIndex);
  
  // Note: We don't define separate variables for breakfast/lunch/dinner here
  // because we filter them dynamically inside the JSX loop below.

  // Calculate total calories for the day
  const totalCalories = dayMeals.reduce((sum, item) => sum + item.calories, 0);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <div className="planner-header">
          <h1 className="planner-title">Meal Planner</h1>
          
          {/* Horizontal Calendar Strip */}
          <div className="calendar-strip">
            {days.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-day ${selectedDayIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedDayIndex(index)}
              >
                <span className="day-name">{day.name}</span>
                <span className="day-number">{day.num}</span>
              </div>
            ))}
          </div>
        </div>
      </IonHeader>

      <IonContent fullscreen>
        
        {/* Loop through meal slots: Breakfast, Lunch, Dinner */}
        {['breakfast', 'lunch', 'dinner'].map((slot) => {
           // Filter meals for this specific slot (e.g., only 'breakfast')
           const mealsInSlot = dayMeals.filter(m => m.slot === slot);
           
           return (
            <div className="meal-section" key={slot}>
              <div className="section-label">
                <span style={{textTransform: 'capitalize'}}>{slot}</span>
              </div>
              
              {/* Show empty state or list of meals */}
              {mealsInSlot.length === 0 ? (
                <div className="empty-slot">No {slot} planned</div>
              ) : (
                mealsInSlot.map(meal => (
                  <div className="meal-card" key={meal.id}>
                    <div className="meal-info">
                      <h4>{meal.title}</h4>
                      <p>{meal.calories} kcal</p>
                    </div>
                    <IonButton fill="clear" color="medium" onClick={() => handleDelete(meal.id)}>
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                ))
              )}
            </div>
           );
        })}

        {/* Daily Summary Footer */}
        <div className="daily-summary">
          <span>Daily Total:</span>
          <span>{totalCalories} / 2000 kcal</span>
        </div>
        
        {/* Spacer for bottom navigation */}
        <div style={{height: '50px'}}></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;