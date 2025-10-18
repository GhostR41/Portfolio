import { TacticalSidebar } from "@/components/TacticalSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminToolbar } from "@/components/AdminToolbar";
import { Code, Database, Globe, Wrench, Brain, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { EditableSkillCategory, SkillCategory } from "@/components/EditableSkillCategory";
import { EditableText } from "@/components/EditableText";

const skillCategories: SkillCategory[] = [
  {
    id: "cat_frontend",
    title: "Frontend Development",
    icon: "Globe",
    skills: [
      { id: "skill_react", name: "React.js", level: 95 },
      { id: "skill_typescript", name: "TypeScript", level: 90 },
      { id: "skill_tailwind", name: "Tailwind CSS", level: 95 },
      { id: "skill_nextjs", name: "Next.js", level: 85 },
      { id: "skill_vuejs", name: "Vue.js", level: 75 },
    ],
  },
  {
    id: "cat_backend",
    title: "Backend Development",
    icon: "Database",
    skills: [
      { id: "skill_nodejs", name: "Node.js", level: 90 },
      { id: "skill_express", name: "Express.js", level: 90 },
      { id: "skill_python", name: "Python", level: 80 },
      { id: "skill_postgresql", name: "PostgreSQL", level: 85 },
      { id: "skill_mongodb", name: "MongoDB", level: 85 },
    ],
  },
  {
    id: "cat_tools",
    title: "Development Tools",
    icon: "Wrench",
    skills: [
      { id: "skill_git", name: "Git & GitHub", level: 95 },
      { id: "skill_docker", name: "Docker", level: 80 },
      { id: "skill_aws", name: "AWS", level: 75 },
      { id: "skill_cicd", name: "CI/CD", level: 85 },
      { id: "skill_jest", name: "Testing (Jest)", level: 85 },
    ],
  },
  {
    id: "cat_soft",
    title: "Soft Skills",
    icon: "Brain",
    skills: [
      { id: "skill_problem", name: "Problem Solving", level: 95 },
      { id: "skill_leadership", name: "Team Leadership", level: 85 },
      { id: "skill_communication", name: "Communication", level: 90 },
      { id: "skill_agile", name: "Agile/Scrum", level: 90 },
      { id: "skill_review", name: "Code Review", level: 90 },
    ],
  },
];

const iconMap = { Code, Database, Globe, Wrench, Brain, Shield };

const certifications = [
  { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2023" },
  { name: "React Advanced Patterns", issuer: "Frontend Masters", year: "2023" },
  { name: "Full Stack Web Development", issuer: "Udacity", year: "2022" },
  { name: "Agile Project Management", issuer: "Scrum Alliance", year: "2022" },
];

export default function Skills() {
  const { isOwner } = useAuth();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminToolbar />
      <TacticalSidebar />
      <div className={`flex-1 ${isOwner ? 'pt-[60px]' : ''}`}>
        <DashboardHeader title="INTELLIGENCE" classification="CAPABILITY ASSESSMENT" />
        <main className="p-6 space-y-6">
          {/* Skills Grid */}
          <EditableSkillCategory
            storageKey="skills_categories"
            initialCategories={skillCategories}
            icons={iconMap}
          />

          {/* Technologies */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">TECHNOLOGY STACK</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "React", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Express",
                "Next.js", "Tailwind", "Docker", "AWS", "Git", "Jest",
                "Redux", "GraphQL", "REST API", "Webpack", "Vite", "Python",
              ].map((tech) => (
                <div
                  key={tech}
                  className="tactical-border rounded bg-card/50 p-3 text-center hover:bg-primary/10 transition-all"
                >
                  <span className="text-xs text-foreground">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">CERTIFICATIONS & TRAINING</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-4">
                  <h3 className="text-foreground font-bold text-sm">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-primary mt-1">{cert.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="tactical-border rounded bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">CURRENT TRAINING</h2>
            </div>
            <div className="space-y-4">
              {[
                { course: "Advanced System Design", progress: 75 },
                { course: "Machine Learning Fundamentals", progress: 45 },
                { course: "Microservices Architecture", progress: 60 },
              ].map((item) => (
                <div key={item.course}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground">{item.course}</span>
                    <span className="text-primary font-mono">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
