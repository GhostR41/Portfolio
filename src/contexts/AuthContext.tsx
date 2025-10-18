import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAuthStateFromUser, signOut, signInAsViewer, AuthState } from '@/utils/auth';

interface AuthContextType {
  authState: AuthState;
  isOwner: boolean;              // UI only; Firestore rules enforce authZ
  isAuthenticated: boolean;      // true if Firebase user is signed in
  loading: boolean;
  logout: () => Promise<void>;
  loginAsViewer: () => void;
}

const OWNER_UID = import.meta.env.VITE_OWNER_UID as string | undefined;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(getAuthStateFromUser(null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    // Viewer session (read-only UX only; does NOT sign into Firebase)
    const viewerSession = localStorage.getItem('viewer_session');
    if (viewerSession) {
      setAuthState({
        isAuthenticated: false, // not signed in to Firebase
        isOwner: false,
        email: null,
        user: null,
      });
      setLoading(false);
      return;
    }

    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState(getAuthStateFromUser(null));
        setLoading(false);
        return;
      }

      try {
        // Refresh token to ensure latest claims; not needed for UID check, but keeps parity
        await user.getIdToken(true);

        const isOwner = !!OWNER_UID && user.uid === OWNER_UID;

        setAuthState({
          isAuthenticated: true,   // signed in
          isOwner,                 // UI only
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
      isAuthenticated: false, // viewer is not a Firebase-authenticated user
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
