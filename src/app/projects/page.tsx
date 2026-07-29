import { ProjectsSection } from "@/components/ProjectsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Jahid Ekbal Mallick",
  description:
    "Showcasing engineering projects: REGIX AI, Smart Home AC Controller, Windows System Optimizer, and more.",
};

const ProjectsPage = () => {
  return <ProjectsSection />;
};

export default ProjectsPage;
