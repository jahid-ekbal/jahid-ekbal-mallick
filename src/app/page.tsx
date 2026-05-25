import GithubIcon from "@/components/icons/GithubIcon";
import { KineticText } from "@/components/shadcnui/kinetic-text";
import { WordRotate } from "@/components/shadcnui/word-rotate";
import { ArrowUpRight, Briefcase, Cpu, Layers, Terminal } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jahid Ekbal Mallick | Fullstack Developer & Founder",
  description:
    "Portfolio of Jahid Ekbal Mallick. Fullstack Developer, UI/UX Designer, and CEO at EKBAL STUDIO / REGIX.",
};

export default function HomePage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary/20 min-h-screen">
      <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-4">
        <div className="bg-primary/5 pointer-events-none absolute top-1/4 left-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl md:h-150 md:w-150" />

        <div className="z-10 grid max-w-3xl place-items-center gap-6 text-center">
          <div className="bg-muted border-border text-muted-foreground animate-fade-in inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Available for Scale Projects
          </div>

          <KineticText
            className="text-foreground text-5xl leading-none font-extrabold tracking-tight sm:text-9xl md:text-6xl"
            text="JAHID EKBAL MALLICK"
          />

          <div className="text-muted-foreground flex h-12 flex-col items-center justify-center gap-2 text-xl font-medium sm:flex-row md:text-2xl">
            <span>Building solutions as a</span>
            <WordRotate
              words={[
                "Fullstack Developer",
                "UI/UX Designer",
                "Tech Entrepreneur",
                "CEO @ EKBAL STUDIO",
              ]}
              className="text-primary decoration-primary/20 font-bold underline decoration-2 underline-offset-4"
            />
          </div>

          <p className="text-muted-foreground/80 mt-2 max-w-lg text-sm leading-relaxed md:text-base">
            Engineering high-performance web architectures, pristine user
            interfaces, and scalable software ecosystems for the next generation
            of the internet.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#projects"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none">
              Explore Architecture
            </Link>
            <Link
              href="https://github.com/jahid-ekbal"
              target="_blank"
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none">
              <GithubIcon className="h-4 w-4" /> GitHub
            </Link>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="border-border/40 mx-auto max-w-6xl border-t px-6 py-20">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-primary mb-2 flex items-center gap-2 font-mono text-sm tracking-wider uppercase">
              <Briefcase className="h-4 w-4" /> Ventures & Projects
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Core Initiatives
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm">
            A selective showcase of live software engineering deployment and
            active digital brands.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group border-border bg-card hover:border-primary/30 relative flex min-h-60 flex-col justify-between rounded-xl border p-6 transition-all hover:shadow-lg">
            <div>
              <div className="flex items-start justify-between">
                <span className="bg-primary/10 text-primary rounded px-2 py-1 font-mono text-xs font-semibold">
                  BRAND & STUDIO
                </span>
                <Link
                  href="https://ekbal-studio.netlify.app/"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors">
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
              <h3 className="group-hover:text-primary mt-4 text-xl font-bold transition-colors">
                EKBAL STUDIO / REGIX
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                A digital agency framework dedicated to building elite UI/UX
                systems and scalable IT products for growing enterprise sectors.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="bg-muted text-muted-foreground rounded px-2.5 py-1 font-mono text-xs">
                Next.js
              </span>
              <span className="bg-muted text-muted-foreground rounded px-2.5 py-1 font-mono text-xs">
                Tailwind CSS
              </span>
              <span className="bg-muted text-muted-foreground rounded px-2.5 py-1 font-mono text-xs">
                Brand Identity
              </span>
            </div>
          </div>

          <div className="group border-border bg-card hover:border-primary/30 relative flex min-h-60 flex-col justify-between rounded-xl border p-6 transition-all hover:shadow-lg">
            <div>
              <div className="flex items-start justify-between">
                <span className="bg-primary/10 text-primary rounded px-2 py-1 font-mono text-xs font-semibold">
                  SAAS ARCHITECTURE
                </span>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors">
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
              <h3 className="group-hover:text-primary mt-4 text-xl font-bold transition-colors">
                Enterprise Level API Layer
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Designing deterministic, type-safe API gateways ensuring
                lightning-fast database transactions and strict authorization
                protocols.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="bg-muted text-muted-foreground rounded px-2.5 py-1 font-mono text-xs">
                TypeScript
              </span>
              <span className="bg-muted text-muted-foreground rounded px-2.5 py-1 font-mono text-xs">
                Node.js
              </span>
              <span className="bg-muted text-muted-foreground rounded px-2.5 py-1 font-mono text-xs">
                PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-border/40 bg-muted/30 mx-auto my-10 max-w-6xl rounded-3xl border-t px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-primary mb-2 flex items-center gap-2 font-mono text-sm tracking-wider uppercase">
              <Cpu className="h-4 w-4" /> Capabilities
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              The Engine
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Strictly adhering to clean code architecture, absolute type
              safety, and optimized rendering engines.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:col-span-2">
            <div className="border-border bg-background rounded-xl border p-4">
              <Terminal className="text-primary mb-2 h-5 w-5" />
              <h4 className="text-sm font-semibold">Languages</h4>
              <p className="text-muted-foreground mt-1 text-xs">
                TypeScript, JavaScript, HTML/CSS, C, C++, C#, Python, SQL
                Binaries, Hexadecimal
              </p>
            </div>
            <div className="border-border bg-background rounded-xl border p-4">
              <Layers className="text-primary mb-2 h-5 w-5" />
              <h4 className="text-sm font-semibold">Frameworks</h4>
              <p className="text-muted-foreground mt-1 text-xs">
                Next.js, React, Node.js, Express.js, Prisma ORM, PostgreSQL,
                mongoDB, Better auth
              </p>
            </div>
            <div className="border-border bg-background rounded-xl border p-4">
              <Cpu className="text-primary mb-2 h-5 w-5" />
              <h4 className="text-sm font-semibold">UI Ecosystems</h4>
              <p className="text-muted-foreground mt-1 text-xs">
                Tailwind CSS, Shadcn UI, Magic UI, Framer Motion, Radix UI,
                Motion Primitive, Lucide Icons
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-border/40 mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 border-t px-6 py-12 sm:flex-row">
        <p className="text-muted-foreground text-center text-xs">
          © {new Date().getFullYear()} JAHID EKBAL MALLICK. Built clean.
        </p>
      </footer>
    </div>
  );
}
