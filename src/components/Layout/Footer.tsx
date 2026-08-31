import { GitHubIcon } from "@/components/icons";
import { getProfile } from "@/lib/data";
import { site } from "@/lib/site";

const Footer = async () => {
  const profile = await getProfile();
  const githubHref = profile?.socials?.github;

  return (
    <footer className="border-border/60 border-t print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {site.name}
        </p>

        {githubHref && (
          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-y-0.5">
            <GitHubIcon
              width={18}
              height={18}
            />
          </a>
        )}
      </div>
    </footer>
  );
};

export default Footer;
