import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const Section = ({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section className={cn("py-14 sm:py-16", className)}>
    {title && (
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {action}
      </div>
    )}
    {children}
  </section>
);

export default Section;
