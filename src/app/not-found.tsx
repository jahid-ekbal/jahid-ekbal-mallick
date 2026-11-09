import Link from "next/link";
import { House } from "lucide-react";

import { buttonVariants } from "@/components/shadcnui/button";

const RootNotFound = () => (
  <div className="mx-auto grid max-w-5xl flex-1 place-items-center px-6 py-24">
    <div className="text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="text-muted-foreground mx-auto mt-4 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className={
          buttonVariants({ variant: "secondary", size: "sm" }) + " mt-8"
        }>
        Back to home
        <House />
      </Link>
    </div>
  </div>
);

export default RootNotFound;
