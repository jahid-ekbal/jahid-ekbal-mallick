import DockNav from "@/components/Layout/DockNav";
import SiteBackdrop from "@/components/SiteBackdrop";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteBackdrop />
      <main className="relative flex-1 pb-36 sm:pb-32 print:pb-0">
        {children}
      </main>
      <DockNav />
    </>
  );
}
