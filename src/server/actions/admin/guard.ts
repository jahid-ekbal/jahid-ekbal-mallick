import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function isAdminRequest(): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session !== null;
}
