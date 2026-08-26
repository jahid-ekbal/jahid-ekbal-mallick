import Link from "next/link";

import {
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import { getProfile } from "@/lib/data";
import { site } from "@/lib/site";

const socialLinks = [
  { key: "github", label: "GitHub", Icon: GitHubIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  { key: "twitter", label: "X", Icon: XIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
  { key: "discord", label: "Discord", Icon: DiscordIcon },
  { key: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon },
  { key: "telegram", label: "Telegram", Icon: TelegramIcon },
] as const;

const Footer = async () => {
  const profile = await getProfile();

  return (
    <footer className="border-border/60 border-t print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {site.name}
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map(({ key, label, Icon }) => {
            const href = profile?.socials?.[key];
            if (!href) return null;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-y-0.5">
                <Icon
                  width={18}
                  height={18}
                />
              </a>
            );
          })}
          <Link
            href={"/contact"}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
