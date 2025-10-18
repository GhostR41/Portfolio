import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface ContentSyncContextType {
  syncContent: (key: string, value: any) => Promise<void>;
}

const ContentSyncContext = createContext<ContentSyncContextType | undefined>(undefined);

const LAST_APPLIED_KEY = 'content_last_applied';

export function ContentSyncProvider({ children }: { children: ReactNode }) {
  const { isOwner } = useAuth();
  const initializedRef = useRef(false);
  const reloadingRef = useRef(false);

  // Sync localStorage to Firestore when owner makes changes
  const syncContent = async (key: string, value: any) => {
    if (!isOwner) return;

    try {
      await setDoc(
        doc(db, 'portfolio', 'content'),
        {
          [key]: value,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error syncing to Firestore:', error);
    }
  };

  // Load content from Firestore for non-owners (no Firebase auth required if rules allow public reads)
  useEffect(() => {
    if (!isOwner) {
      const unsubscribe = onSnapshot(doc(db, 'portfolio', 'content'), (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        const lastUpdated = typeof data.lastUpdated === 'string' ? data.lastUpdated : '';

        // Update localStorage with Firestore data
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'lastUpdated') {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
          }
        });

        // Skip the initial snapshot to avoid immediate reload
        if (!initializedRef.current) {
          if (lastUpdated) sessionStorage.setItem(LAST_APPLIED_KEY, lastUpdated);
          initializedRef.current = true;
          return;
        }

        // Reload only once when lastUpdated actually changes
        const lastApplied = sessionStorage.getItem(LAST_APPLIED_KEY) || '';
        if (lastUpdated && lastUpdated !== lastApplied && !reloadingRef.current) {
          reloadingRef.current = true;
          sessionStorage.setItem(LAST_APPLIED_KEY, lastUpdated);
          setTimeout(() => window.location.reload(), 150);
        }
      });

      return () => unsubscribe();
    }
  }, [isOwner]);

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
