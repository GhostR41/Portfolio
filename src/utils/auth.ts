// Firebase Authentication utilities
import { signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Backend URL - update this after deploying backend to Vercel
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface AuthState {
  isAuthenticated: boolean;
  isOwner: boolean;
  email: string | null;
  user: User | null;
}

export const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get ID token from Firebase
    const idToken = await user.getIdToken();
    
    // Verify with backend
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      await firebaseSignOut(auth);
      return {
        success: false,
        error: data.error || 'Access denied. This application is restricted to authorized users only.'
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google'
    };
  }
};

export const signInAsViewer = (): void => {
  localStorage.setItem('viewer_session', 'active');
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem('viewer_session');
  await firebaseSignOut(auth);
};

export const getAuthStateFromUser = (user: User | null): AuthState => {
  if (!user) {
    return {
      isAuthenticated: false,
      isOwner: false,
      email: null,
      user: null
    };
  }
  
  // If user exists in Firebase auth, they've been verified by backend
  return {
    isAuthenticated: true,
    isOwner: true,
    email: user.email,
    user
  };
};
