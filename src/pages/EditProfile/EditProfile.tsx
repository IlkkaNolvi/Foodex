import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonItem, IonLabel, IonInput, IonButton, useIonToast 
} from '@ionic/react';

const EditProfile: React.FC = () => {
  const [name, setName] = useState('');
  // '2000' on tässä vain oletusarvo, jos käyttäjä ei ole koskaan asettanut tavoitetta.
  const [calorieGoal, setCalorieGoal] = useState('2000'); 
  const [presentToast] = useIonToast();

  useEffect(() => {
    // Ladataan tallennetut asetukset kun sivu aukeaa
    const savedName = localStorage.getItem('foodex_user_name');
    const savedGoal = localStorage.getItem('foodex_calorie_goal');
    
    if (savedName) setName(savedName);
    if (savedGoal) setCalorieGoal(savedGoal);
  }, []);

  const handleSave = () => {
    // 1. Tallennetaan tiedot muistiin
    localStorage.setItem('foodex_user_name', name);
    localStorage.setItem('foodex_calorie_goal', calorieGoal);
    
    // 2. TÄRKEÄÄ: Lähetetään tapahtuma (event), jotta Tab1 (Home) 
    // tietää päivittää kalorimittarin heti ilman refreshiä.
    window.dispatchEvent(new Event('foodex_settings_changed'));
    
    // 3. Näytetään ilmoitus käyttäjälle
    presentToast({
      message: 'Profile updated successfully!',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/profile" text="" color="dark" />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonItem className="ion-margin-bottom">
          <IonLabel position="stacked">Display Name</IonLabel>
          <IonInput 
            value={name} 
            placeholder="Enter your name" 
            onIonInput={e => setName(e.detail.value!)} 
          />
        </IonItem>

        <IonItem className="ion-margin-bottom">
          <IonLabel position="stacked">Daily Calorie Goal (kcal)</IonLabel>
          <IonInput 
            type="number" 
            value={calorieGoal} 
            placeholder="2000" 
            // Käytetään onIonInput mieluummin kuin onIonChange reaaliaikaiseen päivitykseen
            onIonInput={e => setCalorieGoal(e.detail.value!)} 
          />
        </IonItem>

        <IonButton 
          expand="block" 
          onClick={handleSave} 
          className="ion-margin-top" 
          style={{
            '--background': 'var(--ion-color-primary)', 
            fontWeight: 'bold', 
            color: 'black' // Tai 'white' riippuen teemastasi
          }}
        >
          Save Changes
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;