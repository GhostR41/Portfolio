import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
  classification?: string;
}

export function DashboardHeader({ 
  title = "PRANJAY SHARMA", 
  classification = "TOP SECRET" 
}: DashboardHeaderProps) {
  const { isOwner, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="tactical-border border-b bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-wider">{title}</h2>
          <p className="text-xs text-primary">CLASSIFICATION: {classification}</p>
        </div>
        
        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <div className="flex items-center gap-2 px-4 py-2 tactical-border rounded bg-card/50">
              <User className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                {isOwner ? "OWNER MODE" : "VIEWER MODE"}
              </span>
            </div>
          )}
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {time.toLocaleDateString()}
            </p>
            <p className="text-lg font-bold text-foreground font-mono">
              {time.toLocaleTimeString()}
            </p>
          </div>

          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
