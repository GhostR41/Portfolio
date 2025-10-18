import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="tactical-border rounded bg-card p-6 hover:bg-card/80 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && <p className="text-xs text-primary mt-2">{trend}</p>}
        </div>
        <div className="bg-primary/10 p-3 rounded">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
