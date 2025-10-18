// Firebase Authentication utilities
import { signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Public backend URL (optional). If unavailable, we simply skip backend verification.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

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

    // Try backend verification if configured; ignore failure (Option A relies on rules)
    if (BACKEND_URL) {
      try {
        const idToken = await user.getIdToken();
        await fetch(`${BACKEND_URL}/api/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken })
        }).catch(() => void 0);
      } catch {
        // ignore errors
      }
    }

    // Force-refresh to get latest claims (email/email_verified)
    await user.getIdToken(true);
    return { success: true };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    try { await firebaseSignOut(auth); } catch {}
    return {
      success: false,
      error: error?.message || 'Failed to sign in with Google'
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
  // AuthContext computes final isOwner/isAuthenticated from claims
  return {
    isAuthenticated: false,
    isOwner: false,
    email: user.email,
    user
  };
};