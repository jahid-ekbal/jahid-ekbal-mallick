"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import ThemeToggleButton from "@/components/Layout/ThemeToggleButton";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href={"/"}
          className="text-sm font-semibold tracking-tight"
          onClick={() => setOpen(false)}>
          <span className="font-heading text-base">{site.name}</span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive(item.href) ? "text-foreground" : (
                  "text-muted-foreground hover:bg-muted hover:text-foreground"
                ),
              )}>
              {item.label}
            </Link>
          ))}
          <span
            className="bg-border mx-2 h-4 w-px"
            aria-hidden
          />
          <ThemeToggleButton />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggleButton />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors">
            <span
              className="relative block size-[18px]"
              aria-hidden>
              <Menu
                size={18}
                className={cn(
                  "absolute inset-0 transition-all duration-200",
                  open ?
                    "scale-50 rotate-90 opacity-0"
                  : "scale-100 rotate-0 opacity-100",
                )}
              />
              <X
                size={18}
                className={cn(
                  "absolute inset-0 transition-all duration-200",
                  open ?
                    "scale-100 rotate-0 opacity-100"
                  : "scale-50 -rotate-90 opacity-0",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-border/60 bg-background border-t md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col px-6 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive(item.href) ? "text-foreground" : (
                    "text-muted-foreground hover:bg-muted hover:text-foreground"
                  ),
                )}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
