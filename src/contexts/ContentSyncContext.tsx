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
  const { isOwner, authState } = useAuth();
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

  // Load content from Firestore for viewers
  useEffect(() => {
    // Note: This effect runs for viewers only. Ensure your Firestore read rules allow unauthenticated read
    // if your viewer mode isn't signed in with Firebase Auth.
    if (!authState.isOwner && authState.isAuthenticated) {
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

        // Avoid infinite reloads:
        // 1) Skip the initial snapshot (we just populated localStorage).
        if (!initializedRef.current) {
          if (lastUpdated) {
            sessionStorage.setItem(LAST_APPLIED_KEY, lastUpdated);
          }
          initializedRef.current = true;
          return;
        }

        // 2) Reload only when lastUpdated actually changes and only once per update.
        const lastApplied = sessionStorage.getItem(LAST_APPLIED_KEY) || '';
        if (lastUpdated && lastUpdated !== lastApplied && !reloadingRef.current) {
          reloadingRef.current = true;
          sessionStorage.setItem(LAST_APPLIED_KEY, lastUpdated);
          // Small delay prevents back-to-back snapshots from scheduling multiple reloads
          setTimeout(() => {
            window.location.reload();
          }, 150);
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
