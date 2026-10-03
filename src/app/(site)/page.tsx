import HomeHero from "@/components/HomeHero";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { getProfile } from "@/lib/data";
import { site } from "@/lib/site";

const Home = async () => {
  const profile = getProfile();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: site.url,
    jobTitle: profile.headline,
    email: `mailto:${profile.email}`,
    address: profile.location,
    sameAs: Object.values(profile.socials).filter(Boolean),
  };

  return (
    <div>
      <script
        type={"application/ld+json"}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHero />

      <div className="mx-auto max-w-5xl px-6">
        <Section title={"About me"}>
          {profile.email && (
            <p className="text-muted-foreground mb-4 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="underline decoration-dotted underline-offset-4">
                {profile.email}
              </a>
            </p>
          )}

          <div className="text-muted-foreground space-y-5 text-lg leading-relaxed">
            {profile.bio.split("\n\n").map((paragraph, i) => (
              <Reveal
                key={i}
                delay={i * 80}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </Section>

        {profile.skills.length > 0 && (
          <Section title={"Skills and tools"}>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {profile.skills.map((group, gi) => (
                <Reveal
                  key={group.category}
                  delay={gi * 60}>
                  <h3 className="text-foreground mb-3 text-base font-medium">
                    {group.category}
                  </h3>
                  <ul className="flex flex-wrap gap-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border-border text-muted-foreground rounded-full border px-3 py-1.5 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

export default Home;
