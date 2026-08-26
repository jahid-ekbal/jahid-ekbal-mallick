import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import Markdown from "@/components/Markdown";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/shadcnui/button";
import { getAllProjects, getProjectBySlug } from "@/lib/data";

export const revalidate = 300;

export function generateStaticParams() {
  return getAllProjects().then((projects) =>
    projects.map((project) => ({ slug: project.slug })),
  );
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
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : undefined,
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
          href={"/projects"}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors">
          <ArrowLeft size={14} /> All projects
        </Link>

        <p className="text-muted-foreground mt-8 text-xs font-medium tracking-wide uppercase">
          {project.category}
        </p>
        <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          {project.summary}
        </p>

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button
                render={
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }>
                Visit site <ArrowUpRight data-icon="inline-end" />
              </Button>
            )}
            {project.repoUrl && (
              <Button
                variant={"outline"}
                render={
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={"Source code on GitHub"}
                  />
                }>
                <GitHubIcon
                  width={16}
                  height={16}
                />{" "}
                Source
              </Button>
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

        {project.coverImage && (
          <div className="border-border relative mt-10 aspect-[16/9] overflow-hidden rounded-xl border">
            <Image
              src={project.coverImage}
              alt={`${project.title} cover`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        )}

        <article className="border-border mt-12 border-t pt-10">
          <Markdown>{project.description}</Markdown>
        </article>
      </section>
    </div>
  );
};

export default ProjectPage;
