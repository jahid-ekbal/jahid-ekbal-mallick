import Link from "next/link";
import {
  BriefcaseBusiness,
  FileDown,
  GraduationCap,
  Trophy,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import { buttonVariants } from "@/components/shadcnui/button";
import { getProfile } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata(
  "Journey",
  `Journey of ${site.name}: experience, education, and milestones from Kolkata.`,
  "/journey",
);

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
                Experience, education, and milestones that shaped how I build.
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
              <BriefcaseBusiness
                size={18}
                className="text-muted-foreground"
              />
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Experience timeline
              </h2>
            </div>
            {profile.experiences.length > 0 ?
              <ol className="mt-6 space-y-0">
                {profile.experiences.map((exp, i) => (
                  <li
                    key={`${exp.role}-${exp.company}`}
                    className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden
                        className="mt-1.5 size-2.5 shrink-0 rounded-full bg-[var(--hero-accent)]"
                      />
                      {i < profile.experiences.length - 1 && (
                        <span
                          aria-hidden
                          className="bg-border mt-1 w-px flex-1"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{exp.role}</h3>
                        <p className="text-muted-foreground text-sm">
                          {exp.company}
                        </p>
                        {exp.description && (
                          <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      {exp.period && (
                        <span className="text-muted-foreground shrink-0 font-mono text-xs">
                          {exp.period}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            : <p className="text-muted-foreground mt-6 text-sm">
                No experience entries yet. Start with the resume.
              </p>
            }
          </div>
        </Reveal>

        <Reveal delay={120}>
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
                    key={`${edu.degree}-${edu.school ?? "no-school"}`}
                    className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{edu.degree}</h3>
                      {(edu.school || edu.url) && (
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
                      )}
                      {edu.description && (
                        <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-relaxed">
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
                No education entries yet. See resume for study details.
              </p>
            }
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-12">
            <div className="flex items-center gap-2">
              <Trophy
                size={18}
                className="text-muted-foreground"
              />
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Milestones and learning
              </h2>
            </div>
            {profile.milestones.length > 0 ?
              <ol className="mt-6 space-y-0">
                {profile.milestones.map((m, i) => (
                  <li
                    key={m.title}
                    className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden
                        className="border-border bg-background mt-1.5 size-2.5 shrink-0 rounded-full border-2"
                      />
                      {i < profile.milestones.length - 1 && (
                        <span
                          aria-hidden
                          className="bg-border mt-1 w-px flex-1"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{m.title}</h3>
                        <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                      {m.period && (
                        <span className="text-muted-foreground shrink-0 font-mono text-xs">
                          {m.period}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            : <p className="text-muted-foreground mt-6 text-sm">
                Milestones are being organized. See education above.
              </p>
            }
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Journey;
