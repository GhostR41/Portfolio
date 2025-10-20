import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

type PortfolioContent = Record<string, any>;

interface ContentSyncContextType {
  content: PortfolioContent;                    // Live content snapshot (no reloads)
  syncContent: (key: string, value: any) => Promise<void>; // Owner-only: merges and updates lastUpdated
}

const ContentSyncContext = createContext<ContentSyncContextType | undefined>(undefined);

const LAST_APPLIED_KEY = 'content_last_applied';

export function ContentSyncProvider({ children }: { children: ReactNode }) {
  const { isOwner } = useAuth();
  const [content, setContent] = useState<PortfolioContent>({});
  const initializedRef = useRef(false);

  // Owner: sync local changes into Firestore
  const syncContent = async (key: string, value: any) => {
    if (!isOwner) return; // SECURITY: UI check; Firestore rules still enforce
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

  // All users (owners and viewers): subscribe to content without reload loops
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'portfolio', 'content'), (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data() as PortfolioContent;
      const { lastUpdated, ...rest } = data;

      // SECURITY FIX: Update React state instead of triggering full page reload
      // This prevents infinite reload loop and provides better UX
      setContent(rest);

      // Persist to localStorage for components that might read from there
      Object.entries(rest).forEach(([key, value]) => {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      });

      // Track initialization to prevent redundant operations
      if (!initializedRef.current && typeof lastUpdated === 'string') {
        sessionStorage.setItem(LAST_APPLIED_KEY, lastUpdated);
        initializedRef.current = true;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ContentSyncContext.Provider value={{ content, syncContent }}>
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
