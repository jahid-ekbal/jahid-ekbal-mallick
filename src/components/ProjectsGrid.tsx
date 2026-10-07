import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import type { Project } from "@/lib/data";

const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-5">
      {projects.map((project, i) => (
        <Reveal
          key={project.slug}
          delay={(i % 6) * 60}
          className="h-[400px] w-[300px] max-w-full shrink-0">
          <div className="h-full transition-transform duration-200 hover:-translate-y-1">
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
