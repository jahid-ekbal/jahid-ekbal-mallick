export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverImage: string | null;
  techStack: string[];
  category: string;
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
};

// Static project content built from public GitHub repos. Edit directly here.
export const projects: Project[] = [
  {
    slug: "lumiwalls",
    title: "lumiwalls",
    summary: "Light up your screen.",
    description: [
      "Lumiwalls is a wallpaper style web app that lights up your screen with curated visuals.",
      "Built with TypeScript and React. See the repository README for setup and usage.",
    ].join("\n\n"),
    coverImage: null,
    techStack: ["TypeScript", "React", "Next.js"],
    category: "Web App",
    repoUrl: "https://github.com/jahid-ekbal/lumiwalls",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "checkly",
    title: "checkly",
    summary: "Checklist style TypeScript app for tracking tasks and checks.",
    description: [
      "Checkly is a checklist style TypeScript project for tracking tasks and checks.",
      "See the repository README for setup and usage.",
    ].join("\n\n"),
    coverImage: null,
    techStack: ["TypeScript", "React"],
    category: "Tool",
    repoUrl: "https://github.com/jahid-ekbal/checkly",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "basic-auth-profile",
    title: "basic-auth-profile",
    summary: "Auth profile starter with a basic authentication flow.",
    description: [
      "Basic auth profile starter showing a simple authentication flow with profile pages.",
      "See the repository README for setup and usage.",
    ].join("\n\n"),
    coverImage: null,
    techStack: ["TypeScript", "React", "Next.js"],
    category: "Auth",
    repoUrl: "https://github.com/jahid-ekbal/basic-auth-profile",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "cpp-forensic-engine",
    title: "cpp-forensic-engine",
    summary: "C++ forensic engine experiments.",
    description: [
      "Experiments in C++ for forensic style data processing and engine design.",
      "See the repository README for build steps and usage.",
    ].join("\n\n"),
    coverImage: null,
    techStack: ["C++"],
    category: "Systems",
    repoUrl: "https://github.com/jahid-ekbal/cpp-forensic-engine",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "moderation-bot",
    title: "moderation-bot",
    summary: "It is a Discord BOT for server moderation.",
    description: [
      "Moderation bot for Discord servers with safety and helper commands.",
      "Built with TypeScript and Node.js. See the repository README for setup and usage.",
    ].join("\n\n"),
    coverImage: null,
    techStack: [
      "TypeScript",
      "Node.js",
      "discord.js",
      "Prisma",
      "Google Generative AI",
      "Bun",
    ],
    category: "Bot",
    repoUrl: "https://github.com/jahid-ekbal/moderation-bot",
    liveUrl: null,
    featured: false,
  },
];
