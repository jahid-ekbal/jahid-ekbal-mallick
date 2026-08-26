"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { githubImportSchema, type GithubImportValues } from "@/lib/zodSchema";
import { importGithubProject } from "@/server/actions/admin/projects";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { toast } from "@/components/shadcnui/toast";
import { Download, Loader2 } from "lucide-react";

export function GithubImportForm() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<GithubImportValues>({
    resolver: zodResolver(githubImportSchema),
    defaultValues: { repo: "", category: "" },
    mode: "all",
  });

  async function onSubmit(values: GithubImportValues) {
    const result = await importGithubProject(values);
    if (!result.ok) {
      toast.add({
        type: "error",
        title: "Import failed",
        description: result.error,
      });
      return;
    }
    toast.add({
      type: "success",
      title: "Project imported",
      description: "Fill in the remaining details and save.",
    });
    reset();
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Import from GitHub</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <Controller
            name="repo"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="flex-1"
                data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Repo URL or owner/name
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="https://github.com/owner/repo"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Field className="sm:w-44">
                <FieldLabel htmlFor={field.name}>Category override</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="optional"
                />
              </Field>
            )}
          />
          <div className="sm:pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full">
              {isSubmitting ?
                <>
                  Importing...
                  <Loader2
                    data-icon="inline-end"
                    className="animate-spin"
                  />
                </>
              : <>
                  Import
                  <Download
                    data-icon="inline-end"
                    className="transition-transform duration-200 group-hover/button:not-disabled:translate-y-0.5"
                  />
                </>
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
