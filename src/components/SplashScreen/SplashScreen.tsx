import React from 'react';
import { IonButton, IonIcon, IonText } from '@ionic/react';
import { restaurantOutline } from 'ionicons/icons';
import './SplashScreen.css';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  return (
    <div className="splash-container">
      <img 
        src="/public/assets/logo.png" 
        alt="Foodex Logo" 
        className="splash-logo" 
      />

      <IonText>
    
        <p className="splash-subtitle">Your personal cooking assistant</p>
      </IonText>

      <div className="splash-button-container">
        <IonButton 
          expand="block" 
          shape="round" 
          color="primary" 
          onClick={onFinish}
        >
          <IonIcon slot="start" icon={restaurantOutline} />
          Ready to Cook!
        </IonButton>
      </div>
    </div>
  );
};

export default SplashScreen;