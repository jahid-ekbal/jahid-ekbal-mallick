"use client";

import { useEffect, useState } from "react";
import { FileText, House, LayoutGrid, Mail, Route } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from "@/components/motion-primitives/dock";
import { AnimatedThemeToggler } from "@/components/shadcnui/animated-theme-toggler";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

const iconFor = (href: string) => {
  if (href === "/") return House;
  if (href === "/projects") return LayoutGrid;
  if (href === "/journey") return Route;
  if (href === "/contact") return Mail;
  return FileText;
};

const pageItems = [
  { href: "/", label: "Home" },
  ...navItems.map((item) => ({ href: item.href, label: item.label })),
] as const;

const isActive = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const DockNav = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : false;

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 print:hidden">
      <Dock
        magnification={80}
        distance={150}
        className="rounded-[28px] border border-white/40 bg-white/30 shadow-2xl ring-1 ring-white/30 backdrop-blur-2xl backdrop-saturate-150 ring-inset dark:border-white/10 dark:bg-black/30 dark:ring-white/10">
        {pageItems.map(({ href, label }) => {
          const Icon = iconFor(href);
          const active = isActive(pathname, href);
          return (
            <DockItem
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}>
              <DockLabel>{label}</DockLabel>
              <DockIcon
                className={cn(
                  "text-muted-foreground",
                  active && "text-[var(--hero-accent)]",
                )}>
                <span className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1">
                  <Icon size={22} />
                  <span
                    aria-hidden
                    className={cn(
                      "size-1 rounded-full bg-[var(--hero-accent)]",
                      !active && "opacity-0",
                    )}
                  />
                </span>
              </DockIcon>
            </DockItem>
          );
        })}
        <div
          aria-hidden
          className="my-2 w-px bg-black/10 dark:bg-white/15"
        />
        <DockItem
          aria-label="Toggle theme"
          aria-pressed={isDark}>
          <DockLabel>Toggle theme</DockLabel>
          <DockIcon className="text-muted-foreground">
            <span className="flex min-h-11 min-w-11 items-center justify-center">
              <AnimatedThemeToggler
                theme={isDark ? "dark" : "light"}
                onThemeChange={setTheme}
                variant="circle"
                duration={400}
                fromCenter={false}
                aria-label="Toggle theme"
                aria-pressed={isDark}
                className="focus-visible:ring-ring inline-flex size-6 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none [&>svg]:size-5"
              />
            </span>
          </DockIcon>
        </DockItem>
      </Dock>
    </nav>
  );
};

export default DockNav;
