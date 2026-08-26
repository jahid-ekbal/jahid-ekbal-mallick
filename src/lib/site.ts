import type { Metadata } from "next";

export const site = {
  name: "Jahid Ekbal Mallick",
  handle: "jahid-ekbal",
  role: "Full-Stack Engineer | UI/UX Designer",
  title: "Jahid Ekbal Mallick | Full-Stack Engineer",
  description:
    "Full-stack engineer building fast, accessible web apps end to end with React, Next.js, and TypeScript, backed by UI/UX and motion design.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://jahid-ekbal-mallick.onrender.com",
} as const;

export const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const pageMetadata = (
  title: string,
  description: string,
  path: string,
): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    url: path,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
});
