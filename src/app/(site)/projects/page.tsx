import ProjectsGrid from "@/components/ProjectsGrid";
import Reveal from "@/components/Reveal";
import SkillsSection from "@/components/SkillsSection";
import { getAllProjects, getProfile } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata(
  "Projects",
  `Projects built by ${site.name}: full-stack apps, tools, and experiments.`,
  "/projects",
);

const ProjectsPage = () => {
  const projects = getAllProjects();
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="min-h-[70svh] py-14 sm:py-16">
        <Reveal>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Projects
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            Things I have designed, built, and shipped. Each one taught me
            something new.
          </p>
        </Reveal>

        <div className="mt-10">
          <SkillsSection skills={profile.skills} />
          <ProjectsGrid projects={projects} />
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
