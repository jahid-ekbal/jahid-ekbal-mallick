import Link from "next/link";
import { FileDown, GraduationCap, Languages } from "lucide-react";

import Reveal from "@/components/Reveal";
import { buttonVariants } from "@/components/shadcnui/button";
import { getProfile } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata(
  "Journey",
  `Education and milestones of ${site.name}.`,
  "/journey",
);

const languages = [
  { name: "TypeScript", percent: 46.39 },
  { name: "Next.js", percent: 30.33 },
  { name: "JavaScript", percent: 13.34 },
  { name: "HTML", percent: 4.43 },
  { name: "CSS", percent: 2.63 },
  { name: "Prisma ORM SQL", percent: 1.41 },
  { name: "C, C++, C#", percent: 1.0 },
  { name: "Python", percent: 0.78 },
  { name: "Vue", percent: 0.68 },
];

const Journey = () => {
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="min-h-[70svh] py-14 sm:py-16">
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

        <Reveal delay={120}>
          <div className="mt-12">
            <div className="flex items-center gap-2">
              <Languages
                size={18}
                className="text-muted-foreground"
              />
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Languages
              </h2>
            </div>
            <ul className="mt-6 space-y-4">
              {languages.map((lang) => (
                <li key={lang.name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <span className="text-muted-foreground font-mono text-xs tabular-nums">
                      {lang.percent.toFixed(2)}%
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={lang.name}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={lang.percent}
                    className="bg-muted mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-[var(--hero-accent)]"
                      style={{ width: `${lang.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Journey;
