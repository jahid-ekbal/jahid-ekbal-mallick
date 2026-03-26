import { RetroGrid } from "@/components/shadcnui/retro-grid";
import { ShimmerButton } from "@/components/shadcnui/shimmer-button";
import { SparklesText } from "@/components/shadcnui/sparkles-text";
import { WordRotate } from "@/components/shadcnui/word-rotate";
import { FishingHookIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Starter Fullstack",
  description: "Production grade Fullstack Next.js starter template",
};

const page = () => {
  return (
    <section className="grid h-[90dvh] place-items-center">
      <RetroGrid />

      <div className="grid place-items-center gap-4 text-center">
        <SparklesText>JAHID EKBAL MALLICK</SparklesText>
        <WordRotate
          words={["Fullstack Developer", "UI/UX Designer"]}
          className="text-5xl"
        />
      </div>
      <div className="grid grid-cols-2 place-items-center gap-4">
        <ShimmerButton>
          {" "}
          <FishingHookIcon /> Visit my Github profile
        </ShimmerButton>
        <ShimmerButton>
          {" "}
          <FishingHookIcon /> Explore my portfolio website
        </ShimmerButton>
      </div>
    </section>
  );
};

export default page;
