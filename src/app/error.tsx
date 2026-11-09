"use client";

import Link from "next/link";
import { House, RotateCcw } from "lucide-react";

import { buttonVariants } from "@/components/shadcnui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto grid max-w-5xl flex-1 place-items-center px-6 py-24">
      <div className="text-center">
        <p className="text-muted-foreground font-mono text-sm">Error</p>
        <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-sm">
          The page hit an error. Try again, or return to the home page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className={buttonVariants({ variant: "default", size: "sm" })}>
            Try again
            <RotateCcw />
          </button>
          <Link
            href="/"
            className={buttonVariants({ variant: "secondary", size: "sm" })}>
            Back to home
            <House />
          </Link>
        </div>
      </div>
    </div>
  );
}
