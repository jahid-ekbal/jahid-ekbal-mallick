import ContactSocialGrid from "@/components/ContactSocialGrid";
import { Separator } from "@/components/shadcnui/separator";
import { getProfile } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact",
  "Connect with me on social platforms — click a card to open, right-click or tap ••• for Copy link and QR.",
  "/contact",
);

const ContactPage = async () => {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Connect
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          Find me on the platforms I use. Each card is square with the icon in
          the center — click to open directly (desktop and phone), right-click
          or use ••• (mobile) for Go to app, Copy link, or Show QR.
        </p>

        <Separator className="my-8" />

        <ContactSocialGrid
          socials={profile?.socials ?? {}}
          email={profile?.email}
        />

        <p className="text-muted-foreground mt-8 text-center text-xs">
          Tip: Click a card to open directly. Right-click (desktop) or tap •••
          (mobile) for Copy link and QR.
        </p>
      </section>
    </div>
  );
};

export default ContactPage;
