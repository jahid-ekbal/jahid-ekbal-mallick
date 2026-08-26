import ProjectsGrid from "@/components/ProjectsGrid";
import { getAllProjects } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const revalidate = 300;

export const metadata = pageMetadata(
  "Projects",
  `Projects built by ${site.name}: full-stack apps, tools, and experiments.`,
  "/projects",
);

const ProjectsPage = async () => {
  const projects = await getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="py-16 sm:py-20">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          Things I have designed, built, and shipped. Each one taught me
          something new.
        </p>

        <div className="mt-10">
          <ProjectsGrid projects={projects} />
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
