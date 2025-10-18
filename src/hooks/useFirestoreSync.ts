import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface PortfolioContent {
  stats: {
    projects: string;
    technologies: string;
    experience: string;
    certifications: string;
  };
  lastUpdated: number;
}

const DEFAULT_CONTENT: PortfolioContent = {
  stats: {
    projects: '24',
    technologies: '15+',
    experience: '5',
    certifications: '4'
  },
  lastUpdated: Date.now()
};

export const useFirestoreSync = () => {
  const { isOwner, isAuthenticated } = useAuth();
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const contentRef = doc(db, 'portfolio', 'content');

    // Initialize content if it doesn't exist
    const initContent = async () => {
      const docSnap = await getDoc(contentRef);
      if (!docSnap.exists()) {
        await setDoc(contentRef, DEFAULT_CONTENT);
      }
    };

    initContent();

    // Real-time listener
    const unsubscribe = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        setContent(docSnap.data() as PortfolioContent);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const updateContent = async (updates: Partial<PortfolioContent>) => {
    if (!isOwner) {
      console.warn('Only admin can update content');
      return;
    }

    const contentRef = doc(db, 'portfolio', 'content');
    const updatedContent = {
      ...content,
      ...updates,
      lastUpdated: Date.now()
    };

    await setDoc(contentRef, updatedContent);
  };

  return { content, updateContent, loading };
};
