import Link from "next/link";
import { Plus } from "lucide-react";

import prisma from "@/lib/dbClient/prisma";
import { buttonVariants } from "@/components/shadcnui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import { Badge } from "@/components/shadcnui/badge";
import { GithubImportForm } from "@/components/admin/GithubImportForm";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      featured: true,
      published: true,
      sortOrder: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">
            Import from GitHub or create manually.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className={buttonVariants({ className: "group" })}>
          New project
          <Plus
            data-icon="inline-end"
            className="transition-transform duration-200 group-hover:rotate-90"
          />
        </Link>
      </div>

      <GithubImportForm />

      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link
                    href={`/admin/projects/${project.id}` as never}
                    className="hover:underline">
                    {project.title}
                  </Link>
                  {project.featured && (
                    <Badge
                      variant="outline"
                      className="ml-2">
                      featured
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.sortOrder}</TableCell>
                <TableCell>
                  <Badge variant={project.published ? "default" : "secondary"}>
                    {project.published ? "published" : "draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ProjectRowActions
                    id={project.id}
                    published={project.published}
                  />
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground">
                  No projects yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
