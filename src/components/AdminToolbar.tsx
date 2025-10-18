import { useAuth } from "@/contexts/AuthContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { Button } from "@/components/ui/button";
import { Edit3, Eye, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function AdminToolbar() {
  const { isOwner, logout } = useAuth();
  const { isEditMode, toggleEditMode, isPreviewMode, togglePreviewMode, hasUnsavedChanges, saveChanges } = useEditMode();
  const navigate = useNavigate();

  if (!isOwner) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b tactical-border">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground tracking-wider">PRANJAY SHARMA</h1>
        </div>

        {/* Center: Mode Indicator */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
            OWNER MODE
          </Badge>
          {isEditMode && (
            <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/50">
              EDIT MODE ACTIVE
            </Badge>
          )}
          {isPreviewMode && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              PREVIEW MODE
            </Badge>
          )}
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              UNSAVED CHANGES
            </Badge>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleEditMode}
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {isEditMode ? "EXIT EDIT" : "EDIT MODE"}
          </Button>
          
          <Button
            onClick={togglePreviewMode}
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            PREVIEW
          </Button>

          {hasUnsavedChanges && (
            <Button
              onClick={saveChanges}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              SAVE
            </Button>
          )}

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </Button>
        </div>
      </div>
    </div>
  );
}
