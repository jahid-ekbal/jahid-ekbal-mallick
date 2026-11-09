import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import type { Project } from "@/lib/data";

const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground mt-8 rounded-xl border border-dashed p-8 text-center text-sm">
        No projects to show yet. Open the source on GitHub, or start from the
        resume for study background.
      </p>
    );
  }
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <Reveal
          key={project.slug}
          delay={(i % 6) * 60}
          className="h-full">
          <div className="flex h-full transition-transform duration-200 motion-safe:hover:-translate-y-1">
            <ProjectCard
              project={project}
              className="h-full w-full"
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default ProjectsGrid;
