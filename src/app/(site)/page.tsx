import { FileDown, MapPin } from "lucide-react";
import Link from "next/link";

import Section from "@/components/Section";
import { Button } from "@/components/shadcnui/button";
import { getProfile } from "@/lib/data";
import { site } from "@/lib/site";

const Home = async () => {
  const profile = await getProfile();

  const jsonLd =
    profile ?
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        url: site.url,
        jobTitle: profile.headline,
        ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
        address: profile.location,
        sameAs: Object.values(profile.socials).filter(Boolean),
      }
    : null;

  return (
    <div className="mx-auto max-w-5xl px-6">
      {jsonLd && (
        <script
          type={"application/ld+json"}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <section className="py-20 sm:py-28">
        {profile && (
          <p className="border-border bg-muted/50 text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Open to impactful projects
          </p>
        )}

        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
          Hi, I&apos;m {profile?.name ?? "Jahid Ekbal Mallick"}.
          <br />
          <span className="text-muted-foreground">
            {profile?.headline ?? "Fullstack Developer"}.
          </span>
        </h1>

        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
          {profile?.tagline ??
            "I build fast, accessible web products end to end."}
        </p>

        {profile?.location && (
          <p className="text-muted-foreground mt-4 flex items-center gap-1.5 text-sm">
            <MapPin size={14} /> {profile.location}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {profile && (
            <Button
              nativeButton={false}
              render={<Link href={"/resume"} />}>
              Résumé
              <FileDown
                data-icon="inline-end"
                className="transition-transform duration-200 group-hover/button:not-disabled:translate-y-0.5"
              />
            </Button>
          )}
        </div>
      </section>

      <Section title={"About me"}>
        {profile?.location && (
          <p className="text-muted-foreground mb-4 flex items-center gap-1.5 text-sm">
            <MapPin size={14} /> {profile.location}
            {profile.email && (
              <>
                <span className="mx-2">·</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="underline decoration-dotted underline-offset-4">
                  {profile.email}
                </a>
              </>
            )}
          </p>
        )}

        <div className="text-muted-foreground space-y-5 text-base leading-relaxed">
          {(profile?.bio ?? "").split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Section>

      {profile && profile.skills.length > 0 && (
        <Section title={"Skills & tools"}>
          <div className="grid gap-8 sm:grid-cols-3">
            {profile.skills.map((group) => (
              <div key={group.category}>
                <h3 className="text-foreground mb-3 text-sm font-medium">
                  {group.category}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-border text-muted-foreground rounded-full border px-2.5 py-1 text-xs">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default Home;
