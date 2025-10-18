import { LucideIcon } from "lucide-react";
import { EditableText } from "./EditableText";

interface EditableStatCardProps {
  id: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export function EditableStatCard({ id, title, value, icon: Icon, trend }: EditableStatCardProps) {
  return (
    <div className="tactical-border rounded bg-card p-6 hover:bg-card/80 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <EditableText 
            id={`${id}_title`}
            initialValue={title}
            className="text-xs text-muted-foreground mb-2"
            as="p"
          />
          <EditableText 
            id={`${id}_value`}
            initialValue={String(value)}
            className="text-3xl font-bold text-foreground"
            as="p"
          />
          {trend && (
            <EditableText 
              id={`${id}_trend`}
              initialValue={trend}
              className="text-xs text-primary mt-2"
              as="p"
            />
          )}
        </div>
        <div className="bg-primary/10 p-3 rounded">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
