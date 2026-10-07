import HomeHero from "@/components/HomeHero";
import Section from "@/components/Section";
import { InView } from "@/components/shadcnui/in-view";
import { getProfile } from "@/lib/data";
import { site } from "@/lib/site";

const riseVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const riseViewOptions = {
  margin: "0px 0px -10% 0px",
  amount: 0.12,
  once: true,
} as const;

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
          <div className="text-muted-foreground space-y-5 text-lg leading-relaxed">
            {profile.bio.split("\n\n").map((paragraph, i) => (
              <InView
                key={i}
                className="inview-rise"
                variants={riseVariants}
                transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.08 }}
                viewOptions={riseViewOptions}>
                <p>{paragraph}</p>
              </InView>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Home;
