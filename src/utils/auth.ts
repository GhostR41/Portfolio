// Firebase Authentication utilities
import { signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Backend URL - update this after deploying backend to Vercel
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// The single allowed email (configurable). Defaults to the intended owner.
const ALLOWED_EMAIL = (import.meta.env.VITE_ALLOWED_EMAIL || 'pranjaysharma17@gmail.com').toLowerCase();

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

    const email = (user.email || '').toLowerCase();

    // Get ID token from Firebase
    const idToken = await user.getIdToken();

    // Verify with backend
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    const data = await response.json();

    if (!data.success) {
      // Ensure no admin flags are left behind on failure
      localStorage.removeItem('is_owner');
      await firebaseSignOut(auth);
      return {
        success: false,
        error: data.error || 'Access denied. This application is restricted to authorized users only.'
      };
    }

    // Mark admin only after backend success AND email matches allowlist
    if (email === ALLOWED_EMAIL) {
      localStorage.setItem('is_owner', 'true');
    } else {
      // Defensive: even if backend misconfigured, don't grant admin
      localStorage.removeItem('is_owner');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    // Defensive clean-up
    localStorage.removeItem('is_owner');
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google'
    };
  }
};

export const signInAsViewer = (): void => {
  localStorage.setItem('viewer_session', 'active');
  // Ensure admin flag is not present in viewer mode
  localStorage.removeItem('is_owner');
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem('viewer_session');
  localStorage.removeItem('is_owner');
  await firebaseSignOut(auth);
};

export const getAuthStateFromUser = (user: User | null): AuthState => {
  // Viewer mode is handled in AuthContext before this runs
  if (!user) {
    return {
      isAuthenticated: false,
      isOwner: false,
      email: null,
      user: null
    };
  }

  // Only consider authenticated if we have a backend-verified owner flag
  const email = (user.email || '').toLowerCase();
  const isOwnerFlag = localStorage.getItem('is_owner') === 'true';
  const emailAllowed = email === ALLOWED_EMAIL;

  const isOwner = isOwnerFlag && emailAllowed;

  return {
    isAuthenticated: isOwner, // IMPORTANT: do NOT authenticate random Firebase users
    isOwner,
    email: user.email,
    user
  };
};