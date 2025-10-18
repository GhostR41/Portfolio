import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAuthStateFromUser, signOut, signInAsViewer, AuthState } from '@/utils/auth';

interface AuthContextType {
  authState: AuthState;
  isOwner: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  loginAsViewer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(getAuthStateFromUser(null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for viewer session
    const viewerSession = localStorage.getItem('viewer_session');
    if (viewerSession) {
      setAuthState({
        isAuthenticated: true,
        isOwner: false,
        email: null,
        user: null
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const state = getAuthStateFromUser(user);
      setAuthState(state);
      setLoading(false);
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
      isAuthenticated: true,
      isOwner: false,
      email: null,
      user: null
    });
  };

  const value: AuthContextType = {
    authState,
    isOwner: authState.isOwner,
    isAuthenticated: authState.isAuthenticated,
    loading,
    logout: handleLogout,
    loginAsViewer
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
