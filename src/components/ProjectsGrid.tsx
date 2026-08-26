"use client";

import { useMemo, useState } from "react";

import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <div
        className="flex flex-wrap gap-2"
        role={"tablist"}
        aria-label={"Filter projects by category"}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            role={"tab"}
            aria-selected={active === category}
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
              active === category ?
                "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-ring/50 hover:text-foreground",
            )}>
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-muted-foreground mt-12 text-center">
          No projects in this category yet.
        </p>
      )}
    </>
  );
};

export default ProjectsGrid;
