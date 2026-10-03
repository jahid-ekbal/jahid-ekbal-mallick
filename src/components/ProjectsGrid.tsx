"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );
  const [active, setActive] = useState("All");
  const [pending, startTransition] = useTransition();

  const visible =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter projects by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={active === category}
            onClick={() => startTransition(() => setActive(category))}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
              active === category ?
                "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-ring/50 hover:text-foreground",
            )}>
            {category}
          </button>
        ))}
        {pending && (
          <span
            role="status"
            aria-label="Filtering projects"
            className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
            <Loader2
              size={14}
              className="animate-spin"
            />
            Filtering
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <Reveal
            key={project.slug}
            delay={(i % 6) * 60}>
            <div className="transition-transform duration-200 hover:-translate-y-1">
              <ProjectCard project={project} />
            </div>
          </Reveal>
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
