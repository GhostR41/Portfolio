import { Shield, Users, Target, Brain, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { title: "Command Center", icon: Shield, path: "/" },
  { title: "Agent Network", icon: Users, path: "/about" },
  { title: "Operations", icon: Target, path: "/projects" },
  { title: "Intelligence", icon: Brain, path: "/skills" },
  { title: "Systems", icon: Settings, path: "/contact" },
];

export function TacticalSidebar() {
  return (
    <aside className="w-64 bg-card tactical-border border-r min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground">TACTICAL OPS</h1>
            <p className="text-xs text-muted-foreground">v3.7.2</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary tactical-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 p-4 tactical-border rounded bg-card/50">
          <p className="text-xs text-muted-foreground mb-2">SYSTEM STATUS</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
            <span className="text-xs text-foreground">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
