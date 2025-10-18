import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { Button } from './ui/button';
import { EditableText } from './EditableText';

export interface Experience {
  id: string;
  role: string;
  org: string;
  period: string;
  achievements: string[];
}

interface EditableExperienceProps {
  storageKey: string;
  initialExperiences: Experience[];
}

export function EditableExperience({ storageKey, initialExperiences }: EditableExperienceProps) {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setExperiences(JSON.parse(saved));
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(experiences));
    syncContent(storageKey, experiences);
    setHasUnsavedChanges(true);
  }, [experiences, storageKey, setHasUnsavedChanges, syncContent]);

  const addNewExperience = () => {
    const newExp: Experience = {
      id: `exp_${Date.now()}`,
      role: 'New Role',
      org: 'Organization',
      period: '2024 - Present',
      achievements: ['Achievement 1', 'Achievement 2'],
    };
    setExperiences([...experiences, newExp]);
  };

  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addAchievement = (expId: string) => {
    setExperiences(experiences.map(exp =>
      exp.id === expId
        ? { ...exp, achievements: [...exp.achievements, 'New achievement'] }
        : exp
    ));
  };

  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="border-l-2 border-primary pl-4 group relative">
          {isEditMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteExperience(exp.id)}
              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
          
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <EditableText
                id={`${exp.id}_role`}
                initialValue={exp.role}
                className="text-foreground font-bold"
                as="h3"
              />
              <EditableText
                id={`${exp.id}_org`}
                initialValue={exp.org}
                className="text-xs text-primary"
                as="p"
              />
            </div>
            <EditableText
              id={`${exp.id}_period`}
              initialValue={exp.period}
              className="text-xs text-muted-foreground"
              as="span"
            />
          </div>
          
          <ul className="space-y-1">
            {exp.achievements.map((achievement, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">▸</span>
                <EditableText
                  id={`${exp.id}_achievement_${i}`}
                  initialValue={achievement}
                  className="text-xs text-muted-foreground flex-1"
                  as="span"
                />
              </li>
            ))}
          </ul>
          
          {isEditMode && (
            <Button
              onClick={() => addAchievement(exp.id)}
              variant="ghost"
              size="sm"
              className="mt-2 text-primary"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Achievement
            </Button>
          )}
        </div>
      ))}
      
      {isEditMode && (
        <Button
          onClick={addNewExperience}
          variant="outline"
          size="sm"
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      )}
    </div>
  );
}
