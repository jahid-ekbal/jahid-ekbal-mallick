"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import {
  FileText,
  House,
  LayoutGrid,
  Mail,
  Moon,
  Route,
  Sun,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from "@/components/motion-primitives/dock";
import { AnimatedThemeToggler } from "@/components/shadcnui/animated-theme-toggler";
import { cn } from "@/lib/utils";

const pageItems = [
  { href: "/", label: "Home", Icon: House },
  { href: "/projects", label: "Projects", Icon: LayoutGrid },
  { href: "/journey", label: "Journey", Icon: Route },
  { href: "/contact", label: "Contact", Icon: Mail },
  { href: "/resume", label: "Resume", Icon: FileText },
] as const;

const isActive = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const DockNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : false;

  const activateWithKeyboard = (run: () => void) => ({
    onClick: run,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        run();
      }
    },
  });

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 print:hidden">
      <Dock
        magnification={reduceMotion ? 40 : 80}
        distance={reduceMotion ? 0 : 150}
        spring={
          reduceMotion ? { mass: 0.1, stiffness: 1000, damping: 50 } : undefined
        }
        className="rounded-[28px] border border-white/40 bg-white/30 shadow-2xl ring-1 ring-white/30 backdrop-blur-2xl backdrop-saturate-150 ring-inset dark:border-white/10 dark:bg-black/30 dark:ring-white/10">
        {pageItems.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <DockItem
              key={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              {...activateWithKeyboard(() => router.push(href))}>
              <DockLabel>{label}</DockLabel>
              <DockIcon
                className={cn(
                  "text-muted-foreground",
                  active && "text-[var(--hero-accent)]",
                )}>
                <span className="flex flex-col items-center gap-1">
                  <Icon size={20} />
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
            {reduceMotion ?
              <button
                type="button"
                aria-label="Toggle theme"
                aria-pressed={isDark}
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="focus-visible:ring-ring inline-flex size-5 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none">
                {isDark ?
                  <Sun size={20} />
                : <Moon size={20} />}
                <span className="sr-only">Toggle theme</span>
              </button>
            : <AnimatedThemeToggler
                theme={isDark ? "dark" : "light"}
                onThemeChange={setTheme}
                variant="circle"
                duration={400}
                fromCenter={false}
                aria-label="Toggle theme"
                aria-pressed={isDark}
                className="focus-visible:ring-ring inline-flex size-5 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none [&>svg]:size-5"
              />
            }
          </DockIcon>
        </DockItem>
      </Dock>
    </nav>
  );
};

export default DockNav;
