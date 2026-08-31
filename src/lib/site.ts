import type { Metadata } from "next";

export const site = {
  name: "Jahid Ekbal Mallick",
  handle: "jahid-ekbal",
  role: "Full-Stack Developer & Digital Creator",
  title: "Jahid Ekbal Mallick | Full-Stack Developer & Digital Creator",
  description:
    "Full-Stack Developer & Digital Creator crafting digital experiences that merge technical precision with visual innovation — React, Next.js, TypeScript and UI/UX.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://jahid-ekbal-mallick.onrender.com",
} as const;

export const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/journey", label: "Journey" },
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
