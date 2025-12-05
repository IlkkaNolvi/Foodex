import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/profile" text="" color="dark" />
          </IonButtons>
          <IonTitle>About Foodex</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <img src="/assets/logo.png" alt="Foodex Logo" style={{maxWidth: '120px', marginTop: '20px'}} />
            <h2>Foodex</h2>
            <p style={{color: '#666'}}>Version 1.0.0 (BETA)</p>
        </div>

        <h3>Your Culinary Compass</h3>
        <p>
          Foodex was created with a simple mission: to make healthy eating easier and meal planning stress-free. 
          We believe you shouldn't have to jump between five different websites to find dinner inspiration.
        </p>

        <h3>How It Works</h3>
        <p>
          We bring the culinary world to you. Foodex searches across multiple trusted recipe sources simultaneously, 
          giving you one unified place to discover new favorites.
        </p>

        <h3>The Team</h3>
        <p>
          This application is developed with passion as a student project. 
          Our goal is to combine modern mobile design best practices with real-world utility.
        </p>
      </IonContent>
    </IonPage>
  );
};

export default About;