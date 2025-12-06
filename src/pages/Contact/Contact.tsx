import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonItem, IonLabel, IonInput, IonTextarea, IonButton, useIonToast,
  IonText
} from '@ionic/react';

// Regular Expression for basic email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact: React.FC = () => {
  const [presentToast] = useIonToast();

  // 1. State for form fields
  const [formData, setFormData] = useState({
    email: '',
    topic: '',
    message: ''
  });

  // 2. State for validation errors
  const [errors, setErrors] = useState({
    email: '',
    topic: '',
    message: ''
  });

  // Handle changes to all input fields
  const handleChange = (name: keyof typeof formData, value: string) => {
    // Handle null/undefined case for safety
    const safeValue = value || ''; 
    setFormData({ ...formData, [name]: safeValue });
    // Clear the error for the field as soon as the user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  // 3. Validation Logic
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: '', topic: '', message: '' };

    // Check Email
    if (!formData.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Check Topic
    if (!formData.topic || formData.topic.length < 3) {
      newErrors.topic = 'Topic is required and must be at least 3 characters.';
      isValid = false;
    }

    // Check Message
    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Message is required and must be at least 10 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSend = () => {
    // Only proceed if validation passes
    if (validateForm()) { 
      console.log("Sending message with data:", formData);
      
      presentToast({
        message: 'Message sent! We will get back to you shortly.',
        duration: 3000,
        color: 'success',
        position: 'top'
      });
      
      // Reset the form after successful submission
      setFormData({ email: '', topic: '', message: '' });
      setErrors({ email: '', topic: '', message: '' }); // Clear any lingering error states
    } else {
      // Form is invalid, show an error toast
      presentToast({
        message: 'Please correct the errors in the form.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
    }
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

        {/* EMAIL FIELD */}
        <IonItem className="ion-margin-bottom" color={errors.email ? 'danger' : ''}>
          <IonLabel position="stacked">Your Email *</IonLabel>
          <IonInput 
            placeholder="your@email.com" 
            type="email" 
            value={formData.email}
            onIonChange={e => handleChange('email', e.detail.value!)}
          />
        </IonItem>
        {errors.email && (
          <IonText color="danger" className="ion-padding-start">
            <p className="ion-no-margin" style={{fontSize: '12px'}}>{errors.email}</p>
          </IonText>
        )}

        {/* TOPIC FIELD */}
        <IonItem className="ion-margin-top ion-margin-bottom" color={errors.topic ? 'danger' : ''}>
          <IonLabel position="stacked">Topic *</IonLabel>
          <IonInput 
            placeholder="Bug report, Feature request..." 
            value={formData.topic}
            onIonChange={e => handleChange('topic', e.detail.value!)}
          />
        </IonItem>
        {errors.topic && (
          <IonText color="danger" className="ion-padding-start">
            <p className="ion-no-margin" style={{fontSize: '12px'}}>{errors.topic}</p>
          </IonText>
        )}

        {/* MESSAGE FIELD */}
        <IonItem className="ion-margin-top ion-margin-bottom" color={errors.message ? 'danger' : ''}>
          <IonLabel position="stacked">Message *</IonLabel>
          <IonTextarea 
            rows={6} 
            placeholder="Describe your issue..." 
            value={formData.message}
            onIonChange={e => handleChange('message', e.detail.value!)}
          />
        </IonItem>
        {errors.message && (
          <IonText color="danger" className="ion-padding-start">
            <p className="ion-no-margin" style={{fontSize: '12px'}}>{errors.message}</p>
          </IonText>
        )}
        
        <IonButton 
          expand="block" 
          onClick={handleSend} 
          className="ion-margin-top"
          disabled={!!errors.email || !!errors.topic || !!errors.message} 
        >
          Send Message
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Contact;