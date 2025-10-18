import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface ActivityItem {
  id: number;
  project: string;
  action: string;
  timestamp: Date;
  status: "success" | "warning" | "info";
}

const initialActivities: ActivityItem[] = [
  { id: 1, project: "E-Commerce Platform", action: "Deployment successful", timestamp: new Date(), status: "success" },
  { id: 2, project: "Analytics Dashboard", action: "New feature implemented", timestamp: new Date(), status: "info" },
  { id: 3, project: "Task Manager", action: "Performance optimization in progress", timestamp: new Date(), status: "warning" },
  { id: 4, project: "Social Media App", action: "Code review completed", timestamp: new Date(), status: "success" },
];

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      const projects = ["Portfolio Site", "API Gateway", "Mobile App", "Dashboard UI"];
      const actions = [
        "Build successful",
        "Tests passed",
        "Dependencies updated",
        "New commit pushed",
        "Feature deployed",
        "Bug fix applied",
      ];
      const newActivity: ActivityItem = {
        id: Date.now(),
        project: projects[Math.floor(Math.random() * projects.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: new Date(),
        status: ["success", "warning", "info"][Math.floor(Math.random() * 3)] as ActivityItem["status"],
      };
      setActivities((prev) => [newActivity, ...prev.slice(0, 7)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    success: "text-primary",
    warning: "text-yellow-500",
    info: "text-blue-400",
  };

  return (
    <div className="tactical-border rounded bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground">ACTIVITY LOG</h3>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="slide-up border-l-2 border-primary/30 pl-3 py-2">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-sm font-bold ${statusColors[activity.status]}`}>
                  {activity.project}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{activity.action}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {activity.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
