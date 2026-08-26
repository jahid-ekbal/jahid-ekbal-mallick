"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useForm, Controller } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginValues } from "@/lib/zodSchema";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { toast } from "@/components/shadcnui/toast";
import { Loader2, LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "all",
  });

  async function onSubmit(values: LoginValues) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast.add({
        type: "error",
        title: "Sign in failed",
        description: "Invalid email or password.",
      });
      return;
    }
    toast.add({
      type: "success",
      title: "Welcome back",
      description: "Signing you in...",
    });
    const next = searchParams.get("next");
    const target = (
      next && next.startsWith("/admin") ?
        next
      : "/admin") as Route;
    router.push(target);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4">
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              autoComplete="email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
              autoComplete="current-password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full">
        {isSubmitting ?
          <>
            Signing in...
            <Loader2
              data-icon="inline-end"
              className="animate-spin"
            />
          </>
        : <>
            Sign in
            <LogIn
              data-icon="inline-end"
              className="transition-transform duration-200 group-hover/button:not-disabled:translate-x-0.5"
            />
          </>
        }
      </Button>
    </form>
  );
}
