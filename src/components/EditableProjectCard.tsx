import { useState, useEffect } from 'react';
import { ExternalLink, Github, Zap, Trash2, Plus } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentSync } from '@/contexts/ContentSyncContext';
import { Button } from './ui/button';
import { EditableText } from './EditableText';

export interface Project {
  id: string;
  name: string;
  tech: string;
  status: string;
  description: string;
  link: string | null;
  github: string | null;
}

interface EditableProjectCardProps {
  storageKey: string;
  initialProjects: Project[];
}

export function EditableProjectCard({ storageKey, initialProjects }: EditableProjectCardProps) {
  const { isEditMode, setHasUnsavedChanges } = useEditMode();
  const { syncContent } = useContentSync();
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsedProjects = JSON.parse(saved);
      // Sync individual EditableText fields with project data
      parsedProjects.forEach((project: Project) => {
        const savedLink = localStorage.getItem(`${project.id}_link`);
        const savedGithub = localStorage.getItem(`${project.id}_github`);
        if (savedLink) project.link = savedLink;
        if (savedGithub) project.github = savedGithub;
      });
      setProjects(parsedProjects);
    }
  }, [storageKey]);

  useEffect(() => {
    // Update project links from EditableText localStorage values
    const updatedProjects = projects.map(project => {
      const savedLink = localStorage.getItem(`${project.id}_link`);
      const savedGithub = localStorage.getItem(`${project.id}_github`);
      return {
        ...project,
        link: savedLink || project.link,
        github: savedGithub || project.github,
      };
    });
    localStorage.setItem(storageKey, JSON.stringify(updatedProjects));
    syncContent(storageKey, updatedProjects);
    setHasUnsavedChanges(true);
  }, [projects, storageKey, setHasUnsavedChanges, syncContent]);

  const addNewProject = () => {
    const newProject: Project = {
      id: `OP-${Date.now()}`,
      name: 'New Project',
      tech: 'Technology Stack',
      status: 'Active',
      description: 'Project description here',
      link: null,
      github: null,
    };
    setProjects([...projects, newProject]);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'deployed':
      case 'completed':
        return 'text-green-500';
      case 'active':
      case 'development':
        return 'text-primary';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="tactical-border rounded bg-card p-6 hover:bg-card/80 transition-all group relative">
          {isEditMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteProject(project.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <EditableText
                  id={`${project.id}_id`}
                  initialValue={project.id}
                  className="text-xs text-primary font-mono"
                  as="span"
                />
                <EditableText
                  id={`${project.id}_status`}
                  initialValue={project.status.toUpperCase()}
                  className={`text-xs font-bold ${getStatusColor(project.status)}`}
                  as="span"
                />
              </div>
              <EditableText
                id={`${project.id}_name`}
                initialValue={project.name}
                className="text-lg font-bold text-foreground"
                as="h3"
              />
            </div>
            <Zap className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>

          <EditableText
            id={`${project.id}_tech`}
            initialValue={project.tech}
            className="text-xs text-primary mb-3 font-mono"
            as="p"
          />
          <EditableText
            id={`${project.id}_description`}
            initialValue={project.description}
            className="text-sm text-muted-foreground mb-4 leading-relaxed"
            as="p"
          />

          <div className="space-y-2 mb-4">
            {isEditMode && (
              <>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Live URL:</label>
                  <EditableText
                    id={`${project.id}_link`}
                    initialValue={project.link || 'https://'}
                    className="text-xs font-mono text-foreground block"
                    as="p"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">GitHub URL:</label>
                  <EditableText
                    id={`${project.id}_github`}
                    initialValue={project.github || 'https://github.com/'}
                    className="text-xs font-mono text-foreground block"
                    as="p"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {project.link && project.link !== 'https://' && (
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary/30 hover:bg-primary/10"
                asChild
              >
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Live
                </a>
              </Button>
            )}
            {project.github && project.github !== 'https://github.com/' && (
              <Button
                variant="outline"
                size="sm"
                className="text-foreground border-primary/30 hover:bg-primary/10"
                asChild
              >
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-3 h-3 mr-1" />
                  Source
                </a>
              </Button>
            )}
          </div>
        </div>
      ))}
      
      {isEditMode && (
        <div className="tactical-border rounded bg-card p-6 border-dashed flex items-center justify-center min-h-[200px]">
          <Button
            onClick={addNewProject}
            variant="outline"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Project
          </Button>
        </div>
      )}
    </div>
  );
}
