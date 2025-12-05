import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonItem, IonLabel, IonInput, IonTextarea, IonButton, useIonToast 
} from '@ionic/react';

const Contact: React.FC = () => {
  const [presentToast] = useIonToast();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Here you would typically send the data to a backend
    console.log("Sending message:", message);
    
    presentToast({
      message: 'Message sent! We will get back to you shortly.',
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    setMessage('');
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/profile" text="" color="dark" />
          </IonButtons>
          <IonTitle>Contact Support</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <h3>We're Here to Help!</h3>
        <p style={{color: '#666', marginBottom: '20px'}}>
            Have a question, found a bug, or just want to suggest a new feature? 
            We love hearing from our community.
        </p>

        <IonItem className="ion-margin-bottom">
          <IonLabel position="stacked">Your Email</IonLabel>
          <IonInput placeholder="your@email.com" type="email" />
        </IonItem>

        <IonItem className="ion-margin-bottom">
          <IonLabel position="stacked">Topic</IonLabel>
          <IonInput placeholder="Bug report, Feature request..." />
        </IonItem>

        <IonItem className="ion-margin-bottom">
          <IonLabel position="stacked">Message</IonLabel>
          <IonTextarea 
            rows={6} 
            placeholder="Describe your issue..." 
            value={message}
            onIonChange={e => setMessage(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="block" onClick={handleSend} className="ion-margin-top">
          Send Message
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Contact;