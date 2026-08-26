"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/shadcnui/button";
import { toast } from "@/components/shadcnui/toast";
import { Loader2, LogOut } from "lucide-react";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const { error } = await authClient.signOut();
    if (error) {
      setPending(false);
      toast.add({
        type: "error",
        title: "Sign out failed",
        description: "Please try again.",
      });
      return;
    }
    toast.add({
      type: "success",
      title: "Signed out",
      description: "See you soon.",
    });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size={compact ? "sm" : "default"}
      onClick={signOut}
      disabled={pending}
      className="w-full">
      {pending ?
        <>
          Signing out...
          <Loader2
            data-icon="inline-end"
            className="animate-spin"
          />
        </>
      : <>
          Sign out
          <LogOut
            data-icon="inline-end"
            className="transition-transform duration-200 group-hover/button:not-disabled:translate-x-0.5"
          />
        </>
      }
    </Button>
  );
}
