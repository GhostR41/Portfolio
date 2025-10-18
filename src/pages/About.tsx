import { TacticalSidebar } from "@/components/TacticalSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminToolbar } from "@/components/AdminToolbar";
import { Shield, Code, Zap, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { EditableText } from "@/components/EditableText";
import { EditableExperience, Experience } from "@/components/EditableExperience";

export default function About() {
  const { isOwner } = useAuth();

  const experiences: Experience[] = [
    {
      id: "exp_1",
      role: "Senior Full Stack Developer",
      org: "Tech Solutions Inc.",
      period: "2022 - Present",
      achievements: [
        "Led development of enterprise-scale SaaS platform",
        "Reduced application load time by 60%",
        "Mentored team of 5 junior developers",
      ],
    },
    {
      id: "exp_2",
      role: "Full Stack Developer",
      org: "Digital Innovations Ltd.",
      period: "2020 - 2022",
      achievements: [
        "Built and deployed 12+ client applications",
        "Implemented automated testing reducing bugs by 40%",
        "Established coding standards and best practices",
      ],
    },
  ];
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminToolbar />
      <TacticalSidebar />
      <div className={`flex-1 ${isOwner ? 'pt-[60px]' : ''}`}>
        <DashboardHeader title="AGENT NETWORK" classification="PERSONNEL FILE" />
        <main className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <EditableText
                id="profile_title"
                initialValue="AGENT PROFILE"
                className="text-xl font-bold text-foreground"
                as="h2"
              />
            </div>
            <div className="space-y-4">
              <div>
                <EditableText
                  id="profile_designation_label"
                  initialValue="DESIGNATION"
                  className="text-xs text-primary mb-2"
                  as="p"
                />
                <EditableText
                  id="profile_designation"
                  initialValue="Full Stack Developer"
                  className="text-lg text-foreground"
                  as="p"
                />
              </div>
              <div>
                <EditableText
                  id="profile_specialization_label"
                  initialValue="SPECIALIZATION"
                  className="text-xs text-primary mb-2"
                  as="p"
                />
                <EditableText
                  id="profile_specialization"
                  initialValue="React.js • Node.js • TypeScript • Database Architecture"
                  className="text-foreground"
                  as="p"
                />
              </div>
              <div>
                <EditableText
                  id="profile_mission_label"
                  initialValue="MISSION STATEMENT"
                  className="text-xs text-primary mb-2"
                  as="p"
                />
                <EditableText
                  id="profile_mission"
                  initialValue="Specialized agent in developing mission-critical web applications with focus on user experience, performance optimization, and scalable architecture. Expertise in transforming complex requirements into tactical solutions that deliver measurable results."
                  className="text-muted-foreground leading-relaxed"
                  as="p"
                />
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="tactical-border rounded bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                <EditableText
                  id="arsenal_title"
                  initialValue="TECHNICAL ARSENAL"
                  className="text-sm font-bold text-foreground"
                  as="h3"
                />
              </div>
              <div className="space-y-3">
                {[
                  { id: "tech_1", skill: "Frontend Development", level: 95 },
                  { id: "tech_2", skill: "Backend Systems", level: 90 },
                  { id: "tech_3", skill: "Database Management", level: 85 },
                  { id: "tech_4", skill: "UI/UX Design", level: 80 },
                ].map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <EditableText
                        id={`${item.id}_name`}
                        initialValue={item.skill}
                        className="text-muted-foreground"
                        as="span"
                      />
                      <span className="text-primary">{item.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tactical-border rounded bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <EditableText
                  id="competencies_title"
                  initialValue="CORE COMPETENCIES"
                  className="text-sm font-bold text-foreground"
                  as="h3"
                />
              </div>
              <div className="space-y-2">
                {[
                  { id: "comp_1", text: "Agile Development Methodologies" },
                  { id: "comp_2", text: "RESTful API Architecture" },
                  { id: "comp_3", text: "Cloud Services Integration" },
                  { id: "comp_4", text: "Performance Optimization" },
                  { id: "comp_5", text: "Security Best Practices" },
                  { id: "comp_6", text: "CI/CD Pipeline Management" },
                ].map((competency) => (
                  <div key={competency.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                    <EditableText
                      id={competency.id}
                      initialValue={competency.text}
                      className="text-xs text-muted-foreground"
                      as="span"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-primary" />
              <EditableText
                id="mission_history_title"
                initialValue="MISSION HISTORY"
                className="text-xl font-bold text-foreground"
                as="h2"
              />
            </div>
            <EditableExperience
              storageKey="mission_history"
              initialExperiences={experiences}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
