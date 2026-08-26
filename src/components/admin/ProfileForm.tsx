"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema, type ProfileFormValues } from "@/lib/zodSchema";
import { saveProfile } from "@/server/actions/admin/profile";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { toast } from "@/components/shadcnui/toast";
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";

const EMPTY: ProfileFormValues = {
  name: "",
  headline: "",
  tagline: "",
  bio: "",
  location: "",
  email: "",
  avatarUrl: "",
  resumeUrl: "",
  socials: {},
  skills: [],
  experiences: [],
  education: [],
};

function TextField({
  control,
  name,
  label,
  textarea = false,
  rows = 3,
}: {
  control: ReturnType<typeof useForm<ProfileFormValues>>["control"];
  name: keyof ProfileFormValues;
  label: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
          {textarea ?
            <Textarea
              {...field}
              value={(field.value as string) ?? ""}
              id={String(name)}
              rows={rows}
              aria-invalid={fieldState.invalid}
            />
          : <Input
              {...field}
              value={(field.value as string) ?? ""}
              id={String(name)}
              aria-invalid={fieldState.invalid}
            />
          }
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function ProfileForm({
  initial,
}: {
  initial?: Partial<ProfileFormValues>;
}) {
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { ...EMPTY, ...initial },
    mode: "all",
  });
  const { handleSubmit, control, register } = form;
  const { isSubmitting } = form.formState;

  const socials = useFieldArray({ control, name: "socials" as never });
  void socials;

  async function onSubmit(values: ProfileFormValues) {
    const result = await saveProfile(values);
    if (!result.ok) {
      toast.add({
        type: "error",
        title: "Could not save profile",
        description: result.error,
      });
      return;
    }
    toast.add({
      type: "success",
      title: "Profile saved",
    });
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {TextField({ control, name: "name", label: "Name" })}
          {TextField({ control, name: "headline", label: "Headline" })}
          {TextField({
            control,
            name: "tagline",
            label: "Tagline",
            textarea: true,
            rows: 2,
          })}
          {TextField({ control, name: "location", label: "Location" })}
          {TextField({ control, name: "email", label: "Contact email" })}
          {TextField({ control, name: "avatarUrl", label: "Avatar URL" })}
          {TextField({ control, name: "resumeUrl", label: "Resume URL" })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bio</CardTitle>
        </CardHeader>
        <CardContent>
          {TextField({
            control,
            name: "bio",
            label: "Bio (markdown)",
            textarea: true,
            rows: 8,
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Social links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {(
            [
              "github",
              "linkedin",
              "twitter",
              "instagram",
              "youtube",
              "discord",
              "whatsapp",
              "telegram",
            ] as const
          ).map((key) => (
            <div
              key={key}
              className="space-y-1">
              <label
                htmlFor={`socials.${key}`}
                className="text-sm font-medium capitalize">
                {key}
              </label>
              <Input
                id={`socials.${key}`}
                {...register(`socials.${key}` as never)}
                placeholder="https://..."
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Skills</CardTitle>
          <AddSkillButton control={control} />
        </CardHeader>
        <CardContent className="space-y-3">
          <SkillRows control={control} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Experience</CardTitle>
          <AddExperienceButton control={control} />
        </CardHeader>
        <CardContent className="space-y-4">
          <ExperienceRows control={control} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Education</CardTitle>
          <AddEducationButton control={control} />
        </CardHeader>
        <CardContent className="space-y-4">
          <EducationRows control={control} />
        </CardContent>
      </Card>

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
              Save profile
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
          onClick={() => router.push("/admin" as Route)}>
          Back to overview
          <ArrowLeft
            data-icon="inline-start"
            className="transition-transform duration-200 group-hover/button:not-disabled:-translate-x-0.5"
          />
        </Button>
      </div>
    </form>
  );
}

type Control = ReturnType<typeof useForm<ProfileFormValues>>["control"];

function AddSkillButton({ control }: { control: Control }) {
  const { append } = useFieldArray({ control, name: "skills" });
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => append({ category: "", items: "" })}>
      Add group
      <Plus
        data-icon="inline-end"
        className="transition-transform duration-200 group-hover/button:not-disabled:rotate-90"
      />
    </Button>
  );
}

function SkillRows({ control }: { control: Control }) {
  const { fields, remove } = useFieldArray({ control, name: "skills" });
  if (fields.length === 0)
    return <p className="text-muted-foreground text-sm">No skill groups.</p>;
  return fields.map((field, index) => (
    <div
      key={field.id}
      className="flex items-end gap-2">
      <Controller
        name={`skills.${index}.category` as never}
        control={control}
        render={({ field: f }) => (
          <Input
            {...f}
            value={f.value ?? ""}
            placeholder="Frontend"
            className="w-40"
          />
        )}
      />
      <Controller
        name={`skills.${index}.items` as never}
        control={control}
        render={({ field: f }) => (
          <Input
            {...f}
            value={f.value ?? ""}
            placeholder="React, TypeScript, Tailwind"
            className="flex-1"
          />
        )}
      />
      <Button
        type="button"
        size="xs"
        variant="destructive"
        onClick={() => remove(index)}>
        Remove
        <Trash2
          data-icon="inline-end"
          className="transition-transform duration-200 group-hover/button:not-disabled:scale-110"
        />
      </Button>
    </div>
  ));
}

type ExperienceRow = ProfileFormValues["experiences"][number];

function AddExperienceButton({ control }: { control: Control }) {
  const { append } = useFieldArray({ control, name: "experiences" });
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() =>
        append({ role: "", company: "", period: "", description: "" })
      }>
      Add role
      <Plus
        data-icon="inline-end"
        className="transition-transform duration-200 group-hover/button:not-disabled:rotate-90"
      />
    </Button>
  );
}

function ExperienceRows({ control }: { control: Control }) {
  const { fields, remove } = useFieldArray({ control, name: "experiences" });
  if (fields.length === 0)
    return (
      <p className="text-muted-foreground text-sm">No experience entries.</p>
    );
  return fields.map((field, index) => (
    <div
      key={field.id}
      className="border-border space-y-2 rounded-md border p-3">
      <div className="flex items-end gap-2">
        <Controller
          name={`experiences.${index}.role` as never}
          control={control}
          render={({ field: f }) => (
            <Input
              {...f}
              value={f.value ?? ""}
              placeholder="Role"
              className="flex-1"
            />
          )}
        />
        <Controller
          name={`experiences.${index}.company` as never}
          control={control}
          render={({ field: f }) => (
            <Input
              {...f}
              value={f.value ?? ""}
              placeholder="Company"
              className="w-40"
            />
          )}
        />
        <Controller
          name={`experiences.${index}.period` as never}
          control={control}
          render={({ field: f }) => (
            <Input
              {...f}
              value={f.value ?? ""}
              placeholder="2020 - Present"
              className="w-40"
            />
          )}
        />
        <Button
          type="button"
          size="xs"
          variant="destructive"
          onClick={() => remove(index)}>
          Remove
          <Trash2
            data-icon="inline-end"
            className="transition-transform duration-200 group-hover/button:not-disabled:scale-110"
          />
        </Button>
      </div>
      <Controller
        name={`experiences.${index}.description` as never}
        control={control}
        render={({ field: f }) => (
          <Textarea
            {...f}
            value={f.value ?? ""}
            placeholder="What did you do there?"
            rows={2}
          />
        )}
      />
      <span className="sr-only">
        {(field as unknown as ExperienceRow).role}
      </span>
    </div>
  ));
}

type EducationRow = ProfileFormValues["education"][number];

function AddEducationButton({ control }: { control: Control }) {
  const { append } = useFieldArray({ control, name: "education" });
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() =>
        append({ degree: "", school: "", period: "", description: "" })
      }>
      Add entry
      <Plus
        data-icon="inline-end"
        className="transition-transform duration-200 group-hover/button:not-disabled:rotate-90"
      />
    </Button>
  );
}

function EducationRows({ control }: { control: Control }) {
  const { fields, remove } = useFieldArray({ control, name: "education" });
  if (fields.length === 0)
    return (
      <p className="text-muted-foreground text-sm">No education entries.</p>
    );
  return fields.map((field, index) => (
    <div
      key={field.id}
      className="border-border space-y-2 rounded-md border p-3">
      <div className="flex items-end gap-2">
        <Controller
          name={`education.${index}.degree` as never}
          control={control}
          render={({ field: f }) => (
            <Input
              {...f}
              value={f.value ?? ""}
              placeholder="Degree"
              className="flex-1"
            />
          )}
        />
        <Controller
          name={`education.${index}.school` as never}
          control={control}
          render={({ field: f }) => (
            <Input
              {...f}
              value={f.value ?? ""}
              placeholder="School"
              className="w-48"
            />
          )}
        />
        <Controller
          name={`education.${index}.period` as never}
          control={control}
          render={({ field: f }) => (
            <Input
              {...f}
              value={f.value ?? ""}
              placeholder="Period"
              className="w-32"
            />
          )}
        />
        <Button
          type="button"
          size="xs"
          variant="destructive"
          onClick={() => remove(index)}>
          Remove
          <Trash2
            data-icon="inline-end"
            className="transition-transform duration-200 group-hover/button:not-disabled:scale-110"
          />
        </Button>
      </div>
      <Controller
        name={`education.${index}.description` as never}
        control={control}
        render={({ field: f }) => (
          <Textarea
            {...f}
            value={f.value ?? ""}
            placeholder="Notes"
            rows={2}
          />
        )}
      />
      <span className="sr-only">
        {(field as unknown as EducationRow).degree}
      </span>
    </div>
  ));
}
