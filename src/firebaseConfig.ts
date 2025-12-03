// src/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7cUxzoT4EekakVlstVvfZP5i2k0wYp3Q",
  authDomain: "mobile7-foodex.firebaseapp.com",
  projectId: "mobile7-foodex",
  storageBucket: "mobile7-foodex.firebasestorage.app",
  messagingSenderId: "290568542598",
  appId: "1:290568542598:web:d0610d387dfeeb02c87407"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Alustetaan Autentikaatio ja viedään se käytettäväksi muualla
export const auth = getAuth(app);
export default app;