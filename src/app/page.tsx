import { KineticText } from "@/components/shadcnui/kinetic-text";
import { WordRotate } from "@/components/shadcnui/word-rotate";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Starter Fullstack",
  description: "Production grade Fullstack Next.js starter template",
};

const page = () => {
  return (
    <section>
      <BackgroundLines className="flex w-full flex-col items-center justify-center px-4">
        <div className="grid place-items-center gap-4 text-center">
          <KineticText
            className="text-5xl font-extrabold"
            text="JAHID EKBAL MALLICK"
            as="h1"
          />
          <WordRotate
            words={["Fullstack Developer", "UI/UX Designer"]}
            className="text-5xl"
          />
        </div>
      </BackgroundLines>
    </section>
  );
};

export default page;
