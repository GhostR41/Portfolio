import { TacticalSidebar } from "@/components/TacticalSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminToolbar } from "@/components/AdminToolbar";
import { Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { EditableProjectCard, Project } from "@/components/EditableProjectCard";
import { EditableText } from "@/components/EditableText";

const projects: Project[] = [
  {
    id: "OP-2401",
    name: "E-Commerce Platform",
    tech: "React • Node.js • MongoDB",
    status: "Deployed",
    description: "Full-stack e-commerce solution with payment integration, inventory management, and analytics dashboard.",
    link: "https://example.com",
    github: "https://github.com/yourusername/project1",
  },
  {
    id: "OP-2402",
    name: "Task Management System",
    tech: "TypeScript • Express • PostgreSQL",
    status: "Active",
    description: "Collaborative project management tool with real-time updates, team collaboration features, and advanced reporting.",
    link: "https://example.com",
    github: "https://github.com/yourusername/project2",
  },
  {
    id: "OP-2403",
    name: "Analytics Dashboard",
    tech: "React • Chart.js • Firebase",
    status: "Completed",
    description: "Real-time data visualization dashboard with customizable widgets and automated reporting capabilities.",
    link: "https://example.com",
    github: "https://github.com/yourusername/project3",
  },
  {
    id: "OP-2404",
    name: "Social Media App",
    tech: "Next.js • Prisma • AWS",
    status: "Development",
    description: "Modern social networking platform with messaging, content sharing, and community features.",
    link: null,
    github: "https://github.com/yourusername/project4",
  },
];

export default function Projects() {
  const { isOwner } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminToolbar />
      <TacticalSidebar />
      <div className={`flex-1 ${isOwner ? 'pt-[60px]' : ''}`}>
        <DashboardHeader title="OPERATIONS" classification="PROJECT ARCHIVE" />
        <main className="p-6 space-y-6">
          {/* Projects Grid */}
          <EditableProjectCard
            storageKey="projects_list"
            initialProjects={projects}
          />

          {/* Featured Project */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-primary" />
              <EditableText
                id="featured_title"
                initialValue="FEATURED OPERATION"
                className="text-xl font-bold text-foreground"
                as="h2"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <EditableText
                  id="featured_name"
                  initialValue="Project Showcase Platform"
                  className="text-lg font-bold text-foreground mb-2"
                  as="h3"
                />
                <EditableText
                  id="featured_tech"
                  initialValue="React • TypeScript • Tailwind CSS"
                  className="text-xs text-primary mb-3 font-mono"
                  as="p"
                />
                <EditableText
                  id="featured_description"
                  initialValue="A comprehensive portfolio and project showcase platform featuring advanced filtering, real-time search, and interactive demonstrations. Built with modern web technologies and optimized for performance across all devices."
                  className="text-sm text-muted-foreground mb-4 leading-relaxed"
                  as="p"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <EditableText
                      id="featured_feature_1"
                      initialValue="Responsive Design System"
                      className="text-xs text-muted-foreground"
                      as="span"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <EditableText
                      id="featured_feature_2"
                      initialValue="Dark Mode Support"
                      className="text-xs text-muted-foreground"
                      as="span"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <EditableText
                      id="featured_feature_3"
                      initialValue="SEO Optimized"
                      className="text-xs text-muted-foreground"
                      as="span"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-muted/20 rounded p-4 flex items-center justify-center border border-primary/20">
                <EditableText
                  id="featured_placeholder"
                  initialValue="[Project Screenshot/Demo]"
                  className="text-xs text-muted-foreground text-center"
                  as="p"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
