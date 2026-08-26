import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Project } from "@/lib/data";
import { cn, formatRelativeTime } from "@/lib/utils";

const gradients = [
  "from-blue-500/20 via-indigo-500/10 to-transparent",
  "from-emerald-500/20 via-teal-500/10 to-transparent",
  "from-violet-500/20 via-purple-500/10 to-transparent",
  "from-amber-500/20 via-orange-500/10 to-transparent",
  "from-rose-500/20 via-pink-500/10 to-transparent",
  "from-cyan-500/20 via-sky-500/10 to-transparent",
];

const gradientFor = (slug: string) => {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return gradients[hash % gradients.length];
};

const ProjectCard = ({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) => (
  <Link
    href={`/projects/${project.slug}`}
    className={cn(
      "group border-border bg-card hover:border-ring/50 flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md",
      className,
    )}>
    <div
      className={cn(
        "border-border bg-muted relative aspect-[16/9] w-full overflow-hidden border-b",
        !project.coverImage && "bg-gradient-to-br",
        !project.coverImage && gradientFor(project.slug),
      )}>
      {project.coverImage ?
        <Image
          src={project.coverImage}
          alt={`${project.title} cover`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      : <span className="font-heading text-foreground/15 absolute inset-0 grid place-items-center text-5xl font-semibold select-none">
          {project.title.charAt(0)}
        </span>
      }
    </div>

    <div className="flex flex-1 flex-col gap-2 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {project.category}
        </span>
        <ArrowUpRight
          size={16}
          className="text-muted-foreground translate-x-0.5 -translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
        />
      </div>

      <h3 className="font-heading text-lg font-semibold tracking-tight">
        {project.title}
      </h3>
      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
        {project.summary}
      </p>
      {project.repoUpdatedAt && (
        <p className="text-muted-foreground/80 text-xs">
          Updated {formatRelativeTime(project.repoUpdatedAt)}
        </p>
      )}

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-3">
        {project.techStack.slice(0, 4).map((tech) => (
          <li
            key={tech}
            className="border-border bg-muted/50 text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
            {tech}
          </li>
        ))}
        {project.techStack.length > 4 && (
          <li className="border-border bg-muted/50 text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
            +{project.techStack.length - 4}
          </li>
        )}
      </ul>
    </div>
  </Link>
);

export default ProjectCard;
