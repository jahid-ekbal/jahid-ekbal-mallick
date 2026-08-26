import { Mail } from "lucide-react";

import ContactForm from "@/components/ContactForm";
import { getProfile } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact",
  "Get in touch about roles, projects, or collaborations.",
  "/contact",
);

const ContactPage = async () => {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Get in touch
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          Have a role, project, or question? Send a message and it lands
          directly with me.
        </p>

        <div className="border-border bg-card mt-10 rounded-xl border p-6 sm:p-8">
          <ContactForm />
        </div>

        {profile?.email && (
          <a
            href={`mailto:${profile.email}`}
            className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-2 text-sm transition-colors">
            <Mail size={14} /> {profile.email}
          </a>
        )}
      </section>
    </div>
  );
};

export default ContactPage;
