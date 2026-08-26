"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { projectSchema, type ProjectFormValues } from "@/lib/zodSchema";
import { saveProject } from "@/server/actions/admin/projects";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { Switch } from "@/components/shadcnui/switch";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { toast } from "@/components/shadcnui/toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export type ProjectFormInitial = {
  id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  coverImage?: string | null;
  techStackJoined?: string;
  category?: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  published?: boolean;
};

export function ProjectForm({ initial }: { initial?: ProjectFormInitial }) {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: initial?.id,
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      summary: initial?.summary ?? "",
      description: initial?.description ?? "",
      coverImage: initial?.coverImage ?? "",
      techStack: initial?.techStackJoined ?? "",
      category: initial?.category ?? "General",
      repoUrl: initial?.repoUrl ?? "",
      liveUrl: initial?.liveUrl ?? "",
      featured: initial?.featured ?? false,
      published: initial?.published ?? true,
    },
    mode: "all",
  });

  async function onSubmit(values: ProjectFormValues) {
    const result = await saveProject(values);
    if (!result.ok) {
      toast.add({
        type: "error",
        title: "Could not save project",
        description: result.error,
      });
      return;
    }
    toast.add({
      type: "success",
      title: "Project saved",
    });
    router.push("/admin/projects" as Route);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="slug"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Slug (auto if empty)</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Category</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="techStack"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Tech stack (comma separated)
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                placeholder="Next.js, TypeScript, Prisma"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="repoUrl"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Repo URL (https)</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="liveUrl"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Live URL (https)</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="coverImage"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Cover image URL</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="summary"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              id={field.name}
              rows={2}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description (markdown)</FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              id={field.name}
              rows={12}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex flex-wrap gap-6">
        <Controller
          name="published"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Published
            </label>
          )}
        />
        <Controller
          name="featured"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Featured
            </label>
          )}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}>
          {isSubmitting ?
            <>
              Saving...
              <Loader2
                data-icon="inline-end"
                className="animate-spin"
              />
            </>
          : <>
              Save project
              <Save
                data-icon="inline-end"
                className="transition-transform duration-200 group-hover/button:not-disabled:translate-x-0.5"
              />
            </>
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects" as Route)}>
          Cancel
          <ArrowLeft
            data-icon="inline-end"
            className="transition-transform duration-200 group-hover/button:not-disabled:-translate-x-0.5"
          />
        </Button>
      </div>
    </form>
  );
}
