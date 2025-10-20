import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAuthStateFromUser, signOut, signInAsViewer, AuthState } from '@/utils/auth';

const OWNER_UID = import.meta.env.VITE_OWNER_UID as string | undefined;

const VIEWER_IS_AUTHENTICATED =
  (import.meta.env.VITE_VIEWER_IS_AUTHENTICATED || 'false').toLowerCase() === 'true';

interface AuthContextType {
  authState: AuthState;
  isOwner: boolean;         // UI only; not a security boundary
  isAuthenticated: boolean; // Firebase user signed in or viewer UX (if enabled)
  loading: boolean;
  logout: () => Promise<void>;
  loginAsViewer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(getAuthStateFromUser(null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SECURITY FIX: Always subscribe to auth state changes, even in viewer mode
    // This prevents admin lockout and ensures proper auth detection
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Check for viewer session AFTER auth state is known
      const viewerSession = localStorage.getItem('viewer_session');
      
      if (!user && viewerSession) {
        // Viewer mode: no Firebase user, but viewer session active
        setAuthState({
          isAuthenticated: VIEWER_IS_AUTHENTICATED, // UX flag only
          isOwner: false,
          email: null,
          user: null,
        });
        setLoading(false);
        return;
      }

      if (!user) {
        // No user and no viewer session
        setAuthState(getAuthStateFromUser(null));
        setLoading(false);
        return;
      }

      try {
        // SECURITY: Force-refresh token to ensure latest claims
        await user.getIdToken(true);

        // SECURITY: Check ownership via UID (not email)
        const isOwner = !!OWNER_UID && user.uid === OWNER_UID;

        setAuthState({
          isAuthenticated: true, // signed in to Firebase
          isOwner,               // UI only; Firestore rules enforce writes
          email: user.email,
          user,
        });
      } catch (e) {
        console.error('Failed to refresh token claims', e);
        setAuthState(getAuthStateFromUser(null));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('viewer_session');
    await signOut();
    setAuthState(getAuthStateFromUser(null));
  };

  const loginAsViewer = () => {
    signInAsViewer();
    setAuthState({
      isAuthenticated: VIEWER_IS_AUTHENTICATED,
      isOwner: false,
      email: null,
      user: null,
    });
  };

  const value: AuthContextType = {
    authState,
    isOwner: authState.isOwner,
    isAuthenticated: authState.isAuthenticated,
    loading,
    logout: handleLogout,
    loginAsViewer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
