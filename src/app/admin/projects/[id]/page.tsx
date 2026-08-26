import { notFound } from "next/navigation";

import prisma from "@/lib/dbClient/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const techStack = JSON.parse(project.techStack) as string[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit: {project.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          /projects/{project.slug}
        </p>
      </div>
      <ProjectForm
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description,
          coverImage: project.coverImage,
          techStackJoined: techStack.join(", "),
          category: project.category,
          repoUrl: project.repoUrl,
          liveUrl: project.liveUrl,
          featured: project.featured,
          published: project.published,
        }}
      />
    </div>
  );
}
