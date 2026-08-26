import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
        <p className="text-muted-foreground text-sm">
          Published projects appear on /projects immediately after saving.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
