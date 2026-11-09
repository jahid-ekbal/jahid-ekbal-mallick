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
    title: "Lumiwalls",
    summary:
      "A wallpaper style web app that lights up the screen with curated visuals.",
    description: [
      "Lumiwalls is a wallpaper style web app that keeps the screen alive with curated visuals. It was built to explore how a small, focused surface can stay attractive while remaining fast and simple to use, with motion and layout that respect reduced motion.",
      "The build uses TypeScript with React and Next.js for static rendering and file based routes. State stays local, the interface is keyboard friendly, and the layout is mobile first so the visuals scale cleanly from phones to large desktops.",
      "Status: active starter. There is no live demo yet, so the source repository is the source of truth for setup and usage. The next step is a small curated set and a settings panel for theme and blur preferences.",
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
    title: "Checkly",
    summary: "A checklist style TypeScript app for tracking tasks and checks.",
    description: [
      "Checkly is a checklist style app for tracking tasks and checks in one place. It was built to turn a long list of small done items into a clear, calm workflow with consistent naming and quick scanning.",
      "The project is written in TypeScript with React. The focus is on typed task state, predictable updates, and a simple list model that is easy to extend toward due dates, filters, and persistence without a backend.",
      "Status: active starter. There is no live demo yet. The repository documents the local setup. Planned work includes keyboard shortcuts, list filtering, and export to plain text.",
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
    title: "Basic Auth Profile",
    summary: "An auth profile starter with a basic authentication flow.",
    description: [
      "Basic Auth Profile is a starter that shows a simple authentication flow with profile pages. It demonstrates signed in and signed out states, guarded pages, and a clean handoff between auth and profile UI.",
      "The build uses TypeScript with React and Next.js for routing and server components. The auth flow keeps responsibilities small: identity in one place, profile rendering in another, and no business logic mixed into the visual layer.",
      "Status: active starter. There is no live demo yet. The repository is the source for setup and flows. Planned work includes email verification and password reset screens on top of the current base.",
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
    title: "C++ Forensic Engine",
    summary:
      "A C++ experiment for forensic style data processing and engine design.",
    description: [
      "C++ Forensic Engine is a systems experiment in forensic style data processing and engine design. It explores parsing, validation, and deterministic processing steps in C++ with attention to memory and performance.",
      "The codebase favors small functions, explicit error paths, and testable units over clever tricks. Build steps and usage live in the repository README so the experiment stays reproducible on a clean toolchain.",
      "Status: experimental. There is no live demo. The goal is learning over production hardening: input handling, reporting structure, and profiling a small pipeline end to end.",
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
    title: "Moderation Bot",
    summary:
      "A Discord bot for server moderation with safety and helper commands.",
    description: [
      "Moderation Bot is a Discord bot for server moderation with safety and helper commands. It was built to give server owners a small set of reliable tools plus friendly automation for repeat tasks.",
      "The build uses TypeScript and Node.js with discord.js for the Discord API, Prisma for data access, Google Generative AI for helper responses, and Bun for local tooling. Command handling keeps checks visible so moderators see what ran and why.",
      "Status: active. There is no hosted demo because Discord bots need a live server token. The repository documents setup, permissions, and environment variables. Planned work includes audit logging and per server settings.",
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
