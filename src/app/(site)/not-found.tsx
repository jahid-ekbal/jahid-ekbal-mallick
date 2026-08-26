import Link from "next/link";
import { House } from "lucide-react";

import { Button } from "@/components/shadcnui/button";

const NotFound = () => (
  <div className="mx-auto grid max-w-5xl flex-1 place-items-center px-6 py-24">
    <div className="text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="text-muted-foreground mx-auto mt-4 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button
        className="mt-8"
        nativeButton={false}
        render={<Link href={"/"} />}>
        Back to home
        <House
          data-icon="inline-end"
          className="transition-transform duration-200 group-hover/button:not-disabled:translate-x-0.5"
        />
      </Button>
    </div>
  </div>
);

export default NotFound;
