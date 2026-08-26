import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

// Authoritative sign-in state check: unlike the old proxy-level
// cookie-presence redirect, a VALID session is required before bouncing to
// /admin - stale/expired cookies fall through and simply render the form
// again, so a login <-> admin redirect loop is impossible.
export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="bg-background text-foreground flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin sign in
          </h1>
          <p className="text-muted-foreground text-sm">
            Private access only. This page is not linked anywhere.
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
