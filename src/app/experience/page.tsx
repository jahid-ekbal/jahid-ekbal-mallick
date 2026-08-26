import Link from "next/link";
import { FileDown } from "lucide-react";

import { Button } from "@/components/shadcnui/button";
import { getProfile } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata(
  "Experience",
  `Career timeline and work experience of ${site.name}.`,
  "/experience",
);

const Experience = async () => {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Experience
          </h1>
          {profile && (
            <Button
              variant={"outline"}
              render={<Link href={"/resume"} />}>
              View résumé <FileDown data-icon="inline-end" />
            </Button>
          )}
        </div>

        {profile && profile.experiences.length > 0 ?
          <ol className="border-border relative mt-12 space-y-12 border-l pl-8">
            {profile.experiences.map((exp) => (
              <li
                key={`${exp.role}-${exp.company}`}
                className="relative">
                <span
                  className="border-background bg-foreground/70 absolute top-1.5 -left-[37px] size-2.5 rounded-full border-2"
                  aria-hidden
                />
                <span className="text-muted-foreground font-mono text-xs">
                  {exp.period}
                </span>
                <h2 className="font-heading mt-1.5 text-lg font-semibold tracking-tight">
                  {exp.role}
                </h2>
                <p className="text-muted-foreground text-sm">{exp.company}</p>
                {exp.description && (
                  <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        : <p className="text-muted-foreground mt-8">Experience coming soon.</p>}
      </section>
    </div>
  );
};

export default Experience;
