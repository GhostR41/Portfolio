import { useState, useEffect } from 'react';
import { LucideIcon, Trash2, Plus } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { Button } from './ui/button';
import { EditableText } from './EditableText';

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: Skill[];
}

interface EditableSkillCategoryProps {
  storageKey: string;
  initialCategories: SkillCategory[];
  icons: Record<string, LucideIcon>;
}

export function EditableSkillCategory({ storageKey, initialCategories, icons }: EditableSkillCategoryProps) {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCategories(JSON.parse(saved));
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(categories));
    syncContent(storageKey, categories);
    setHasUnsavedChanges(true);
  }, [categories, storageKey, setHasUnsavedChanges, syncContent]);

  const addSkillToCategory = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            skills: [...cat.skills, {
              id: `skill_${Date.now()}`,
              name: 'New Skill',
              level: 80
            }]
          }
        : cat
    ));
  };

  const deleteSkill = (categoryId: string, skillId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId
        ? { ...cat, skills: cat.skills.filter(s => s.id !== skillId) }
        : cat
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {categories.map((category) => {
        const Icon = icons[category.icon] || icons.Globe;
        return (
          <div key={category.id} className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-5 h-5 text-primary" />
              <EditableText
                id={`${category.id}_title`}
                initialValue={category.title.toUpperCase()}
                className="text-sm font-bold text-foreground"
                as="h3"
              />
            </div>
            <div className="space-y-4">
              {category.skills.map((skill) => (
                <div key={skill.id} className="group">
                  <div className="flex justify-between text-xs mb-2">
                    <EditableText
                      id={`${skill.id}_name`}
                      initialValue={skill.name}
                      className="text-muted-foreground flex-1"
                      as="span"
                    />
                    <div className="flex items-center gap-2">
                      <EditableText
                        id={`${skill.id}_level`}
                        initialValue={String(skill.level)}
                        className="text-primary font-mono"
                        as="span"
                      />
                      <span className="text-primary">%</span>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSkill(category.id, skill.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 p-0"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
              {isEditMode && (
                <Button
                  onClick={() => addSkillToCategory(category.id)}
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
