"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { postSchema, type PostFormValues } from "@/lib/zodSchema";
import { savePost } from "@/server/actions/admin/posts";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { toast } from "@/components/shadcnui/toast";
import { ArrowLeft, FileText, Globe, Loader2 } from "lucide-react";

export type PostFormInitial = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  tagsJoined?: string;
};

export function PostForm({ initial }: { initial?: PostFormInitial }) {
  const router = useRouter();
  const [publishIntent, setPublishIntent] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: initial?.id,
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      excerpt: initial?.excerpt ?? "",
      content: initial?.content ?? "",
      coverImage: initial?.coverImage ?? "",
      tags: initial?.tagsJoined ?? "",
      status: "DRAFT",
    },
    mode: "all",
  });

  async function onSubmit(values: PostFormValues) {
    const result = await savePost({
      ...values,
      status: publishIntent ? "PUBLISHED" : "DRAFT",
    });
    if (!result.ok) {
      toast.add({
        type: "error",
        title: "Could not save post",
        description: result.error,
      });
      return;
    }
    toast.add({
      type: "success",
      title: publishIntent ? "Post published" : "Draft saved",
    });
    router.push("/admin/posts" as Route);
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
          name="tags"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Tags (comma separated)
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                placeholder="nextjs, tutorial, ai"
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
        name="excerpt"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Excerpt</FieldLabel>
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
        name="content"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Content (markdown)</FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              id={field.name}
              rows={18}
              className="font-mono text-sm"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => setPublishIntent(false)}>
          {isSubmitting ?
            <>
              Saving...
              <Loader2
                data-icon="inline-end"
                className="animate-spin"
              />
            </>
          : <>
              Save as draft
              <FileText
                data-icon="inline-end"
                className="transition-transform duration-200 group-hover/button:not-disabled:translate-y-0.5"
              />
            </>
          }
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setPublishIntent(true)}>
          {isSubmitting ?
            <>
              Publishing...
              <Loader2
                data-icon="inline-end"
                className="animate-spin"
              />
            </>
          : <>
              Save &amp; publish
              <Globe
                data-icon="inline-end"
                className="transition-transform duration-200 group-hover/button:not-disabled:rotate-12"
              />
            </>
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/posts" as Route)}>
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
