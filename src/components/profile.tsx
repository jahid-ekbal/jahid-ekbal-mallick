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
  school?: string;
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
  headline: "Full-Stack Developer and UI/UX Designer",
  tagline:
    "I build fast, accessible websites from Kolkata that pair clean React code with careful UI and visual craft.",
  bio: [
    "I am Jahid Ekbal Mallick, a Full-Stack Developer and Digital Creator based in Kolkata, India. I study Geography in an honours program while building on the side with React, Next.js, and TypeScript, and I bring the same curiosity for places and people into how I design and ship for the web.",
    "My school years shaped how I work. I joined Paschim Joynagar J.C. High School (H.S.) in class 5, chose the arts stream in class 11, and passed higher secondary in 2026 before starting my current studies. That long run of classes taught me steady, patient delivery, and my drama years from class 6 to 11 taught me timing, teamwork, and how to hold a room. I performed at Rabindra Sadan in Kolkata, at Gobardanga Town Hall three times, and on school and other school stages.",
    "I have been drawn to technology since childhood, starting with games and growing into esports community play on PC. Today I focus that same energy on the web: responsive websites, interactive apps, user interface work, and social and campaign visuals. My stack covers HTML5, CSS3, JavaScript (ES6+), React, Next.js, TypeScript, Tailwind CSS, and Bootstrap, with UI and UX prototyping in Figma, Photoshop and Premiere Pro, and Blender for 3D and video assets.",
  ].join("\n\n"),
  location: "Kolkata, India",
  email: "jahidekbalmallick@gmail.com",
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
      items: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript"],
    },
    {
      category: "Runtime",
      items: ["Node.js", "Bun"],
    },
    {
      category: "Framework",
      items: ["React", "Next.js", "Tailwind CSS", "Bootstrap"],
    },
    {
      category: "UI and styling",
      items: [
        "shadcn/ui",
        "Base UI",
        "next-themes",
        "lucide-react",
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
        "Framer Motion",
        "Radix UI",
        "React Hook Form",
      ],
    },
    {
      category: "Design and media",
      items: [
        "Figma",
        "Photoshop",
        "Premiere Pro",
        "Blender",
        "After Effects",
        "Illustrator",
        "Canva",
        "Lightroom",
        "Adobe XD",
        "Filmora",
      ],
    },
    {
      category: "Tools and delivery",
      items: ["VS Code", "Git", "GitHub"],
    },
    {
      category: "Delivery",
      items: [
        "Responsive Design",
        "UI/UX",
        "Video Production",
        "Thumbnails",
        "Performance Optimization",
        "Content Strategy",
        "Accessibility",
      ],
    },
  ],
};
