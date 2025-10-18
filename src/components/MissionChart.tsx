import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "Jan", projects: 2 },
  { month: "Feb", projects: 3 },
  { month: "Mar", projects: 4 },
  { month: "Apr", projects: 3 },
  { month: "May", projects: 5 },
  { month: "Jun", projects: 6 },
];

export function MissionChart() {
  return (
    <div className="tactical-border rounded bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground">PROJECT ACTIVITY OVERVIEW</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,53,0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))" 
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="projects" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
