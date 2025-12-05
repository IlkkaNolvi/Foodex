import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  IonContent, IonPage, IonIcon, IonList, IonItem, IonLabel, IonButton,
  useIonRouter, useIonToast, useIonViewWillEnter
} from '@ionic/react';
import {
  personOutline, settingsOutline, heartOutline, informationCircleOutline,
  mailOutline, chevronForwardOutline, logOutOutline
} from 'ionicons/icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getPlannedMeals } from '../services/plannerService'; // Importataan ateriatiedot
import './Profile.css';

const Profile: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();
  const [user, setUser] = useState<User | null>(null);
  
  // Tilat käyttäjätiedoille
  const [displayName, setDisplayName] = useState('');
  
  // Tila graafidataa varten
  const [weeklyData, setWeeklyData] = useState<{ day: string; percent: number }[]>([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  // Tämä funktio ajetaan AINA kun sivu avataan (päivittää tiedot reaaliajassa)
  useIonViewWillEnter(() => {
    // 1. Haetaan tallennettu nimi ja tavoite
    const savedName = localStorage.getItem('foodex_user_name');
    if (savedName) setDisplayName(savedName);

    const savedGoal = localStorage.getItem('foodex_calorie_goal');
    const goal = savedGoal ? parseInt(savedGoal, 10) : 2000;
    setCalorieGoal(goal);

    // 2. Haetaan ateriat Plannerista
    const meals = getPlannedMeals();
    
    // 3. Lasketaan seuraavan 7 päivän kalorit
    const daysArr = [];
    const today = new Date();
    // Viikonpäivien lyhenteet (Suomi: SU, MA, TI...) tai Englanti (S, M, T...)
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; 

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      // Etsitään tämän päivän (dayIndex = i) ateriat
      // Käytetään '==' jotta vertailu on joustava (esim. jos tallennus on merkkijonona)
      const dayMeals = meals.filter(m => m.dayIndex == i);
      
      // Lasketaan kalorit yhteen
      const dayTotal = dayMeals.reduce((sum, item) => sum + item.calories, 0);
      
      // Lasketaan prosenttiosuus tavoitteesta (max 100% graafia varten)
      let percent = (dayTotal / goal) * 100;
      if (percent > 100) percent = 100;

      daysArr.push({
        day: weekDays[d.getDay()], // Hakee viikonpäivän kirjaimen
        percent: percent
      });
    }
    
    setWeeklyData(daysArr);
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      presentToast({ message: 'Logged out successfully', duration: 2000, color: 'dark' });
      router.push('/login', 'back', 'replace');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-background-color">
        <div className="profile-header">
          <div className="avatar-placeholder">
            <IonIcon icon={personOutline} className="avatar-icon" />
          </div>
          {user ? (
            <>
              {/* Näytetään tallennettu nimi TAI sähköpostin alkuosa */}
              <h2 className="user-name">{displayName || user.email?.split('@')[0]}</h2>
              <p style={{color: '#666', margin: '5px 0 0'}}>{user.email}</p>
            </>
          ) : (
            <h2 className="user-name">Guest User</h2>
          )}
        </div>

        <div className="summary-card">
          <div className="summary-title">Weekly Calorie Plan (Next 7 Days)</div>
          <div className="chart-container">
            {weeklyData.map((data, index) => (
              <div key={index} className="chart-bar-wrapper">
                {/* KORJAUS: Käytetään pikseleitä (px) prosentin (%) sijaan korkeudessa.
                   Koska chart-container on n. 100px korkea, 1% = 1px.
                   Tämä varmistaa, että palkit näkyvät, vaikka CSS-konteksti olisi hankala.
                */}
                <div 
                  className={`chart-bar ${data.percent > 0 ? 'active' : ''}`} 
                  style={{ 
                    height: `${data.percent}px`, 
                    minHeight: data.percent === 0 ? '4px' : 'auto',
                    opacity: data.percent === 0 ? 0.3 : 1
                  }}
                ></div>
                <span className="chart-day">{data.day}</span>
              </div>
            ))}
          </div>
          <p style={{textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '10px'}}>
            Goal: {calorieGoal} kcal / day
          </p>
        </div>

        <IonList className="profile-menu" lines="full">
          <IonItem button detail={false} className="menu-item" routerLink="/profile/edit">
            <IonIcon icon={settingsOutline} slot="start" color="medium" />
            <IonLabel>Edit Profile & Goals</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" style={{fontSize: '16px'}} />
          </IonItem>

          <IonItem button detail={false} className="menu-item" routerLink="/profile/favorites">
            <IonIcon icon={heartOutline} slot="start" color="medium" />
            <IonLabel>My Favorites</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" style={{fontSize: '16px'}} />
          </IonItem>

          <IonItem button detail={false} className="menu-item" routerLink="/profile/about">
            <IonIcon icon={informationCircleOutline} slot="start" color="medium" />
            <IonLabel>About Foodex</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" style={{fontSize: '16px'}} />
          </IonItem>

          <IonItem button detail={false} className="menu-item" lines="none" routerLink="/profile/contact">
            <IonIcon icon={mailOutline} slot="start" color="medium" />
            <IonLabel>Contact Support</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" style={{fontSize: '16px'}} />
          </IonItem>
        </IonList>

        <IonButton expand="block" color="danger" fill="outline" className="logout-btn" onClick={handleLogout}>
          <IonIcon icon={logOutOutline} slot="start" /> Logout
        </IonButton>
        <div style={{height: '40px'}}></div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;