import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  IonContent,
  IonPage,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  useIonRouter,
  useIonToast
} from '@ionic/react';
import {
  personOutline,
  settingsOutline,
  heartOutline,
  informationCircleOutline,
  mailOutline,
  chevronForwardOutline,
  logOutOutline
} from 'ionicons/icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Verify the path!
import './Profile.css';

const Profile: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Retrieving the current user from Firebase
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  // Mock data for weekly chart
  const weeklyData = [
    { day: 'M', percent: 60 },
    { day: 'T', percent: 85 },
    { day: 'W', percent: 40 },
    { day: 'T', percent: 90 },
    { day: 'F', percent: 20 },
    { day: 'S', percent: 10 },
    { day: 'S', percent: 0 },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      presentToast({
        message: 'Logged out successfully',
        duration: 2000,
        color: 'dark'
      });
      router.push('/login', 'back', 'replace');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-background-color">
        
        {/* 1. Header & User Info */}
        <div className="profile-header">
          <div className="avatar-placeholder">
            <IonIcon icon={personOutline} className="avatar-icon" />
          </div>

          {/* Showing correct user information within the header */}
          {user ? (
            <>
              <h2 className="user-name">{user.email?.split('@')[0]}</h2>
              <p style={{color: '#666', margin: '5px 0 0'}}>{user.email}</p>
            </>
          ) : (
            <h2 className="user-name">Guest User</h2>
          )}
        </div>

        {/* 2. Weekly Calorie Summary Chart */}
        <div className="summary-card">
          <div className="summary-title">Weekly Calorie Summary</div>
          <div className="chart-container">
            {weeklyData.map((data, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div 
                  className={`chart-bar ${data.percent > 50 ? 'active' : ''}`} 
                  style={{ height: `${data.percent}%` }}
                ></div>
                <span className="chart-day">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Settings Menu */}
        <IonList className="profile-menu" lines="full">
          
          <IonItem button detail={false} className="menu-item">
            <IonIcon icon={settingsOutline} slot="start" color="medium" />
            <IonLabel>Edit Profile & Goals</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" style={{fontSize: '16px'}} />
          </IonItem>

          <IonItem button detail={false} className="menu-item">
            <IonIcon icon={heartOutline} slot="start" color="medium" />
            <IonLabel>My Favorites</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" style={{fontSize: '16px'}} />
          </IonItem>

          <IonItem button detail={false} className="menu-item">
            <IonIcon icon={informationCircleOutline} slot="start" color="medium" />
            <IonLabel>About Foodex</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" style={{fontSize: '16px'}} />
          </IonItem>

          <IonItem button detail={false} className="menu-item" lines="none">
            <IonIcon icon={mailOutline} slot="start" color="medium" />
            <IonLabel>Contact Support</IonLabel>
            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" style={{fontSize: '16px'}} />
          </IonItem>

        </IonList>

        {/* 4. Logout Button */}
        <IonButton 
          expand="block" 
          color="danger" 
          fill="outline" 
          className="logout-btn"
          onClick={handleLogout}
        >
          <IonIcon icon={logOutOutline} slot="start" />
          Logout
        </IonButton>

        <div style={{height: '40px'}}></div>

      </IonContent>
    </IonPage>
  );
};

export default Profile;