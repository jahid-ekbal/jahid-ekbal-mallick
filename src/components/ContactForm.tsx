"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CircleCheck, Loader2, Send } from "lucide-react";

import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import type { ContactFormValues } from "@/lib/zodSchema";
import { contactSchema } from "@/lib/zodSchema";
import { submitContactMessage } from "@/server/actions/contact";
import { toast } from "@/components/shadcnui/toast";

const fields: ReadonlyArray<{
  name: "name" | "email";
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder: string;
}> = [
  {
    name: "name",
    label: "Name",
    autoComplete: "name",
    placeholder: "Ada Lovelace",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "ada@example.com",
  },
];

const ContactForm = () => {
  const [sent, setSent] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", body: "" },
    mode: "all",
  });

  if (sent) {
    return (
      <div className="animate-in fade-in zoom-in-50 border-border bg-card rounded-xl border p-8 text-center duration-300">
        <CircleCheck
          className="mx-auto text-emerald-500"
          size={32}
        />
        <h2 className="font-heading mt-4 text-lg font-semibold">
          Message sent
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Thanks for reaching out. I will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        const result = await submitContactMessage(values);
        if (result.ok) {
          toast.add({
            type: "success",
            title: "Message sent",
            description: "Thanks for reaching out.",
          });
          setSent(true);
        } else {
          toast.add({
            type: "error",
            title: "Could not send message",
            description: result.error,
          });
        }
      })}
      noValidate
      className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <Controller
            key={f.name}
            name={f.name}
            control={control}
            render={({ field, fieldState }) => (
              <div
                className="space-y-2"
                data-invalid={fieldState.invalid}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium">
                  {f.label}
                </label>
                <Input
                  {...field}
                  id={field.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="text-destructive text-xs">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
        ))}
      </div>

      <Controller
        name={"subject"}
        control={control}
        render={({ field, fieldState }) => (
          <div
            className="space-y-2"
            data-invalid={fieldState.invalid}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium">
              Subject
            </label>
            <Input
              {...field}
              id={field.name}
              placeholder={"What is this about?"}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <p className="text-destructive text-xs">
                {fieldState.error?.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name={"body"}
        control={control}
        render={({ field, fieldState }) => (
          <div
            className="space-y-2"
            data-invalid={fieldState.invalid}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium">
              Message
            </label>
            <Textarea
              {...field}
              id={field.name}
              rows={6}
              placeholder={
                "Tell me about the role, project, or idea. The more detail, the better."
              }
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <p className="text-destructive text-xs">
                {fieldState.error?.message}
              </p>
            )}
          </div>
        )}
      />

      <Button
        type={"submit"}
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            Sending{" "}
            <Loader2
              data-icon="inline-end"
              className="animate-spin"
            />
          </>
        : <>
            Send message{" "}
            <Send
              data-icon="inline-end"
              className="transition-transform duration-200 group-hover/button:not-disabled:translate-x-0.5"
            />
          </>
        }
      </Button>
    </form>
  );
};

export default ContactForm;
