import Link from "next/link";

import ContactSocialGrid from "@/components/ContactSocialGrid";
import Reveal from "@/components/Reveal";
import { buttonVariants } from "@/components/shadcnui/button";
import { Separator } from "@/components/shadcnui/separator";
import { getProfile } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact",
  "Connect with me on social platforms. Open a card, copy a link, or scan a QR code.",
  "/contact",
);

const ContactPage = () => {
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="min-h-[70svh] py-14 sm:py-16">
        <Reveal>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Connect
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            Find me on the platforms I use. Open a card to visit, or use the
            menu on each card to copy the link or scan a QR code.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Email me
            </a>
            <Link
              prefetch={false}
              href="/projects"
              className={buttonVariants({ variant: "outline", size: "sm" })}>
              See my work
            </Link>
          </div>
        </Reveal>

        <Separator className="my-8" />

        <Reveal delay={100}>
          <ContactSocialGrid
            socials={profile.socials}
            email={profile.email}
          />
        </Reveal>
      </section>
    </div>
  );
};

export default ContactPage;
