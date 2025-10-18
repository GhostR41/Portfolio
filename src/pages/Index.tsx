import { TacticalSidebar } from "@/components/TacticalSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminToolbar } from "@/components/AdminToolbar";
import { EditableStatCard } from "@/components/EditableStatCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { TerminalChat } from "@/components/TerminalChat";
import { EditableChart } from "@/components/EditableChart";
import { MissionTable } from "@/components/MissionTable";
import { Users, Target, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isOwner } = useAuth();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminToolbar />
      <TacticalSidebar />
      <div className={`flex-1 ${isOwner ? 'pt-[60px]' : ''}`}>
        <DashboardHeader />
        <main className="p-6 space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EditableStatCard
              id="stat_projects"
              title="COMPLETED PROJECTS"
              value="24"
              icon={Target}
              trend="+3 this month"
            />
            <EditableStatCard
              id="stat_technologies"
              title="TECHNOLOGIES"
              value="15+"
              icon={Shield}
              trend="Continuously expanding"
            />
            <EditableStatCard
              id="stat_experience"
              title="YEARS EXPERIENCE"
              value="5"
              icon={Users}
              trend="Since 2019"
            />
            <EditableStatCard
              id="stat_certifications"
              title="CERTIFICATIONS"
              value="4"
              icon={AlertTriangle}
              trend="AWS, React, Agile"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed />
            <TerminalChat />
          </div>

          {/* Chart */}
          <EditableChart />

          {/* Mission Table */}
          <MissionTable />
        </main>
      </div>
    </div>
  );
};

export default Index;
