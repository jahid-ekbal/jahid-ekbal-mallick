import { GitHubIcon } from "@/components/icons";
import { profile } from "@/components/profile";
import { site } from "@/lib/site";

const socialIcons = [
  {
    key: "github",
    label: "GitHub",
    href: profile.socials.github,
    Icon: GitHubIcon,
  },
].filter((s) => Boolean(s.href));

const Footer = () => {
  return (
    <footer className="border-border/60 border-t print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {new Date().getFullYear()} {site.name}
        </p>

        <div className="flex items-center gap-4">
          {socialIcons.map(({ key, label, href, Icon }) => (
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
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
