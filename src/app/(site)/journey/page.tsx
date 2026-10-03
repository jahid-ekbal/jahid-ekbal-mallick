import Link from "next/link";
import { FileDown, GraduationCap } from "lucide-react";

import Reveal from "@/components/Reveal";
import { buttonVariants } from "@/components/shadcnui/button";
import { getProfile } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata(
  "Journey",
  `Education and milestones of ${site.name}.`,
  "/journey",
);

const Journey = () => {
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                Journey
              </h1>
              <p className="text-muted-foreground mt-3 max-w-xl">
                Education and the path that shaped how I build.
              </p>
            </div>
            <Link
              prefetch={false}
              href="/resume"
              className={buttonVariants({ variant: "outline", size: "sm" })}>
              View resume
              <FileDown />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-12">
            <div className="flex items-center gap-2">
              <GraduationCap
                size={18}
                className="text-muted-foreground"
              />
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Education
              </h2>
            </div>
            {profile.education.length > 0 ?
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
        </Reveal>
      </section>
    </div>
  );
};

export default Journey;
