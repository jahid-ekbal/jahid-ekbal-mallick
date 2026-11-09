import DockNav from "@/components/Layout/DockNav";
import SiteBackdrop from "@/components/SiteBackdrop";
import type { LayoutProps } from "@/lib/types";

export default function SiteLayout({ children }: LayoutProps) {
  return (
    <>
      <a
        href="#main"
        className="skip-link">
        Skip to content
      </a>
      <SiteBackdrop />
      <main
        id="main"
        className="relative flex-1 pb-36 sm:pb-32 print:pb-0">
        {children}
      </main>
      <DockNav />
    </>
  );
}
