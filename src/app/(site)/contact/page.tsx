import Link from "next/link";

import ContactSocialGrid from "@/components/ContactSocialGrid";
import Reveal from "@/components/Reveal";
import { buttonVariants } from "@/components/shadcnui/button";
import { Separator } from "@/components/shadcnui/separator";
import { getProfile } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact",
  "Contact Jahid Ekbal Mallick from Kolkata by email or social platforms. GitHub, LinkedIn, X, WhatsApp, and Telegram.",
  "/contact",
);

const ContactPage = () => {
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="min-h-[70svh] py-14 sm:py-16">
        <Reveal>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Contact
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            I am based in Kolkata and work remotely. Email is the fastest
            channel for project notes. On each card you can open the link, copy
            it, or scan a QR code. No account or login needed to reach me.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent("Hello Jahid - project note")}&body=${encodeURIComponent("Hi Jahid,\n\n")}`}
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
