import { FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const projects = [
  { id: "PRJ-2401", name: "E-Commerce Platform", tech: "React • Node.js", status: "Deployed", year: "2024" },
  { id: "PRJ-2402", name: "Analytics Dashboard", tech: "TypeScript • PostgreSQL", status: "Active", year: "2024" },
  { id: "PRJ-2403", name: "Task Management System", tech: "Next.js • MongoDB", status: "Active", year: "2023" },
  { id: "PRJ-2404", name: "Social Media App", tech: "React Native • AWS", status: "Development", year: "2024" },
  { id: "PRJ-2405", name: "Portfolio Website", tech: "React • Tailwind", status: "Deployed", year: "2024" },
];

export function MissionTable() {
  const statusColors = {
    Active: "text-primary",
    Deployed: "text-green-500",
    Development: "text-yellow-500",
  };

  return (
    <div className="tactical-border rounded bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground">PROJECT INFORMATION</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-primary/30 hover:bg-transparent">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Project</TableHead>
              <TableHead className="text-muted-foreground">Technologies</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="border-primary/30 hover:bg-muted/50">
                <TableCell className="font-mono text-xs text-primary">{project.id}</TableCell>
                <TableCell className="text-sm text-foreground">{project.name}</TableCell>
                <TableCell className="text-sm text-primary">{project.tech}</TableCell>
                <TableCell className={`text-sm font-bold ${statusColors[project.status as keyof typeof statusColors]}`}>
                  {project.status}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{project.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
