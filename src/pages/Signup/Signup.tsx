import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonLoading,
  IonToast,
  useIonRouter,
  IonIcon
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import './Signup.css';

// Define the interface for Firebase errors
interface FirebaseError {
  code?: string;
  message?: string;
}

const Signup: React.FC = () => {
  const router = useIonRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setToastMessage('Please fill in all fields.');
      setShowToast(true);
      return;
    }

    if (password !== confirmPassword) {
      setToastMessage('Passwords do not match.');
      setShowToast(true);
      return;
    }

    if (password.length < 6) {
        setToastMessage('Password should be at least 6 characters.');
        setShowToast(true);
        return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful!');
      setLoading(false);
      setToastMessage('Account created successfully! Logging you in...');
      setShowToast(true);
      
      setTimeout(() => {
         router.push('/tabs/tab1', 'forward', 'replace');
      }, 1500);

    } catch (err: unknown) {
      // FIX: Cast the error to the specific interface to access 'code'
      const error = err as FirebaseError;

      console.error('Signup error:', error);
      setLoading(false);
      
      let message = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
          message = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'The email address is badly formatted.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak.';
      }
      
      setToastMessage(message);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
        <IonButton fill="clear" className="back-button" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBackOutline} slot="start" color="dark"/>
            Back
        </IonButton>
      <IonContent fullscreen className="ion-padding">
        <div className="auth-content pt-0">
          <div className="logo-container">
             <img src="/assets/logo.png" alt="Foodex Logo" className="logo-img logo-small" style={{maxWidth: '150px'}} />
          </div>

          <h1 className="header-title">Sign up page</h1>

          <IonInput
            className="custom-input"
            type="email"
            placeholder="Email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            fill="outline"
            mode="md"
          />
          <IonInput
            className="custom-input"
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            fill="outline"
            mode="md"
          />
          <IonInput
            className="custom-input"
            type="password"
            placeholder="Password again"
            value={confirmPassword}
            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            fill="outline"
            mode="md"
          />

          <IonButton
            expand="block"
            className="login-button"
            onClick={handleSignup}
          >
            Sign up
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message={'Creating account...'} />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastMessage.includes('success') ? "success" : "danger"}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Signup;