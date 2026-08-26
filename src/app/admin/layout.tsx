import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/posts", label: "Posts" },
] as const;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="bg-background text-foreground flex min-h-svh">
      <aside className="border-border hidden w-56 shrink-0 flex-col border-r md:flex">
        <div className="border-border border-b px-4 py-4">
          <p className="text-sm font-semibold">Portfolio admin</p>
          <p className="text-muted-foreground truncate text-xs">
            {session.user.email}
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-sm">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-2">
          <SignOutButton />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border flex items-center gap-4 overflow-x-auto border-b px-4 py-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-xs whitespace-nowrap">
              {item.label}
            </Link>
          ))}
          <SignOutButton compact />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
