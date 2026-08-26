import { MapPin } from "lucide-react";

import Section from "@/components/Section";
import { getProfile } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata(
  "About",
  `Bio, education, and background of ${site.name}.`,
  "/about",
);

const About = async () => {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          About me
        </h1>

        {profile?.location && (
          <p className="text-muted-foreground mt-4 flex items-center gap-1.5 text-sm">
            <MapPin size={14} /> {profile.location}
          </p>
        )}

        <div className="text-muted-foreground mt-8 space-y-5 text-base leading-relaxed">
          {(profile?.bio ?? "").split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      {profile && profile.education.length > 0 && (
        <Section
          title={"Education"}
          className={"pt-0"}>
          <ul className="space-y-6">
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
                    <p className="text-muted-foreground mt-1 text-sm">
                      {edu.description}
                    </p>
                  )}
                </div>
                {edu.period && (
                  <span className="text-muted-foreground font-mono text-xs">
                    {edu.period}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
};

export default About;
