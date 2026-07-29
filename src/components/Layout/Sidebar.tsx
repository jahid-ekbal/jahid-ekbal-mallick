"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  BriefcaseIcon,
  Home,
  Mail,
  Sparkles,
  User,
  Waves,
} from "lucide-react";
import ThemeToggleButton from "./ThemeToggleButton";

const links: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/skills", label: "Skills", icon: BookOpen },
  { href: "/projects", label: "Projects", icon: BriefcaseIcon },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/ocean", label: "Ocean", icon: Waves },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-dvh w-64 flex-col border-r border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-slate-800/40 px-6 py-5">
        <Sparkles className="h-5 w-5 text-cyan-400" />
        <span className="text-lg font-bold text-cyan-400">REGIX</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href as never}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ?
                  "bg-cyan-500/10 text-cyan-400"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}>
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/40 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Theme</span>
          <ThemeToggleButton />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
