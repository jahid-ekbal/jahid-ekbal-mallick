export type Socials = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  discord?: string;
  whatsapp?: string;
  telegram?: string;
};

export type SkillGroup = { category: string; items: string[] };

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description?: string;
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  description?: string;
  url?: string;
};

export type Profile = {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  avatar: string;
  socials: Socials;
  skills: SkillGroup[];
};

// Static profile content. Edit directly here.
export const profile: Profile = {
  name: "Jahid Ekbal Mallick",
  headline: "Full-Stack Developer and Digital Creator",
  tagline:
    "I craft digital experiences that merge technical precision with visual innovation to build engaging web solutions.",
  bio: [
    "I am Jahid Ekbal Mallick, a Full-Stack Developer and Digital Creator from Kolkata, India. I craft digital experiences that merge technical precision with visual innovation, bridging functionality and aesthetics to build engaging web solutions.",
    "Development expertise: HTML5, CSS3, JavaScript (ES6+), React, Next.js, TypeScript, Tailwind CSS, Bootstrap, with responsive, mobile-first builds. Design specialization: UI/UX prototyping in Figma, Adobe Photoshop and Premiere Pro, Blender 3D, digital advertising, social content and thumbnail production.",
    "What I deliver: responsive websites, interactive web apps, user-centric interfaces, social campaigns, video and thumbnails, and custom ad assets. My workflow combines clean, maintainable code with compelling visuals. For business inquiries: jahidekbal.io@gmail.com",
  ].join("\n\n"),
  location: "Kolkata, India",
  email: "jahidekbal.io@gmail.com",
  avatar: "/images/profile.jpg",
  socials: {
    github: "https://github.com/jahid-ekbal",
    linkedin: "https://www.linkedin.com/in/jahid-developer",
    twitter: "https://x.com/JAHIDEKBAL01",
    discord: "https://discord.com/users/1076183559796183242",
    whatsapp: "https://wa.me/919733696362",
    telegram: "https://t.me/jahidekbal",
  },
  skills: [
    {
      category: "Programming language",
      items: [
        "HTML5",
        "CSS3",
        "JavaScript (ES6+)",
        "TypeScript",
        "Python",
        "C#",
        "C++",
        "PowerShell",
        "Batch",
      ],
    },
    {
      category: "Runtime",
      items: ["Node.js", "Bun", "Go"],
    },
    {
      category: "Software",
      items: [
        "Figma",
        "Photoshop",
        "Premiere Pro",
        "Blender",
        "VS Code",
        "Visual Studio",
        "Android Studio",
        "Git",
        "GitHub",
      ],
    },
    {
      category: "Framework",
      items: ["React", "Next.js", "Tailwind CSS", "Bootstrap"],
    },
    {
      category: "Library",
      items: [
        "Three.js",
        "React Three Fiber",
        "React Hook Form",
        "shadcn/ui",
        "Base UI",
        "next-themes",
        "discord.js",
        "Zod",
        "Yup",
        "Radix UI",
        "lucide-react",
        "React Toastify",
        "Recharts",
        "use-file-picker",
        "Sharp",
        "p-limit",
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
      ],
    },
    {
      category: "AI Harness",
      items: ["Kilo Code", "Cline", "opencode", "ZCode", "Devin"],
    },
    {
      category: "AI Models",
      items: ["Claude", "GPT", "Gemini", "Ollama"],
    },
    {
      category: "Backend and Data",
      items: [
        "Prisma",
        "Neon",
        "libSQL",
        "Better Auth",
        "AWS S3",
        "Argon2",
        "REST APIs",
        "Auth Flows",
        "T3 Env",
        "dotenv",
      ],
    },
    {
      category: "Automation",
      items: ["Windows Tweaks", "System Optimization", "Task Automation"],
    },
    {
      category: "Delivery",
      items: [
        "Responsive Design",
        "UI/UX",
        "Video Production",
        "Digital Ads",
        "Thumbnails",
        "Prettier",
        "ESLint",
        "Prisma Studio",
        "shadcn CLI",
      ],
    },
  ],
};
