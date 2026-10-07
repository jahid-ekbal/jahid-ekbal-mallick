import DockNav from "@/components/Layout/DockNav";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="flex-1 pb-32">{children}</main>
      <DockNav />
    </>
  );
}
