import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace these with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyCvd8cFJ1B3dl1skcUaolxAerhCrDRKJsQ",
  authDomain: "protf-cd175.firebaseapp.com",
  projectId: "protf-cd175",
  storageBucket: "protf-cd175.firebasestorage.app",
  messagingSenderId: "415670752667",
  appId: "1:415670752667:web:289dba2172b0b49b307d3e",
  measurementId: "G-3JTVZYB7S2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// SECURITY: Email whitelist is now handled by backend
// No need for client-side email validation
