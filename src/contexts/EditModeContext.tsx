import { createContext, useContext, useState, ReactNode } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  saveChanges: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isPreviewMode) setIsPreviewMode(false);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    if (isEditMode && !isPreviewMode) {
      setIsEditMode(false);
    }
  };

  const saveChanges = () => {
    // Mark all changes as saved
    localStorage.setItem('content_saved_timestamp', Date.now().toString());
    setHasUnsavedChanges(false);
  };

  const value: EditModeContextType = {
    isEditMode,
    toggleEditMode,
    isPreviewMode,
    togglePreviewMode,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    saveChanges
  };

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
};

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};
