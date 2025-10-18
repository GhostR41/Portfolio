import { createContext, useContext, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface ContentSyncContextType {
  syncContent: (key: string, value: any) => Promise<void>;
}

const ContentSyncContext = createContext<ContentSyncContextType | undefined>(undefined);

export function ContentSyncProvider({ children }: { children: ReactNode }) {
  const { isOwner, authState } = useAuth();

  // Sync localStorage to Firestore when owner makes changes
  const syncContent = async (key: string, value: any) => {
    if (!isOwner) return;
    
    try {
      await setDoc(doc(db, 'portfolio', 'content'), {
        [key]: value,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error syncing to Firestore:', error);
    }
  };

  // Load content from Firestore for viewers
  useEffect(() => {
    if (!authState.isOwner && authState.isAuthenticated) {
      const unsubscribe = onSnapshot(doc(db, 'portfolio', 'content'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // Update localStorage with Firestore data
          Object.entries(data).forEach(([key, value]) => {
            if (key !== 'lastUpdated') {
              localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            }
          });
          // Trigger page reload to reflect changes
          window.location.reload();
        }
      });

      return () => unsubscribe();
    }
  }, [authState.isOwner, authState.isAuthenticated]);

  return (
    <ContentSyncContext.Provider value={{ syncContent }}>
      {children}
    </ContentSyncContext.Provider>
  );
}

export function useContentSync() {
  const context = useContext(ContentSyncContext);
  if (!context) {
    throw new Error('useContentSync must be used within ContentSyncProvider');
  }
  return context;
}
