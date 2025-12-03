import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonLoading,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import './Login.css';

// Define the structure for Firebase errors
interface FirebaseError {
  code?: string;
  message?: string;
}

const Login: React.FC = () => {
  const router = useIonRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const handleLogin = async () => {
    if (!email || !password) {
      setToastMessage('Please enter both email and password.');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');
      setLoading(false);
      // Navigate to the main app (Tab 1) and replace history
      router.push('/tabs/tab1', 'forward', 'replace');
    } catch (err: unknown) {
      // FIX: Cast 'unknown' error to our FirebaseError interface
      const error = err as FirebaseError;
      
      console.error('Login error:', error);
      setLoading(false);
      
      let message = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          message = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
          message = 'The email address is badly formatted.';
      } else if (error.code === 'auth/too-many-requests') {
          message = 'Too many failed attempts. Please try again later.';
      }
      // Show the error toast
      setToastMessage(message);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="auth-content">
          <div className="logo-container">
             <img src="/assets/logo.png" alt="Foodex Logo" className="logo-img" />
          </div>

          <h1 className="header-title">USER LOGIN</h1>

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
            placeholder="Password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            fill="outline"
            mode="md"
          />

          <IonButton
            expand="block"
            className="login-button"
            onClick={handleLogin}
          >
            Login
          </IonButton>

          <p className="helper-text">
            Don't have an account yet? Please{' '}
            <Link to="/signup" className="link-text">register</Link> for free.
          </p>

          <Link to="/tabs/tab1" className="skip-link">Skip for now</Link>
        </div>

        <IonLoading isOpen={loading} message={'Logging in...'} />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;