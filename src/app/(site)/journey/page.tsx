import Link from "next/link";
import { FileDown, GraduationCap, Briefcase } from "lucide-react";

import { Button } from "@/components/shadcnui/button";
import { Separator } from "@/components/shadcnui/separator";
import { getProfile } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata(
  "Journey",
  `Career, education and milestones of ${site.name}.`,
  "/journey",
);

const Journey = async () => {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Journey
            </h1>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Roles, education and the path that shaped how I build.
            </p>
          </div>
          {profile && (
            <Button
              variant={"outline"}
              nativeButton={false}
              render={<Link href={"/resume"} />}>
              View résumé
              <FileDown
                data-icon="inline-end"
                className="transition-transform duration-200 group-hover/button:not-disabled:translate-y-0.5"
              />
            </Button>
          )}
        </div>

        {/* Experience */}
        <div className="mt-12">
          <div className="flex items-center gap-2">
            <Briefcase
              size={18}
              className="text-muted-foreground"
            />
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Experience
            </h2>
          </div>
          {profile && profile.experiences.length > 0 ?
            <ol className="border-border relative mt-6 space-y-10 border-l pl-8">
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
                  <h3 className="font-heading mt-1.5 text-base font-semibold tracking-tight">
                    {exp.role}
                  </h3>
                  <p className="text-muted-foreground text-sm">{exp.company}</p>
                  {exp.description && (
                    <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          : <p className="text-muted-foreground mt-6 text-sm">
              Experience coming soon.
            </p>
          }
        </div>

        <Separator className="my-12" />

        {/* Education */}
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap
              size={18}
              className="text-muted-foreground"
            />
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Education
            </h2>
          </div>
          {profile && profile.education.length > 0 ?
            <ul className="mt-6 space-y-6">
              {profile.education.map((edu) => (
                <li
                  key={`${edu.degree}-${edu.school}`}
                  className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{edu.degree}</h3>
                    <p className="text-muted-foreground text-sm">
                      {edu.school}
                      {edu.url && (
                        <>
                          {" "}
                          <a
                            href={edu.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2">
                            {edu.url.replace(/^https?:\/\//, "")}
                          </a>
                        </>
                      )}
                    </p>
                    {edu.description && (
                      <p className="text-muted-foreground mt-1 max-w-xl text-sm">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  {edu.period && (
                    <span className="text-muted-foreground shrink-0 font-mono text-xs">
                      {edu.period}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          : <p className="text-muted-foreground mt-6 text-sm">
              Education details coming soon.
            </p>
          }
        </div>
      </section>
    </div>
  );
};

export default Journey;
