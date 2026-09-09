import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import Markdown from "@/components/Markdown";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { GitHubIcon } from "@/components/icons";
import { buttonVariants } from "@/components/shadcnui/button";
import { getAllProjects, getProjectBySlug } from "@/lib/data";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: `/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

const ProjectPage = async (props: PageProps<"/projects/[slug]">) => {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <Link
          href="/projects"
          prefetch={false}
          className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors">
          <ArrowLeft
            size={14}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />{" "}
          All projects
        </Link>

        <Reveal>
          <p className="text-muted-foreground mt-8 text-xs font-medium tracking-wide uppercase">
            {project.category}
          </p>
          <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            {project.summary}
          </p>
        </Reveal>

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "default", size: "sm" })}>
                Visit site
                <ArrowUpRight />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Source code on GitHub"
                className={buttonVariants({ variant: "outline", size: "sm" })}>
                <GitHubIcon
                  width={16}
                  height={16}
                />{" "}
                Source
              </a>
            )}
          </div>
        )}

        {project.techStack.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li
                key={tech}
                className="border-border bg-muted/50 text-muted-foreground rounded-full border px-3 py-1 text-xs">
                {tech}
              </li>
            ))}
          </ul>
        )}

        <TiltCard className="border-border bg-muted relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl border">
          <span className="font-heading text-foreground/15 absolute inset-0 grid place-items-center text-5xl font-semibold select-none">
            {project.title.charAt(0)}
          </span>
        </TiltCard>

        <article className="border-border mt-12 border-t pt-10">
          <Markdown>{project.description}</Markdown>
        </article>
      </section>
    </div>
  );
};

export default ProjectPage;
