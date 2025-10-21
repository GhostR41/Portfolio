// Firebase Authentication utilities
import { signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { logger } from '@/lib/logger';

// SECURITY: Validate backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// SECURITY: Enforce HTTPS in production
if (BACKEND_URL && import.meta.env.PROD && !BACKEND_URL.startsWith('https://')) {
  throw new Error('SECURITY ERROR: Backend URL must use HTTPS in production');
}

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

    // SECURITY NOTE: Backend verification removed (Option A - rely on Firestore rules)
    // Backend verification was not being used, creating false sense of security.
    // All authorization is now enforced entirely by Firestore rules.
    // If you need backend verification, implement proper session management.

    // Force-refresh to get latest claims
    await user.getIdToken(true);
    return { success: true };
  } catch (error: any) {
    // SECURITY: Use secure logger (dev-only, redacts sensitive data)
    logger.error('Google sign-in error:', error);
    
    try { await firebaseSignOut(auth); } catch {}
    return {
      success: false,
      error: error?.message || 'Failed to sign in with Google'
    };
  }
};

// SECURITY NOTE: viewer_session is a UX-only flag for client-side UI
// It does NOT grant any permissions - all security is enforced by Firestore rules
// This flag can be manipulated via browser console and has zero security value
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
  // AuthContext computes final isOwner/isAuthenticated from claims
  return {
    isAuthenticated: false,
    isOwner: false,
    email: user.email,
    user
  };
};