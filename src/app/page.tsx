import { MorphingText } from "@/components/shadcnui/morphing-text";
import { SmoothCursor } from "@/components/shadcnui/smooth-cursor";
import { SparklesText } from "@/components/shadcnui/sparkles-text";
import { WordRotate } from "@/components/shadcnui/word-rotate";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JAHID EKBAL MALLICK",
  description: "JAHID EKBAL MALLICK Portfolio Website",
};

const page = () => {
  return (
    <section className="grid h-[90dvh] place-items-center">

      <SmoothCursor />


      <div className="flex flex-col items-center gap-4 text-center">

        <SparklesText className="text-6xl font-bold">JAHID EKBAL MALLICK is a </SparklesText>

          <WordRotate className="text-4xl font-bold" words={["Full Stack Developer", "Web Pentester"]} />

        </div>

        {/* <div className="">

          <MorphingText className=" " texts={["Welcome to", "My Portfolio Website"]} />

        </div>
       */}

   
    </section>
  );
};

export default page;
