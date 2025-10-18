import { useState, useEffect } from 'react';
import { LucideIcon, Trash2, Plus } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { Button } from './ui/button';
import { EditableText } from './EditableText';

export interface ContactInfoItem {
  id: string;
  icon: string;
  label: string;
  value: string;
  link: string | null;
}

interface EditableContactInfoProps {
  storageKey: string;
  initialItems: ContactInfoItem[];
  icons: Record<string, LucideIcon>;
}

export function EditableContactInfo({ storageKey, initialItems, icons }: EditableContactInfoProps) {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [items, setItems] = useState<ContactInfoItem[]>(initialItems);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
    syncContent(storageKey, items);
    setHasUnsavedChanges(true);
  }, [items, storageKey, setHasUnsavedChanges, syncContent]);

  const addNewItem = () => {
    const newItem: ContactInfoItem = {
      id: `contact_${Date.now()}`,
      icon: 'Mail',
      label: 'New Contact',
      value: 'Click to edit',
      link: null,
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ContactInfoItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-4">
      {items.map((info) => {
        const Icon = icons[info.icon] || icons.Mail;
        return (
          <div key={info.id} className="flex items-start gap-3 group">
            <Icon className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <EditableText
                id={`${info.id}_label`}
                initialValue={info.label}
                className="text-xs text-muted-foreground"
                as="p"
              />
              {info.link ? (
                <a
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  <EditableText
                    id={`${info.id}_value`}
                    initialValue={info.value}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                    as="span"
                  />
                </a>
              ) : (
                <EditableText
                  id={`${info.id}_value`}
                  initialValue={info.value}
                  className="text-sm text-foreground"
                  as="p"
                />
              )}
            </div>
            {isEditMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteItem(info.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        );
      })}
      {isEditMode && (
        <Button
          onClick={addNewItem}
          variant="outline"
          size="sm"
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact Info
        </Button>
      )}
    </div>
  );
}
