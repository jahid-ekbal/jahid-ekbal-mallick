import ResumePrintButton from "@/components/ResumePrintButton";
import { getProfile } from "@/lib/data";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata(
  "Résumé",
  `Résumé of ${site.name}, full-stack engineer and UI/UX designer.`,
  "/resume",
);

const socialLabels: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "X",
  instagram: "Instagram",
  youtube: "YouTube",
  discord: "Discord",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  signal: "Signal",
};

const ResumePage = async () => {
  const profile = await getProfile();
  if (!profile) return null;

  const socialEntries = Object.entries(profile.socials).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16 print:max-w-none print:px-0 print:py-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight print:text-2xl">
            {profile.name}
          </h1>
          <p className="text-muted-foreground mt-1">{profile.headline}</p>
          <p className="text-muted-foreground mt-1 text-sm print:text-xs">
            {profile.location} | {site.url.replace(/^https?:\/\//, "")}
          </p>
        </div>
        <ResumePrintButton />
      </div>

      <section className="mt-8 print:mt-5">
        <h2 className="border-border border-b pb-1 text-sm font-semibold tracking-wide uppercase print:text-xs">
          Summary
        </h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed print:text-xs">
          {profile.bio.split("\n\n")[0]}
        </p>
      </section>

      {socialEntries.length > 0 && (
        <section className="mt-6 print:mt-4">
          <h2 className="border-border border-b pb-1 text-sm font-semibold tracking-wide uppercase print:text-xs">
            Links
          </h2>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm print:text-xs">
            {socialEntries.map(([key, href]) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground text-muted-foreground underline underline-offset-2">
                  {socialLabels[key] ?? key}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.skills.length > 0 && (
        <section className="mt-6 print:mt-4">
          <h2 className="border-border border-b pb-1 text-sm font-semibold tracking-wide uppercase print:text-xs">
            Skills
          </h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 print:text-xs">
            {profile.skills.map((group) => (
              <div key={group.category}>
                <dt className="font-medium">{group.category}</dt>
                <dd className="text-muted-foreground">
                  {group.items.join(" | ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {profile.experiences.length > 0 && (
        <section className="mt-6 print:mt-4">
          <h2 className="border-border border-b pb-1 text-sm font-semibold tracking-wide uppercase print:text-xs">
            Experience
          </h2>
          <ol className="mt-3 space-y-4">
            {profile.experiences.map((exp) => (
              <li key={`${exp.role}-${exp.company}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-medium print:text-xs">
                    {exp.role} | {exp.company}
                  </h3>
                  <span className="text-muted-foreground font-mono text-xs">
                    {exp.period}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed print:text-xs">
                    {exp.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {profile.education.length > 0 && (
        <section className="mt-6 print:mt-4">
          <h2 className="border-border border-b pb-1 text-sm font-semibold tracking-wide uppercase print:text-xs">
            Education
          </h2>
          <ul className="mt-3 space-y-3">
            {profile.education.map((edu) => (
              <li key={`${edu.degree}-${edu.school}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-medium print:text-xs">
                    {edu.degree} | {edu.school}
                    {edu.url && (
                      <>
                        {" "}
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground text-xs underline underline-offset-2">
                          {edu.url.replace(/^https?:\/\//, "")}
                        </a>
                      </>
                    )}
                  </h3>
                  {edu.period && (
                    <span className="text-muted-foreground font-mono text-xs">
                      {edu.period}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p className="text-muted-foreground mt-1 text-sm print:text-xs">
                    {edu.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ResumePage;
