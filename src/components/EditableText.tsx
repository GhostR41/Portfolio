import { useState, useRef, useEffect } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { cn } from '@/lib/utils';
import { textContentSchema, shortTextSchema } from '@/lib/validation-schemas';
import { toast } from 'sonner';
import { z } from 'zod';

interface EditableTextProps {
  id: string;
  initialValue: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  placeholder?: string;
}

export function EditableText({ 
  id, 
  initialValue, 
  className, 
  as = 'p',
  placeholder = 'Click to edit...'
}: EditableTextProps) {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved value from localStorage, fallback to initialValue
    const saved = localStorage.getItem(`editable_${id}`);
    if (saved !== null) {
      setValue(saved);
    } else {
      setValue(initialValue);
    }
  }, [id, initialValue]);

  useEffect(() => {
    // Save to localStorage and sync to Firestore when value changes
    if (value !== initialValue) {
      const storageKey = `editable_${id}`;
      localStorage.setItem(storageKey, value);
      syncContent(storageKey, value);
      setHasUnsavedChanges(true);
    }
  }, [value, initialValue, id, setHasUnsavedChanges, syncContent]);

  const handleBlur = () => {
    setIsEditing(false);
    if (textRef.current) {
      const newValue = textRef.current.textContent || placeholder;
      
      // SECURITY: Validate input before saving
      try {
        // Use appropriate schema based on content length expectation
        const schema = as === 'h1' || as === 'h2' || as === 'h3' ? shortTextSchema : textContentSchema;
        const validated = schema.parse(newValue);
        
        setValue(validated);
        const storageKey = `editable_${id}`;
        localStorage.setItem(storageKey, validated);
        syncContent(storageKey, validated);
        setHasUnsavedChanges(true);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error(`Validation error: ${error.errors[0].message}`);
          // Revert to previous valid value
          if (textRef.current) {
            textRef.current.textContent = value;
          }
        }
      }
    }
  };

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const Component = as;

  return (
    <Component
      ref={textRef as any}
      className={cn(
        className,
        isEditMode && 'cursor-text hover:outline hover:outline-2 hover:outline-primary/50 rounded px-1 transition-all',
        isEditing && 'outline outline-2 outline-primary'
      )}
      contentEditable={isEditMode && isEditing}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onClick={handleClick}
      data-placeholder={placeholder}
    >
      {value}
    </Component>
  );
}
